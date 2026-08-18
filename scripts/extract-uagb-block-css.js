/**
 * Extract all CSS rules for given uagb block ids from a saved live HTML file,
 * preserving @media wrappers. Usage:
 *   node scripts/extract-uagb-block-css.js <saved.html> <block-id> [block-id ...]
 */
const fs = require('fs');

const [file, ...ids] = process.argv.slice(2);
const html = fs.readFileSync(file, 'utf8');

let out = [];
for (const st of html.matchAll(/<style[^>]*>([^]*?)<\/style>/g)) {
  const css = st[1];
  if (!ids.some((id) => css.includes(id))) continue;
  // tokenize top-level: @media blocks vs plain rules
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf('@media', i);
    const seg = at === -1 ? css.slice(i) : css.slice(i, at);
    for (const r of seg.match(/[^{}]+\{[^{}]*\}/g) || []) {
      if (ids.some((id) => r.includes(id))) out.push(r.trim());
    }
    if (at === -1) break;
    // find matching closing brace of the media block
    let depth = 0, j = css.indexOf('{', at);
    const header = css.slice(at, j).trim();
    let k = j;
    for (depth = 1, k = j + 1; k < css.length && depth > 0; k++) {
      if (css[k] === '{') depth++;
      else if (css[k] === '}') depth--;
    }
    const body = css.slice(j + 1, k - 1);
    const kept = (body.match(/[^{}]+\{[^{}]*\}/g) || []).filter((r) => ids.some((id) => r.includes(id)));
    if (kept.length) out.push(`${header}{\n${kept.map((r) => r.trim()).join('\n')}\n}`);
    i = k;
  }
}
console.log(out.join('\n'));
