const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto('http://localhost:1314/blog/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.uagb-post__inner-wrap')].slice(0, 5).map(c => {
      const title = c.querySelector('.uagb-post__title');
      const byline = c.querySelector('.uagb-post-grid-byline');
      const excerpt = c.querySelector('.uagb-post__excerpt');
      return {
        totalH: Math.round(c.getBoundingClientRect().height),
        padding: getComputedStyle(c).padding,
        titleH: title ? Math.round(title.getBoundingClientRect().height) : 0,
        titleFontSize: title ? getComputedStyle(title).fontSize : 'N/A',
        titlePaddingBottom: title ? getComputedStyle(title).paddingBottom : 'N/A',
        bylineH: byline ? Math.round(byline.getBoundingClientRect().height) : 0,
        excerptH: excerpt ? Math.round(excerpt.getBoundingClientRect().height) : 0,
        excerptFontSize: excerpt ? getComputedStyle(excerpt).fontSize : 'N/A',
        excerptLineHeight: excerpt ? getComputedStyle(excerpt).lineHeight : 'N/A',
        excerptText: excerpt ? excerpt.textContent.substring(0, 80) : 'N/A',
      };
    });
    return cards;
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
