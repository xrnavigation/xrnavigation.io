const { chromium } = require('playwright');

const slug = process.argv[2] || 'blog';
const localPort = process.argv.includes('--port')
  ? process.argv[process.argv.indexOf('--port') + 1]
  : '1314';

const viewports = {
  mobile: { width: 375, height: 812 },
};

const selectors = [
  {
    name: 'hero-root',
    selector: '.blog-hero, .Change-background',
  },
  {
    name: 'hero-inner',
    selector: '.blog-hero > .uagb-container-inner-blocks-wrap',
  },
  {
    name: 'hero-title',
    selector: '.blog-hero h1, .blog-hero .wp-block-heading',
  },
  {
    name: 'hero-copy',
    selector: '.blog-hero p',
  },
  {
    name: 'heading-root',
    textMatch: 'Latest Blog Posts',
  },
  {
    name: 'heading-inner',
    textMatch: 'Latest Blog Posts',
    selector: '.uagb-container-inner-blocks-wrap',
  },
  {
    name: 'heading-h2',
    selector: '.entry-content h2.uagb-heading-text',
  },
  {
    name: 'grid-root',
    selector: '.uagb-post-grid.uagb-post__items, .wp-block-uagb-post-grid.uagb-post-grid',
  },
  {
    name: 'card',
    selector: '.uagb-post__inner-wrap',
  },
  {
    name: 'card-image',
    selector: '.uagb-post__image',
  },
  {
    name: 'card-title',
    selector: '.uagb-post__title',
  },
  {
    name: 'card-byline',
    selector: '.uagb-post-grid-byline',
  },
  {
    name: 'card-excerpt',
    selector: '.uagb-post__excerpt',
  },
];

function pickComputed(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    tag: el.tagName.toLowerCase(),
    classes: el.className,
    text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    rect: {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    display: cs.display,
    position: cs.position,
    width: cs.width,
    maxWidth: cs.maxWidth,
    minHeight: cs.minHeight,
    padding: cs.padding,
    margin: cs.margin,
    gap: cs.gap,
    flexDirection: cs.flexDirection,
    justifyContent: cs.justifyContent,
    alignItems: cs.alignItems,
    backgroundImage: cs.backgroundImage,
    backgroundPosition: cs.backgroundPosition,
    backgroundRepeat: cs.backgroundRepeat,
    backgroundSize: cs.backgroundSize,
    backgroundAttachment: cs.backgroundAttachment,
    gridTemplateColumns: cs.gridTemplateColumns,
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    color: cs.color,
  };
}

async function collect(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  return page.evaluate((targetSelectors) => {
    const pickNode = (entry) => {
      if (entry.textMatch) {
        const roots = [...document.querySelectorAll('.entry-content > .wp-block-uagb-container, .entry-content > .wp-block-group')];
        const root = roots.find((el) => (el.textContent || '').includes(entry.textMatch));
        if (!root) return null;
        return entry.selector ? root.querySelector(entry.selector) : root;
      }
      return document.querySelector(entry.selector);
    };

    const metrics = {};
    for (const entry of targetSelectors) {
      const el = pickNode(entry);
      metrics[entry.name] = el
        ? (() => {
            const cs = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName.toLowerCase(),
              classes: el.className,
              text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
              rect: {
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              },
              display: cs.display,
              position: cs.position,
              width: cs.width,
              maxWidth: cs.maxWidth,
              minHeight: cs.minHeight,
              padding: cs.padding,
              margin: cs.margin,
              gap: cs.gap,
              flexDirection: cs.flexDirection,
              justifyContent: cs.justifyContent,
              alignItems: cs.alignItems,
              backgroundImage: cs.backgroundImage,
              backgroundPosition: cs.backgroundPosition,
              backgroundRepeat: cs.backgroundRepeat,
              backgroundSize: cs.backgroundSize,
              backgroundAttachment: cs.backgroundAttachment,
              gridTemplateColumns: cs.gridTemplateColumns,
              fontSize: cs.fontSize,
              lineHeight: cs.lineHeight,
              color: cs.color,
            };
          })()
        : null;
    }

    const cards = [...document.querySelectorAll('.uagb-post__inner-wrap')].slice(0, 3).map((el) => {
      const title = el.querySelector('.uagb-post__title');
      const byline = el.querySelector('.uagb-post-grid-byline');
      const excerpt = el.querySelector('.uagb-post__excerpt');
      const image = el.querySelector('.uagb-post__image');
      const cs = getComputedStyle(el);
      return {
        rect: {
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height),
        },
        padding: cs.padding,
        backgroundImage: cs.backgroundImage,
        backgroundPosition: cs.backgroundPosition,
        backgroundSize: cs.backgroundSize,
        backgroundAttachment: cs.backgroundAttachment,
        title: title
          ? {
              rect: {
                width: Math.round(title.getBoundingClientRect().width),
                height: Math.round(title.getBoundingClientRect().height),
              },
              fontSize: getComputedStyle(title).fontSize,
              lineHeight: getComputedStyle(title).lineHeight,
              paddingBottom: getComputedStyle(title).paddingBottom,
              margin: getComputedStyle(title).margin,
            }
          : null,
        byline: byline
          ? {
              rect: {
                width: Math.round(byline.getBoundingClientRect().width),
                height: Math.round(byline.getBoundingClientRect().height),
              },
              fontSize: getComputedStyle(byline).fontSize,
              lineHeight: getComputedStyle(byline).lineHeight,
              paddingBottom: getComputedStyle(byline).paddingBottom,
              margin: getComputedStyle(byline).margin,
            }
          : null,
        excerpt: excerpt
          ? {
              rect: {
                width: Math.round(excerpt.getBoundingClientRect().width),
                height: Math.round(excerpt.getBoundingClientRect().height),
              },
              fontSize: getComputedStyle(excerpt).fontSize,
              lineHeight: getComputedStyle(excerpt).lineHeight,
              paddingBottom: getComputedStyle(excerpt).paddingBottom,
              margin: getComputedStyle(excerpt).margin,
            }
          : null,
        image: image
          ? {
              display: getComputedStyle(image).display,
              rect: {
                width: Math.round(image.getBoundingClientRect().width),
                height: Math.round(image.getBoundingClientRect().height),
              },
            }
          : null,
      };
    });

    return {
      url: location.href,
      bodyHeight: document.body.scrollHeight,
      metrics,
      cards,
    };
  }, selectors);
}

function diffValue(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return b - a;
  return null;
}

function summarize(wp, hugo) {
  const out = {};
  for (const key of Object.keys(wp.metrics)) {
    const left = wp.metrics[key];
    const right = hugo.metrics[key];
    if (!left || !right) {
      out[key] = { wp: left, hugo: right };
      continue;
    }
    out[key] = {
      wp: left,
      hugo: right,
      deltas: {
        rectWidth: diffValue(left.rect.width, right.rect.width),
        rectHeight: diffValue(left.rect.height, right.rect.height),
        fontSize: diffValue(parseFloat(left.fontSize), parseFloat(right.fontSize)),
        lineHeight: diffValue(parseFloat(left.lineHeight), parseFloat(right.lineHeight)),
      },
    };
  }

  out.cards = wp.cards.map((card, idx) => ({
    index: idx,
    wp: card,
    hugo: hugo.cards[idx] || null,
    deltas: hugo.cards[idx]
      ? {
          rectWidth: diffValue(card.rect.width, hugo.cards[idx].rect.width),
          rectHeight: diffValue(card.rect.height, hugo.cards[idx].rect.height),
        }
      : null,
  }));

  return {
    wp: {
      url: wp.url,
      bodyHeight: wp.bodyHeight,
    },
    hugo: {
      url: hugo.url,
      bodyHeight: hugo.bodyHeight,
    },
    bodyHeightDelta: hugo.bodyHeight - wp.bodyHeight,
    comparison: out,
  };
}

(async () => {
  const browser = await chromium.launch();
  const contextOptions = {
    viewport: viewports.mobile,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  };

  const wpPage = await browser.newPage(contextOptions);
  const hugoPage = await browser.newPage(contextOptions);

  const wpUrl = `https://xrnavigation.io/${slug}/`;
  const hugoUrl = `http://127.0.0.1:${localPort}/${slug}/`;

  const [wp, hugo] = await Promise.all([
    collect(wpPage, wpUrl),
    collect(hugoPage, hugoUrl),
  ]);

  await browser.close();

  console.log(JSON.stringify(summarize(wp, hugo), null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
