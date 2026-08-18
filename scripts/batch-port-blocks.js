/** Save browser-served HTML for every sitemap page and run
 * scripts/port-page-blocks.py file:<slug> for each.
 * Usage: node scripts/batch-port-blocks.js [slug ...] (default: all sitemap
 * slugs except those already ported into wordpress-compat.css). */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const SKIP = new Set(['home', 'about', 'blog', 'accessibility-statement']);
const OUTDIR = path.join(require('os').tmpdir(), 'wp-block-port');
fs.mkdirSync(OUTDIR, { recursive: true });

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'wp-export/1.0' } });
  return r.text();
}

(async () => {
  let slugs = process.argv.slice(2);
  if (!slugs.length) {
    for (const sm of ['page-sitemap.xml', 'post-sitemap.xml']) {
      const xml = await fetchText(`https://xrnavigation.io/${sm}`);
      for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
        const p = m[1].replace('https://xrnavigation.io', '').replace(/^\/|\/$/g, '');
        const slug = p || 'home';
        if (!SKIP.has(slug)) slugs.push(slug);
      }
    }
  }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const slug of slugs) {
    const url = `https://xrnavigation.io/${slug}/`;
    const file = path.join(OUTDIR, slug.replace(/\//g, '-') + '.html');
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      fs.writeFileSync(file, await page.content());
      const out = execFileSync('python', ['scripts/port-page-blocks.py', file, 'file:' + slug.replace(/\//g, '-')],
        { encoding: 'utf8' });
      process.stdout.write(slug + ': ' + out.trim().split('\n').pop() + '\n');
    } catch (e) {
      console.log(slug + ': FAILED ' + e.message.split('\n')[0]);
    }
  }
  await browser.close();
  console.log('done', slugs.length);
})();
