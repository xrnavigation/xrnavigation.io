# Structural Content Gaps Fix Report

## Summary

Investigated the 5 worst-scoring pages from the visual comparison (>85% pixel diff). Found that all pages had matching article content between WP and Hugo -- the high diff scores were primarily from theme/layout differences (header, nav, footer styling), not missing content. However, several fixable content issues were found and resolved.

## Pages Investigated

### 1. capability-statement (91.6% diff)
- **Finding:** Content identical between WP and Hugo (heading + download link). Diff is purely from theme/layout styling.
- **Action:** No content fix needed.

### 2. acr (90.6% diff)
- **Finding:** Content matched, but markdown link markup was broken -- `[` on its own line caused links to render as plain text instead of clickable download links. File paths in `/images/` were verified correct (both .docx and .pdf exist in static/images).
- **Action:** Fixed link markup to inline format.

### 3. brandon-keith-biggs (90.5% diff)
- **Finding:** Content matched. Profile image was missing alt text (`![](/images/unnamed-1.webp)` vs WP's `alt="Brandon Keith Biggs"`). Image file exists.
- **Action:** Added alt text: `![Brandon Keith Biggs](/images/unnamed-1.webp)`.

### 4. 404-2 (93.0% diff)
- **Finding:** WP publishes 404 content as a page at `/404-2/`. Hugo uses a `404.html` template. The template had generic placeholder text instead of matching the WP content.
- **Action:** Updated `themes/xrnav/layouts/404.html` to match WP: heading "404! Page Not Found.", Try Audiom link, Go Home arrow link. Also fixed broken link markup in `content/404-2.md`.

### 5. audiom-demo-form (86.1% diff)
- **Finding:** Hugo form had a Phone field; WP form has a Website field instead. Fields didn't match.
- **Action:** Replaced Phone field with Website field to match WP form.

## Additional Fixes

Grep found the same broken link pattern (bare `[` on its own line) in 3 additional content files that weren't in the original investigation list:
- `content/corporate-campuses.md` -- 2 CTA links at bottom
- `content/health-care-facilities.md` -- 2 CTA links at bottom
- `content/universities.md` -- 2 CTA links at bottom

All fixed in the second commit.

## Commits

1. `7dfbab4` -- Fix structural content gaps on worst-scoring migration pages (brandon-keith-biggs alt text, acr links, audiom-demo-form fields, 404 template)
2. `3ea3a6b` -- Fix broken markdown link markup across content pages (corporate-campuses, health-care-facilities, universities, 404-2)

## Remaining Diff Sources

The high pixel diff scores on these pages will remain elevated because the underlying cause is theme/CSS differences (different header, navigation, footer, typography, colors) between the WP theme and the Hugo theme. These are not content gaps -- they are expected visual differences that will be addressed by CSS/theme work.
