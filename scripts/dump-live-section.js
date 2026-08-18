/** Dump a live root container's outer HTML by block id, balanced-div extraction.
 * Usage: node scripts/dump-live-section.js <saved.html> <block-id> <out.html> */
const fs = require('fs');
const [file, id, out] = process.argv.slice(2);
const d = fs.readFileSync(file, 'utf8');
const re = new RegExp(`<div class="wp-block-uagb-container[^"]*uagb-block-${id}[^"]*"`);
const m = d.match(re);
if (!m) { console.error('no container markup for', id); process.exit(1); }
const start = m.index;
let depth = 0, i = start;
const tag = /<div\b|<\/div>/g;
tag.lastIndex = start;
let end = -1;
for (let t; (t = tag.exec(d)); ) {
  if (t[0] === '<div' || t[0].startsWith('<div')) depth++;
  else depth--;
  if (depth === 0) { end = tag.lastIndex; break; }
}
if (end === -1) { console.error('unbalanced'); process.exit(1); }
fs.writeFileSync(out, d.slice(start, end));
console.log('wrote', out, end - start, 'chars');
