# Visual Comparison Report: Hugo vs WordPress Baseline

**Date:** 2026-03-30
**Method:** Playwright screenshots of local Hugo site (port 1314) compared against WordPress baseline PNGs using pixelmatch (threshold 0.1)
**Viewports:** Desktop (1920x1080), Mobile (375x812)

## Summary

| Category | Count |
|---|---|
| Total comparisons | 180 |
| Matching (<2% diff) | 0 |
| Minor differences (2-10%) | 1 |
| Major differences (>10%) | 179 |
| HTTP 404 errors (missing pages) | 22 |

Zero pages match the WordPress baseline within 2%. This is expected at this stage of migration -- the Hugo site uses a different theme, layout structure, and CSS from WordPress.

## Missing Pages (HTTP 404)

11 blog posts have not been migrated to Hugo yet. All return 404:

| Slug |
|---|
| digital-map-tool-accessibility-comparison |
| five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat |
| five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies |
| how-to-convert-from-a-pdf-map-to-a-vector-data-map |
| how-to-convert-from-pdf-to-geojson-using-qgis |
| how-to-make-detailed-map-text-descriptions |
| how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples |
| how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance |
| list-of-non-visual-drawing-tools |
| the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business |
| what-is-the-definition-of-a-map |

These are all long-form blog posts. Each counts as 2 failures (desktop + mobile = 22 total).

## Top 10 Worst Pages (Excluding 404s)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 93.0% | 404-2 | desktop | 1920x1606 | 1920x1358 |
| 91.6% | capability-statement | desktop | 1920x1390 | 1920x1198 |
| 90.6% | acr | desktop | 1920x1390 | 1920x1496 |
| 90.5% | brandon-keith-biggs | desktop | 1920x1606 | 1920x1888 |
| 90.3% | blog | mobile | 375x5162 | 375x15087 |
| 86.1% | audiom-demo-form | desktop | 1920x1191 | 1920x1322 |
| 85.4% | 404-2 | mobile | 375x1753 | 375x1953 |
| 84.5% | brandon-keith-biggs | mobile | 375x1753 | 375x2821 |
| 84.2% | capability-statement | mobile | 375x1590 | 375x1841 |
| 84.1% | blog | desktop | 1920x2878 | 1920x7954 |

## Best Pages (Closest to Baseline)

| Diff % | Slug | Viewport | Baseline Size | Hugo Size |
|---|---|---|---|---|
| 9.9% | privacy-policy | desktop | 1920x8964 | 1920x8488 |
| 11.4% | fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific | desktop | 1920x17334 | 1920x15663 |
| 18.3% | nfb25 | desktop | 1920x3934 | 1920x3706 |
| 21.0% | map-evaluation-tool | desktop | 1920x5221 | 1920x4919 |
| 23.6% | gallery | desktop | 1920x2430 | 1920x2280 |
| 24.3% | sonification-awards-2024-application | desktop | 1920x8275 | 1920x9605 |
| 24.7% | accessibility-statement | desktop | 1920x4163 | 1920x3858 |
| 25.8% | nfb25 | mobile | 375x4745 | 375x5091 |
| 27.1% | events | mobile | 375x7010 | 375x7691 |
| 27.7% | implementation | desktop | 1920x2702 | 1920x2780 |

## Analysis: What Causes the Biggest Differences

### 1. Different theme and CSS (affects all pages)
The Hugo site uses theme "xrnav" which has fundamentally different styling from the WordPress theme. Header, footer, navigation, typography, spacing, and color all differ. This is the dominant source of pixel differences across every page.

### 2. Height mismatches (affects most pages)
Almost every page has a different total height between baseline and Hugo. This indicates different content rendering heights due to different CSS (line-height, padding, margins, font sizes), different header/footer sizes, and different content wrapping.

### 3. Blog listing page (blog -- 84-90% diff)
The Hugo blog listing shows all posts on one page (paginate=10 but Hugo rendered 15087px mobile vs 5162px baseline). WordPress likely used different pagination or showed fewer posts.

### 4. Missing content on specific pages
Pages like `capability-statement`, `acr`, `404-2`, and `brandon-keith-biggs` show 85-93% diff, suggesting structural content differences beyond just CSS -- possibly missing sections, different layouts, or unported custom templates.

### 5. Width mismatches on some pages
A few pages show width differences (e.g., `about` baseline is 2720px wide vs 1920px Hugo, `sonification-awards-2024-application` baseline is 611px vs expected mobile width). These are likely baseline capture artifacts from the WordPress site having responsive breakpoint differences.

### 6. Missing blog posts (11 slugs, 22 comparisons)
These pages haven't been migrated at all. They need content files created under `content/blog/`.

## Diff Images

Visual diff images for all pages with >5% difference are saved in `tests/diffs/` (not committed -- gitignored). Each diff highlights changed pixels in red against a transparent background.

## Full Results

Complete per-page JSON results are in `tests/comparison-results.json` (not committed).

## Recommendations

1. **Do not target pixel-perfect parity.** The Hugo site intentionally uses a new theme. Visual comparison is useful for catching missing content and broken layouts, not for matching WordPress styling.
2. **Prioritize missing pages.** The 11 blog posts returning 404 need content migration.
3. **Review structural pages.** Pages with >80% diff (404-2, capability-statement, acr, brandon-keith-biggs, audiom-demo-form) likely have missing content sections or broken templates.
4. **Blog pagination.** The blog listing page height tripled -- check if pagination settings match WordPress.
5. **Use this test as a regression baseline.** Once the Hugo site is visually acceptable, re-capture baselines from Hugo and use this comparison test to prevent regressions.
