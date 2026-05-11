const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto('http://localhost:1314/blog/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const img = document.querySelector('.uagb-post__image');
    const card = document.querySelector('.uagb-post__inner-wrap');
    return {
      imgDisplay: img ? getComputedStyle(img).display : 'no element',
      imgHeight: img ? img.getBoundingClientRect().height : 0,
      cardHeight: card ? Math.round(card.getBoundingClientRect().height) : 0,
      cardBg: card ? getComputedStyle(card).backgroundImage : 'none',
      cardChildren: card ? [...card.children].map(c => ({
        tag: c.tagName,
        classes: c.className.substring(0, 50),
        display: getComputedStyle(c).display,
        height: Math.round(c.getBoundingClientRect().height),
      })) : [],
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
