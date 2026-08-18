/**
 * Extract <table> elements from a live WP page and print them as GFM markdown
 * tables, for repairing pages whose tables the Turndown export flattened.
 * Usage: node scripts/extract-live-tables.js <slug>
 */
const { chromium } = require('playwright');

const slug = process.argv[2];
if (!slug) { console.error('usage: node scripts/extract-live-tables.js <slug>'); process.exit(1); }
const url = `https://xrnavigation.io/${slug}/`;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  const tables = await page.evaluate(() => {
    function cellText(td) {
      let out = '';
      for (const n of td.childNodes) {
        if (n.nodeType === Node.TEXT_NODE) out += n.textContent;
        else if (n.nodeName === 'BR') out += '<br>';
        else if (n.nodeName === 'A') out += `[${n.textContent.trim()}](${n.getAttribute('href')})`;
        else if (n.nodeType === Node.ELEMENT_NODE) out += cellText(n);
      }
      return out.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
    }
    const root = document.querySelector('.entry-content') || document.body;
    return [...root.querySelectorAll('table')].map((t) => {
      const caption = t.querySelector('caption')?.textContent.trim() || '';
      const figcaption = t.closest('figure')?.querySelector('figcaption')?.textContent.trim() || '';
      const rows = [...t.querySelectorAll('tr')].map((tr) =>
        [...tr.querySelectorAll('th,td')].map(cellText));
      return { caption, figcaption, rows };
    });
  });
  for (const [i, t] of tables.entries()) {
    console.log(`\n=== table ${i}${t.caption ? ` caption: ${t.caption}` : ''}${t.figcaption ? ` figcaption: ${t.figcaption}` : ''} ===\n`);
    if (!t.rows.length) continue;
    const width = Math.max(...t.rows.map((r) => r.length));
    const pad = (r) => [...r, ...Array(width - r.length).fill('')];
    const line = (r) => `| ${pad(r).join(' | ')} |`;
    console.log(line(t.rows[0]));
    console.log(`|${Array(width).fill(' --- ').join('|')}|`);
    for (const r of t.rows.slice(1)) console.log(line(r));
  }
  await browser.close();
})();
