const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto('http://localhost:1314/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const main = document.querySelector('.site-main');
    const sections = main ? [...main.children].map(s => ({
      tag: s.tagName,
      classes: s.className.substring(0, 60),
      height: Math.round(s.getBoundingClientRect().height),
      minHeight: getComputedStyle(s).minHeight,
      padding: getComputedStyle(s).padding,
    })) : [];

    const footer = document.querySelector('footer.site-footer');
    return {
      sections,
      footerH: footer ? Math.round(footer.getBoundingClientRect().height) : 0,
      totalH: document.body.scrollHeight,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
