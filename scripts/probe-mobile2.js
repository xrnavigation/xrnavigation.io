const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  for (const [label, url] of [['hugo', 'http://127.0.0.1:1314/universities/'], ['wp', 'https://xrnavigation.io/universities/']]) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const h1 = [...document.querySelectorAll('h1')].find(h=>h.textContent.includes('Transform Your Campus'));
      if (!h1) return null;
      const rect = h1.getBoundingClientRect();
      const cs = getComputedStyle(h1);
      const inner = h1.closest('.collection-hero-inner') || h1.parentElement;
      const innerRect = inner.getBoundingClientRect();
      const sec = h1.closest('.collection-hero, .wp-block-uagb-container.alignfull');
      const secRect = sec ? sec.getBoundingClientRect() : {};
      return {
        h1: { w: rect.width, x: rect.left, fs: cs.fontSize, lh: cs.lineHeight, padding: cs.padding, margin: cs.margin },
        inner: { tag: inner.tagName, cls: inner.className.slice(0,50), w: innerRect.width, x: innerRect.left, padding: getComputedStyle(inner).padding, maxW: getComputedStyle(inner).maxWidth },
        section: { w: secRect.width, x: secRect.left, padding: sec ? getComputedStyle(sec).padding : '' },
      };
    });
    console.log(label, JSON.stringify(r, null, 2));
    await ctx.close();
  }
  await browser.close();
})();
