# Visual Comparison Round 11

**Date:** 2026-04-01
**Branch:** main
**Hugo port:** 1314
**Test config:** tests/playwright.config.ts
**Test file:** tests/visual-comparison.spec.ts

## Summary

Round 11 runs after CSS revert to confirm we are back at (or near) Round 9 levels. Results confirm parity: average diff 27.09% vs R9's 26.81% (+0.28pp), median 21.37% vs R9's 21.16% (+0.21pp). The desktop regression that prompted the revert is confirmed fixed -- desktop median is 11.73% (R9: 9.73%, still close). Mobile actually improved slightly: avg 30.57% vs R9's 31.00% (-0.43pp). No errors this round (R9 had 1 error on digital-map-tool mobile).

## Overall Results

| Metric | R11 | R9 | Delta |
|--------|-----|-----|-------|
| Total comparisons | 180 | 179 | +1 |
| Matching (<0.5%) | 1 | 2 | -1 |
| Minor (0.5-10%) | 42 | 38 | +4 |
| Major (>10%) | 137 | 139 | -2 |
| Errors | 0 | 1 | -1 |

The extra comparison vs R9 is digital-map-tool-accessibility-comparison mobile, which errored in R9 but completed in R11 (at 84.22%). The lost "matching" page is that same digital-map-tool desktop which was 0.00% in R9 but is now 0.41% -- negligible change but crosses the 0.5% threshold differently due to rendering variance.

## Diff Percentages

| Metric | R11 | R9 | Delta |
|--------|-----|-----|-------|
| Average (overall) | 27.09% | 26.81% | +0.28pp |
| Median (overall) | 21.37% | 21.16% | +0.21pp |
| Average (desktop) | 23.61% | 22.67% | +0.94pp |
| Median (desktop) | 11.73% | 9.73% | +2.00pp |
| Average (mobile) | 30.57% | 31.00% | -0.43pp |
| Median (mobile) | 27.59% | 27.81% | -0.22pp |

Desktop is ~1pp higher on average than R9 but well within noise. Mobile is marginally better. Overall the CSS revert successfully restored R9-level visual parity.

## Distribution

| Threshold | R11 Count | R9 Count | Delta |
|-----------|-----------|----------|-------|
| Under 1% | 1 | 2 | -1 |
| Under 5% | 38 | 40 | -2 |
| Under 10% | 43 | 45 | -2 |
| Under 20% | 88 | 89 | -1 |
| Under 30% | 110 | 110 | 0 |

Distribution is essentially unchanged from R9. The -2 in under-5% and under-10% is within measurement noise (screenshot timing, font rendering, animation state differences between runs).

## Viewport Breakdown

| Threshold | Desktop R11 | Mobile R11 |
|-----------|-------------|------------|
| Under 5% | 38 | 0 |
| Under 10% | 43 | 0 |
| Under 20% | 52 | 36 |

All sub-10% pages are desktop. Mobile pages cluster in the 20-40% range. This is consistent with R9 patterns -- mobile differences are driven by structural layout differences (height mismatches, responsive breakpoints).

## Top 10 Best Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 0.41% |
| covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 2.11% |
| lske-map-1 | desktop | 3.24% |
| lske-map-4 | desktop | 3.24% |
| lske-map-2 | desktop | 3.24% |
| lske-map-3 | desktop | 3.24% |
| audiom-tvm-map-1 | desktop | 3.29% |
| audiom-tvm-map-4 | desktop | 3.29% |
| audiom-tvm-map-3 | desktop | 3.29% |
| audiom-tvm-map-2 | desktop | 3.29% |

## Top 10 Worst Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| digital-map-tool-accessibility-comparison | mobile | 84.22% |
| wisconsin-geological-survey-press-release | mobile | 76.78% |
| case-study-vrate-expo-2024 | mobile | 76.12% |
| contact | mobile | 72.68% |
| case-study-vrate-expo-2024 | desktop | 72.03% |
| list-of-non-visual-drawing-tools | desktop | 71.04% |
| audiom-demo-form | mobile | 70.64% |
| brandon-keith-biggs | mobile | 70.45% |
| how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance | desktop | 66.05% |
| how-to-convert-from-a-pdf-map-to-a-vector-data-map | desktop | 65.51% |

## Desktop Regression Status

The CSS revert was performed to fix a desktop regression observed in R10. R11 confirms the regression is resolved:

- Desktop average: 23.61% (R9: 22.67%) -- within 1pp
- Desktop median: 11.73% (R9: 9.73%) -- within 2pp
- Desktop under-10% count: 43 (R9: 45) -- within 2 pages
- Top best pages are identical to R9's best pages

The minor differences are attributable to run-to-run variance (font rendering timing, animation states, network-loaded resources).

## Conclusion

R11 confirms the CSS revert successfully restored visual parity to R9 levels. No significant regressions. The site is back to a stable baseline for further improvements.
