# Link Audit Notes
## 2026-03-30

**GOAL:** Find and fix all broken internal links on the Hugo site.

**STATE:** Hugo site builds successfully (98 pages, 280 static files). Need to write link checker script.

**OBSERVED:**
- hugo.toml has menu entries for: /, /about/, /gallery/, /blog/, /contact/, /map-evaluation-tool/, /accessibility-statement/
- Content dir has ~80 .md files plus blog/ subdirectory
- Theme partials: footer.html, header.html, head.html, theme-switcher.html
- Static has images/ dir and _redirects file
- public/ dir exists from build

**FINDINGS (first run):**
- 93 broken internal links, 41 missing images, 26 wp-content refs, 50 self-referencing external URLs
- Unique broken link patterns:
  1. `/audiom-gallery/` (should be `/gallery/`) — in blog posts and paginated pages
  2. `/evaluate/` (should be `/map-evaluation-tool/`) — in blog posts and paginated pages
  3. `/home` (should be `/`) — in 2 pages (blog index, how-to-make-detailed-map-text-descriptions)
  4. `/livereload.js?...` — Hugo dev server artifact baked into blog HTML output
  5. Missing DALL-E images — ~7 unique images referenced but not in static/images/
  6. `https://xrnavigation.io/wp-content/plugins/wpforms/...` — WP remnant in paginated pages
  7. 50 self-referencing external URLs (`https://xrnavigation.io/...` should be relative)
- wp-content refs to icad.org are external/legitimate, NOT broken
- The `nav-list` class and `/audiom-gallery/`, `/evaluate/` links only appear in public/ output, NOT in theme templates or layouts source. The blog single template uses `{{ .Content }}` — these links must be baked into blog markdown content or come from a different baseof.
- Blog posts use a DIFFERENT layout than other pages (simpler header with nav-list class vs the Astra-style header). Source template not yet found.

**UPDATE:** Clean build (rm -rf public && hugo) eliminated stale artifacts. Previous results were polluted by hugo server livereload artifacts and stale paginated pages. Real numbers after clean build:
- 11 broken internal links (2x `/home` link, 9x missing DALL-E images)
- 9 missing images (same DALL-E images)
- 18 wp-content refs (all external icad.org — legitimate, not ours)
- 36 self-referencing external URLs (https://xrnavigation.io/... should be relative)

**FIXABLE NOW:**
1. `/home` -> `/` in content/blog/how-to-make-detailed-map-text-descriptions.md (lines 36, 102)
2. `/home` in blog/index.html output — need to find source (blog list template?)
3. 36 self-referencing external URLs — need to convert to relative in content .md files
4. Missing DALL-E images — files don't exist in static/images/, can't fix without the actual images

**DONE:**
- Fixed 2 `/home` -> `/` in how-to-make-detailed-map-text-descriptions.md
- Fixed 25 self-referencing external URLs in 12 content files
- Fixed mangled mailto and google redirect wrapper URLs in accessibility-statement.md
- Created `scripts/check-links.js` (Node.js CI gate, `npm run check-links`)
- Created `scripts/check-links.py` (Python version, used for initial audit)
- Created `reports/migration-link-audit.md`
- Written `data/broken-links.json`

**REMAINING:** 9 missing DALL-E images need to be downloaded from WP site or regenerated.
