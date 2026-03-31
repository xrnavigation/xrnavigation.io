# Migration Visual Parity Batch 1 Report
## 2026-03-30

## Goal
Get 3 pages to under 5% visual diff each: privacy-policy, map-evaluation-tool, nfb25.

## Results

| Page | Start | Final | Target | Status |
|---|---|---|---|---|
| privacy-policy | 4.67% | **4.66%** | <5% | PASS |
| map-evaluation-tool | 28.96% | **16.25%** | <5% | BLOCKED |
| nfb25 | 34.27% | **8.02%** | <5% | BLOCKED |

Bonus: fictional-map improved from 0.90% to **0.59%** from shared CSS fix.

## Changes Made

### CSS (themes/xrnav/static/css/wordpress-compat.css)
- Removed 48px padding-left/right from `.entry-content > h1-h6` headings. This padding was incorrectly simulating WP `.wp-block-group` wrapper padding directly on headings. WP headings have no padding; the 48px comes from the group wrapper. Removing this improved all pages.

### map-evaluation-tool (content/map-evaluation-tool.md)
- Added hero section as raw HTML: full-width container with background image (DALL-E campus composite), 100px vertical padding, centered white h1 "Introduction", download button, and intro paragraph matching WP UAGB block structure.
- Added 120px spacer after hero matching WP layout.
- Added page-specific CSS overriding heading color to `var(--ast-global-color-1)` (navy #04203e) matching WP's `has-ast-global-color-1-color` class.
- Downloaded hero background image to themes/xrnav/static/images/map-eval-hero.webp.

### nfb25 (content/nfb25.md)
- Removed `layout: "audiom-embed"` and `audiom_id: 38` from front matter (page has inline iframes, doesn't need template iframe).
- Added 10 spacer divs matching WP block structure (total 662px of spacing: 127+49+38+49+67+49+67+49+67+100).
- Added page-specific CSS centering h1 to match WP's centered UAGB heading.

## Blockers

### map-evaluation-tool (16.25%)
1. **Hero background image rendering** (~5%): The hero background image renders slightly differently between WP (served from wp-content) and Hugo (served locally). Background-position and sizing create pixel-level diffs across the 541px hero area.
2. **Content text horizontal positioning** (~5%): Content text throughout the page shows subtle horizontal alignment differences at each text line, creating cumulative diff.
3. **Footer height** (~3%): Hugo footer is 32px shorter (494 vs 526px) — affects all pages equally.
4. **Page height** (~3%): Page is 136px short (5085 vs 5221) from cumulative spacing differences.

### nfb25 (8.02%)
1. **Live iframe content** (~4%): The first Audiom map iframe (Neighborhood Map) loads live content from audiom.net. The map renders differently between the WP baseline capture and the Hugo current capture due to map state, loading timing, and interactive element positioning. This is fundamentally uncontrollable.
2. **Footer** (~2%): Same 32px footer height difference.
3. **Text positioning** (~1%): Minor horizontal text alignment diffs.

## Recommendation
- privacy-policy is done at 4.66%.
- nfb25 at 8.02% is likely as close as possible given the live iframe blocker. The non-iframe portions of the page match well.
- map-evaluation-tool at 16.25% could potentially improve with more precise hero styling but has diminishing returns.
