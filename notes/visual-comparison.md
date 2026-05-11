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

## 2026-03-30 (Round 9)

**RESULTS:** 179 valid comparisons, 1 error (digital-map-tool-accessibility-comparison mobile -- context destroyed)
- Avg 26.81% (R8: 32.23%), median 21.16% (R8: 33.90%)
- Desktop avg 22.67% (R8: 24.69%), desktop median 9.73%
- Mobile avg 31.00% (R8: 39.77%), mobile median 27.81%
- Under 5%: 40, under 10%: 45, under 20%: 89, under 30%: 110
- 2 matching (<0.5%), 38 minor, 139 major
- New perfect: digital-map-tool-accessibility-comparison desktop at 0.00%
- Worst: wisconsin-geological-survey mobile 76.78%, case-study-vrate-expo-2024 mobile 76.12%
- Standard pages (47.28%), blog (47.67%) remain worst categories
- Report written to reports/migration-comparison-round9.md
**DONE:** Analysis complete, report written, temp files cleaned. Committing next.

## 2026-04-01 (Round 11 -- after CSS revert)

**RESULTS:** 180 comparisons, 1 matching, 42 minor, 137 major, 0 errors
- Avg 27.09% (R9: 26.81%), median 21.37% (R9: 21.16%)
- Desktop avg 23.61% (R9: 22.67%), desktop median 11.73% (R9: 9.73%)
- Mobile avg 30.57% (R9: 31.00%), mobile median 27.59% (R9: 27.81%)
- Under 5%: 38 (R9: 40), under 10%: 43 (R9: 45), under 20%: 88 (R9: 89), under 30%: 110 (R9: 110)
- Desktop under 5%: 38, under 10%: 43 -- all sub-10% pages are desktop
- Mobile under 20%: 36, no mobile pages under 10%
- Best: fictional-map desktop 0.41%, covid-statistic desktop 2.11%
- Worst: digital-map-tool-accessibility-comparison mobile 84.22%, wisconsin-geological-survey mobile 76.78%
- Very close to R9 numbers overall; slight regression in desktop (~1pp), slight improvement in mobile (~0.4pp)
**STATUS:** Writing report and committing. Hugo still running, need to kill.

## 2026-04-08 (Round 12 — fresh run after 12 component-fix commits)

**GOAL:** Measure the cumulative effect of commits bae6a11 through 4d64004 (CTA overlay, info-box width, hero padding, team gap, blog-index cards, team heading, blog card sizing, feature cards gradient, info-box mobile, team mobile, blog mobile CSS).

**STATUS:** Hugo serving on :1314 (verified 200). About to run both full-page and chunk comparison suites.

**Full-page results (180/180 passed):**
- Avg: 16.03% (R11: 27.09%) — **11pp improvement**
- Median: 10.67% (R11: 21.37%)
- Desktop avg: 12.52% (R11: 23.61%), median: 4.52%
- Mobile avg: 19.55% (R11: 30.57%), median: 18.33%
- Under 1%: 1, Under 5%: 46 (R11: 38), Under 10%: 87 (R11: 43), Under 20%: 118 (R11: 88), Under 30%: 154 (R11: 110)
- Desktop under 5%: 46, under 10%: 53, under 20%: 69
- Mobile under 5%: 0, under 10%: 34, under 20%: 49
- Best: fictional-map desktop 0.33%
- Worst: digital-map-tool-accessibility-comparison desktop 64.5%

**Family summary:**
- blog-single: 32.3% (11 pages, 951px avg height delta — height-dominated)
- blog-index: 31.3% (1 page, desktop 33%, mobile 29%)
- collection: 22.3% (3 pages, desktop 13.4%, mobile 31.3%)
- homepage: 16.2% (1 page, desktop 10.8%, mobile 21.6%)
- standard-single: 15.6% (25 pages, desktop 10.5%, mobile 20.6%)
- audiom-embed: 11.9% (49 pages, desktop 8.7%, mobile 15.2%)

**R11→R12 delta:** The 12 component-fix commits dropped overall avg 27.09→16.03% (11pp). Desktop improved most dramatically (23.61→12.52%). Mobile improved but remains the gap (30.57→19.55%).

## Computed-style diffing addition (in progress)

**GOAL:** Add computed-style capture to chunk-comparison.spec.ts so it reports *which CSS properties differ* between WP and Hugo for each section, not just the pixel diff %.

**DONE so far:**
- Added STYLE_PROPERTIES constant (28 key layout/visual properties)
- Added StyleCapture, StyleDiff interfaces
- Added styleDiffs field to ChunkResult
- Modified screenshotSections to capture computed styles via `section.evaluate(getComputedStyle)` for container + heading + firstParagraph + innerWrapper
- Return type now includes `styles: Map<number, StyleCapture>`

**DONE:**
- normalizeStyleValue, isNoisyDiff, diffStyles functions added
- Noise filters: same-filename background-image URLs, zero box-shadow vs none, viewport-width max-width
- Wired into test body: sections above 5% get style diffs in JSON + console
- Console shows top 12 diffs per section with "... and N more"
- Tested on home (desktop+mobile) and about (desktop+mobile) — output is extremely actionable
- Systemic patterns visible: flex→block, missing gap, wrong colors, wrong padding

**Verified patterns from style diff output:**
- `container.display: flex → block` appears in nearly every section (WP uses flex, Hugo uses block)
- `container.gap/row-gap/column-gap` lost everywhere
- Mobile: `font-size: 15px → 16px`, `line-height: 23px → 26px` systemic
- Team bios: `heading.color: rgb(249,250,251) → rgb(4,32,62)` (should be light, Hugo has dark)
- About section 13: `innerWrapper.width: 1200px → 0px` — root cause of 95.7% diff

**Status:** Style-diff tool committed as 318c4e3. Dispatched 4 parallel fix agents (homepage, about, collections, blog-index). All 4 hit token limits after 66-92 tool calls (~13 min each). No commits from agents, but significant uncommitted work exists.

**Agent progress from notes + git diff:**
- `wordpress-compat.css`: massive changes (6943 insertions, 6576 deletions) — all 4 agents wrote CSS
- `collection.html`: 94 lines changed
- `blog/list.html`: 4 lines changed
- `baseof.html`: 3 lines changed

**fix-homepage** (notes/homepage-css-parity-2026-04-08.md):
- Fixed shared section base: display:flex, text-align:start
- Fixed hero, why, clients, use-cases, contact desktop properties
- Initially broke things with flex-direction:column (WP uses row), then corrected
- Mobile fixes NOT started. Desktop fixes applied but unverified.

**fix-about** (notes/about-css-parity.md):
- Section 13: 95.7→58.4%, Section 12: 52.9→19%
- Team bio colors fixed, Experience paragraph fixed
- Mobile -20px margins fixed, team bio font-size fixed
- Still remaining: Problem/Solution padding, Our Partners innerWrapper, Publications colors, mobile team bios

**fix-collections** (notes/collection-css-parity-2026-04-08.md): Exists but not yet read
**fix-blog-index** (notes/blog-index-parity.md): Exists but not yet read

**Combined agent results: MOSTLY REGRESSIONS.**
Only 2 improved (about desktop -7pp, blog desktop -10.8pp). 8 regressed, some badly (universities mobile +9.7pp, blog mobile +9pp, home mobile +8.5pp, health-care desktop +6.7pp).

Root causes from agent notes:
- Homepage agent set flex-direction:column then corrected to row, but incomplete
- Collections agent broke width with negative margins, identified `:has()` fix but didn't apply
- Blog agent had flex-direction wrong, mobile grid went from 29→67%
- Shared CSS changes (base section styles) affected all pages

**Decision:** Revert all CSS/template changes, then apply only verified-good fixes.

**Reverted** all agent CSS/template changes. Verified baseline restored.

**Now applying surgical fixes to about page (desktop):**
1. Section 13 (2c780bfa): bg-color #15191d → transparent, min-height 459→540px, added innerWrapper flex/column/center/gap/width 1200px
2. Section 12 (b7884180): added justify-content:center, align-items:center, gap:20px to innerWrapper
3. Team bios (4084160e, 55dd86c5, b49613d3): added h3 color #f9fafb, p color #f9fafb

**Verified after batch 1 (about desktop):**
- Section 13: 95.7→58.4% (bg transparent + innerWrapper flex/center/width). Remaining 58% has NO style diffs — visual content diff.
- Section 12: 52.9→19.0% (innerWrapper justify/align/gap)
- CONTACT US: 13.0→9.7% (removed bogus min-height 391px, added heading color #15191d, paragraph color/weight)
- Our Partners: 8.5→8.6% (added bg #f9fafb, heading font-weight 800 — minimal movement)
- Publications: still 5.0% (added p color #000)
- Experience How Audiom: still 26.0% (added p color #000 — didn't help, likely structural)
- Team bios desktop: 6-9% unchanged despite color fix (gap/layout properties dominate)
- **Home: NO REGRESSIONS** — all sections identical to baseline. About-scoped selectors confirmed safe.

**Mobile still untouched** — about mobile worst sections: Brandon 58.4%, James 57.8%, Chris 56.4%, Meet Our Team 54.4%.

**Committed about desktop fixes as 9f7511b.**

**Homepage fixes in progress:**
- Use Cases: padding 10px→80px horizontal — Use Cases desktop 23.5→23.0% (marginal)
- Contact desktop: padding-bottom 10px→200px REGRESSED 24.9→45.9% — REVERTED. The style diff says WP has padding-bottom 200px on the outer container, but Hugo's contact section has a floating form card that makes the structure different. The padding-bottom 200px makes the section way too tall because Hugo's layout is different from WP's. Need to investigate the actual WP DOM structure before touching contact padding.
- Contact paragraph color: #777→#04203e — keeping this, it's correct from style diff
- Contact mobile padding: 0 — REVERTED (same issue, structure differs)
- Team mobile: added padding 64px 24px — not yet verified
- Contact heading-area margin-bottom: untouched

**Current state (uncommitted):** use-cases padding 80px, contact p color #04203e, team mobile padding 64px 24px. Contact padding reverted to original.

**Key learning:** Style diffs show property differences but don't account for structural differences between WP and Hugo DOM. The contact section in Hugo has a different internal layout (floating card) so matching container padding 1:1 doesn't produce the same visual result. Need to compare the actual DOM structure, not just computed styles.

**Homepage committed as 21ac239.** Use Cases 23.5→23.0%, Team mobile 46.9→43.2%.

**Full-page R12c results (after 2 surgical commits):**
- Overall avg: 17.09% (was 16.03%) — slight regression from about mobile height shift
- About desktop: 21.6→20.1% (improved), about mobile: 31.2→33.1% (regressed 1.9pp from section 13 height change)
- Home desktop: 10.8→10.7%, home mobile: 21.6→21.1% (both marginal improvement)
- The full-page metric lags behind chunk-level improvements due to height cascading. Chunk comparison remains the better convergence metric.

**Commit log this session:**
- 318c4e3: Style-diff tool added to chunk comparison
- 9f7511b: About desktop fixes (section 13: 95→58%, section 12: 52→19%, team colors, partners bg)
- 21ac239: Homepage use-cases padding + team mobile padding

**Chunk comparison complete (180/180 passed, 5.3m):**
- 266 total sections, 250 matched, 16 unmatched WP, 0 unmatched Hugo
- Matched section avg: 18.35%, median: 12.68%
- Desktop sections: 125, avg 12.86%
- Mobile sections: 125, avg 23.84%
- Under 5%: 84, Under 10%: 112, Under 20%: 157
- 78 of 180 page/viewport entries have chunk avg under 5% (43%)
- 31 page/viewport entries have chunk avg over 30% (17%)
- Worst sections: universities mobile "Audiom: The Inclusive Digital Map Solution" at 100% (missing screenshot), about desktop unnamed section at 95.7%, about mobile unnamed at 92.7%
