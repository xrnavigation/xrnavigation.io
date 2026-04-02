const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const comparisonPath = path.join(repoRoot, 'tests', 'comparison-results.json');
const contentRoot = path.join(repoRoot, 'content');

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.+?)\s*$/);
    if (!kv) {
      continue;
    }
    data[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return data;
}

function findContentFile(slug) {
  const candidates = [
    path.join(contentRoot, `${slug}.md`),
    path.join(contentRoot, 'blog', `${slug}.md`),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  if (slug === 'home') {
    return path.join(contentRoot, '_index.md');
  }

  if (slug === 'blog') {
    return path.join(contentRoot, 'blog', '_index.md');
  }

  return null;
}

function familyFor(slug, filePath, frontmatter) {
  if (slug === 'home') {
    return 'homepage';
  }
  if (slug === 'blog') {
    return 'blog-index';
  }
  if (filePath && filePath.includes(`${path.sep}blog${path.sep}`)) {
    return 'blog-single';
  }
  if (frontmatter.layout === 'collection') {
    return 'collection';
  }
  if (frontmatter.type === 'audiom-embed') {
    return 'audiom-embed';
  }
  return 'standard-single';
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }
  return map;
}

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function summarizeFamily(name, entries) {
  const diffs = entries.map((entry) => entry.diffPercent);
  const desktop = entries.filter((entry) => entry.viewport === 'desktop').map((entry) => entry.diffPercent);
  const mobile = entries.filter((entry) => entry.viewport === 'mobile').map((entry) => entry.diffPercent);

  const uniqueSlugs = Array.from(new Set(entries.map((entry) => entry.slug))).sort();
  const sorted = [...entries].sort((a, b) => b.diffPercent - a.diffPercent);

  return {
    family: name,
    comparisons: entries.length,
    pages: uniqueSlugs.length,
    avgDiff: avg(diffs),
    avgDesktop: desktop.length ? avg(desktop) : null,
    avgMobile: mobile.length ? avg(mobile) : null,
    worst: sorted.slice(0, 5).map((entry) => ({
      slug: entry.slug,
      viewport: entry.viewport,
      diffPercent: entry.diffPercent,
    })),
  };
}

const results = JSON.parse(fs.readFileSync(comparisonPath, 'utf8'));
const enriched = results.map((result) => {
  const filePath = findContentFile(result.slug);
  const frontmatter = filePath ? parseFrontmatter(fs.readFileSync(filePath, 'utf8')) : {};
  return {
    ...result,
    filePath: filePath ? path.relative(repoRoot, filePath).replace(/\\/g, '/') : null,
    family: familyFor(result.slug, filePath, frontmatter),
  };
});

const families = Array.from(groupBy(enriched, (entry) => entry.family).entries())
  .map(([name, entries]) => summarizeFamily(name, entries))
  .sort((a, b) => b.avgDiff - a.avgDiff);

const worstOverall = [...enriched]
  .sort((a, b) => b.diffPercent - a.diffPercent)
  .slice(0, 20)
  .map((entry) => ({
    slug: entry.slug,
    viewport: entry.viewport,
    family: entry.family,
    filePath: entry.filePath,
    diffPercent: entry.diffPercent,
  }));

const summary = {
  generatedFrom: 'tests/comparison-results.json',
  families,
  worstOverall,
};

process.stdout.write(JSON.stringify(summary, null, 2));
