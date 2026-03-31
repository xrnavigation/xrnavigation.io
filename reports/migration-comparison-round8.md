# Visual Comparison Round 8: After Embed Template Perfection

**Date:** 2026-03-30
**Branch:** master
**Hugo port:** 1314
**Test config:** tests/playwright.config.ts
**Test file:** tests/visual-comparison.spec.ts

## Summary

Round 8 shows a dramatic improvement over Round 7, with average diff dropping 12.13 percentage points (from 44.36% to 32.23%). The embed template perfection work delivered substantial gains -- 39 pages are now under 5% diff (up from 5 in R7), and minor differences (2-10%) jumped from 15 to 43.

## Overall Results

| Metric | R8 | R7 | Delta |
|--------|-----|-----|-------|
| Total comparisons | 180 | 180 | -- |
| Matching (<2%) | 1 | 1 | -- |
| Minor (2-10%) | 43 | 15 | +28 |
| Major (>10%) | 136 | 164 | -28 |
| Errors | 0 | 0 | -- |

## Diff Percentages

| Metric | R8 | R7 | Delta |
|--------|-----|-----|-------|
| Average (overall) | 32.23% | 44.36% | -12.13pp |
| Median (overall) | 33.90% | 46.12% | -12.22pp |
| Average (desktop) | 24.69% | 39.72% | -15.03pp |
| Median (desktop) | 11.74% | -- | -- |
| Average (mobile) | 39.77% | 49.01% | -9.24pp |
| Median (mobile) | 37.07% | -- | -- |

## Distribution

| Threshold | R8 Count | R7 Count | Delta |
|-----------|----------|----------|-------|
| Under 1% | 1 | 1 | -- |
| Under 5% | 39 | 5 | +34 |
| Under 10% | 44 | 16 | +28 |
| Under 20% | 55 | 27 | +28 |
| Under 30% | 73 | 41 | +32 |

## Top 10 Best Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 0.41% |
| covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 2.12% |
| lske-map-1 | desktop | 3.24% |
| lske-map-4 | desktop | 3.25% |
| lske-map-2 | desktop | 3.25% |
| lske-map-3 | desktop | 3.25% |
| audiom-tvm-map-1 | desktop | 3.29% |
| audiom-tvm-map-4 | desktop | 3.30% |
| audiom-tvm-map-3 | desktop | 3.30% |
| audiom-tvm-map-2 | desktop | 3.30% |

## Top 10 Worst Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| digital-map-tool-accessibility-comparison | mobile | 84.28% |
| universities | desktop | 77.81% |
| health-care-facilities | desktop | 76.91% |
| case-study-vrate-expo-2024 | desktop | 72.01% |
| list-of-non-visual-drawing-tools | desktop | 71.03% |
| brandon-keith-biggs | mobile | 70.24% |
| wisconsin-geological-survey-press-release | mobile | 67.59% |
| corporate-campuses | desktop | 67.39% |
| how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance | desktop | 66.04% |
| audiom-demo | mobile | 65.62% |

## Audiom Embed Pages

**Total audiom/embed pages:** 44
**Under 5% diff:** 13 (all desktop viewports)

| Page | Viewport | Diff % |
|------|----------|--------|
| audiom-tvm-map-1 | desktop | 3.29% |
| audiom-tvm-map-2 | desktop | 3.30% |
| audiom-tvm-map-3 | desktop | 3.30% |
| audiom-tvm-map-4 | desktop | 3.30% |
| audiom-numbers | desktop | 4.03% |
| audiom-bovine-manus-diagram | desktop | 4.15% |
| audiom-human-skeleton-diagram | desktop | 4.17% |
| audiom-airbus-lopa-a320-200-diagram | desktop | 4.23% |
| audiom-airplane-aa-747-seatmap | desktop | 4.39% |
| audiom-create-x-demo-day-map-2024 | desktop | 4.43% |
| audiom-airbus-lopa-a320-200-seat-map | desktop | 4.59% |
| audiom-mean-sea-level-rise-map-fall-2024 | desktop | 4.67% |
| audiom-sole-source-justification | desktop | 4.80% |

Mobile audiom embeds remain at 27-47% diff, driven by structural layout differences in the mobile viewport.

## Width Mismatch Analysis

- 3 pages have width mismatches (baseline vs current)
- Average diff WITH width mismatch: 65.71%
- Average diff WITHOUT width mismatch: 31.66%

## Key Observations

1. **Desktop embed pages converged:** 13 audiom desktop pages are now within 5%, showing the embed template work landed effectively.
2. **Desktop dramatically improved:** Desktop average dropped 15.03pp (39.72% to 24.69%), with median at 11.74%.
3. **Mobile remains the challenge:** Mobile average at 39.77% (down from 49.01%) but still the primary contributor to overall diff.
4. **Collection/portfolio pages still divergent:** universities (77.81%), health-care-facilities (76.91%), corporate-campuses (67.39%) remain high -- these have grid/card layouts that differ structurally.
5. **39 pages under 5%** (up from 5 in R7) -- nearly all are desktop embed pages, confirming the embed template perfection targeted the right areas.

## Progress Across Rounds

| Round | Avg Diff | Under 10% | Under 30% |
|-------|----------|-----------|-----------|
| R2 | 43.64% | 0 | -- |
| R3 | 42.17% | -- | -- |
| R4 | 51.31% | 2 | -- |
| R5 | 46.01% | 2 | -- |
| R6 | 45.19% | 16 | -- |
| R7 | 44.36% | 16 | 41 |
| R8 | 32.23% | 44 | 73 |
