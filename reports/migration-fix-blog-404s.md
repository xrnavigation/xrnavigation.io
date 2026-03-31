# Report: Fix 11 Blog Posts Returning 404

## Date
2026-03-30

## Problem
11 blog posts exported to `content/blog/` returned HTTP 404. WordPress served these posts at root-level URLs (`/{slug}/`), but Hugo's permalink config (`blog = "/blog/:slug/"`) rendered them at `/blog/{slug}/`.

## Root Cause
The Hugo config in `hugo.toml` has `[permalinks] blog = "/blog/:slug/"`. Posts in `content/blog/` therefore render at `/blog/{slug}/`, not at the root-level `/{slug}/` URLs that WordPress used.

## Fix Applied
Added `url: /{slug}/` to the frontmatter of all 11 blog posts. This overrides Hugo's permalink pattern and renders each post at its original WordPress URL.

### Files Modified
1. `content/blog/digital-map-tool-accessibility-comparison.md`
2. `content/blog/five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat.md`
3. `content/blog/five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies.md`
4. `content/blog/how-to-convert-from-a-pdf-map-to-a-vector-data-map.md`
5. `content/blog/how-to-convert-from-pdf-to-geojson-using-qgis.md`
6. `content/blog/how-to-make-detailed-map-text-descriptions.md`
7. `content/blog/how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples.md`
8. `content/blog/how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance.md`
9. `content/blog/list-of-non-visual-drawing-tools.md`
10. `content/blog/the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business.md`
11. `content/blog/what-is-the-definition-of-a-map.md`

## Verification

### Static build verification
Ran `hugo` and confirmed `public/{slug}/index.html` exists for all 11 slugs.

### Live server verification
Started `hugo server` and curled all 11 URLs. All returned HTTP 200:

```
200 /digital-map-tool-accessibility-comparison/
200 /five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat/
200 /five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies/
200 /how-to-convert-from-a-pdf-map-to-a-vector-data-map/
200 /how-to-convert-from-pdf-to-geojson-using-qgis/
200 /how-to-make-detailed-map-text-descriptions/
200 /how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples/
200 /how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance/
200 /list-of-non-visual-drawing-tools/
200 /the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business/
200 /what-is-the-definition-of-a-map/
```

## Note
Posts still live in `content/blog/` and still appear in the blog listing at `/blog/`. The `url` frontmatter only overrides where the individual post page renders. This preserves both the blog section listing and the original WordPress URLs.

## Commit
`c793da8` — Fix blog post 404s by adding url frontmatter for WordPress URL parity
