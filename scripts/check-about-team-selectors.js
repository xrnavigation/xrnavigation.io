const { chromium } = require('playwright');

const targets = [
  { name: 'localMobile', url: 'http://127.0.0.1:1314/about/' },
  { name: 'liveMobile', url: 'https://xrnavigation.io/about/' },
];

const selectors = [
  '.uagb-block-4084160e',
  '.uagb-block-4084160e > .uagb-container-inner-blocks-wrap',
  '.uagb-block-8f705a85',
  '.uagb-block-1cbef3a3',
  '.uagb-block-316f7e41',
  '.uagb-block-316f7e41 .uagb-ifb-title',
  '.uagb-block-316f7e41 .uagb-ifb-desc',
  '.uagb-block-55dd86c5',
  '.uagb-block-55dd86c5 > .uagb-container-inner-blocks-wrap',
  '.uagb-block-253df222',
  '.uagb-block-75636745',
  '.uagb-block-8a61e05b',
  '.uagb-block-8a61e05b .uagb-ifb-title',
  '.uagb-block-8a61e05b .uagb-ifb-desc',
  '.uagb-block-b49613d3',
  '.uagb-block-b49613d3 > .uagb-container-inner-blocks-wrap',
  '.uagb-block-e7587deb',
  '.uagb-block-25c8dd88',
  '.uagb-block-28226b57',
  '.uagb-block-28226b57 .uagb-ifb-title',
  '.uagb-block-28226b57 .uagb-ifb-desc',
];

async function inspect(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      },
      display: cs.display,
      flexDirection: cs.flexDirection,
      flexWrap: cs.flexWrap,
      justifyContent: cs.justifyContent,
      alignItems: cs.alignItems,
      rowGap: cs.rowGap,
      columnGap: cs.columnGap,
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      width: cs.width,
      maxWidth: cs.maxWidth,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      color: cs.color,
      textAlign: cs.textAlign,
    };
  }, selector);
}

(async () => {
  const out = {};
  for (const target of targets) {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    out[target.name] = {};
    for (const selector of selectors) {
      out[target.name][selector] = await inspect(page, selector);
    }
    await browser.close();
  }
  console.log(JSON.stringify(out, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
