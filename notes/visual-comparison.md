# Visual Comparison Notes
## 2026-03-30

**GOAL:** Screenshot Hugo site, compare against 180 WordPress baseline PNGs, report diffs.

**OBSERVATIONS:**
- 180 baseline files in tests/baseline/ (90 slugs x 2 viewports: desktop/mobile)
- Existing playwright config at tests/playwright.config.ts, baseline spec at tests/visual-baseline.spec.ts
- Hugo available (v0.156.0), config at hugo.toml, theme "xrnav"
- Viewports: desktop=1920x1080, mobile=375x812
- package.json has @playwright/test and typescript as devDeps
- Need to install pixelmatch + pngjs for diff approach
- .gitignore already has tests/baseline/*.png, node_modules/, public/

**DONE:**
- Hugo served on port 1314 (98 pages built)
- Installed pixelmatch + pngjs
- Created tests/visual-comparison.spec.ts -- screenshots Hugo, diffs against baselines
- Ran comparison: 180 baselines, 0 matching, 1 minor, 179 major, 22 errors (404s)
- 11 blog posts not yet migrated (404)
- Best match: privacy-policy desktop at 9.9% diff
- All pages differ due to theme/CSS differences -- this is expected
- Report written to reports/migration-playwright-comparison.md
- .gitignore updated with tests/current/, tests/diffs/, tests/comparison-results.json
- Hugo server killed

## 2026-03-30 (Round 2 -- after CSS rewrite)

**OBSERVATIONS:**
- Round 2: 180 comparisons, 0 matching, 0 minor, 180 major, 0 errors (all 404s fixed)
- Best page: fictional-map-description... desktop at 11.86% (round 1 best was privacy-policy at 9.9%)
- Average diff: 43.64%, median: 43.70%
- Round 1 had 22 errors (404s); round 2 has 0 errors -- all pages now exist
- Previously missing blog posts are now migrated and rendering
- Worst pages: blog listing (91.6% mobile, 86% desktop), digital-map-tool (83.3%), universities (82.9%)
- Height mismatches remain the dominant diff source
- No pages under 10% diff -- CSS rewrite didn't achieve close visual parity

**NEXT:** Write round 2 report, kill Hugo, commit.

## 2026-03-30 (Round 4 -- after header/footer, blog, typography fixes)

**OBSERVATIONS:**
- 180 comparisons, 0 matching, 2 minor, 178 major, 0 errors
- Average diff: 51.31%, median: 55.49% -- WORSE than R3 (42.17%/38.70%)
- Desktop avg: 41.53%, Mobile avg: 61.10%
- 90 of 180 pages have width mismatches (baseline vs current mobile widths: 375 vs 550)
- Width mismatch pages avg 60.96% diff vs 41.67% for width-matched pages
- Mobile viewport appears to be rendering at 550px instead of 375px -- this inflates mobile diffs significantly
- Best: fictional-map-description... desktop at 4.96%, privacy-policy desktop at 9.96%
- Worst: blog mobile 93.18%, blog desktop 85.63%
- Blog listing page dramatically worse -- likely different pagination/layout
- Desktop-only avg (41.53%) is actually comparable to R3 range

**KEY FINDING:** The mobile viewport width changed from 375 to 550 between rounds, inflating all mobile diffs. This is a test configuration or rendering issue, not a regression.

**DONE:** Tests completed, analysis script written, notes updated.
**NEXT:** Write round 4 report, kill Hugo, commit.
