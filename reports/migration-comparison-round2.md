# Visual Comparison Round 2: Hugo vs WordPress Baseline (Post CSS Rewrite)

**Date:** 2026-03-30
**Method:** Playwright screenshots of local Hugo site (port 1314) compared against WordPress baseline PNGs using pixelmatch (threshold 0.1)
**Viewports:** Desktop (1920x1080), Mobile (375x812)

## Summary

| Category | Round 2 | Round 1 | Change |
|---|---|---|---|
| Total comparisons | 180 | 180 | -- |
| Matching (<2% diff) | 0 | 0 | -- |
| Minor differences (2-10%) | 0 | 1 | -1 |
| Major differences (>10%) | 180 | 179 | +1 |
| HTTP errors (404s) | 0 | 22 | -22 (all fixed) |
| Average diff % | 43.64% | n/a | -- |
| Median diff % | 43.70% | n/a | -- |

## Top 10 Best Pages (Lowest Diff %)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 11.86% | fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 1920x17334 | 1920x16330 |
| 13.39% | nfb25 | mobile | 375x4745 | 375x4934 |
| 18.15% | covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 1920x2383 | 1920x2376 |
| 19.96% | audiom-neighborhood-demo | desktop | 1920x1685 | 1920x1792 |
| 20.60% | implementation | desktop | 1920x2702 | 1920x2882 |
| 20.71% | rose-quarter-and-sunset-maps | desktop | 1920x2301 | 1920x2520 |
| 21.38% | sonification-award-2026-application-of-audiom-wisconsin-geological-survey-quaternary-map | desktop | 1920x3146 | 1920x3272 |
| 22.48% | sonification-awards-2024-application | desktop | 1920x8275 | 1920x7650 |
| 22.65% | lske-map-3 | desktop | 1920x1806 | 1920x1902 |
| 22.75% | lske-map-4 | desktop | 1920x1806 | 1920x1902 |

## Top 10 Worst Pages (Highest Diff %)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 91.61% | blog | mobile | 375x5162 | 375x17572 |
| 85.95% | blog | desktop | 1920x2878 | 1920x8923 |
| 83.32% | digital-map-tool-accessibility-comparison | mobile | 938x6561 | 375x11746 |
| 82.87% | universities | desktop | 1920x4689 | 1920x2623 |
| 79.63% | health-care-facilities | desktop | 1920x5466 | 1920x2763 |
| 78.00% | brandon-keith-biggs | mobile | 375x1753 | 375x2574 |
| 76.49% | list-of-non-visual-drawing-tools | desktop | 1920x3462 | 1920x2094 |
| 74.78% | corporate-campuses | desktop | 1920x4885 | 1920x2862 |
| 74.21% | how-to-convert-from-a-pdf-map-to-a-vector-data-map | desktop | 1920x3656 | 1920x2198 |
| 71.73% | how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance | desktop | 1920x4188 | 1920x2449 |

## Comparison with Round 1

### What improved
- **All 404s resolved.** Round 1 had 22 HTTP 404 errors (11 unmigrated blog posts x 2 viewports). Round 2 has zero -- all pages now render.
- **Previously missing pages now have real diffs.** Pages like `digital-map-tool-accessibility-comparison`, `list-of-non-visual-drawing-tools`, and other blog posts that were 100% diff (404) now render with actual content.

### What did not improve
- **Zero pages match (<2% diff).** Same as round 1.
- **Zero pages in minor range (2-10%).** Round 1 had 1 (privacy-policy at 9.9%); round 2 has zero. The privacy-policy page regressed from 9.9% to above 10%.
- **Best page diff is worse.** Round 1 best was 9.9% (privacy-policy desktop); round 2 best is 11.86% (fictional-map-description desktop).
- **Blog listing page is still the worst.** Mobile blog went from 90.3% to 91.6%, desktop blog from 84.1% to 86.0%. The page is now even longer (17572px mobile vs 15087px in round 1), suggesting more blog posts are rendering.

### Structural observations
- The worst pages (blog, universities, health-care-facilities, corporate-campuses) all show large height mismatches, indicating content rendering differences -- either missing grid/card layouts, different pagination, or missing sections.
- Desktop pages generally perform better than mobile -- the best 10 are almost all desktop viewports.
- Pages with embedded map content (audiom demos, map descriptions) tend to score better because the map iframe dominates the visual area and renders similarly.

## Overall Assessment

**The CSS rewrite did not materially improve visual parity.** The average diff is 43.64% with a median of 43.70%. No pages are within 10% of the WordPress baseline. The primary improvement is operational: all pages now exist (zero 404s vs 22 in round 1).

The remaining differences are dominated by:
1. **Layout/structural differences** -- header, footer, navigation, card grids render differently
2. **Height mismatches** -- nearly every page has different total height due to different CSS (margins, padding, line-height, font-size)
3. **Blog pagination** -- Hugo's blog listing renders far more content than WordPress did
4. **Content section differences** -- some pages (universities, health-care-facilities, corporate-campuses) appear to be missing content sections or rendering them differently

Achieving closer visual parity will require matching WordPress's specific layout patterns (grid systems, card components, header/footer structure) rather than broad CSS property matching. The current approach of extracting and rewriting CSS from design tokens is producing a distinct visual identity, not a WordPress replica.

## Files

- Full per-page JSON results: `tests/comparison-results.json`
- Visual diff images (>5% different): `tests/diffs/`
- Current Hugo screenshots: `tests/current/`
- Round 1 report: `reports/migration-playwright-comparison.md`
