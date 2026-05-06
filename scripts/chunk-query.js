#!/usr/bin/env node
/*
 * Query helpers over tests/chunk-results.json.
 *
 * Usage:
 *   node scripts/chunk-query.js worst [N]
 *       Top N worst matched sections across all pages (default 30).
 *       Filters out sentinel-100% rows (no overlap area / unmatched).
 *
 *   node scripts/chunk-query.js worst-all [N]
 *       Same as worst but includes 100% sentinel rows.
 *
 *   node scripts/chunk-query.js page <slug> [viewport]
 *       Print every section for a slug. Optional viewport: desktop|mobile.
 *
 *   node scripts/chunk-query.js find <heading-substring>
 *       Find sections whose heading contains the substring (case-insensitive).
 *
 *   node scripts/chunk-query.js families
 *       Group worst sections by page family heuristic (slug → family).
 *
 *   node scripts/chunk-query.js stats
 *       Overall statistics (count, mean, median, sentinel count).
 *
 * All output is whitespace-aligned text suitable for piping.
 */

const fs = require('fs');
const path = require('path');

const RESULTS_PATH = path.resolve(__dirname, '..', 'tests', 'chunk-results.json');
const CHUNKS_DIR = path.resolve(__dirname, '..', 'tests', 'chunks');

// Path of the wp/hugo PNG saved by chunk-comparison.spec.ts for one section.
function chunkPngs(slug, viewport, index) {
  const dir = path.join(CHUNKS_DIR, slug);
  return {
    wp: path.join(dir, `wp-${viewport}-section-${index}.png`),
    hugo: path.join(dir, `hugo-${viewport}-section-${index}.png`),
  };
}

function loadResults() {
  return JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
}

function flatten(results) {
  const out = [];
  for (const page of results) {
    for (const s of page.sections || []) {
      out.push({
        page: page.slug,
        viewport: page.viewport,
        index: s.sectionIndex,
        heading: s.heading || '',
        diff: s.diffPercent,
        overlapDiff: s.overlapDiffPercent,
        wpW: s.wpWidth, wpH: s.wpHeight,
        hugoW: s.hugoWidth, hugoH: s.hugoHeight,
        heightDelta: s.heightDelta,
        method: s.matchMethod,
        type: s.selectorType,
      });
    }
  }
  return out;
}

function fmtRow(x) {
  const heading = x.heading ? x.heading.slice(0, 45) : '<null>';
  const dims = `${x.wpW}x${x.wpH} → ${x.hugoW}x${x.hugoH}`;
  const pngs = chunkPngs(x.page, x.viewport, x.index);
  // Show PNG paths so they can be read for a visual verification.
  // Use ./relative paths so they paste into Read tool calls cleanly.
  const wpRel = path.relative(process.cwd(), pngs.wp).replace(/\\/g, '/');
  const hugoRel = path.relative(process.cwd(), pngs.hugo).replace(/\\/g, '/');
  return [
    x.diff.toFixed(1).padStart(5) + '%',
    x.viewport.padEnd(7),
    x.page.padEnd(45),
    `[${x.index}]`.padStart(4),
    heading.padEnd(45),
    dims,
    '\n        wp:   ' + wpRel,
    '\n        hugo: ' + hugoRel,
  ].join('  ');
}

function cmdWorst(args, { includeSentinel } = {}) {
  const limit = parseInt(args[0], 10) || 30;
  let sections = flatten(loadResults());
  if (!includeSentinel) {
    sections = sections.filter(s => s.diff < 99.99);
  }
  sections.sort((a, b) => b.diff - a.diff);
  for (const s of sections.slice(0, limit)) {
    console.log(fmtRow(s));
  }
  console.log(`\nshown ${Math.min(limit, sections.length)} / ${sections.length} sections`);
}

function cmdPage(args) {
  const [slug, viewport] = args;
  if (!slug) {
    console.error('usage: chunk-query.js page <slug> [viewport]');
    process.exit(2);
  }
  const results = loadResults();
  const pages = results.filter(p =>
    p.slug === slug && (!viewport || p.viewport === viewport),
  );
  if (pages.length === 0) {
    console.error(`no entries for slug=${slug}${viewport ? ' viewport=' + viewport : ''}`);
    process.exit(1);
  }
  for (const page of pages) {
    console.log(`\n# ${page.slug} ${page.viewport}  avg=${page.avgDiffPercent.toFixed(1)}%  max=${page.maxDiffPercent.toFixed(1)}%  matched=${page.matchedSections}/${page.totalSections}`);
    for (const s of page.sections) {
      console.log(fmtRow({
        page: page.slug,
        viewport: page.viewport,
        index: s.sectionIndex,
        heading: s.heading || '',
        diff: s.diffPercent,
        overlapDiff: s.overlapDiffPercent,
        wpW: s.wpWidth, wpH: s.wpHeight,
        hugoW: s.hugoWidth, hugoH: s.hugoHeight,
        heightDelta: s.heightDelta,
        method: s.matchMethod,
        type: s.selectorType,
      }));
    }
  }
}

function cmdFind(args) {
  const needle = (args[0] || '').toLowerCase();
  if (!needle) {
    console.error('usage: chunk-query.js find <heading-substring>');
    process.exit(2);
  }
  const sections = flatten(loadResults())
    .filter(s => (s.heading || '').toLowerCase().includes(needle));
  sections.sort((a, b) => b.diff - a.diff);
  for (const s of sections) console.log(fmtRow(s));
  console.log(`\n${sections.length} matching section(s)`);
}

function cmdStats() {
  const sections = flatten(loadResults());
  const real = sections.filter(s => s.diff < 99.99);
  const sentinel = sections.length - real.length;
  const sorted = real.map(s => s.diff).sort((a, b) => a - b);
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  console.log(`total sections:     ${sections.length}`);
  console.log(`sentinel (100%):    ${sentinel}`);
  console.log(`measured sections:  ${real.length}`);
  console.log(`mean diff:          ${mean.toFixed(2)}%`);
  console.log(`median diff:        ${median.toFixed(2)}%`);
  for (const t of [1, 5, 10, 20, 30, 50]) {
    const n = real.filter(s => s.diff < t).length;
    console.log(`  under ${String(t).padStart(2)}%:        ${n}`);
  }
}

function cmdFamilies() {
  const sections = flatten(loadResults()).filter(s => s.diff < 99.99);
  const buckets = new Map();
  for (const s of sections) {
    const key = s.page;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(s.diff);
  }
  const rows = [];
  for (const [page, diffs] of buckets) {
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const max = Math.max(...diffs);
    rows.push({ page, count: diffs.length, avg, max });
  }
  rows.sort((a, b) => b.avg - a.avg);
  for (const r of rows.slice(0, 30)) {
    console.log(`${r.avg.toFixed(1).padStart(5)}%  max ${r.max.toFixed(1).padStart(5)}%  n=${String(r.count).padStart(3)}  ${r.page}`);
  }
}

const [, , cmd, ...rest] = process.argv;
const dispatch = {
  worst: () => cmdWorst(rest),
  'worst-all': () => cmdWorst(rest, { includeSentinel: true }),
  page: () => cmdPage(rest),
  find: () => cmdFind(rest),
  stats: () => cmdStats(),
  families: () => cmdFamilies(),
};

if (!dispatch[cmd]) {
  console.error('usage: chunk-query.js {worst|worst-all|page|find|families|stats} [args]');
  process.exit(2);
}
dispatch[cmd]();
