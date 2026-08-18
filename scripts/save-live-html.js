/** Save live page HTML as a real browser (JS disabled) sees it.
 * Usage: node scripts/save-live-html.js <url> <out.html> */
const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ javaScriptEnabled: false })).newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 60000 });
  fs.writeFileSync(out, await p.content());
  console.log('saved', out);
  await b.close();
})();
