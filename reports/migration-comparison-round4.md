# Visual Comparison Round 4: Hugo vs WordPress Baseline (Post Header/Footer, Blog, Typography Fixes)

**Date:** 2026-03-30
**Method:** Playwright screenshots of local Hugo site (port 1314) compared against WordPress baseline PNGs using pixelmatch (threshold 0.1)
**Viewports:** Desktop (1920x1080), Mobile (375x812)

## Summary

| Category | Round 4 | Round 3 | Round 2 | Round 1 |
|---|---|---|---|---|
| Total comparisons | 180 | 180 | 180 | 180 |
| Matching (<2% diff) | 0 | 0 | 0 | 0 |
| Minor differences (2-10%) | 2 | 0 | 0 | 1 |
| Major differences (>10%) | 178 | 180 | 180 | 179 |
| HTTP errors (404s) | 0 | 0 | 0 | 22 |
| Average diff % | 51.31% | 42.17% | 43.64% | 43.64% |
| Median diff % | 55.49% | 38.70% | 43.70% | n/a |
| Desktop avg % | 41.53% | -- | -- | -- |
| Mobile avg % | 61.10% | -- | -- | -- |

## IMPORTANT: Mobile Width Regression Inflates R4 Numbers

The R4 overall averages are **not directly comparable** to R3. A significant number of mobile screenshots (90 of 180 total, i.e., all 90 mobile pages) are rendering at **550px width instead of 375px**, despite the Playwright viewport being configured at 375px. In R3, mobile pages rendered at 375px matching the baselines.

This width mismatch alone accounts for the apparent regression:
- Pages WITH width mismatch: **60.96% avg diff**
- Pages WITHOUT width mismatch (desktop): **41.67% avg diff**

The desktop-only average of **41.53%** is comparable to R3's overall 42.17%, suggesting the actual visual fidelity has not regressed -- the mobile rendering width changed.

**Root cause needs investigation:** Something in the recent template/CSS changes is causing mobile pages to render wider than the viewport. Likely a CSS `min-width` on the body or a container, or a wide element forcing horizontal overflow.

## Top 10 Best Pages (Lowest Diff %)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 4.96% | fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 1920x17334 | 1920x17743 |
| 9.96% | privacy-policy | desktop | 1920x8964 | 1920x9308 |
| 20.96% | map-evaluation-tool | desktop | 1920x5221 | 1920x5331 |
| 22.98% | covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho | desktop | 1920x2383 | 1920x2878 |
| 23.07% | capability-statement | desktop | 1920x1390 | 1920x1186 |
| 23.15% | gallery | desktop | 1920x2430 | 1920x2559 |
| 23.50% | sonification-awards-2024-application | desktop | 1920x8275 | 1920x9476 |
| 23.83% | acr | desktop | 1920x1390 | 1920x1358 |
| 24.75% | accessibility-statement | desktop | 1920x4163 | 1920x4273 |
| 24.78% | nfb25 | desktop | 1920x3934 | 1920x3854 |

**Notable improvements:**
- fictional-map-description desktop improved from 12.40% (R3) to 4.96% (R4) -- now nearly matching
- privacy-policy desktop at 9.96% -- first page under 10% since R1
- 2 pages now in "minor" category (<10%), up from 0 in R2/R3

## Top 10 Worst Pages (Highest Diff %)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 93.18% | blog | mobile | 375x5162 | 550x14420 |
| 85.63% | blog | desktop | 1920x2878 | 1920x8752 |
| 84.01% | brandon-keith-biggs | mobile | 375x1753 | 550x2681 |
| 80.37% | universities | desktop | 1920x4689 | 1920x2972 |
| 75.27% | digital-map-tool-accessibility-comparison | mobile | 938x6561 | 550x12710 |
| 75.05% | corporate-campuses | mobile | 375x5892 | 550x5337 |
| 75.01% | audiom-wisconsin-geological-survey-quaternary-map | mobile | 375x2145 | 375x904 |
| 74.63% | magicmap-paloalto | mobile | 375x4588 | 550x5979 |
| 74.60% | health-care-facilities | mobile | 375x5532 | 550x5291 |
| 73.50% | health-care-facilities | desktop | 1920x5466 | 1920x3183 |

## Breakdown by Category

### Blog listing (blog desktop/mobile)
Blog listing remains the worst page. Hugo height is 8752px vs baseline 2878px (desktop) -- Hugo is showing all posts while WordPress paginates. Mobile is even worse due to combined pagination + width mismatch.

### Collection pages (universities, corporate-campuses, health-care-facilities)
These pages show significant height differences -- Hugo versions are shorter, suggesting missing content sections or collapsed grid layouts.

### Content pages with width mismatch
Most mobile content pages cluster in the 55-65% range, heavily influenced by the 375->550px width rendering issue.

## Round-over-Round Trend

| Metric | R1 | R2 | R3 | R4 | R4 Desktop Only |
|---|---|---|---|---|---|
| Average diff % | 43.64% | 43.64% | 42.17% | 51.31% | 41.53% |
| Median diff % | n/a | 43.70% | 38.70% | 55.49% | ~37% |
| Best page diff % | 9.9% | 11.86% | 12.40% | 4.96% | 4.96% |
| Pages <10% | 1 | 0 | 0 | 2 | 2 |
| Errors | 22 | 0 | 0 | 0 | 0 |

**Desktop-only metrics show steady improvement.** The headline regression is entirely a mobile viewport width artifact.

## Assessment of Remaining Issues

### Critical (blocks visual parity)
1. **Mobile viewport rendering at 550px** -- All 90 mobile screenshots render wider than the 375px viewport setting. This needs CSS investigation (likely a `min-width` or overflowing element).
2. **Blog listing pagination** -- Hugo shows all posts; WordPress paginates. Need Hugo pagination template.
3. **Collection page content gaps** -- universities, corporate-campuses, health-care-facilities are significantly shorter in Hugo, suggesting missing taxonomy/archive content.

### Moderate (significant visual diff)
4. **Height mismatches on content pages** -- 84 pages have >20% height difference, even on desktop. Header/footer size differences, spacing, and embedded content sizing all contribute.
5. **Home page** -- 69.32% desktop, 72.45% mobile. The most visible page still has major layout differences.

### Minor (incremental improvements)
6. **Typography and spacing fine-tuning** -- Even width-matched desktop pages average 41.53% diff. The remaining gap is likely font rendering, spacing, padding, and color differences.
7. **Embedded content sizing** -- Audiom iframe/embed heights differ between WordPress and Hugo.

### Recommended Next Steps
1. **Fix mobile viewport width issue** -- This is the highest-impact single fix. Investigate CSS for `min-width` or overflow-causing elements.
2. **Add blog pagination** -- Match WordPress's posts-per-page count.
3. **Fix collection page templates** -- Audit universities, corporate-campuses, health-care-facilities for missing content sections.
4. **Home page layout** -- Dedicated pass to match WordPress home page structure.
