const { chromium } = require('playwright');

const [, , url, viewportName = 'mobile'] = process.argv;

if (!url) {
  console.error('Usage: node scripts/inspect-demo-form.js <url> [mobile|desktop]');
  process.exit(1);
}

const config = viewportName === 'desktop'
  ? {
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    }
  : {
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    };

const selectors = [
  'body',
  '.wp-demo-form-page',
  '.wp-demo-form-page .Change-background',
  '.wp-demo-form-page .Change-background::before',
  '.wp-demo-form-page .uagb-container-inner-blocks-wrap',
  '.wp-demo-form-page .uagb-block-7cba2e14',
  '.wp-demo-form-page h1.wp-block-heading',
  '#wpforms-2320',
  '#wpforms-form-2320',
  '#wpforms-2320-field_0-container',
  '#wpforms-2320-field_1-container',
  '#wpforms-submit-2320',
  '.site-footer',
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage(config);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const result = await page.evaluate((targetSelectors) => {
    const readMetric = selector => {
      if (selector.endsWith('::before')) {
        const baseSelector = selector.replace('::before', '');
        const el = document.querySelector(baseSelector);
        if (!el) return { selector, missing: true };
        const cs = getComputedStyle(el, '::before');
        return {
          selector,
          display: cs.display,
          opacity: cs.opacity,
          background: cs.backgroundColor,
        };
      }

      const el = document.querySelector(selector);
      if (!el) return { selector, missing: true };
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        selector,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        margin: cs.margin,
        padding: cs.padding,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        backgroundImage: cs.backgroundImage,
        backgroundPosition: cs.backgroundPosition,
        backgroundAttachment: cs.backgroundAttachment,
      };
    };

    return {
      url: location.href,
      bodyHeight: document.body.scrollHeight,
      metrics: targetSelectors.map(readMetric),
    };
  }, selectors);

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
