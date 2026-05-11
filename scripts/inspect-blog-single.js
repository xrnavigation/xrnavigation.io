const { chromium } = require('playwright');

const slug = process.argv[2] || 'list-of-non-visual-drawing-tools';

const targets = [
  { name: 'localDesktop', url: `http://127.0.0.1:1314/${slug}/`, viewport: { width: 1920, height: 1080 } },
  { name: 'liveDesktop', url: `https://xrnavigation.io/${slug}/`, viewport: { width: 1920, height: 1080 } },
  { name: 'localMobile', url: `http://127.0.0.1:1314/${slug}/`, viewport: { width: 375, height: 812 } },
  { name: 'liveMobile', url: `https://xrnavigation.io/${slug}/`, viewport: { width: 375, height: 812 } },
];

const selectors = [
  '#masthead',
  '.ast-mobile-header-wrap',
  '.ast-primary-header-bar',
  '.ast-single-entry-banner',
  '.ast-single-entry-banner .ast-container',
  '.ast-single-entry-banner .entry-title',
  '.ast-single-entry-banner .entry-meta',
  '.ast-article-single:not(.ast-related-post)',
  '.ast-post-format-.single-layout-1',
  '.entry-content.clear',
  '.post-navigation',
  '.ast-single-related-posts-container',
  '.ast-related-posts-title-section',
  '.ast-related-posts-wrapper',
  '.ast-related-post',
  '.ast-related-post-featured-section img',
  '.related-entry-header',
  '.ast-related-post-title',
  '.ast-related-post-excerpt',
  'footer#colophon',
];

async function inspect(url, viewport) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const result = await page.evaluate((targetSelectors) => {
    const read = selector => {
      const el = document.querySelector(selector);
      if (!el) return { selector, missing: true };
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        selector,
        x: Math.round(rect.x),
        y: Math.round(rect.y + window.scrollY),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        marginTop: cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        marginLeft: cs.marginLeft,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
        maxWidth: cs.maxWidth,
        minHeight: cs.minHeight,
        display: cs.display,
        gridTemplateColumns: cs.gridTemplateColumns,
        gap: cs.gap,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        text: el.textContent.trim().slice(0, 80),
      };
    };

    return {
      pageHeight: document.documentElement.scrollHeight,
      selectors: targetSelectors.map(read),
    };
  }, selectors);
  await browser.close();
  return result;
}

(async () => {
  const out = {};
  for (const target of targets) {
    out[target.name] = await inspect(target.url, target.viewport);
  }
  console.log(JSON.stringify(out, null, 2));
})();
