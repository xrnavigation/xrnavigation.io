const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const fs = require('fs');
let pixelmatch;

const slug = process.argv[2] || 'fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific';
const baselineFile = `tests/baseline/${slug}-desktop.png`;
const currentFile = `tests/current/quick-${slug}.png`;
const diffFile = `tests/current/diff-${slug}.png`;
const url = slug === 'home' ? 'http://localhost:1314/' : `http://localhost:1314/${slug}/`;

(async () => {
  pixelmatch = (await import('pixelmatch')).default;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await Promise.race([page.waitForLoadState('networkidle'), page.waitForTimeout(10000)]);
  // Scroll to bottom to trigger lazy-loaded images, then back to top
  await page.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await delay(100);
    }
    window.scrollTo(0, 0);
    await delay(200);
  });
  // Wait for Able Player to initialize if present
  // Wait for Able Player to fully initialize
  await page.waitForSelector('.able-wrapper', { timeout: 5000 }).catch(() => {});
  await page.waitForSelector('.able-controller', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: currentFile, fullPage: true });
  await browser.close();

  const b = PNG.sync.read(fs.readFileSync(baselineFile));
  const c = PNG.sync.read(fs.readFileSync(currentFile));

  // Handle different image sizes by compositing onto max-dimension canvas
  const w = Math.max(b.width, c.width);
  const h = Math.max(b.height, c.height);

  function expandToCanvas(img, targetW, targetH) {
    if (img.width === targetW && img.height === targetH) return img.data;
    // Create a new buffer filled with white (background)
    const buf = Buffer.alloc(targetW * targetH * 4, 0);
    for (let i = 0; i < targetW * targetH; i++) {
      buf[i * 4 + 0] = 255; // R
      buf[i * 4 + 1] = 255; // G
      buf[i * 4 + 2] = 255; // B
      buf[i * 4 + 3] = 255; // A
    }
    // Copy original image data row by row
    for (let y = 0; y < img.height; y++) {
      const srcOff = y * img.width * 4;
      const dstOff = y * targetW * 4;
      img.data.copy(buf, dstOff, srcOff, srcOff + img.width * 4);
    }
    return buf;
  }

  const bData = expandToCanvas(b, w, h);
  const cData = expandToCanvas(c, w, h);

  const diffPng = new PNG({ width: w, height: h });
  const numDiff = pixelmatch(bData, cData, diffPng.data, w, h, { threshold: 0.1 });
  const pct = (numDiff / (w * h) * 100).toFixed(2);

  // Save diff image
  fs.writeFileSync(diffFile, PNG.sync.write(diffPng));

  console.log(`${slug}: ${pct}% diff (${w}x${h}, baseline ${b.width}x${b.height}, current ${c.width}x${c.height})`);
  console.log(`Diff image: ${diffFile}`);
})();
