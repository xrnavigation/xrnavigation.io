const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto('http://localhost:1314/accessibility-statement/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const main = document.querySelector('.site-main, #primary, article');
    const entryContent = document.querySelector('.entry-content');
    const container = document.querySelector('.site-content .ast-container');
    const uagb = document.querySelector('.uagb-container-inner-blocks-wrap');

    return {
      mainH: main ? Math.round(main.getBoundingClientRect().height) : 0,
      mainPadding: main ? getComputedStyle(main).padding : 'N/A',
      entryContentW: entryContent ? Math.round(entryContent.getBoundingClientRect().width) : 0,
      entryContentPadding: entryContent ? getComputedStyle(entryContent).padding : 'N/A',
      containerW: container ? Math.round(container.getBoundingClientRect().width) : 0,
      containerPadding: container ? getComputedStyle(container).padding : 'N/A',
      uagbW: uagb ? Math.round(uagb.getBoundingClientRect().width) : 0,
      uagbPadding: uagb ? getComputedStyle(uagb).padding : 'N/A',
      pFontSize: getComputedStyle(document.querySelector('p') || document.body).fontSize,
      bodyH: document.body.scrollHeight,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
