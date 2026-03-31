# Download Missing DALL-E Images

## 2026-03-30

**GOAL:** Download 9 missing DALL-E images from live WP site.

**DONE:**
- Read broken-links.json — 9 missing images, all DALL-E with %C2%B7 in filenames
- Found all WP source URLs in static/images/manifest.json
- Downloaded all 8 unique files from xrnavigation.io/wp-content/uploads/2023/10/
- All files have real sizes (122KB-2.2MB), no zero-byte downloads

**STUCK:** check-links.js still reports 9 missing. It resolves against `public/` (Hugo build output), not `static/`. Hugo builds static/ into public/ — but the `%C2%B7` encoding in filenames may cause path resolution mismatch. The checker does `path.join(PUBLIC, urlPath)` where urlPath is URL-encoded (`%C2%B7`), but the actual file on disk has literal `%C2%B7` in the filename. Need to check if Hugo copies these correctly or if there's a URL-decoding issue.

**NEXT:** Check public/images/ after Hugo build to see if the files appear there with the expected names.
