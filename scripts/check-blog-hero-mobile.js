const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto('http://localhost:1314/blog/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const hero = document.querySelector('.blog-hero, .Change-background');
    const grid = document.querySelector('.uagb-post__columns-3.is-grid');
    const footer = document.querySelector('footer.site-footer');
    const aboveFooter = document.querySelector('.site-above-footer-wrap');
    const belowFooter = document.querySelector('.site-below-footer-wrap');
    const latestH2 = document.querySelector('.latest-posts-heading, .blog-latest h2, .uagb-post-grid h2');

    // Find the "Latest Blog Posts" heading
    const h2s = [...document.querySelectorAll('h2')];
    const latestH = h2s.find(h => h.textContent.includes('Latest'));

    return {
      heroH: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
      heroPadding: hero ? getComputedStyle(hero).padding : 'N/A',
      gridH: grid ? Math.round(grid.getBoundingClientRect().height) : 0,
      gridGap: grid ? getComputedStyle(grid).gap : 'N/A',
      gridColumns: grid ? getComputedStyle(grid).gridTemplateColumns : 'N/A',
      aboveFooterH: aboveFooter ? Math.round(aboveFooter.getBoundingClientRect().height) : 0,
      belowFooterH: belowFooter ? Math.round(belowFooter.getBoundingClientRect().height) : 0,
      latestH2H: latestH ? Math.round(latestH.getBoundingClientRect().height) : 0,
      latestH2Margin: latestH ? getComputedStyle(latestH).margin : 'N/A',
      totalHeight: document.body.scrollHeight,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
