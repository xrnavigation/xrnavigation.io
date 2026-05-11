const fs = require('fs');
const path = require('path');

const selectors = process.argv.slice(2);
if (selectors.length === 0) {
  console.error('Usage: node scripts/extract-about-rules.js <selector-fragment> [...]');
  process.exit(1);
}

const html = fs.readFileSync(path.join(__dirname, '..', 'data', 'wp-html', 'about.html'), 'utf8');
const styleMatch = html.match(/<style id="uagb-style-frontend-203">([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error('uagb-style-frontend-203 not found');
  process.exit(1);
}

const css = styleMatch[1];
for (const selector of selectors) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`[^{}]*${escaped}[^{}]*\\{[^}]*\\}`, 'g'),
    new RegExp(`@media[^{}]*\\{(?:[^{}]*\\{[^}]*\\})*[^{}]*${escaped}[^{}]*\\{[^}]*\\}(?:[^{}]*\\{[^}]*\\})*\\}`, 'g'),
  ];

  console.log(`\n/* ${selector} */`);
  const seen = new Set();
  for (const pattern of patterns) {
    const matches = css.match(pattern) || [];
    for (const match of matches) {
      if (seen.has(match)) {
        continue;
      }
      seen.add(match);
      console.log(match);
    }
  }
}
