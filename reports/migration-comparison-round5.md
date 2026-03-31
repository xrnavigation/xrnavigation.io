# Visual Comparison Round 5: After Mobile Width Fix

**Date:** 2026-03-30
**Branch:** master
**Change:** Fixed mobile viewport width rendering (was 550px in R4, now correctly 375px)

## Summary

| Metric | R3 | R4 | R5 | Delta (R4 to R5) |
|--------|-----|-----|-----|-------------------|
| Total comparisons | 180 | 180 | 180 | -- |
| Matching (<2%) | 0 | 0 | 0 | -- |
| Minor (2-10%) | 3 | 2 | 2 | -- |
| Major (>10%) | 177 | 178 | 178 | -- |
| Errors | 0 | 0 | 0 | -- |
| Overall avg diff | 42.17% | 51.31% | 46.01% | -5.30pp |
| Overall median diff | 38.70% | 55.49% | 46.94% | -8.55pp |
| Desktop avg | ~42% | 41.53% | 41.47% | -0.06pp |
| Desktop median | -- | -- | 38.35% | -- |
| Mobile avg | -- | 61.10% | 50.55% | -10.55pp |
| Mobile median | -- | -- | 51.15% | -- |

## Key Observations

1. **Mobile width fix worked.** Mobile average dropped from 61.10% to 50.55% (-10.55pp). Width mismatches dropped from 90 pages to just 5 pages.
2. **Desktop held steady.** Desktop average essentially unchanged at 41.47% (was 41.53% in R4).
3. **Overall improvement over R4** but still worse than R3 (46.01% vs 42.17%). The R3-to-R4 regression was partly mobile width, partly structural changes.
4. **Only 5 width mismatches remain** (down from 90 in R4). The one notable one is `digital-map-tool-accessibility-comparison` mobile at 938x6561 baseline vs 375x13213 current -- the baseline itself was captured at wrong width.

## Threshold Breakdown

| Threshold | Count | Percentage |
|-----------|-------|------------|
| Under 10% | 2 | 1.1% |
| Under 20% | 2 | 1.1% |
| Under 30% | 22 | 12.2% |
| Under 40% | 56 | 31.1% |
| Under 50% | 98 | 54.4% |
| Over 50% | 82 | 45.6% |

## Top 10 Best Pages

| Diff % | Page | Viewport | Dimensions (baseline vs current) |
|--------|------|----------|----------------------------------|
| 4.96% | fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 1920x17334 vs 1920x17743 |
| 9.96% | privacy-policy | desktop | 1920x8964 vs 1920x9308 |
| 20.96% | map-evaluation-tool | desktop | 1920x5221 vs 1920x5331 |
| 22.98% | covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 1920x2383 vs 1920x2878 |
| 23.07% | capability-statement | desktop | 1920x1390 vs 1920x1186 |
| 23.15% | gallery | desktop | 1920x2430 vs 1920x2559 |
| 23.50% | sonification-awards-2024-application | desktop | 1920x8275 vs 1920x9476 |
| 23.83% | acr | desktop | 1920x1390 vs 1920x1358 |
| 24.75% | accessibility-statement | desktop | 1920x4163 vs 1920x4273 |
| 24.78% | nfb25 | desktop | 1920x3934 vs 1920x3854 |

## Top 10 Worst Pages

| Diff % | Page | Viewport | Dimensions (baseline vs current) |
|--------|------|----------|----------------------------------|
| 90.34% | blog | mobile | 375x5162 vs 375x14923 |
| 85.63% | blog | desktop | 1920x2878 vs 1920x8752 |
| 85.39% | digital-map-tool-accessibility-comparison | mobile | 938x6561 vs 375x13213 |
| 80.37% | universities | desktop | 1920x4689 vs 1920x2972 |
| 80.26% | brandon-keith-biggs | mobile | 375x1753 vs 375x3184 |
| 75.01% | audiom-wisconsin-geological-survey-quaternary-map | mobile | 375x2145 vs 375x904 |
| 73.50% | health-care-facilities | desktop | 1920x5466 vs 1920x3183 |
| 69.32% | home | desktop | 1920x6770 vs 1920x8742 |
| 68.58% | list-of-non-visual-drawing-tools | desktop | 1920x3462 vs 1920x2608 |
| 67.20% | corporate-campuses | desktop | 1920x4885 vs 1920x3292 |

## Mobile Top 10 Best

| Diff % | Page | Dimensions (baseline vs current) |
|--------|------|----------------------------------|
| 26.19% | nfb25 | 375x4745 vs 375x5596 |
| 26.29% | how-to-make-detailed-map-text-descriptions | 375x9266 vs 375x10162 |
| 28.12% | fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | 375x19085 vs 375x23452 |
| 29.34% | what-is-the-definition-of-a-map | 375x8060 vs 375x8348 |
| 29.36% | how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples | 375x14585 vs 375x16888 |
| 31.39% | the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business | 375x7070 vs 375x7572 |
| 32.53% | how-to-convert-from-pdf-to-geojson-using-qgis | 375x7566 vs 375x7663 |
| 34.49% | how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance | 375x5999 vs 375x6254 |
| 35.22% | events | 375x7010 vs 375x8738 |
| 36.32% | sonification-award-2026-application-of-audiom-wisconsin-geological-survey-quaternary-map | 375x3735 vs 375x4700 |

## Assessment of Remaining Issues

### High-Impact Problems (fix these next)

1. **Blog listing page (85-90% diff):** Hugo renders all blog posts on one page (14923px tall mobile) while WordPress paginates (5162px). Need to add Hugo pagination to match WordPress blog listing.

2. **Height mismatches across the board:** Nearly every page has significant height differences, indicating spacing, padding, or content layout issues. The best pages (fictional-map, privacy-policy) have close height matches AND low pixel diffs.

3. **Portfolio/grid pages (universities, corporate-campuses, health-care-facilities):** 67-80% diff. These use card/grid layouts that aren't matching WordPress. Heights are shorter in Hugo, suggesting missing content or collapsed grids.

4. **Homepage (69% desktop):** The homepage has grown from 6770px to 8742px in Hugo -- extra content or spacing.

### Moderate Issues

5. **brandon-keith-biggs (80% mobile):** Page height doubled (1753 to 3184px) -- likely a layout issue specific to this team/bio page.

6. **digital-map-tool-accessibility-comparison:** Baseline was captured at 938px width (wrong), making this comparison invalid. Should re-capture baseline at 375px.

### What to Fix Next (Priority Order)

1. **Blog pagination** -- will fix the single worst page and bring 2 comparisons down 40-50pp each
2. **Grid/card layouts** on portfolio pages -- universities, corporate-campuses, health-care-facilities, list-of-non-visual-drawing-tools
3. **Homepage section spacing** -- investigate why Hugo homepage is 2000px taller
4. **General spacing/padding audit** -- the consistent ~25-50% diff across most pages suggests systematic padding/margin differences in the CSS

### Trend

| Round | Avg | Median | Notes |
|-------|-----|--------|-------|
| R1 | -- | -- | Initial comparison, 22 errors (404s) |
| R2 | 43.64% | 43.70% | CSS rewrite, all 404s fixed |
| R3 | 42.17% | 38.70% | Structural fixes |
| R4 | 51.31% | 55.49% | Regression: mobile rendered at 550px instead of 375px |
| R5 | 46.01% | 46.94% | Mobile width fixed; 10.55pp mobile improvement |

The mobile width fix was effective but the overall average remains higher than R3. The gap is primarily in mobile diffs (50.55% R5 mobile vs ~42% R3 overall). Desktop is stable at ~41.5%. Further mobile CSS work and blog pagination are the highest-leverage next steps.
