const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const fs = require('fs');
let pixelmatch;

const slug = process.argv[2] || 'fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific';
const baselineFile = `tests/baseline/${slug}-desktop.png`;
const currentFile = `tests/current/quick-${slug}.png`;
const url = slug === 'home' ? 'http://localhost:1314/' : `http://localhost:1314/${slug}/`;

(async () => {
  pixelmatch = (await import('pixelmatch')).default;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await Promise.race([page.waitForLoadState('networkidle'), page.waitForTimeout(10000)]);
  await page.screenshot({ path: currentFile, fullPage: true });
  await browser.close();

  const b = PNG.sync.read(fs.readFileSync(baselineFile));
  const c = PNG.sync.read(fs.readFileSync(currentFile));
  const w = Math.min(b.width, c.width), h = Math.min(b.height, c.height);
  const diff = pixelmatch(b.data, c.data, null, w, h, { threshold: 0.1 });
  const pct = (diff / (w * h) * 100).toFixed(2);
  console.log(`${slug}: ${pct}% diff (${w}x${h}, baseline ${b.height}px, current ${c.height}px)`);
})();
