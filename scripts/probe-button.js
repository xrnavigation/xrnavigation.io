const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  for (const [label, url] of [['hugo', 'http://127.0.0.1:1314/map-evaluation-tool/'], ['wp', 'https://xrnavigation.io/map-evaluation-tool/']]) {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const btn = document.querySelector('.wp-block-button__link, .wp-element-button');
      if (!btn) return null;
      const cs = getComputedStyle(btn);
      return {
        sourceText: btn.textContent.trim().slice(0, 60),
        textTransform: cs.textTransform,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
        bgColor: cs.backgroundColor,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        textDecoration: cs.textDecoration,
      };
    });
    console.log(label, JSON.stringify(r, null, 2));
    await ctx.close();
  }
  await browser.close();
})();
