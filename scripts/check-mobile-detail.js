const { chromium } = require('playwright');
const slug = process.argv[2] || 'blog';
const url = slug === 'home' ? 'http://localhost:1314/' : `http://localhost:1314/${slug}/`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    // Check all h1 elements
    const h1s = [...document.querySelectorAll('h1')].map(h => ({
      text: h.textContent.substring(0, 60),
      fontSize: getComputedStyle(h).fontSize,
      classes: h.className,
      parentClasses: h.parentElement ? h.parentElement.className : 'none'
    }));

    // Check all containers
    const containers = [...document.querySelectorAll('.ast-container')].map(c => ({
      maxWidth: getComputedStyle(c).maxWidth,
      width: c.getBoundingClientRect().width,
      paddingLeft: getComputedStyle(c).paddingLeft,
      paddingRight: getComputedStyle(c).paddingRight,
      classes: c.className,
      parentClasses: c.parentElement ? c.parentElement.className : 'none',
      childrenCount: c.children.length
    }));

    // Check blog grid
    const grid = document.querySelector('.uagb-post__columns-3.is-grid');
    const gridInfo = grid ? {
      display: getComputedStyle(grid).display,
      gridTemplateColumns: getComputedStyle(grid).gridTemplateColumns,
      width: grid.getBoundingClientRect().width,
      childCount: grid.children.length
    } : 'not found';

    // Check blog post cards
    const cards = [...document.querySelectorAll('.uagb-post__inner-wrap')].slice(0, 3).map(c => ({
      width: c.getBoundingClientRect().width,
      height: c.getBoundingClientRect().height,
    }));

    return { h1s, containers, gridInfo, cards, bodyHeight: document.body.scrollHeight };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
