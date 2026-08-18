/**
 * Add featured_image/featured_image_alt front matter to blog posts, mapping
 * live WP featured-media URLs to local files via static/images/manifest.json.
 * Data source: wp-json/wp/v2/posts featured_media -> media source_url.
 */
const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('static/images/manifest.json', 'utf8'));
const map = {};
for (const it of manifest) {
  let local = '/' + it.local_path.replace(/^static\//, '').replace(/\\/g, '/');
  if (local.includes('%')) local = local.replace(/%/g, '%25');
  map[it.wp_url] = local;
  map[decodeURIComponent(it.wp_url)] = local;
}

(async () => {
  const posts = await (await fetch('https://xrnavigation.io/wp-json/wp/v2/posts?per_page=100&_fields=slug,featured_media',
    { headers: { 'User-Agent': 'wp-export/1.0' } })).json();
  for (const p of posts) {
    if (!p.featured_media) continue;
    const m = await (await fetch(`https://xrnavigation.io/wp-json/wp/v2/media/${p.featured_media}?_fields=source_url,alt_text`,
      { headers: { 'User-Agent': 'wp-export/1.0' } })).json();
    const local = map[m.source_url] || map[decodeURIComponent(m.source_url)];
    if (!local) { console.log('UNMAPPED', p.slug, m.source_url); continue; }
    const f = `content/blog/${p.slug}.md`;
    if (!fs.existsSync(f)) { console.log('NO FILE', p.slug); continue; }
    let t = fs.readFileSync(f, 'utf8');
    if (/featured_image:/.test(t)) { console.log('already has', p.slug); continue; }
    const alt = (m.alt_text || '').replace(/"/g, '\\"');
    const ins = `featured_image: "${local}"\nfeatured_image_alt: "${alt}"\n`;
    if (!/\ndraft: false\r?\n/.test(t)) { console.log('NO ANCHOR', p.slug); continue; }
    t = t.replace(/\ndraft: false(\r?\n)/, `\n${ins.trimEnd()}\ndraft: false$1`);
    fs.writeFileSync(f, t);
    console.log('ok', p.slug, '->', local);
  }
})();
