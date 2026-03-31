# Visual Comparison Round 6: After Able Player and iframe Fixes

**Date:** 2026-03-30
**Hugo port:** 1314
**Test config:** tests/playwright.config.ts
**Baseline:** 180 WordPress screenshots (90 pages x 2 viewports)

## Summary

| Metric | R6 | R5 | Delta |
|--------|----|----|-------|
| Total comparisons | 180 | 180 | -- |
| Matching (<2%) | 1 | 0 | +1 |
| Minor (2-10%) | 15 | 2 | +13 |
| Major (>10%) | 164 | 178 | -14 |
| Errors | 0 | 0 | -- |
| Avg diff % | 45.19% | 46.01% | -0.82pp |
| Median diff % | 48.87% | 46.94% | +1.93pp |
| Desktop avg | 40.38% | 41.47% | -1.09pp |
| Desktop median | 45.51% | -- | -- |
| Mobile avg | 49.99% | 50.55% | -0.56pp |
| Mobile median | 53.77% | -- | -- |

## Distribution

| Threshold | Count | % of total |
|-----------|-------|------------|
| Under 1% | 1 | 0.6% |
| Under 5% | 5 | 2.8% |
| Under 10% | 16 | 8.9% |
| Under 20% | 26 | 14.4% |
| Under 30% | 41 | 22.8% |

## Top 10 Best Pages

| Page | Viewport | Diff % | Dimensions (current vs baseline) |
|------|----------|--------|----------------------------------|
| fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 0.41% | 1920x17333 vs 1920x17334 |
| covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 2.12% | 1920x2382 vs 1920x2383 |
| privacy-policy | desktop | 4.72% | 1920x8983 vs 1920x8964 |
| audiom-sole-source-justification | desktop | 4.80% | 1920x1080 vs 1920x1080 |
| wcag-map-comparison-table | desktop | 4.80% | 1920x1080 vs 1920x1080 |
| fcoi | desktop | 5.32% | 1920x1080 vs 1920x1080 |
| lske-map-3 | desktop | 7.13% | 1920x1807 vs 1920x1806 |
| nfb25 | desktop | 7.28% | 1920x3866 vs 1920x3934 |
| lske-map-4 | desktop | 7.38% | 1920x1807 vs 1920x1806 |
| lske-map-2 | desktop | 7.48% | 1920x1807 vs 1920x1806 |

## Top 10 Worst Pages

| Page | Viewport | Diff % | Dimensions (current vs baseline) |
|------|----------|--------|----------------------------------|
| blog | mobile | 89.44% | 375x13818 vs 375x5162 |
| map-evaluation-tool | mobile | 89.43% | 2351x7971 vs 375x7269 |
| blog | desktop | 84.51% | 1920x8095 vs 1920x2878 |
| digital-map-tool-accessibility-comparison | mobile | 84.28% | 375x12270 vs 938x6561 |
| universities | desktop | 79.90% | 1920x2516 vs 1920x4689 |
| health-care-facilities | desktop | 77.23% | 1920x2728 vs 1920x5466 |
| case-study-vrate-expo-2024 | desktop | 72.01% | 1920x1080 vs 1920x1800 |
| corporate-campuses | desktop | 71.07% | 1920x2809 vs 1920x4885 |
| list-of-non-visual-drawing-tools | desktop | 71.03% | 1920x2035 vs 1920x3462 |
| brandon-keith-biggs | mobile | 70.24% | 375x2277 vs 375x1753 |

## R5 to R6 Comparison

Overall average improved modestly from 46.01% to 45.19% (-0.82pp). Desktop improved from 41.47% to 40.38% (-1.09pp). Mobile improved from 50.55% to 49.99% (-0.56pp).

The most significant improvement is in the minor-difference category: R5 had only 2 pages with minor differences (2-10%), while R6 has 15. This means 13 additional pages crossed below the 10% threshold. R6 also achieved the first matching page (<2%): the fictional-map-description desktop view at 0.41%.

Pages under 10% went from 2 (R5) to 16 (R6) -- an 8x increase in near-parity pages. This indicates Able Player and iframe fixes primarily improved pages that embed media content.

## Remaining Issues

1. **Blog listing (84-89%):** Hugo shows all posts on one page vs WordPress pagination. Height mismatch is 3:1 on mobile (13818 vs 5162).
2. **map-evaluation-tool mobile (89%):** Width mismatch -- rendering at 2351px instead of 375px. Likely an iframe or embedded content forcing layout wider.
3. **digital-map-tool-accessibility-comparison mobile (84%):** Baseline width 938px vs current 375px -- similar iframe/embed width issue in baseline capture.
4. **Portfolio/grid pages (70-80%):** universities, health-care-facilities, corporate-campuses -- card grid layouts differ significantly in height, suggesting different card counts or layout structure.
5. **case-study-vrate-expo-2024 (72%):** Current is shorter than baseline (1080 vs 1800) -- content may be missing or collapsed.

## Assessment

Round 6 shows incremental but meaningful progress. The headline average (-0.82pp) understates the real improvement: the number of near-parity pages (under 10%) increased from 2 to 16, indicating the Able Player and iframe fixes successfully brought media-heavy pages into close alignment. The remaining gap is dominated by structural layout differences (blog pagination, grid cards, missing content sections) rather than styling issues. The next highest-impact fixes would be blog pagination and the portfolio/grid card layouts.
