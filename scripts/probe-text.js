#!/usr/bin/env node
/* Compare visible text content of a section between WP and Hugo at a given viewport.
 * Catches text-transform, capitalization, content drift, and source-text mismatches —
 * the cheapest signal in the building, per Q.
 *
 * Usage: node scripts/probe-text.js <slug> [heading-substring] [desktop|mobile]
 */
const { chromium } = require('@playwright/test');
const slug = process.argv[2];
const needle = (process.argv[3] || '').toLowerCase();
const vp = process.argv[4] === 'desktop' ? { width: 1920, height: 1080 } : { width: 375, height: 812 };
if (!slug) { console.error('usage'); process.exit(2); }
(async () => {
  const browser = await chromium.launch();
  for (const [label, url] of [['hugo', `http://127.0.0.1:1314/${slug}/`], ['wp', `https://xrnavigation.io/${slug}/`]]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const r = await page.evaluate((needle) => {
      const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const headings = [...document.querySelectorAll('h1,h2,h3,h4')];
      const h = needle ? headings.find(e => norm(e.textContent).includes(needle)) : headings[0];
      const sec = h ? h.closest('.wp-block-uagb-container.alignfull, .wp-block-group.alignfull') : null;
      if (!sec) return null;
      const visible = [...sec.querySelectorAll('h1,h2,h3,h4,p,a,button,span,li')]
        .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0 && el.textContent.trim())
        .map(el => ({
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 120),
          tt: getComputedStyle(el).textTransform,
          fs: getComputedStyle(el).fontSize,
          fw: getComputedStyle(el).fontWeight,
          color: getComputedStyle(el).color,
        }));
      return { count: visible.length, items: visible.slice(0, 30) };
    }, needle);
    console.log('\n=== ' + label + ' ===');
    console.log('section text-bearing elements:', r ? r.count : 0);
    if (r) for (const i of r.items) console.log(i.tag.padEnd(5), '[tt=' + i.tt.padEnd(10) + ']', '[fs=' + i.fs.padEnd(8) + ']', '[fw=' + i.fw + ']', i.text);
    await ctx.close();
  }
  await browser.close();
})();
