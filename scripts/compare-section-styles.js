const { chromium } = require('playwright');

const slug = process.argv[2];
const headingNeedle = process.argv.slice(3).join(' ').trim();

if (!slug || !headingNeedle) {
  console.error('Usage: node scripts/compare-section-styles.js <slug> <heading text>');
  process.exit(1);
}

const viewport = { width: 375, height: 812 };

function buildUrl(base, pageSlug) {
  if (pageSlug === 'home') {
    return `${base}/`;
  }
  return `${base}/${pageSlug}/`;
}

async function inspectPage(browser, label, url, headingText) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await Promise.race([page.waitForLoadState('networkidle'), page.waitForTimeout(10000)]);

  const result = await page.evaluate((needle) => {
    const normalize = (text) => (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const target = normalize(needle);
    const roots = [
      '.wp-block-uagb-container.uagb-is-root-container',
      'main > section',
      'main section',
      '.entry-content > div',
      '.entry-content > section',
      '.entry-content > article',
      '.entry-content section',
    ];
    const headings = [...document.querySelectorAll('main h1, main h2, main h3, main h4, .entry-content h1, .entry-content h2, .entry-content h3, .entry-content h4')];
    const headingEl = headings.find((el) => normalize(el.textContent).includes(target));

    if (!headingEl) {
      return { error: `Heading not found: ${needle}` };
    }

    const root = headingEl.closest(roots.join(', ')) || headingEl.parentElement;
    const pick = (selector) => root.querySelector(selector);
    const list = (selector) => [...root.querySelectorAll(selector)].slice(0, 6);
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        width: Math.round(r.width),
        height: Math.round(r.height),
        top: Math.round(r.top),
        left: Math.round(r.left),
      };
    };
    const style = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        position: cs.position,
        width: cs.width,
        maxWidth: cs.maxWidth,
        minHeight: cs.minHeight,
        height: cs.height,
        padding: cs.padding,
        margin: cs.margin,
        gap: cs.gap,
        rowGap: cs.rowGap,
        columnGap: cs.columnGap,
        flexDirection: cs.flexDirection,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        gridTemplateColumns: cs.gridTemplateColumns,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        textAlign: cs.textAlign,
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
      };
    };
    const describe = (el, name) => {
      if (!el) return null;
      return {
        name,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
        className: el.className || null,
        rect: rect(el),
        style: style(el),
      };
    };

    return {
      heading: describe(headingEl, 'heading'),
      root: describe(root, 'root'),
      inner: describe(pick('.uagb-container-inner-blocks-wrap, .section-inner'), 'inner'),
      firstParagraph: describe(pick('p'), 'firstParagraph'),
      firstImage: describe(pick('img'), 'firstImage'),
      firstButton: describe(pick('.wp-block-button__link, .uagb-buttons-repeater, .section-cta a, a'), 'firstButton'),
      grids: [
        describe(pick('.use-cases-grid, .team-grid, .steps-grid, .features-grid, .uagb-post__columns-3.is-grid, .uagb-post__columns-mobile-1.is-grid'), 'primaryGrid'),
        ...list('.wp-block-uagb-container, .use-case-card, .team-card, .uagb-post__inner-wrap').slice(0, 3).map((el, index) => describe(el, `sampleItem${index + 1}`)),
      ].filter(Boolean),
    };
  }, headingText);

  await page.close();
  return { label, url, result };
}

(async () => {
  const browser = await chromium.launch();
  try {
    const wpUrl = buildUrl('https://xrnavigation.io', slug);
    const hugoUrl = buildUrl('http://127.0.0.1:1314', slug);
    const [wp, hugo] = await Promise.all([
      inspectPage(browser, 'wp', wpUrl, headingNeedle),
      inspectPage(browser, 'hugo', hugoUrl, headingNeedle),
    ]);
    console.log(JSON.stringify({ slug, heading: headingNeedle, viewport, wp, hugo }, null, 2));
  } finally {
    await browser.close();
  }
})();
