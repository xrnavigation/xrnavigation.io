const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto('https://xrnavigation.io/privacy-policy/', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const ps = [...document.querySelectorAll('.entry-content > p, .entry-content > ul, .entry-content > h2')];
    return ps.slice(0, 5).map(p => {
      const cs = getComputedStyle(p);
      const r = p.getBoundingClientRect();
      return { tag: p.tagName, txt: (p.textContent||'').slice(0, 40), w: r.width, x: r.left, padding: cs.padding, margin: cs.margin };
    });
  });
  console.log(JSON.stringify(r, null, 2));
  await browser.close();
})();
