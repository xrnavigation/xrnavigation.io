/**
 * Visual Comparison Test: Hugo site vs WordPress baseline screenshots.
 *
 * Reads baseline PNGs from tests/baseline/, screenshots the local Hugo site
 * at the matching URL and viewport, diffs with pixelmatch, and writes a report.
 *
 * Usage:
 *   npx playwright test --config tests/playwright.config.ts tests/visual-comparison.spec.ts
 *
 * Optional env:
 *   COMPARE_SLUGS=slug-a,slug-b
 */

import { type Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const HUGO_BASE = 'http://localhost:1314';
const BASELINE_DIR = path.join(__dirname, 'baseline');
const CURRENT_DIR = path.join(__dirname, 'current');
const DIFF_DIR = path.join(__dirname, 'diffs');
const RESULTS_ROOT = path.join(__dirname, '.comparison-results');
const RUN_TOKEN = `run-${process.ppid}`;
const RUN_RESULTS_DIR = path.join(RESULTS_ROOT, RUN_TOKEN);
const RUN_LOCK_PATH = path.join(RESULTS_ROOT, `${RUN_TOKEN}.lock`);
const SUMMARY_PATH = path.join(__dirname, 'comparison-results.json');
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

interface ComparisonTask {
  slug: string;
  viewport: string;
  baselineFile: string;
}

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

initializeRunArtifacts();
const TASKS = loadTasks();

function initializeRunArtifacts(): void {
  for (const dir of [CURRENT_DIR, DIFF_DIR, RESULTS_ROOT]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    fs.writeFileSync(RUN_LOCK_PATH, String(process.pid), { flag: 'wx' });
    fs.rmSync(RUN_RESULTS_DIR, { recursive: true, force: true });
    fs.mkdirSync(RUN_RESULTS_DIR, { recursive: true });
    fs.rmSync(SUMMARY_PATH, { force: true });
  } catch {
    fs.mkdirSync(RUN_RESULTS_DIR, { recursive: true });
  }
}

function loadTasks(): ComparisonTask[] {
  const tasks = fs.readdirSync(BASELINE_DIR)
    .filter(filename => filename.endsWith('.png'))
    .map(parseBaselineFilename)
    .filter((task): task is ComparisonTask => task !== null)
    .filter(task => SLUG_FILTER.size === 0 || SLUG_FILTER.has(task.slug))
    .sort((left, right) =>
      left.slug.localeCompare(right.slug) || left.viewport.localeCompare(right.viewport)
    );

  return tasks;
}

function parseBaselineFilename(filename: string): ComparisonTask | null {
  const match = filename.match(/^(.+)-(desktop|mobile)\.png$/);
  if (!match) return null;
  return { slug: match[1], viewport: match[2], baselineFile: filename };
}

function slugToUrl(slug: string): string {
  if (slug === 'home') return '/';
  return `/${slug}/`;
}

async function stabilizePageForScreenshot(page: Page): Promise<void> {
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
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    for (let y = 0; y < height; y += 500) {
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

function writeAggregateSummary(): void {
  const results = fs.readdirSync(RUN_RESULTS_DIR)
    .filter(filename => filename.endsWith('.json'))
    .map(filename => JSON.parse(
      fs.readFileSync(path.join(RUN_RESULTS_DIR, filename), 'utf8')
    ) as ComparisonResult)
    .sort((left, right) =>
      left.slug.localeCompare(right.slug) || left.viewport.localeCompare(right.viewport)
    );

  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(results, null, 2));
}

function persistResult(result: ComparisonResult): void {
  const resultPath = path.join(RUN_RESULTS_DIR, `${result.slug}-${result.viewport}.json`);
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  writeAggregateSummary();
}

test.describe.configure({ mode: 'parallel' });

if (TASKS.length === 0) {
  test('no comparison tasks matched current filter', async () => {
    console.log('No baseline tasks matched the current filter.');
  });
} else {
  for (const task of TASKS) {
    test(`${task.slug} (${task.viewport})`, async ({ browser }) => {
      const url = HUGO_BASE + slugToUrl(task.slug);
      const baselinePng = PNG.sync.read(
        fs.readFileSync(path.join(BASELINE_DIR, task.baselineFile))
      );
      const viewport = VIEWPORTS[task.viewport];
      const currentPath = path.join(CURRENT_DIR, `${task.slug}-${task.viewport}.png`);
      const diffPath = path.join(DIFF_DIR, `${task.slug}-${task.viewport}-diff.png`);

      const context = await browser.newContext({
        viewport: { width: baselinePng.width, height: viewport.height },
      });
      const page = await context.newPage();

      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 15_000,
        });

        if (!response || response.status() >= 400) {
          const result: ComparisonResult = {
            slug: task.slug,
            viewport: task.viewport,
            diffPercent: 100,
            totalPixels: 0,
            diffPixels: 0,
            error: `HTTP ${response?.status() ?? 'no response'}`,
            baselineWidth: 0,
            baselineHeight: 0,
            currentWidth: 0,
            currentHeight: 0,
          };
          persistResult(result);
          return;
        }

        await stabilizePageForScreenshot(page);
        await page.screenshot({ path: currentPath, fullPage: true });

        const currentPng = PNG.sync.read(fs.readFileSync(currentPath));

        const width = Math.min(baselinePng.width, currentPng.width);
        const height = Math.min(baselinePng.height, currentPng.height);
        const sizeMismatch =
          baselinePng.width !== currentPng.width || baselinePng.height !== currentPng.height;

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

        const overlapArea = width * height;
        let diffPercent = (diffPixels / overlapArea) * 100;

        if (sizeMismatch) {
          const maxWidth = Math.max(baselinePng.width, currentPng.width);
          const maxHeight = Math.max(baselinePng.height, currentPng.height);
          const maxArea = maxWidth * maxHeight;
          diffPercent = (diffPercent * overlapArea + 100 * (maxArea - overlapArea)) / maxArea;
        }

        if (diffPercent > 5) {
          fs.writeFileSync(diffPath, PNG.sync.write(diffPng));
        } else if (fs.existsSync(diffPath)) {
          fs.rmSync(diffPath, { force: true });
        }

        const result: ComparisonResult = {
          slug: task.slug,
          viewport: task.viewport,
          diffPercent,
          totalPixels: overlapArea,
          diffPixels,
          baselineWidth: baselinePng.width,
          baselineHeight: baselinePng.height,
          currentWidth: currentPng.width,
          currentHeight: currentPng.height,
        };
        persistResult(result);

        console.log(
          `${task.slug} (${task.viewport}) ${diffPercent.toFixed(1)}% ` +
          `[${baselinePng.width}x${baselinePng.height} vs ${currentPng.width}x${currentPng.height}]`
        );
      } catch (error) {
        const result: ComparisonResult = {
          slug: task.slug,
          viewport: task.viewport,
          diffPercent: 100,
          totalPixels: 0,
          diffPixels: 0,
          error: String(error),
          baselineWidth: 0,
          baselineHeight: 0,
          currentWidth: 0,
          currentHeight: 0,
        };
        persistResult(result);
      } finally {
        await context.close();
      }
    });
  }
}
