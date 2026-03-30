import { test } from '@playwright/test';

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const SITEMAP_URLS = [
  'https://xrnavigation.io/page-sitemap.xml',
  'https://xrnavigation.io/post-sitemap.xml',
];

const BASELINE_DIR = path.join(__dirname, 'baseline');

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 375, height: 812 },
];

/** Fetch a URL over HTTPS and return the body as a string. */
function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve, reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/** Extract all <loc> URLs from a sitemap XML string. */
async function parseSitemap(xml: string): Promise<string[]> {
  // Simple regex extraction — avoids needing xml2js dependency
  const urls: string[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

/** Derive a filename slug from a URL. */
function slugFromUrl(url: string): string {
  const parsed = new URL(url);
  const pathname = parsed.pathname.replace(/^\/|\/$/g, '');
  if (pathname === '') return 'home';
  return pathname.replace(/\//g, '-');
}

// Collect all URLs before tests run, then generate a test per URL+viewport.
let allUrls: string[] = [];

test.beforeAll(async () => {
  // Ensure baseline directory exists
  if (!fs.existsSync(BASELINE_DIR)) {
    fs.mkdirSync(BASELINE_DIR, { recursive: true });
  }

  // Fetch and parse both sitemaps
  for (const sitemapUrl of SITEMAP_URLS) {
    const xml = await fetchUrl(sitemapUrl);
    const urls = await parseSitemap(xml);
    allUrls.push(...urls);
  }

  console.log(`Found ${allUrls.length} URLs across sitemaps`);
});

test('capture visual baselines', async ({ browser }) => {
  const failed: string[] = [];
  let skipped = 0;
  let captured = 0;

  // Process each URL sequentially to avoid overwhelming the site
  for (const url of allUrls) {
    const slug = slugFromUrl(url);

    for (const vp of VIEWPORTS) {
      const filename = `${slug}-${vp.name}.png`;
      const filepath = path.join(BASELINE_DIR, filename);

      // Skip already-captured screenshots
      if (fs.existsSync(filepath)) {
        skipped++;
        continue;
      }

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      try {
        // Navigate with a short timeout — don't wait for networkidle in goto
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });

        // Race networkidle against a 10s ceiling so pages with persistent
        // connections (reCAPTCHA, analytics) don't block the whole run.
        await Promise.race([
          page.waitForLoadState('networkidle').catch(() => {}),
          page.waitForTimeout(10_000),
        ]);

        // Wait for fonts to finish loading
        await page.evaluate(() => document.fonts.ready);

        // Small extra wait for any late-loading embeds
        await page.waitForTimeout(1000);

        // Take full-page screenshot
        await page.screenshot({
          path: filepath,
          fullPage: true,
        });

        captured++;
        console.log(`  ✓ ${filename}`);
      } catch (err) {
        failed.push(filename);
        console.error(`  ✗ ${filename}: ${err}`);
      } finally {
        await context.close();
      }
    }
  }

  console.log(`\nBaseline summary: ${captured} captured, ${skipped} skipped (existing), ${failed.length} failed`);
  if (failed.length > 0) {
    console.log('Failed pages:');
    for (const f of failed) {
      console.log(`  - ${f}`);
    }
  }
});
