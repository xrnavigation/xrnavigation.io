/**
 * Component Summary Builder
 *
 * Reads chunk-results.json and classifies each section into a component type,
 * then aggregates stats per component.
 *
 * Usage: node scripts/build-component-summary.js
 */

const fs = require('fs');
const path = require('path');

const RESULTS_PATH = path.join(__dirname, '..', 'tests', 'chunk-results.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'tests', 'component-summary.json');

// --- Component classification ---

// Known heading patterns → component type
const HEADING_PATTERNS = [
  // Hero sections (first section on a page, usually H1)
  { pattern: /^(inclusive digital maps|transform your campus|welcome to xr navigation)/i, component: 'hero' },

  // Info-box sections (challenge/solution pairs on collection pages)
  { pattern: /^(the challenge|the solution|navigating the hospital|audiom: the|the challenge of campus)/i, component: 'info-box' },

  // Feature cards (inside wp-block-group on WP)
  { pattern: /^(inclusivity at its core|real-time adaptability|seamless integration|beyond compliance|branding and reputation|inclusivity$|accessible map features)/i, component: 'feature-cards' },

  // CTA sections
  { pattern: /^(starting your path|leading the (way|charge)|join the movement)/i, component: 'cta' },

  // Team sections
  { pattern: /^(meet our team|brandon biggs|chris toth|james coughlan)/i, component: 'team' },

  // Contact
  { pattern: /^contact us$/i, component: 'contact-form' },

  // Blog index
  { pattern: /^(navigating the future|latest blog posts)/i, component: 'blog-index' },

  // About page specific
  { pattern: /^(about xr navigation|experience how audiom|publications|the problem is massive|but we have the solution|our partners|our investors)/i, component: 'about-section' },

  // Client logos
  { pattern: /^our clients$/i, component: 'client-logos' },

  // Steps
  { pattern: /^step one$/i, component: 'steps' },

  // Why section
  { pattern: /^why xr navigation/i, component: 'why-section' },

  // What is
  { pattern: /^what is audiom/i, component: 'what-is' },

  // Use cases
  { pattern: /^audiom use cases$/i, component: 'use-cases' },

  // 404
  { pattern: /^404/i, component: 'error-page' },

  // ACR
  { pattern: /^accessibility conformance/i, component: 'acr' },

  // Accessibility statement
  { pattern: /^accessibility statement/i, component: 'accessibility-statement' },
];

function classifySection(section, page) {
  const heading = section.heading || '';

  // Check heading patterns
  for (const { pattern, component } of HEADING_PATTERNS) {
    if (pattern.test(heading)) {
      return component;
    }
  }

  // Classify by page context for headingless/unmatched sections
  if (section.selectorType === 'whole-page') {
    // Determine by slug patterns
    if (page.slug.startsWith('audiom-') || page.slug.startsWith('lske-') ||
        page.slug.startsWith('asa') || page.slug.startsWith('atia') ||
        page.slug.startsWith('wcvi') || page.slug.startsWith('peachability') ||
        page.slug.startsWith('sonification') || page.slug.startsWith('nfb') ||
        page.slug.startsWith('csun')) {
      return 'embed-page';
    }
    if (page.slug.includes('covid') || page.slug.includes('map')) {
      return 'embed-page';
    }
    // Blog posts
    const blogSlugs = ['digital-map-tool', 'five-things', 'five-ways', 'how-to-convert',
      'how-to-make', 'how-to-systematically', 'how-xr-navigation', 'list-of-non-visual',
      'the-first-three', 'what-is-the-definition'];
    if (blogSlugs.some(s => page.slug.startsWith(s))) {
      return 'blog-post';
    }
    // Standard pages
    return 'standard-page';
  }

  if (section.matchMethod.startsWith('unmatched')) {
    return 'unmatched';
  }

  // Fallback
  return 'unknown';
}

// --- Main ---

const data = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));

// Classify all sections
const classified = [];
for (const page of data) {
  for (const section of page.sections) {
    const component = classifySection(section, page);
    classified.push({
      component,
      slug: page.slug,
      viewport: page.viewport,
      heading: section.heading,
      selectorType: section.selectorType,
      matchMethod: section.matchMethod,
      diffPercent: section.diffPercent,
      overlapDiffPercent: section.overlapDiffPercent,
      heightDelta: section.heightDelta,
      wpWidth: section.wpWidth,
      wpHeight: section.wpHeight,
      hugoWidth: section.hugoWidth,
      hugoHeight: section.hugoHeight,
    });
  }
}

// Aggregate by component
const componentMap = new Map();
for (const item of classified) {
  if (!componentMap.has(item.component)) {
    componentMap.set(item.component, { instances: [], desktop: [], mobile: [] });
  }
  const entry = componentMap.get(item.component);
  entry.instances.push(item);
  if (item.matchMethod.startsWith('unmatched')) continue;
  if (item.viewport === 'desktop') entry.desktop.push(item);
  else entry.mobile.push(item);
}

const summary = [];
for (const [component, data] of componentMap) {
  const matched = data.instances.filter(i => !i.matchMethod.startsWith('unmatched'));
  const unmatched = data.instances.filter(i => i.matchMethod.startsWith('unmatched'));

  const avg = arr => arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null;
  const diffs = matched.map(i => i.diffPercent);
  const desktopDiffs = data.desktop.map(i => i.diffPercent);
  const mobileDiffs = data.mobile.map(i => i.diffPercent);

  summary.push({
    component,
    totalInstances: data.instances.length,
    matchedInstances: matched.length,
    unmatchedInstances: unmatched.length,
    avgDiff: avg(diffs),
    minDiff: diffs.length ? Math.min(...diffs) : null,
    maxDiff: diffs.length ? Math.max(...diffs) : null,
    desktopAvg: avg(desktopDiffs),
    mobileAvg: avg(mobileDiffs),
    best: matched.length ? matched.sort((a, b) => a.diffPercent - b.diffPercent)[0] : null,
    worst: matched.length ? matched.sort((a, b) => b.diffPercent - a.diffPercent)[0] : null,
    instances: matched.sort((a, b) => a.diffPercent - b.diffPercent).map(i => ({
      slug: i.slug,
      viewport: i.viewport,
      heading: i.heading,
      diff: +i.diffPercent.toFixed(1),
    })),
  });
}

// Sort by average diff descending (worst components first)
summary.sort((a, b) => (b.avgDiff || 0) - (a.avgDiff || 0));

// Write output
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2));

// Console report
console.log('\n=== Component Summary ===\n');
console.log(`Total sections classified: ${classified.length}`);
console.log(`Components found: ${summary.length}\n`);

for (const c of summary) {
  const avgStr = c.avgDiff !== null ? c.avgDiff.toFixed(1) + '%' : 'N/A';
  const rangeStr = c.minDiff !== null ? `${c.minDiff.toFixed(1)}%-${c.maxDiff.toFixed(1)}%` : 'N/A';
  const deskStr = c.desktopAvg !== null ? c.desktopAvg.toFixed(1) + '%' : 'N/A';
  const mobStr = c.mobileAvg !== null ? c.mobileAvg.toFixed(1) + '%' : 'N/A';

  console.log(`${c.component}`);
  console.log(`  Instances: ${c.matchedInstances} matched, ${c.unmatchedInstances} unmatched`);
  console.log(`  Avg: ${avgStr}  Range: ${rangeStr}  Desktop: ${deskStr}  Mobile: ${mobStr}`);
  if (c.best) console.log(`  Best: "${c.best.heading || '(none)'}" on ${c.best.slug} ${c.best.viewport} (${c.best.diffPercent.toFixed(1)}%)`);
  if (c.worst) console.log(`  Worst: "${c.worst.heading || '(none)'}" on ${c.worst.slug} ${c.worst.viewport} (${c.worst.diffPercent.toFixed(1)}%)`);
  console.log();
}
