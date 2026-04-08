/**
 * Chunk-Based Visual Comparison: Hugo vs live WordPress, section by section.
 *
 * Instead of diffing full-page screenshots (where height mismatches cascade),
 * this test finds DOM sections on both sites, screenshots each independently,
 * matches them by heading text, and diffs each pair.
 *
 * Usage:
 *   1. Start Hugo: hugo server --port 1314 --bind 127.0.0.1 --disableFastRender --noHTTPCache
 *   2. Run: npx playwright test --config tests/playwright.config.ts tests/chunk-comparison.spec.ts
 *
 * Optional env:
 *   COMPARE_SLUGS=slug-a,slug-b   (filter to specific slugs)
 */

import { type Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const HUGO_BASE = 'http://127.0.0.1:1314';
const WP_BASE = 'https://xrnavigation.io';

const BASELINE_DIR = path.join(__dirname, 'baseline');
const CHUNK_DIR = path.join(__dirname, 'chunks');
const CHUNK_RESULTS_DIR = path.join(__dirname, '.chunk-results');
const RUN_TOKEN = `run-${process.ppid}`;
const RUN_DIR = path.join(CHUNK_RESULTS_DIR, RUN_TOKEN);
const CHUNK_SUMMARY_PATH = path.join(__dirname, 'chunk-results.json');

const SLUG_FILTER = new Set(
  (process.env.COMPARE_SLUGS ?? '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
);

const VIEWPORTS: Record<string, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 812 },
};

// --- Types ---

interface SectionInfo {
  index: number;
  heading: string | null;
  headingLevel: number | null;
  selectorType: 'uagb-root' | 'wp-block-group' | 'heading-split' | 'whole-page';
  /** CSS selector to re-locate this section */
  locator: string;
}

interface ChunkResult {
  slug: string;
  viewport: string;
  sectionIndex: number;
  heading: string | null;
  selectorType: string;
  matchMethod: string;
  diffPercent: number;
  overlapDiffPercent: number;
  wpWidth: number;
  wpHeight: number;
  hugoWidth: number;
  hugoHeight: number;
  heightDelta: number;
  error?: string;
}

interface PageChunkSummary {
  slug: string;
  viewport: string;
  totalSections: number;
  matchedSections: number;
  unmatchedWp: number;
  unmatchedHugo: number;
  avgDiffPercent: number;
  maxDiffPercent: number;
  sections: ChunkResult[];
}

// --- Initialization ---

for (const dir of [CHUNK_DIR, CHUNK_RESULTS_DIR, RUN_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

// Build task list from baseline filenames
const TASKS = fs.readdirSync(BASELINE_DIR)
  .filter(f => f.endsWith('.png'))
  .map(f => {
    const m = f.match(/^(.+)-(desktop|mobile)\.png$/);
    return m ? { slug: m[1], viewport: m[2] } : null;
  })
  .filter((t): t is { slug: string; viewport: string } => t !== null)
  .filter(t => SLUG_FILTER.size === 0 || SLUG_FILTER.has(t.slug))
  // Deduplicate (one test per slug+viewport)
  .filter((t, i, arr) => arr.findIndex(x => x.slug === t.slug && x.viewport === t.viewport) === i)
  .sort((a, b) => a.slug.localeCompare(b.slug) || a.viewport.localeCompare(b.viewport));

// --- DOM Section Finding (runs in browser) ---

function findSectionsScript(): SectionInfo[] {
  const entryContent = document.querySelector('.entry-content') ||
    document.querySelector('main#main') ||
    document.body;

  const sections: SectionInfo[] = [];
  let index = 0;

  // Tier 1: UAGB root containers + wp-block-group (WP and Hugo pages that mirror WP structure)
  const uagbBoundaries = entryContent.querySelectorAll(
    '.wp-block-uagb-container.alignfull.uagb-is-root-container, ' +
    '.wp-block-group.alignfull'
  );

  if (uagbBoundaries.length > 0) {
    uagbBoundaries.forEach((el) => {
      const heading = el.querySelector('h1, h2, h3');
      const isUagb = el.classList.contains('uagb-is-root-container');
      sections.push({
        index: index++,
        heading: heading?.textContent?.trim() ?? null,
        headingLevel: heading ? parseInt(heading.tagName[1]) : null,
        selectorType: isUagb ? 'uagb-root' : 'wp-block-group',
        locator: '',
      });
    });
    return sections;
  }

  // Tier 1b: Hugo <section> elements (collection pages, homepage sections, etc.)
  const sectionEls = entryContent.querySelectorAll('section');
  if (sectionEls.length > 0) {
    sectionEls.forEach((el) => {
      const heading = el.querySelector('h1, h2, h3');
      sections.push({
        index: index++,
        heading: heading?.textContent?.trim() ?? null,
        headingLevel: heading ? parseInt(heading.tagName[1]) : null,
        selectorType: 'uagb-root', // Treat as equivalent for matching purposes
        locator: '',
      });
    });
    return sections;
  }

  // Tier 2: H2 heading splits (blog posts)
  const h2s = entryContent.querySelectorAll('h2');
  if (h2s.length > 0) {
    h2s.forEach((h2) => {
      sections.push({
        index: index++,
        heading: h2.textContent?.trim() ?? null,
        headingLevel: 2,
        selectorType: 'heading-split',
        locator: '',
      });
    });
    return sections;
  }

  // Tier 3: whole page
  sections.push({
    index: 0,
    heading: entryContent.querySelector('h1, h2, h3')?.textContent?.trim() ?? null,
    headingLevel: null,
    selectorType: 'whole-page',
    locator: '',
  });
  return sections;
}

// --- Page Stabilization (reused from visual-comparison) ---

async function stabilizePage(page: Page): Promise<void> {
  await Promise.race([
    page.waitForLoadState('networkidle').catch(() => {}),
    page.waitForTimeout(8_000),
  ]);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    const images = Array.from(document.images);
    await Promise.all(images.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>(r => {
        const done = () => r();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 2000);
      });
    }));
    let stablePasses = 0;
    let prevHeight = 0;
    while (stablePasses < 2) {
      const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await delay(100); }
      window.scrollTo(0, 0);
      await delay(300);
      const cur = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      if (cur === prevHeight) stablePasses++;
      else { stablePasses = 0; prevHeight = cur; }
    }
  });
  await page.waitForTimeout(500);
}

// --- Section Screenshotting ---

async function screenshotSections(
  page: Page,
  side: 'wp' | 'hugo',
  slug: string,
  viewport: string,
): Promise<{ sections: SectionInfo[]; screenshots: Map<number, Buffer> }> {
  const sections: SectionInfo[] = await page.evaluate(findSectionsScript);
  const screenshots = new Map<number, Buffer>();

  const entryContent = page.locator('.entry-content').first();
  const hasEntry = await entryContent.count() > 0;
  const container = hasEntry ? entryContent : page.locator('main#main').first();

  if (sections.length === 0 || sections[0].selectorType === 'whole-page') {
    // Screenshot entire content area
    const dir = path.join(CHUNK_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, `${side}-${viewport}-whole.png`);
    await container.screenshot({ path: p });
    screenshots.set(0, fs.readFileSync(p));
    return { sections, screenshots };
  }

  if (sections[0].selectorType === 'heading-split') {
    // For heading-split pages, screenshot the whole content area
    // Chunk-level comparison not possible without wrapper elements
    const dir = path.join(CHUNK_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, `${side}-${viewport}-whole.png`);
    await container.screenshot({ path: p });
    screenshots.set(0, fs.readFileSync(p));
    // Override to single whole-page for comparison
    sections.length = 0;
    sections.push({
      index: 0,
      heading: null,
      headingLevel: null,
      selectorType: 'whole-page',
      locator: '',
    });
    return { sections, screenshots };
  }

  // Screenshot each section independently — find the actual DOM elements
  // Try UAGB root containers first, then <section> elements
  const uagbSelector = '.wp-block-uagb-container.alignfull.uagb-is-root-container, .wp-block-group.alignfull';
  let sectionLocators = container.locator(uagbSelector);

  if (await sectionLocators.count() === 0) {
    // Fallback: Hugo <section> elements
    sectionLocators = container.locator('section');
  }

  const count = await sectionLocators.count();

  const dir = path.join(CHUNK_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < count; i++) {
    const section = sectionLocators.nth(i);
    try {
      // Scroll into view first to ensure rendering
      await section.scrollIntoViewIfNeeded({ timeout: 3000 });
      await page.waitForTimeout(200);

      const p = path.join(dir, `${side}-${viewport}-section-${i}.png`);
      await section.screenshot({ path: p });
      screenshots.set(i, fs.readFileSync(p));
    } catch {
      // Section might be hidden or zero-size
      console.log(`  [${side}] Could not screenshot section ${i} for ${slug}`);
    }
  }

  return { sections, screenshots };
}

// --- Matching ---

function normalizeHeading(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchSections(
  wpSections: SectionInfo[],
  hugoSections: SectionInfo[],
): { pairs: Array<{ wp: number; hugo: number; method: string }>; unmatchedWp: number[]; unmatchedHugo: number[] } {
  const pairs: Array<{ wp: number; hugo: number; method: string }> = [];
  const usedHugo = new Set<number>();
  const usedWp = new Set<number>();

  // Pass 1: exact heading match
  for (const wp of wpSections) {
    if (!wp.heading || usedWp.has(wp.index)) continue;
    const wpKey = normalizeHeading(wp.heading);
    for (const hugo of hugoSections) {
      if (!hugo.heading || usedHugo.has(hugo.index)) continue;
      if (normalizeHeading(hugo.heading) === wpKey) {
        pairs.push({ wp: wp.index, hugo: hugo.index, method: 'exact_heading' });
        usedWp.add(wp.index);
        usedHugo.add(hugo.index);
        break;
      }
    }
  }

  // Pass 2: position-based for remaining
  for (const wp of wpSections) {
    if (usedWp.has(wp.index)) continue;
    for (const hugo of hugoSections) {
      if (usedHugo.has(hugo.index)) continue;
      if (wp.index === hugo.index) {
        pairs.push({ wp: wp.index, hugo: hugo.index, method: 'position' });
        usedWp.add(wp.index);
        usedHugo.add(hugo.index);
        break;
      }
    }
  }

  pairs.sort((a, b) => a.wp - b.wp);

  const unmatchedWp = wpSections.filter(s => !usedWp.has(s.index)).map(s => s.index);
  const unmatchedHugo = hugoSections.filter(s => !usedHugo.has(s.index)).map(s => s.index);

  return { pairs, unmatchedWp, unmatchedHugo };
}

// --- Diffing ---

function diffScreenshots(wpBuf: Buffer, hugoBuf: Buffer): {
  diffPercent: number;
  overlapDiffPercent: number;
  wpWidth: number; wpHeight: number;
  hugoWidth: number; hugoHeight: number;
  heightDelta: number;
} {
  const wpPng = PNG.sync.read(wpBuf);
  const hugoPng = PNG.sync.read(hugoBuf);

  const width = Math.min(wpPng.width, hugoPng.width);
  const height = Math.min(wpPng.height, hugoPng.height);

  if (width === 0 || height === 0) {
    return {
      diffPercent: 100, overlapDiffPercent: 100,
      wpWidth: wpPng.width, wpHeight: wpPng.height,
      hugoWidth: hugoPng.width, hugoHeight: hugoPng.height,
      heightDelta: hugoPng.height - wpPng.height,
    };
  }

  const cropData = (png: PNG, w: number, h: number): Buffer => {
    if (png.width === w && png.height === h) return png.data as unknown as Buffer;
    const buf = Buffer.alloc(w * h * 4);
    for (let y = 0; y < h; y++) {
      const srcOff = y * png.width * 4;
      const dstOff = y * w * 4;
      png.data.copy(buf, dstOff, srcOff, srcOff + w * 4);
    }
    return buf;
  };

  const wpCropped = cropData(wpPng, width, height);
  const hugoCropped = cropData(hugoPng, width, height);
  const diffOut = new PNG({ width, height });

  const diffPixels = pixelmatch(wpCropped, hugoCropped, diffOut.data, width, height, { threshold: 0.1 });

  const overlapArea = width * height;
  const overlapDiffPercent = (diffPixels / overlapArea) * 100;
  let diffPercent = overlapDiffPercent;

  const sizeMismatch = wpPng.width !== hugoPng.width || wpPng.height !== hugoPng.height;
  if (sizeMismatch) {
    const maxW = Math.max(wpPng.width, hugoPng.width);
    const maxH = Math.max(wpPng.height, hugoPng.height);
    const maxArea = maxW * maxH;
    diffPercent = (diffPercent * overlapArea + 100 * (maxArea - overlapArea)) / maxArea;
  }

  return {
    diffPercent, overlapDiffPercent,
    wpWidth: wpPng.width, wpHeight: wpPng.height,
    hugoWidth: hugoPng.width, hugoHeight: hugoPng.height,
    heightDelta: hugoPng.height - wpPng.height,
  };
}

// --- Summary ---

function writeChunkSummary(summary: PageChunkSummary): void {
  const resultPath = path.join(RUN_DIR, `${summary.slug}-${summary.viewport}.json`);
  fs.writeFileSync(resultPath, JSON.stringify(summary, null, 2));

  // Aggregate all results
  const allResults = fs.readdirSync(RUN_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(RUN_DIR, f), 'utf8')) as PageChunkSummary)
    .sort((a, b) => a.slug.localeCompare(b.slug) || a.viewport.localeCompare(b.viewport));
  fs.writeFileSync(CHUNK_SUMMARY_PATH, JSON.stringify(allResults, null, 2));
}

// --- Tests ---

function slugToUrl(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}/`;
}

test.describe.configure({ mode: 'parallel' });

if (TASKS.length === 0) {
  test('no tasks', async () => { console.log('No baseline tasks matched filter.'); });
} else {
  for (const task of TASKS) {
    test(`chunks: ${task.slug} (${task.viewport})`, async ({ browser }) => {
      const vp = VIEWPORTS[task.viewport];

      // --- WordPress side ---
      const wpCtx = await browser.newContext({ viewport: vp });
      const wpPage = await wpCtx.newPage();
      let wpResult: Awaited<ReturnType<typeof screenshotSections>>;
      try {
        await wpPage.goto(WP_BASE + slugToUrl(task.slug), {
          waitUntil: 'domcontentloaded', timeout: 30_000,
        });
        await stabilizePage(wpPage);
        wpResult = await screenshotSections(wpPage, 'wp', task.slug, task.viewport);
      } finally {
        await wpCtx.close();
      }

      // --- Hugo side ---
      const hugoCtx = await browser.newContext({ viewport: vp });
      const hugoPage = await hugoCtx.newPage();
      let hugoResult: Awaited<ReturnType<typeof screenshotSections>>;
      try {
        const resp = await hugoPage.goto(HUGO_BASE + slugToUrl(task.slug), {
          waitUntil: 'domcontentloaded', timeout: 15_000,
        });
        if (!resp || resp.status() >= 400) {
          writeChunkSummary({
            slug: task.slug, viewport: task.viewport,
            totalSections: 0, matchedSections: 0,
            unmatchedWp: wpResult.sections.length, unmatchedHugo: 0,
            avgDiffPercent: 100, maxDiffPercent: 100,
            sections: [{ slug: task.slug, viewport: task.viewport, sectionIndex: 0,
              heading: null, selectorType: 'error', matchMethod: 'none',
              diffPercent: 100, overlapDiffPercent: 100,
              wpWidth: 0, wpHeight: 0, hugoWidth: 0, hugoHeight: 0,
              heightDelta: 0, error: `HTTP ${resp?.status() ?? 'none'}`,
            }],
          });
          return;
        }
        await stabilizePage(hugoPage);
        hugoResult = await screenshotSections(hugoPage, 'hugo', task.slug, task.viewport);
      } finally {
        await hugoCtx.close();
      }

      // --- Match & Diff ---
      const { pairs, unmatchedWp, unmatchedHugo } = matchSections(
        wpResult.sections, hugoResult.sections
      );

      const chunkResults: ChunkResult[] = [];

      for (const pair of pairs) {
        const wpBuf = wpResult.screenshots.get(pair.wp);
        const hugoBuf = hugoResult.screenshots.get(pair.hugo);
        const wpSection = wpResult.sections.find(s => s.index === pair.wp)!;

        if (!wpBuf || !hugoBuf) {
          chunkResults.push({
            slug: task.slug, viewport: task.viewport,
            sectionIndex: pair.wp,
            heading: wpSection.heading, selectorType: wpSection.selectorType,
            matchMethod: pair.method,
            diffPercent: 100, overlapDiffPercent: 100,
            wpWidth: 0, wpHeight: 0, hugoWidth: 0, hugoHeight: 0,
            heightDelta: 0, error: 'missing screenshot',
          });
          continue;
        }

        const diff = diffScreenshots(wpBuf, hugoBuf);
        chunkResults.push({
          slug: task.slug, viewport: task.viewport,
          sectionIndex: pair.wp,
          heading: wpSection.heading, selectorType: wpSection.selectorType,
          matchMethod: pair.method,
          ...diff,
        });
      }

      // Report unmatched
      for (const idx of unmatchedWp) {
        const s = wpResult.sections.find(x => x.index === idx)!;
        chunkResults.push({
          slug: task.slug, viewport: task.viewport,
          sectionIndex: idx,
          heading: s.heading, selectorType: s.selectorType,
          matchMethod: 'unmatched_wp',
          diffPercent: 100, overlapDiffPercent: 100,
          wpWidth: 0, wpHeight: 0, hugoWidth: 0, hugoHeight: 0, heightDelta: 0,
        });
      }
      for (const idx of unmatchedHugo) {
        const s = hugoResult.sections.find(x => x.index === idx)!;
        chunkResults.push({
          slug: task.slug, viewport: task.viewport,
          sectionIndex: idx,
          heading: s.heading, selectorType: s.selectorType,
          matchMethod: 'unmatched_hugo',
          diffPercent: 100, overlapDiffPercent: 100,
          wpWidth: 0, wpHeight: 0, hugoWidth: 0, hugoHeight: 0, heightDelta: 0,
        });
      }

      const matched = chunkResults.filter(r => !r.matchMethod.startsWith('unmatched'));
      const avgDiff = matched.length > 0
        ? matched.reduce((s, r) => s + r.diffPercent, 0) / matched.length
        : 100;
      const maxDiff = matched.length > 0
        ? Math.max(...matched.map(r => r.diffPercent))
        : 100;

      const summary: PageChunkSummary = {
        slug: task.slug, viewport: task.viewport,
        totalSections: wpResult.sections.length,
        matchedSections: pairs.length,
        unmatchedWp: unmatchedWp.length,
        unmatchedHugo: unmatchedHugo.length,
        avgDiffPercent: avgDiff,
        maxDiffPercent: maxDiff,
        sections: chunkResults,
      };

      writeChunkSummary(summary);

      // Console report
      console.log(`\n${task.slug} (${task.viewport}): ${pairs.length} matched, ` +
        `${unmatchedWp.length} unmatched WP, ${unmatchedHugo.length} unmatched Hugo`);
      for (const r of chunkResults) {
        const label = r.heading ? `"${r.heading}"` : `section ${r.sectionIndex}`;
        const status = r.matchMethod.startsWith('unmatched') ? r.matchMethod : `${r.diffPercent.toFixed(1)}%`;
        console.log(`  [${r.selectorType}] ${label}: ${status}`);
      }
    });
  }
}
