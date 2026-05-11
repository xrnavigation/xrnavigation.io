const { chromium } = require('playwright');
const url = 'http://localhost:1314/blog/';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    // Blog hero
    const hero = document.querySelector('.blog-hero, .Change-background');
    const heroInfo = hero ? {
      height: hero.getBoundingClientRect().height,
      classes: hero.className
    } : 'none';

    // Count blog cards
    const cards = document.querySelectorAll('.uagb-post__inner-wrap');
    const cardHeights = [...cards].map(c => Math.round(c.getBoundingClientRect().height));

    // Header height
    const header = document.querySelector('#ast-mobile-header, .main-header-bar-wrap');
    const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0;

    // Footer sections
    const aboveFooter = document.querySelector('.site-above-footer-wrap');
    const belowFooter = document.querySelector('.site-below-footer-wrap');
    const aboveH = aboveFooter ? Math.round(aboveFooter.getBoundingClientRect().height) : 0;
    const belowH = belowFooter ? Math.round(belowFooter.getBoundingClientRect().height) : 0;

    // Pagination
    const pagination = document.querySelector('.pagination');
    const paginH = pagination ? Math.round(pagination.getBoundingClientRect().height) : 0;

    // Get all major sections heights
    const sections = [...document.querySelectorAll('body > *')].map(s => ({
      tag: s.tagName,
      classes: s.className.substring(0, 60),
      height: Math.round(s.getBoundingClientRect().height)
    }));

    return {
      heroInfo,
      cardCount: cards.length,
      cardHeights,
      headerH,
      aboveFooterH: aboveH,
      belowFooterH: belowH,
      paginH,
      sections,
      totalHeight: document.body.scrollHeight
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
