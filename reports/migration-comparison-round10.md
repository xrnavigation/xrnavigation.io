# Visual Comparison Round 10

**Date:** 2026-04-01
**Branch:** main
**Hugo port:** 1314
**Test config:** tests/playwright.config.ts
**Test file:** tests/visual-comparison.spec.ts

## Summary

Round 10 shows a regression from Round 9. Average diff increased from 26.81% to 29.03% (+2.22pp). The most significant damage is on desktop: desktop average rose from 22.67% to 27.65% (+4.98pp) and desktop median nearly doubled from 9.73% to 19.09% (+9.36pp). Mobile held roughly steady (30.41% vs 31.00%). The sub-5% bucket collapsed from 40 pages to 11, indicating something shifted that hurt the previously best-matching desktop pages.

## Overall Results

| Metric | R10 | R9 | Delta |
|--------|-----|-----|-------|
| Total comparisons | 180 | 179 | +1 |
| Match (<5%) | 11 | 40 | -29 |
| Minor (5-20%) | 76 | 49 | +27 |
| Major (>20%) | 93 | 90 | +3 |

## Diff Percentages

| Metric | R10 | R9 | Delta |
|--------|-----|-----|-------|
| Average (overall) | 29.03% | 26.81% | +2.22pp |
| Median (overall) | 22.89% | 21.16% | +1.73pp |
| Average (desktop) | 27.65% | 22.67% | +4.98pp |
| Median (desktop) | 19.09% | 9.73% | +9.36pp |
| Average (mobile) | 30.41% | 31.00% | -0.59pp |
| Median (mobile) | 27.59% | 27.81% | -0.22pp |

## Distribution

| Threshold | R10 Count | R9 Count | Delta |
|-----------|-----------|----------|-------|
| Under 1% | 0 | 2 | -2 |
| Under 5% | 11 | 40 | -29 |
| Under 10% | 25 | 45 | -20 |
| Under 20% | 87 | 89 | -2 |
| Under 30% | 106 | 110 | -4 |

The collapse in the under-5% and under-10% buckets is the defining feature of R10. Pages that were 0-3% in R9 (embed pages, map pages) are now 4.5-5.5%, suggesting a global CSS or template change pushed many near-matches just over the 5% line. The under-20% and under-30% buckets stayed roughly stable, meaning mid-range pages were not significantly affected.

## Top 20 Best Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 1.90% |
| lske-map-2 | desktop | 4.55% |
| lske-map-4 | desktop | 4.56% |
| lske-map-3 | desktop | 4.56% |
| privacy-policy | desktop | 4.68% |
| audiom-tvm-map-4 | desktop | 4.73% |
| audiom-tvm-map-2 | desktop | 4.75% |
| audiom-tvm-map-3 | desktop | 4.77% |
| audiom-sole-source-justification | desktop | 4.78% |
| wcag-map-comparison-table | desktop | 4.79% |
| lske-map-1 | desktop | 4.81% |
| csun | desktop | 5.06% |
| fcoi | desktop | 5.31% |
| audiom-demo | desktop | 5.32% |
| audiom-tvm-map-1 | desktop | 5.36% |
| ipst | desktop | 5.55% |
| election2024 | desktop | 5.61% |
| audiom-airplane-aa-747-seatmap | desktop | 5.61% |
| covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 5.64% |
| gavilan-hollister | desktop | 7.00% |

All top 20 are desktop. The best mobile page did not make this list. Embed/map pages dominate but shifted upward ~1.5pp from R9.

## Top 20 Worst Pages

| Page | Viewport | Diff % |
|------|----------|--------|
| digital-map-tool-accessibility-comparison | mobile | 84.22% |
| wisconsin-geological-survey-press-release | mobile | 76.78% |
| case-study-vrate-expo-2024 | mobile | 76.12% |
| contact | mobile | 72.68% |
| case-study-vrate-expo-2024 | desktop | 72.48% |
| list-of-non-visual-drawing-tools | desktop | 71.04% |
| audiom-demo-form | mobile | 70.64% |
| brandon-keith-biggs | mobile | 70.45% |
| how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance | desktop | 66.05% |
| how-to-convert-from-a-pdf-map-to-a-vector-data-map | desktop | 65.51% |
| wcag-map-comparison-table | mobile | 65.36% |
| five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat | desktop | 65.15% |
| 404-2 | desktop | 63.88% |
| about | desktop | 63.28% |
| five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies | desktop | 62.44% |
| this-is-a-covid-statistic-map-showing-total-cases-over-washington-oregan-and-idaho | mobile | 62.31% |
| corporate-campuses | mobile | 62.31% |
| brandon-keith-biggs | desktop | 61.85% |
| digital-map-tool-accessibility-comparison | desktop | 61.27% |
| contact | desktop | 59.76% |

## Root Cause Analysis of Worst Pages

### Needs Template/Content Fix (structural or content missing)

These pages have large height differences or width mismatches indicating missing content, broken templates, or fundamentally different page structures:

| Page | Viewport | Diff % | Height Diff | Notes |
|------|----------|--------|-------------|-------|
| digital-map-tool-accessibility-comparison | desktop | 61.27% | 5266px (100%) | Page appears to render at half expected height -- likely missing table/content |
| digital-map-tool-accessibility-comparison | mobile | 84.22% | 5686px (87%) + 563px width mismatch | Baseline captured at 938px wide, not 375px -- baseline issue or responsive breakpoint |
| about | desktop | 63.28% | 1092px (12%) + 800px width mismatch | Baseline at 2720px wide vs 1920px current |
| case-study-vrate-expo-2024 | desktop | 72.48% | 720px (40%) | Missing content sections |
| case-study-vrate-expo-2024 | mobile | 76.12% | 748px (38%) | Same -- missing content |
| contact | desktop | 59.76% | 486px (31%) | Missing form or content block |
| contact | mobile | 72.68% | 592px (29%) | Same |
| audiom-demo-form | mobile | 70.64% | 510px (29%) | Form rendering differently |
| list-of-non-visual-drawing-tools | desktop | 71.04% | 1427px (41%) | Missing content sections |
| 404-2 | desktop | 63.88% | 526px (33%) | 404 page content mismatch |

### CSS Tweaking (layout/styling differences, content present)

These pages have moderate height differences suggesting styling gaps rather than missing content:

| Page | Viewport | Diff % | Height Diff | Notes |
|------|----------|--------|-------------|-------|
| wisconsin-geological-survey-press-release | mobile | 76.78% | 725px (39%) | Content present but styling very different |
| brandon-keith-biggs | mobile | 70.45% | 382px (22%) | Author page styling |
| brandon-keith-biggs | desktop | 61.85% | 194px (12%) | Author page styling |
| how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance | desktop | 66.05% | 1752px (42%) | Blog post -- typography/spacing |
| how-to-convert-from-a-pdf-map-to-a-vector-data-map | desktop | 65.51% | 1371px (38%) | Blog post -- typography/spacing |
| five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat | desktop | 65.15% | 1550px (39%) | Blog post -- typography/spacing |
| five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies | desktop | 62.44% | 1294px (35%) | Blog post -- typography/spacing |
| wcag-map-comparison-table | mobile | 65.36% | 295px (24%) | Table rendering on mobile |
| this-is-a-covid-statistic-map-showing-total-cases-over-washington-oregan-and-idaho | mobile | 62.31% | 419px (22%) | Embed page mobile styling |
| corporate-campuses | mobile | 62.31% | 756px (13%) | Collection page mobile styling |

## Trajectory Assessment

| Round | Avg | Desktop Avg | Mobile Avg | Under 10% | Under 30% |
|-------|-----|-------------|------------|-----------|-----------|
| R8 | 32.23% | 24.69% | 39.77% | 44 | 73 |
| R9 | 26.81% | 22.67% | 31.00% | 45 | 110 |
| R10 | 29.03% | 27.65% | 30.41% | 25 | 106 |

**R10 is a regression on desktop, flat on mobile.** The overall average increased 2.22pp. Desktop was hit hardest: the median nearly doubled (9.73% to 19.09%), and the under-10% count dropped from 45 to 25. Mobile improved marginally (-0.59pp avg, -0.22pp median).

The regression appears to be a broad shift affecting previously well-matched pages rather than catastrophic failure on a few pages. The embed/map pages that were the best performers in R9 (0-3.3%) all shifted up to 4.5-5.8%, suggesting a header, footer, or global CSS change added ~2pp of diff across the board on desktop.

Notable individual regression: `digital-map-tool-accessibility-comparison` desktop went from 0.00% in R9 to 61.27% in R10 -- this page lost most of its content rendering.
