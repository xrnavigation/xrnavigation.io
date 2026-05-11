const { chromium } = require('playwright');
const slug = process.argv[2] || 'universities';
const url = `http://localhost:1314/${slug}/`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const sections = [];
    // Get all direct children of main or content area
    const main = document.querySelector('.site-main, #primary');
    if (main) {
      [...main.children].forEach(el => {
        sections.push({
          tag: el.tagName,
          classes: el.className.substring(0, 80),
          height: Math.round(el.getBoundingClientRect().height),
          padding: getComputedStyle(el).padding,
          maxWidth: getComputedStyle(el).maxWidth,
          width: Math.round(el.getBoundingClientRect().width),
        });
      });
    }

    // Footer
    const footer = document.querySelector('footer.site-footer');
    const footerH = footer ? Math.round(footer.getBoundingClientRect().height) : 0;

    return { sections, footerH, totalHeight: document.body.scrollHeight };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
