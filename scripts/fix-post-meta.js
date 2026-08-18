/**
 * Sync blog post date (full timestamp, for correct ordering) and author name
 * from the WP REST API into front matter.
 */
const fs = require('fs');

(async () => {
  const H = { headers: { 'User-Agent': 'wp-export/1.0' } };
  const posts = await (await fetch('https://xrnavigation.io/wp-json/wp/v2/posts?per_page=100&_fields=slug,date,author', H)).json();
  const authors = {};
  for (const p of posts) {
    if (!(p.author in authors)) {
      const a = await (await fetch(`https://xrnavigation.io/wp-json/wp/v2/users/${p.author}?_fields=name`, H)).json();
      authors[p.author] = a.name;
    }
    const f = `content/blog/${p.slug}.md`;
    if (!fs.existsSync(f)) { console.log('NO FILE', p.slug); continue; }
    let t = fs.readFileSync(f, 'utf8');
    const before = t;
    t = t.replace(/^date: .*$/m, `date: ${p.date}`);
    if (/^author: /m.test(t)) {
      t = t.replace(/^author: .*$/m, `author: "${authors[p.author]}"`);
    } else {
      t = t.replace(/^(date: .*)$/m, `$1\nauthor: "${authors[p.author]}"`);
    }
    if (t !== before) { fs.writeFileSync(f, t); console.log('ok', p.slug, p.date, authors[p.author]); }
  }
})();
