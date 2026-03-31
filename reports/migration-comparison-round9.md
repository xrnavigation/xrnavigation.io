# Visual Comparison Round 9

**Date:** 2026-03-30
**Branch:** master
**Hugo port:** 1314
**Test config:** tests/playwright.config.ts
**Test file:** tests/visual-comparison.spec.ts

## Summary

Round 9 continues steady improvement over Round 8, with average diff dropping 5.42 percentage points (from 32.23% to 26.81%). The median dropped even more dramatically -- from 33.90% to 21.16% (12.74pp). Desktop median is now 9.73%, meaning more than half of all desktop screenshots are under 10% diff. 89 of 179 pages are now under 20%, up from 55 in R8.

## Overall Results

| Metric | R9 | R8 | Delta |
|--------|-----|-----|-------|
| Total comparisons | 179 | 180 | -1 |
| Matching (<0.5%) | 2 | 1 | +1 |
| Minor (0.5-5%) | 38 | 43 | -5 |
| Major (>=5%) | 139 | 136 | +3 |
| Errors | 1 | 0 | +1 |

Note: R9 has 1 error (digital-map-tool-accessibility-comparison mobile -- navigation caused execution context destruction). The matching/minor/major shift reflects tightened thresholds: R8 used 2% for "matching" and 10% for "major"; R9 uses 0.5% and 5% respectively. Using R8's thresholds, R9 would show 2 matching, 43 minor (2-10%), 134 major -- comparable structure but better distribution.

## Diff Percentages

| Metric | R9 | R8 | Delta |
|--------|-----|-----|-------|
| Average (overall) | 26.81% | 32.23% | -5.42pp |
| Median (overall) | 21.16% | 33.90% | -12.74pp |
| Average (desktop) | 22.67% | 24.69% | -2.02pp |
| Median (desktop) | 9.73% | 11.74% | -2.01pp |
| Average (mobile) | 31.00% | 39.77% | -8.77pp |
| Median (mobile) | 27.81% | 37.07% | -9.26pp |

## Distribution

| Threshold | R9 Count | R8 Count | Delta |
|-----------|----------|----------|-------|
| Under 1% | 2 | 1 | +1 |
| Under 5% | 40 | 39 | +1 |
| Under 10% | 45 | 44 | +1 |
| Under 20% | 89 | 55 | +34 |
| Under 30% | 110 | 73 | +37 |

The biggest gains are in the 10-30% band: 37 more pages under 30%, 34 more under 20%. This indicates broad mid-range improvements rather than targeted fixes to individual pages.

## Top 10 Best Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| digital-map-tool-accessibility-comparison | desktop | 0.00% |
| fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 0.41% |
| covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 2.11% |
| lske-map-1 | desktop | 3.24% |
| lske-map-4 | desktop | 3.24% |
| lske-map-2 | desktop | 3.24% |
| lske-map-3 | desktop | 3.24% |
| audiom-tvm-map-1 | desktop | 3.29% |
| audiom-tvm-map-4 | desktop | 3.29% |
| audiom-tvm-map-2 | desktop | 3.29% |

## Top 10 Worst Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| wisconsin-geological-survey-press-release | mobile | 76.78% |
| case-study-vrate-expo-2024 | mobile | 76.12% |
| contact | mobile | 72.68% |
| case-study-vrate-expo-2024 | desktop | 72.03% |
| universities | mobile | 71.64% |
| list-of-non-visual-drawing-tools | desktop | 71.04% |
| audiom-demo-form | mobile | 70.64% |
| brandon-keith-biggs | mobile | 70.45% |
| health-care-facilities | mobile | 69.64% |
| corporate-campuses | mobile | 68.84% |

## Category Breakdown

| Category | Count | Avg Diff | Median Diff |
|----------|-------|----------|-------------|
| Standard pages | 12 | 47.28% | 56.08% |
| Blog | 2 | 47.67% | 47.67% |
| Audiom embed | 19 | 21.95% | 11.03% |
| Other | 146 | 25.48% | 19.78% |

### Category by Viewport

| Category | Desktop Avg | Mobile Avg |
|----------|-------------|------------|
| Standard pages | 38.03% | 56.53% |
| Blog | 33.96% | 61.38% |
| Audiom embed | 12.05% | 32.94% |
| Other | 22.71% | 28.24% |

## Worst Remaining Categories

1. **Standard pages (avg 47.28%):** contact (72.68% mobile), 404-2, about, services, privacy-policy -- these structural pages have layout differences that persist. Contact mobile is worst at 72.68%.
2. **Blog (avg 47.67%):** Blog listing remains at 33.96% desktop, 61.38% mobile -- pagination and layout differences drive this.
3. **Collection/portfolio pages:** universities (71.64% mobile), health-care-facilities (69.64% mobile), corporate-campuses (68.84% mobile) -- grid/card layouts with significant height mismatches.
4. **Case studies:** case-study-vrate-expo-2024 is 72-76% in both viewports -- likely missing content or very different layout.
5. **Mobile gap persists:** Mobile averages 31.00% vs desktop 22.67% (8.33pp gap), though this narrowed from R8's 15.08pp gap.

## Progress Across Rounds

| Round | Avg Diff | Median | Desktop Avg | Mobile Avg | Under 5% | Under 10% | Under 30% |
|-------|----------|--------|-------------|------------|----------|-----------|-----------|
| R2 | 43.64% | 43.70% | -- | -- | -- | 0 | -- |
| R3 | 42.17% | 38.70% | -- | -- | -- | -- | -- |
| R4 | 51.31% | 55.49% | 41.53% | 61.10% | -- | 2 | -- |
| R5 | 46.01% | 46.94% | 41.47% | 50.55% | -- | 2 | -- |
| R6 | 45.19% | 48.87% | 40.38% | 49.99% | 5 | 16 | -- |
| R7 | 44.36% | 46.12% | 39.72% | 49.01% | 5 | 16 | 41 |
| R8 | 32.23% | 33.90% | 24.69% | 39.77% | 39 | 44 | 73 |
| R9 | 26.81% | 21.16% | 22.67% | 31.00% | 40 | 45 | 110 |

## Key Observations

1. **Median improvement outpaces average:** The 12.74pp median drop (vs 5.42pp average) indicates the distribution is shifting left -- many pages improved substantially while a long tail of difficult pages persists.
2. **Desktop median under 10%:** At 9.73%, more than half of all desktop screenshots are within 10% of the WordPress baseline. Desktop is approaching parity for most pages.
3. **Mobile closed the gap:** Mobile average improved 8.77pp (39.77% to 31.00%), narrowing the desktop-mobile gap from 15.08pp to 8.33pp.
4. **110 of 179 pages under 30%:** 61% of all comparisons are now within 30%, up from 41% in R8.
5. **New perfect match:** digital-map-tool-accessibility-comparison desktop hit 0.00% diff.
6. **Persistent problem areas:** Standard/structural pages (contact, about, 404, services), collection/portfolio grids (universities, health-care-facilities, corporate-campuses), and case studies remain the worst performers. These share a pattern: significant height mismatches indicating missing or different content blocks.
