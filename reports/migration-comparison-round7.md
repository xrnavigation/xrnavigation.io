# Visual Comparison Round 7

**Date:** 2026-03-30
**Hugo port:** 1314
**Test config:** tests/playwright.config.ts
**Baseline:** 180 WordPress screenshots (90 pages x 2 viewports)

## Summary

| Metric | R7 | R6 | Delta |
|--------|----|----|-------|
| Total comparisons | 180 | 180 | -- |
| Matching (<2%) | 1 | 1 | -- |
| Minor (2-10%) | 15 | 15 | -- |
| Major (>10%) | 164 | 164 | -- |
| Errors | 0 | 0 | -- |
| Avg diff % | 44.36% | 45.19% | -0.83pp |
| Median diff % | 46.12% | 48.87% | -2.75pp |
| Desktop avg | 39.72% | 40.38% | -0.66pp |
| Desktop median | 44.97% | 45.51% | -0.54pp |
| Mobile avg | 49.01% | 49.99% | -0.98pp |
| Mobile median | 51.30% | 53.77% | -2.47pp |

## Distribution

| Threshold | R7 Count | R7 % of total | R6 Count | R6 % of total |
|-----------|----------|---------------|----------|---------------|
| Under 1% | 1 | 0.6% | 1 | 0.6% |
| Under 5% | 5 | 2.8% | 5 | 2.8% |
| Under 10% | 16 | 8.9% | 16 | 8.9% |
| Under 20% | 27 | 15.0% | 26 | 14.4% |
| Under 30% | 41 | 22.8% | 41 | 22.8% |

## Top 10 Best Pages

| Page | Viewport | Diff % | Dimensions (baseline vs current) |
|------|----------|--------|----------------------------------|
| fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 0.41% | 1920x17334 vs 1920x17333 |
| covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 2.12% | 1920x2383 vs 1920x2382 |
| privacy-policy | desktop | 4.72% | 1920x8964 vs 1920x8983 |
| audiom-sole-source-justification | desktop | 4.80% | 1920x1080 vs 1920x1080 |
| wcag-map-comparison-table | desktop | 4.80% | 1920x1080 vs 1920x1080 |
| fcoi | desktop | 5.32% | 1920x1080 vs 1920x1080 |
| lske-map-3 | desktop | 7.13% | 1920x1806 vs 1920x1807 |
| nfb25 | desktop | 7.28% | 1920x3934 vs 1920x3866 |
| lske-map-4 | desktop | 7.38% | 1920x1806 vs 1920x1807 |
| lske-map-2 | desktop | 7.48% | 1920x1806 vs 1920x1807 |

## Top 10 Worst Pages

| Page | Viewport | Diff % | Dimensions (baseline vs current) |
|------|----------|--------|----------------------------------|
| digital-map-tool-accessibility-comparison | mobile | 84.28% | 938x6561 vs 375x12270 |
| universities | desktop | 77.81% | 1920x4689 vs 1920x2848 |
| health-care-facilities | desktop | 76.91% | 1920x5466 vs 1920x3462 |
| case-study-vrate-expo-2024 | desktop | 72.01% | 1920x1800 vs 1920x1080 |
| list-of-non-visual-drawing-tools | desktop | 71.03% | 1920x3462 vs 1920x2035 |
| brandon-keith-biggs | mobile | 70.24% | 375x1753 vs 375x2277 |
| nasa-jpl-campus-map | mobile | 68.45% | 375x2145 vs 375x3057 |
| wisconsin-geological-survey-press-release | mobile | 67.59% | 375x1856 vs 375x1405 |
| corporate-campuses | desktop | 67.39% | 1920x4885 vs 1920x3158 |
| magicmap-paloalto | mobile | 67.21% | 375x4588 vs 375x6085 |

## Key Changes from R6

### Blog listing page: major improvement

The blog listing page was the worst performer in R6 (desktop 84.51%, mobile 89.44%) due to Hugo rendering all posts on a single page versus WordPress pagination. In R7, blog dropped to desktop 33.96% and mobile 48.09% -- improvements of 50.55pp and 41.35pp respectively. Blog is no longer in the worst 10.

### map-evaluation-tool: dropped off worst list

In R6, map-evaluation-tool mobile was the second worst at 89.43% with a width mismatch (2351px vs 375px). It no longer appears in the worst 10.

### Overall improvement

Average diff improved 0.83pp (45.19% to 44.36%). Median improved more substantially at 2.75pp (48.87% to 46.12%), indicating the middle of the distribution shifted more than outliers. Mobile median improved 2.47pp. One additional page crossed below the 20% threshold (26 to 27).

## Worst Pages by Category (>=50% diff)

### Collection/Portfolio pages (10)

These are grid/card layout pages where Hugo renders fewer or differently-sized cards than WordPress.

| Page | Viewport | Diff % |
|------|----------|--------|
| universities | desktop | 77.81% |
| health-care-facilities | desktop | 76.91% |
| list-of-non-visual-drawing-tools | desktop | 71.03% |
| nasa-jpl-campus-map | mobile | 68.45% |
| corporate-campuses | desktop | 67.39% |
| magicmap-paloalto | mobile | 67.21% |
| health-care-facilities | mobile | 63.70% |
| corporate-campuses | mobile | 60.77% |
| universities | mobile | 58.92% |
| list-of-non-visual-drawing-tools | mobile | 53.77% |

### Embed/Tool pages (5)

Pages with embedded iframes, comparison tools, or complex interactive content.

| Page | Viewport | Diff % |
|------|----------|--------|
| digital-map-tool-accessibility-comparison | mobile | 84.28% |
| about | desktop | 62.94% |
| digital-map-tool-accessibility-comparison | desktop | 61.28% |
| about | mobile | 52.48% |
| wcag-map-comparison-table | mobile | 51.30% |

### Case Study pages (2)

| Page | Viewport | Diff % |
|------|----------|--------|
| case-study-vrate-expo-2024 | desktop | 72.01% |
| case-study-vrate-expo-2024 | mobile | 65.61% |

### Standard/Other pages (66)

The largest group, dominated by audiom demo/embed pages and blog posts with significant layout differences. Key patterns:

- **Audiom embed pages (desktop):** 53-56% diff range. These pages embed audiom players; the embed sizing and surrounding layout differs from WordPress.
- **Audiom embed pages (mobile):** 56-66% diff range. Mobile layouts consistently worse than desktop for embeds.
- **Event/conference pages:** 51-65% range (nfb, atia, dif25, eclipse24, etc.). Layout and content structure differences.
- **Blog posts:** 54-67% range. Individual blog post layouts still differ in typography, spacing, and sidebar/widget areas.
- **Contact/form pages:** contact at 59.86% desktop, 63.64% mobile. Form rendering differs.

## Progress Across Rounds

| Round | Avg | Desktop Avg | Mobile Avg | Under 10% | Under 20% |
|-------|-----|-------------|------------|-----------|-----------|
| R2 | 43.64% | -- | -- | 0 | -- |
| R3 | 42.17% | -- | -- | -- | -- |
| R4 | 51.31% | 41.53% | 61.10% | 2 | -- |
| R5 | 46.01% | 41.47% | 50.55% | 2 | -- |
| R6 | 45.19% | 40.38% | 49.99% | 16 | 26 |
| R7 | 44.36% | 39.72% | 49.01% | 16 | 27 |

## Assessment

Round 7 shows continued incremental improvement. The headline numbers (avg -0.83pp, median -2.75pp) reflect steady progress. The blog pagination fix was the single largest improvement, removing the two worst outliers from R6 (blog desktop/mobile at 84-89%).

The remaining gap is structural rather than cosmetic:

1. **Collection/portfolio grids (10 pages):** Hugo renders different card counts or layouts. These need grid template matching.
2. **Audiom embed pages (30+ pages):** The embed player dimensions and surrounding layout differ. This is the largest single category of remaining diffs.
3. **Event/conference pages:** Layout structure differences -- likely missing sidebar widgets, different section ordering, or missing content blocks.
4. **digital-map-tool-accessibility-comparison mobile (84%):** Width mismatch in baseline (938px) vs current (375px) -- this is partially a baseline capture artifact.

The next highest-impact fixes would be: (1) audiom embed sizing to match WordPress, (2) collection/portfolio grid layouts, (3) event page layout structure.
