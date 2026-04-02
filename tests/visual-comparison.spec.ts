/**
 * Visual Comparison Test: Hugo site vs WordPress baseline screenshots.
 *
 * Reads baseline PNGs from tests/baseline/, screenshots the local Hugo site
 * at the matching URL and viewport, diffs with pixelmatch, and writes a report.
 *
 * Usage:
 *   npx playwright test --config tests/playwright.config.ts tests/visual-comparison.spec.ts
 *
 * Prerequisites:
 *   - Hugo server running on http://localhost:1314
 *   - npm install pixelmatch pngjs
 */

import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const HUGO_BASE = 'http://localhost:1314';
const BASELINE_DIR = path.join(__dirname, 'baseline');
const CURRENT_DIR = path.join(__dirname, 'current');
const DIFF_DIR = path.join(__dirname, 'diffs');
const SLUG_FILTER = new Set(
  (process.env.COMPARE_SLUGS ?? '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
);

const VIEWPORTS: Record<string, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 812 },
};

interface ComparisonResult {
  slug: string;
  viewport: string;
  diffPercent: number;
  totalPixels: number;
  diffPixels: number;
  error?: string;
  baselineWidth: number;
  baselineHeight: number;
  currentWidth: number;
  currentHeight: number;
}

/** Convert a baseline filename into { slug, viewport }. */
function parseBaselineFilename(filename: string): { slug: string; viewport: string } | null {
  const match = filename.match(/^(.+)-(desktop|mobile)\.png$/);
  if (!match) return null;
  return { slug: match[1], viewport: match[2] };
}

/** Convert a slug to a Hugo URL path. */
function slugToUrl(slug: string): string {
  if (slug === 'home') return '/';
  return `/${slug}/`;
}

async function stabilizePageForScreenshot(page: import('@playwright/test').Page): Promise<void> {
  await Promise.race([
    page.waitForLoadState('networkidle').catch(() => {}),
    page.waitForTimeout(8_000),
  ]);

  await page.evaluate(() => document.fonts.ready);

  const requiresDeepSettle = await page.locator('iframe, .able-wrapper, .able-controller').count();
  if (!requiresDeepSettle) {
    await page.waitForTimeout(500);
    return;
  }

  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const getHeight = () => Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    const currentHeight = getHeight();
    for (let y = 0; y < currentHeight; y += 500) {
      window.scrollTo(0, y);
      await delay(100);
    }

    window.scrollTo(0, 0);
    await delay(250);
  });

  await page.waitForSelector('.able-wrapper', { timeout: 5_000 }).catch(() => {});
  await page.waitForSelector('.able-controller', { timeout: 5_000 }).catch(() => {});
  await page.waitForTimeout(3_000);
}

test('compare Hugo screenshots against WordPress baselines', async ({ browser }) => {
  // Ensure output directories exist
  for (const dir of [CURRENT_DIR, DIFF_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Read all baseline files
  const baselineFiles = fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.png'));
  console.log(`Found ${baselineFiles.length} baseline files`);

  // Parse into comparison tasks
  const tasks: { slug: string; viewport: string; baselineFile: string }[] = [];
  for (const file of baselineFiles) {
    const parsed = parseBaselineFilename(file);
    if (parsed) {
      if (SLUG_FILTER.size > 0 && !SLUG_FILTER.has(parsed.slug)) {
        continue;
      }
      tasks.push({ ...parsed, baselineFile: file });
    }
  }

  console.log(`Parsed ${tasks.length} comparison tasks`);

  const results: ComparisonResult[] = [];
  let completed = 0;

  for (const task of tasks) {
    const { slug, viewport, baselineFile } = task;
    const url = HUGO_BASE + slugToUrl(slug);
    const vp = VIEWPORTS[viewport];
    const currentFilename = `${slug}-${viewport}.png`;

    completed++;
    if (completed % 10 === 0) {
      console.log(`Progress: ${completed}/${tasks.length}`);
    }

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    try {
      // Navigate to Hugo page
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
      });

      if (!response || response.status() >= 400) {
        results.push({
          slug, viewport, diffPercent: 100, totalPixels: 0, diffPixels: 0,
          error: `HTTP ${response?.status() ?? 'no response'}`,
          baselineWidth: 0, baselineHeight: 0, currentWidth: 0, currentHeight: 0,
        });
        await context.close();
        continue;
      }

      // Wait for page to settle, including lazy content and iframe-driven height changes.
      await stabilizePageForScreenshot(page);

      // Screenshot
      const currentPath = path.join(CURRENT_DIR, currentFilename);
      await page.screenshot({ path: currentPath, fullPage: true });

      // Load both images for comparison
      const baselineBuf = fs.readFileSync(path.join(BASELINE_DIR, baselineFile));
      const currentBuf = fs.readFileSync(currentPath);

      const baselinePng = PNG.sync.read(baselineBuf);
      const currentPng = PNG.sync.read(currentBuf);

      // Resize to match if needed — use the smaller dimensions
      const width = Math.min(baselinePng.width, currentPng.width);
      const height = Math.min(baselinePng.height, currentPng.height);

      // If sizes differ significantly, note that and compare what we can
      const sizeMismatch = baselinePng.width !== currentPng.width || baselinePng.height !== currentPng.height;

      // Create cropped versions for comparison
      const baselineCropped = cropPng(baselinePng, width, height);
      const currentCropped = cropPng(currentPng, width, height);

      const diffPng = new PNG({ width, height });
      const diffPixels = pixelmatch(
        baselineCropped,
        currentCropped,
        diffPng.data,
        width,
        height,
        { threshold: 0.1 }
      );

      const totalPixels = width * height;
      let diffPercent = (diffPixels / totalPixels) * 100;

      // If sizes differ, add penalty proportional to the size difference
      if (sizeMismatch) {
        const maxW = Math.max(baselinePng.width, currentPng.width);
        const maxH = Math.max(baselinePng.height, currentPng.height);
        const maxArea = maxW * maxH;
        const overlapArea = width * height;
        const uncoveredRatio = (maxArea - overlapArea) / maxArea;
        // Blend: overlap diff + uncovered area counts as 100% diff
        diffPercent = (diffPercent * overlapArea + 100 * (maxArea - overlapArea)) / maxArea;
      }

      // Save diff image if >5% different
      if (diffPercent > 5) {
        const diffPath = path.join(DIFF_DIR, `${slug}-${viewport}-diff.png`);
        fs.writeFileSync(diffPath, PNG.sync.write(diffPng));
      }

      results.push({
        slug, viewport, diffPercent, totalPixels, diffPixels,
        baselineWidth: baselinePng.width, baselineHeight: baselinePng.height,
        currentWidth: currentPng.width, currentHeight: currentPng.height,
      });
    } catch (err) {
      results.push({
        slug, viewport, diffPercent: 100, totalPixels: 0, diffPixels: 0,
        error: String(err),
        baselineWidth: 0, baselineHeight: 0, currentWidth: 0, currentHeight: 0,
      });
    } finally {
      await context.close();
    }
  }

  // Write JSON results
  const jsonPath = path.join(__dirname, 'comparison-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  // Print summary
  const matching = results.filter(r => r.diffPercent < 2);
  const minor = results.filter(r => r.diffPercent >= 2 && r.diffPercent <= 10);
  const major = results.filter(r => r.diffPercent > 10);
  const errors = results.filter(r => r.error);

  console.log('\n=== COMPARISON SUMMARY ===');
  console.log(`Total comparisons: ${results.length}`);
  console.log(`Matching (<2% diff): ${matching.length}`);
  console.log(`Minor differences (2-10%): ${minor.length}`);
  console.log(`Major differences (>10%): ${major.length}`);
  console.log(`Errors: ${errors.length}`);

  // Top 10 worst
  const sorted = [...results].sort((a, b) => b.diffPercent - a.diffPercent);
  console.log('\nTop 10 worst pages:');
  for (const r of sorted.slice(0, 10)) {
    const sizeInfo = r.error ? r.error :
      `${r.baselineWidth}x${r.baselineHeight} vs ${r.currentWidth}x${r.currentHeight}`;
    console.log(`  ${r.diffPercent.toFixed(1)}% — ${r.slug} (${r.viewport}) [${sizeInfo}]`);
  }

  // Also print errors
  if (errors.length > 0) {
    console.log('\nPages with errors:');
    for (const r of errors) {
      console.log(`  ${r.slug} (${r.viewport}): ${r.error}`);
    }
  }
});

/** Crop a PNG to a given width/height, returning raw pixel data. */
function cropPng(png: PNG, targetWidth: number, targetHeight: number): Buffer {
  if (png.width === targetWidth && png.height === targetHeight) {
    return png.data as unknown as Buffer;
  }

  const cropped = Buffer.alloc(targetWidth * targetHeight * 4);
  for (let y = 0; y < targetHeight; y++) {
    const srcOffset = y * png.width * 4;
    const dstOffset = y * targetWidth * 4;
    png.data.copy(cropped, dstOffset, srcOffset, srcOffset + targetWidth * 4);
  }
  return cropped;
}
