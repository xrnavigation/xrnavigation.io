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

## 2026-03-30 (Round 5 -- after mobile width fix)

**OBSERVATIONS:**
- 180 comparisons, 0 matching, 2 minor, 178 major, 0 errors
- Avg 46.01%, median 46.94% -- improved over R4 (51.31%/55.49%) but still worse than R3 (42.17%/38.70%)
- Desktop avg 41.47%, mobile avg 50.55%
- Width mismatches dropped from 90 to 5 -- mobile width fix worked
- Mobile improved 10.55pp over R4
- Only 2 pages under 10%: fictional-map desktop (4.96%), privacy-policy desktop (9.96%)
- Blog listing is worst (85-90%) due to no pagination in Hugo
- Portfolio/grid pages 67-80% -- card layouts not matching

**DONE:** Test run, analysis, report written to reports/migration-comparison-round5.md
**NEXT:** Blog pagination, grid/card layouts, homepage spacing, general padding audit.

## 2026-03-30 (Round 6 -- after Able Player and iframe fixes)

**RESULTS:** 180 comparisons, 1 matching, 15 minor, 164 major, 0 errors
- Avg 45.19%, median 48.87% -- improved from R5 (46.01%/46.94%)
- Desktop avg 40.38% (R5: 41.47%), mobile avg 49.99% (R5: 50.55%)
- 1 page under 1% (fictional-map desktop 0.41%), 5 under 5%, 16 under 10%
- Best: fictional-map desktop 0.41%, covid-statistic desktop 2.12%, privacy-policy desktop 4.72%
- Worst: blog mobile 89.4%, map-evaluation-tool mobile 89.4%, blog desktop 84.5%
- map-evaluation-tool mobile has width mismatch (2351 vs 375)
**DONE:** Tests complete, analysis done, need to write report and commit.

## 2026-03-30 (Round 7)

**RESULTS:** 180 comparisons, 1 matching, 15 minor, 164 major, 0 errors
- Avg 44.36% (R6: 45.19%), median 46.12% (R6: 48.87%)
- Desktop avg 39.72% (R6: 40.38%), mobile avg 49.01% (R6: 49.99%)
- Blog dramatically improved: desktop 33.96% (was 84.51%), mobile 48.09% (was 89.44%)
- map-evaluation-tool dropped off worst 10
- Under 10%: 16, under 20%: 27 (was 26), under 30%: 41 (same)
- 66 standard pages >= 50% -- embed-heavy audiom demos dominate
- 10 collection/portfolio pages >= 50% -- grid layout mismatches
**STATUS:** Analysis done, writing report and committing.

## 2026-03-30 (Round 8 -- after embed template perfection)

**RESULTS:** 180 comparisons, 1 matching, 43 minor, 136 major, 0 errors
- Avg 32.23% (R7: 44.36%), median 33.90% (R7: 46.12%) -- massive improvement
- Desktop avg 24.69% (R7: 39.72%), mobile avg 39.77% (R7: 49.01%)
- Desktop median 11.74%, mobile median 37.07%
- Under 1%: 1, under 5%: 39 (R7: 5), under 10%: 44 (R7: 16), under 20%: 55 (R7: 27), under 30%: 73 (R7: 41)
- 13 audiom embed pages now under 5% (all desktop)
- Mobile audiom embeds still 27-47% due to structural differences
- Worst: digital-map-tool-accessibility-comparison mobile 84.28%, universities desktop 77.81%
- Best: fictional-map desktop 0.41%, covid-statistic desktop 2.12%, lske-map-* desktop ~3.25%
**STATUS:** Writing report and committing.
