const { chromium } = require('playwright');

const [, , url] = process.argv;

if (!url) {
  console.error('Usage: node scripts/inspect-mobile-page.js <url>');
  process.exit(1);
}

const selectors = [
  'body',
  '.wp-accessibility-page',
  '.wp-accessibility-page .entry-content',
  '.uagb-block-450c520f',
  '.uagb-block-450c520f > .uagb-container-inner-blocks-wrap',
  '.uagb-block-7cba2e14',
  '.uagb-block-4a73817d',
  '.uagb-block-4a73817d .uagb-heading-text',
  '.uagb-block-7cba2e14 > p',
  '.uagb-block-7cba2e14 .wp-block-jetpack-markdown',
  '.uagb-block-7cba2e14 .wp-block-jetpack-markdown p',
  '.wp-block-spacer',
  '.site-footer',
  '.site-footer-primary',
  '.site-footer-primary-section-1',
  '.site-footer-primary-section-2',
  '.site-footer-below-section-1',
];

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

  const result = await page.evaluate((targetSelectors) => {
    const readMetric = selector => {
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
      metrics: targetSelectors.map(readMetric),
    };
  }, selectors);

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
