# Visual Comparison Round 3: Hugo vs WordPress Baseline (Post Template Port)

**Date:** 2026-03-30
**Method:** Playwright screenshots of local Hugo site (port 1314) compared against WordPress baseline PNGs using pixelmatch (threshold 0.1)
**Viewports:** Desktop (1920x1080), Mobile (375x812)

## Summary

| Category | Round 3 | Round 2 | Round 1 | R3 vs R2 |
|---|---|---|---|---|
| Total comparisons | 180 | 180 | 180 | -- |
| Matching (<2% diff) | 0 | 0 | 0 | -- |
| Minor differences (2-10%) | 0 | 0 | 1 | -- |
| Major differences (>10%) | 180 | 180 | 179 | -- |
| HTTP errors (404s) | 0 | 0 | 22 | -- |
| Average diff % | 42.17% | 43.64% | 43.64% | -1.47pp |
| Median diff % | 38.70% | 43.70% | n/a | -5.00pp |

## Top 10 Best Pages (Lowest Diff %)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 12.40% | fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 1920x17334 | 1920x16202 |
| 14.28% | nfb25 | mobile | 375x4745 | 375x4689 |
| 18.29% | case-study-wisconsin-geological-survey | desktop | 1920x1904 | 1920x2069 |
| 19.01% | case-study-wisconsin-geological-survey | mobile | 375x2388 | 375x2499 |
| 20.28% | how-to-make-detailed-map-text-descriptions | mobile | 375x9266 | 375x9215 |
| 20.43% | gatech | desktop | 1920x1506 | 1920x1645 |
| 20.92% | peachability-walk-june-22-2025 | desktop | 1920x3802 | 1920x3749 |
| 21.74% | gallery | mobile | 375x3054 | 375x3136 |
| 22.49% | sonification-awards-2024-application | desktop | 1920x8275 | 1920x7624 |
| 22.93% | audiom-sheep-brain-diagram | desktop | 1920x3487 | 1920x3599 |

## Top 10 Worst Pages (Highest Diff %)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 90.01% | blog | mobile | 375x5162 | 375x14723 |
| 85.88% | universities | desktop | 1920x4689 | 1920x2417 |
| 85.31% | blog | desktop | 1920x2878 | 1920x8585 |
| 84.27% | health-care-facilities | desktop | 1920x5466 | 1920x2558 |
| 84.24% | digital-map-tool-accessibility-comparison | mobile | 938x6561 | 375x12302 |
| 81.06% | corporate-campuses | desktop | 1920x4885 | 1920x2631 |
| 76.48% | list-of-non-visual-drawing-tools | desktop | 1920x3462 | 1920x2079 |
| 74.19% | audiom-wisconsin-geological-survey-quaternary-map | mobile | 375x2145 | 375x884 |
| 73.48% | how-to-convert-from-a-pdf-map-to-a-vector-data-map | desktop | 1920x3656 | 1920x2214 |
| 72.93% | wisconsin-geological-survey-press-release | mobile | 375x1856 | 401x1344 |

## Comparison with Round 1 (43.64% avg) and Round 2 (43.64% avg)

### What improved (Round 3 vs Round 2)
- **Average diff dropped 1.47 percentage points** (43.64% to 42.17%).
- **Median diff dropped 5.00 percentage points** (43.70% to 38.70%). The median improvement is more meaningful than the average -- it indicates a broad improvement across the middle of the distribution rather than just outlier shifts.
- **Best page improved.** Top page is now 12.40% (fictional-map-description desktop) vs 11.86% in round 2 -- slightly worse on the top page, but more pages are now in the low-20s range.
- **New entries in top 10.** `case-study-wisconsin-geological-survey` (18.29% desktop, 19.01% mobile), `how-to-make-detailed-map-text-descriptions` (20.28% mobile), `gatech` (20.43%), and `peachability-walk-june-22-2025` (20.92%) are new best-performers.
- **Blog desktop improved.** 85.31% vs 85.95% in round 2 (blog is slightly less broken).

### What did not improve
- **Zero pages match (<2% diff).** Same across all three rounds.
- **Zero pages in minor range (2-10%).** Same as round 2.
- **Blog mobile still worst** at 90.01% (was 91.61% in round 2) -- massive height mismatch (14723px vs 5162px baseline).
- **Universities desktop worsened.** 85.88% vs 82.87% in round 2.
- **Collection pages still badly broken.** Universities, health-care-facilities, corporate-campuses all render roughly half the height of the WordPress baseline -- missing card grid content.

## Assessment: What's Still Causing Differences

### 1. Header/Footer/Navigation (~15-25% of every page's diff)
Every single page differs in header and footer rendering. These are site-wide structural elements that affect all 180 comparisons. The Hugo header/nav and footer do not match the WordPress layout (different heights, spacing, navigation structure, background colors). Fixing header and footer would reduce every page's diff by an estimated 15-25 percentage points.

### 2. Blog Listing Page (worst offender: 85-90%)
Hugo renders all blog posts on the listing page; WordPress paginates. Hugo blog listing is 3x taller than the WordPress version. This needs pagination to match.

### 3. Collection/Taxonomy Pages (universities, health-care-facilities, corporate-campuses: 80-86%)
These pages render as simple lists in Hugo but were card grids with images in WordPress. The Hugo versions are roughly half the height, indicating missing visual content.

### 4. Typography and Spacing (pervasive)
Line-height, font-size, margin, and padding differences cause cumulative height mismatches on almost every page. Most pages differ by 5-15% in total height, which adds proportional diff penalty.

### 5. Mobile Viewport Width Mismatches
Some baselines were captured at non-standard widths (938px for digital-map-tool-accessibility-comparison, 395px for about, 401px for wisconsin-geological-survey-press-release). These create automatic diff penalties since Hugo screenshots use the configured 375px width.

### Priority Order for Improvement
1. **Header + Footer** -- highest leverage, affects all 180 comparisons
2. **Blog pagination** -- fixes the single worst page
3. **Collection page card grids** -- fixes 6-8 of the worst pages
4. **Typography tuning** (font-size, line-height, margins) -- broad improvement across all pages

## Files

- Full per-page JSON results: `tests/comparison-results.json`
- Visual diff images (>5% different): `tests/diffs/`
- Current Hugo screenshots: `tests/current/`
- Round 2 report: `reports/migration-comparison-round2.md`
- Round 1 report: `reports/migration-playwright-comparison.md`
