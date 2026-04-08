const { chromium } = require('playwright');

const VIEWPORT = { width: 375, height: 812 };
const WP_URL = process.env.WP_URL || 'https://xrnavigation.io/';
const HUGO_URL = process.env.HUGO_URL || 'http://127.0.0.1:1314/';

const sections = [
  { name: 'steps', index: 1, heading: 'Step One' },
  { name: 'why-section', index: 2, heading: 'Why XR Navigation Is The Future' },
  { name: 'client-logos', index: 4, heading: 'Our Clients' },
  { name: 'what-is', index: 5, heading: 'What Is Audiom?' },
  { name: 'use-cases', index: 6, heading: 'Audiom Use Cases' },
  { name: 'contact-form', index: 8, heading: 'CONTACT US' },
];

function pick(el) {
  if (!el) {
    return null;
  }

  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const firstHeading = el.querySelector('h1,h2,h3,h4,h5,h6');
  return {
    tag: el.tagName.toLowerCase(),
    className: el.className,
    text: (firstHeading || el).textContent.trim().slice(0, 120),
    rect: {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    styles: {
      display: cs.display,
      position: cs.position,
      width: cs.width,
      maxWidth: cs.maxWidth,
      minHeight: cs.minHeight,
      margin: cs.margin,
      padding: cs.padding,
      gap: cs.gap,
      rowGap: cs.rowGap,
      columnGap: cs.columnGap,
      flexDirection: cs.flexDirection,
      justifyContent: cs.justifyContent,
      alignItems: cs.alignItems,
      gridTemplateColumns: cs.gridTemplateColumns,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      textAlign: cs.textAlign,
    },
  };
}

async function capture(page, name, index, heading) {
  return page.evaluate(({ index, heading }) => {
    const main = document.querySelector('main.site-main') || document.querySelector('main') || document.querySelector('.entry-content');
    const contentRoot = document.querySelector('.entry-content') || main;
    const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim();

    const pick = (el) => {
      if (!el) {
        return null;
      }

      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const firstHeading = el.querySelector('h1,h2,h3,h4,h5,h6');
      return {
        tag: el.tagName.toLowerCase(),
        className: el.className,
        text: (firstHeading || el).textContent.trim().slice(0, 120),
        rect: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        styles: {
          display: cs.display,
          position: cs.position,
          width: cs.width,
          maxWidth: cs.maxWidth,
          minHeight: cs.minHeight,
          margin: cs.margin,
          padding: cs.padding,
          gap: cs.gap,
          rowGap: cs.rowGap,
          columnGap: cs.columnGap,
          flexDirection: cs.flexDirection,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          gridTemplateColumns: cs.gridTemplateColumns,
          backgroundColor: cs.backgroundColor,
          backgroundImage: cs.backgroundImage,
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          textAlign: cs.textAlign,
        },
      };
    };

    const findSectionByHeading = (root, needle) => {
      if (!root) return null;
      return [...root.children].find((child) => {
        const headings = child.querySelectorAll('h1,h2,h3,h4,h5,h6');
        return [...headings].some((el) => normalize(el.textContent) === needle);
      }) || null;
    };

    const findExact = (root, selector, text) => {
      if (!root) return null;
      return [...root.querySelectorAll(selector)].find((el) => {
        const value = normalize(el.textContent);
        return value === text;
      }) || null;
    };

    const findStyle = (root, selector) => {
      if (!root) return null;
      return root.querySelector(selector);
    };

    const root = findSectionByHeading(contentRoot, heading);
    const headingEl = findExact(root, 'h1,h2,h3,h4,h5,h6', heading);

    let inner = null;
    let grid = null;
    let card = null;
    let body = null;
    let sectionInner = null;
    let featureGrid = null;
    let featureCard = null;
    let logoBar = null;
    let useCaseGrid = null;
    let useCaseCard = null;
    let useCaseBody = null;
    let whyVideo = null;
    let logos = null;
    let form = null;

    if (root) {
      inner = root.querySelector('.uagb-container-inner-blocks-wrap');
      sectionInner = root.querySelector('.section-inner');
      if (heading === 'Step One') {
        grid = findStyle(root, 'div[style*="grid-template-columns"]');
        card = grid ? grid.querySelector('.wp-block-uagb-container') : null;
        body = card ? card.querySelector('.uagb-container-inner-blocks-wrap') : null;
        featureCard = root.querySelector('.step-card');
      } else if (heading === 'Why XR Navigation Is The Future') {
        grid = findStyle(root, 'div[style*="grid-template-columns"]');
        card = grid ? grid.querySelector('.wp-block-uagb-info-box') : null;
        featureGrid = root.querySelector('.features-grid');
        featureCard = root.querySelector('.feature-card');
        whyVideo = root.querySelector('.why-video');
      } else if (heading === 'Our Clients') {
        logos = findStyle(root, 'div[style*="display: flex"]');
        logoBar = root.querySelector('.logo-bar');
      } else if (heading === 'What Is Audiom?') {
        body = root.querySelector('.uagb-container-inner-blocks-wrap');
      } else if (heading === 'Audiom Use Cases') {
        grid = findStyle(root, 'div[style*="grid-template-columns"]');
        card = grid ? grid.querySelector('.wp-block-uagb-container') : null;
        body = findStyle(root, 'div[style*="padding: 2rem"]');
        useCaseGrid = root.querySelector('.use-cases-grid');
        useCaseCard = root.querySelector('.use-case-card');
        useCaseBody = root.querySelector('.use-case-body');
      } else if (heading === 'CONTACT US') {
        form = document.querySelector('form.contact-form, form.wpforms-form');
      }
    }

    return {
      section: pick(root),
      heading: pick(headingEl),
      inner: pick(inner),
      grid: pick(grid),
      card: pick(card),
      body: pick(body),
      sectionInner: pick(sectionInner),
      featureGrid: pick(featureGrid),
      featureCard: pick(featureCard),
      logoBar: pick(logoBar),
      useCaseGrid: pick(useCaseGrid),
      useCaseCard: pick(useCaseCard),
      useCaseBody: pick(useCaseBody),
      whyVideo: pick(whyVideo),
      logos: pick(logos),
      form: pick(form),
      bodyClass: document.body.className,
      mainChildren: contentRoot ? contentRoot.children.length : 0,
    };
  }, { index, heading });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const [label, url] of [['wp', WP_URL], ['hugo', HUGO_URL]]) {
    const page = await browser.newPage({ viewport: VIEWPORT });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    results[label] = {};
    for (const section of sections) {
      results[label][section.name] = await capture(page, section.name, section.index, section.heading);
    }
    await page.close();
  }

  await browser.close();

  const diff = {};
  for (const section of sections) {
    const wp = results.wp[section.name];
    const hugo = results.hugo[section.name];
    diff[section.name] = {
      heading: section.heading,
      wp,
      hugo,
    };
  }

  console.log(JSON.stringify(diff, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
