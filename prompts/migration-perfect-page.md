# Task: Get One Page to 0% Visual Diff — Tight Iteration Loop

## Goal
Make the Hugo rendering of `/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific/` IDENTICAL to the WordPress baseline screenshot. Currently at 4.96% diff. Get it to <1%.

## Method: TIGHT LOOP
You will iterate inside this single agent session. Do NOT write a report and exit after one attempt. Keep going until the diff is <1%.

### Loop:
1. Start Hugo server: `hugo server --port 1314 &`
2. Screenshot the page at desktop (1920x1080): use Playwright to navigate to `http://localhost:1314/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific/` and screenshot
3. Diff against baseline at `tests/baseline/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific-desktop.png` using pixelmatch
4. If diff > 1%: analyze the diff image to find WHERE the pixels differ (top? bottom? middle? header? footer? content area?)
5. Fix the CSS/template causing the difference
6. Rebuild Hugo (kill server, restart)
7. Screenshot again, diff again
8. Repeat until <1%

### How to Analyze Diffs
The diff image highlights changed pixels. To find what's different:
- Compare page heights (are they the same px?)
- Compare the diff image regions — is the difference concentrated in header, footer, content, or spread throughout?
- Use JavaScript on both the live WP page and the Hugo page to get computed styles on matching elements and compare

### What You Have
- Baseline screenshot: `tests/baseline/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific-desktop.png`
- Live WP page: https://xrnavigation.io/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific/
- Hugo content: `content/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific.md`
- WP CSS: `data/wp-css/` (29 files including the per-block UAGB styles)
- WP HTML patterns: `data/wp-html/structural-patterns.md`
- Hugo templates: `themes/xrnav/layouts/`
- Hugo CSS: `themes/xrnav/static/css/`

### Key Tools
```bash
# Screenshot a single page
npx playwright test --config tests/playwright.config.ts -g "fictional-map" 2>&1

# Or write a quick script:
node -e "
const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:1314/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tests/current/test-page.png', fullPage: true });
  await browser.close();
})()
"

# Diff two images
node -e "
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs = require('fs');
const img1 = PNG.sync.read(fs.readFileSync('tests/baseline/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific-desktop.png'));
const img2 = PNG.sync.read(fs.readFileSync('tests/current/test-page.png'));
// ... diff logic
"
```

### Browser Access
You can also use MCP chrome tools to inspect the live WP page and compare computed styles against the Hugo page. Use ToolSearch to load tools first.

## What Causes Diffs on This Specific Page
This page is an audiom embed page. It has:
- Header (logo + nav)
- Page title (h1)
- Description paragraph
- Audiom iframe embed
- Footer

The 4.96% diff is likely from: header/footer height differences, title font-size/margin, content padding, or iframe wrapper padding. Each of these is fixable.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit each fix iteration with a message like "Iteration N: fix X on fictional-map page (Y% → Z%)"
- After reaching <1%, commit final state and write report

## Report
Write to `reports/migration-perfect-page.md` with:
- Starting diff %
- Each iteration: what was wrong, what was fixed, new diff %
- Final diff %
- What CSS/template changes were made
- Which changes are page-specific vs. apply to all pages
- Commit hashes
