# Download Missing DALL-E Images

## 2026-03-30

**GOAL:** Download 9 missing DALL-E images from live WP site.

**DONE:**
- Read broken-links.json — 9 missing images, all DALL-E with %C2%B7 in filenames
- Found all WP source URLs in static/images/manifest.json
- Downloaded all 8 unique files from xrnavigation.io/wp-content/uploads/2023/10/
- All files have real sizes (122KB-2.2MB), no zero-byte downloads

**ROOT CAUSE:** Images were never missing from disk. All 8 DALL-E files were committed in `b3ccd4b`. The bug was in `check-links.js` line 98: `decodeURIComponent()` converted `%C2%B7` to UTF-8 `·`, but filenames on disk contain literal `%C2%B7`. Fixed by adding raw-path fallback in `resolveInPublic()`.

**RESULT:** check-links passes with 0 missing images. Committed fix in `9f64980`.
