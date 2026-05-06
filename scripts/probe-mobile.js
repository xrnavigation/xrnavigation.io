#!/usr/bin/env node
/* Mobile-viewport DOM/CSS probe.
 *
 * Usage:
 *   node scripts/probe-mobile.js <slug> [heading-substring]
 *
 * Examples:
 *   node scripts/probe-mobile.js blog "Latest Blog Posts"
 *   node scripts/probe-mobile.js about "Meet Our Team"
 *
 * Loads both http://127.0.0.1:1314/<slug>/ (Hugo) and https://xrnavigation.io/<slug>/
 * (WP) at 375×812, finds the heading inside .entry-content, and prints computed
 * values for the heading, its alignfull section, and the article/entry-content
 * chain so layout escapes (negative margin tricks) are visible.
 */
const { chromium } = require('@playwright/test');

const slug = process.argv[2];
const headingNeedle = process.argv[3] || '';
if (!slug) {
  console.error('usage: probe-mobile.js <slug> [heading-substring]');
  process.exit(2);
}

const HUGO = `http://127.0.0.1:1314/${slug}/`;
const WP = `https://xrnavigation.io/${slug}/`;

(async () => {
  const browser = await chromium.launch();
  for (const [label, url] of [['hugo', HUGO], ['wp', WP]]) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (err) {
      console.log(label, 'NAV ERROR:', err.message);
      await ctx.close();
      continue;
    }
    const result = await page.evaluate((needle) => {
      const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const headings = [...document.querySelectorAll('h1,h2,h3,h4')];
      const h = needle
        ? headings.find(e => norm(e.textContent).includes(norm(needle)))
        : headings[0];
      const dump = el => el ? {
        tag: el.tagName,
        cls: el.className.slice(0, 80),
        w: +el.getBoundingClientRect().width.toFixed(2),
        x: +el.getBoundingClientRect().left.toFixed(2),
        padding: getComputedStyle(el).padding,
        margin: getComputedStyle(el).margin,
        maxW: getComputedStyle(el).maxWidth,
        boxSizing: getComputedStyle(el).boxSizing,
        display: getComputedStyle(el).display,
      } : null;
      const sec = h ? h.closest('.wp-block-uagb-container.alignfull, .wp-block-group.alignfull') : null;
      const entry = document.querySelector('.entry-content');
      const article = entry?.closest('article');
      const main = document.querySelector('main, #main, #primary');
      const astContainer = entry?.closest('.ast-container');
      const siteContent = entry?.closest('#content, .site-content');
      return {
        viewport: innerWidth,
        htmlFontSize: getComputedStyle(document.documentElement).fontSize,
        bodyFontSize: getComputedStyle(document.body).fontSize,
        matches921: matchMedia('(max-width: 921px)').matches,
        heading: h ? {
          text: h.textContent.trim().slice(0, 60),
          fontSize: getComputedStyle(h).fontSize,
          fontWeight: getComputedStyle(h).fontWeight,
          textAlign: getComputedStyle(h).textAlign,
        } : null,
        section: dump(sec),
        chain: { siteContent: dump(siteContent), astContainer: dump(astContainer), main: dump(main), article: dump(article), entry: dump(entry) },
      };
    }, headingNeedle);
    console.log(label, JSON.stringify(result, null, 2));
    await ctx.close();
  }
  await browser.close();
})();
