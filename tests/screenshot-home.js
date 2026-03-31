const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:1314/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tests/current/home-desktop.png', fullPage: true });
  console.log('Homepage screenshot taken');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
