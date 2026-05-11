const { chromium } = require('playwright');

const [, , url] = process.argv;

if (!url) {
  console.error('Usage: node scripts/inspect-entry-children.js <url>');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const result = await page.evaluate(() => {
    const entry = document.querySelector('.entry-content');
    if (!entry) return { error: 'No .entry-content found' };

    const items = Array.from(entry.children).map((el, index) => {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        index,
        tag: el.tagName.toLowerCase(),
        className: el.className,
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
        top: rect.top + window.scrollY,
        height: rect.height,
        margin: cs.margin,
        padding: cs.padding,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
      };
    });

    return {
      url: location.href,
      bodyHeight: document.body.scrollHeight,
      entryHeight: entry.getBoundingClientRect().height,
      items,
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
