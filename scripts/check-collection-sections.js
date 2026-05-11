const { chromium } = require('playwright');
const slug = process.argv[2] || 'universities';
const url = `http://localhost:1314/${slug}/`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const results = [];
    // collection-page children
    const cp = document.querySelector('.collection-page');
    if (cp) {
      [...cp.children].forEach(el => {
        results.push({
          classes: el.className.substring(0, 80),
          height: Math.round(el.getBoundingClientRect().height),
          padding: getComputedStyle(el).padding,
          minHeight: getComputedStyle(el).minHeight,
        });
      });
    }
    return { sections: results, total: document.body.scrollHeight };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
