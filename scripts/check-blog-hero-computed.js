const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto('http://localhost:1314/blog/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const data = await page.evaluate(() => {
    const hero = document.querySelector('.blog-hero');
    return {
      heroH: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
      heroPadding: hero ? getComputedStyle(hero).padding : 'N/A',
      heroMinHeight: hero ? getComputedStyle(hero).minHeight : 'N/A',
      heroClasses: hero ? hero.className : 'N/A',
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
