# Migration Link Audit Report

Date: 2026-03-30

## Summary

Automated link checker (`npm run check-links`) found and fixed broken internal links across the Hugo site. Remaining issues are 9 missing DALL-E generated images that need to be downloaded from the WordPress site or regenerated.

## Fixed Issues

### Broken Internal Links (2 fixed)

| Source | Broken URL | Fixed To |
|--------|-----------|----------|
| `content/blog/how-to-make-detailed-map-text-descriptions.md` | `/home` | `/` |
| `content/blog/how-to-make-detailed-map-text-descriptions.md` | `/home` | `/` |

### Self-Referencing External URLs (25 fixed)

Converted `https://xrnavigation.io/path` to `/path` in 12 content files:

- `content/accessibility-statement.md` - 1 link + fixed mangled mailto + google redirect wrappers
- `content/blog/digital-map-tool-accessibility-comparison.md` - 1 link
- `content/blog/five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat.md` - 1 link
- `content/blog/how-to-convert-from-a-pdf-map-to-a-vector-data-map.md` - 1 link
- `content/blog/how-to-convert-from-pdf-to-geojson-using-qgis.md` - 3 links
- `content/blog/how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance.md` - 1 link
- `content/events.md` - 1 link
- `content/gallery.md` - 8 links
- `content/implementation.md` - 3 links
- `content/map-evaluation-tool.md` - 3 links (including 1 HTML href)
- `content/sonification-awards-2024-application.md` - 2 links
- `content/this-is-a-covid-statistic-map-showing-total-cases-over-washington-oregan-and-idaho.md` - 1 link

### Other Fixes in accessibility-statement.md

- Fixed mangled mailto link: `mailto:support@xrnavigation.iosupport@xrnavigation.io` -> `mailto:support@xrnavigation.io`
- Replaced Google redirect wrapper URLs with direct relative links
- Fixed display text links to use descriptive text instead of raw URLs

## Remaining Issues

### Missing DALL-E Images (9)

These DALL-E generated images are referenced in content but do not exist in `static/images/`. They need to be downloaded from the live WordPress site at `https://xrnavigation.io/wp-content/uploads/2023/10/` or regenerated.

**Unique images (7 distinct files):**

1. `DALL-E-2023-10-18-11.08.39-Close-up-perspective-inside-a-hospital-waiting-area_...png`
   - Used in: `content/_index.md` (homepage)
2. `DALL-E-2023-10-18-11.08.39-Close-up-perspective-inside-a-hospital-waiting-area_...xand-...png` (note the typo "xand")
   - Used in: `content/_index.md` (homepage)
3. `DALL-E-2023-10-18-11.08.39-Close-up-perspective-inside-a-hospital-waiting-area_...webp`
   - Used in: `content/_index.md`, `content/health-care-facilities.md`
4. `DALL-E-2023-10-17-13.20.29-Photo-taken-from-a-high-angle-of-a-Silicon-Valley-esque-corporate-campus...webp`
   - Used in: `content/corporate-campuses.md`
5. `DALL-E-2023-10-17-15.06.01-Expansive-shot-of-a-person-with-headphones...webp`
   - Used in: `content/corporate-campuses.md`
6. `DALL-E-2023-10-18-11.41.34-Photorealistic-image-inside-a-bustling-hospital...webp`
   - Used in: `content/health-care-facilities.md`
7. `DALL-E-2023-10-17-15.50.05-A-composite-image...university-campus...webp`
   - Used in: `content/universities.md`
8. `DALL-E-2023-10-17-15.06.09-Wide-shot-capturing-a-person-with-headphones...corporate-campus...webp`
   - Used in: `content/universities.md`

### External wp-content References (not broken)

18 references to `icad.org/wp-content/uploads/...` are legitimate external links to conference papers. These are NOT self-hosted wp-content URLs and do not need migration.

## CI Gate

The link checker is available as `npm run check-links`. It:
1. Builds the Hugo site (`hugo`)
2. Crawls all HTML files in `public/`
3. Extracts all `<a href>` and `<img src>` values
4. Checks internal links resolve to files in `public/`
5. Skips Hugo alias redirect pages
6. Reports broken links, missing images, and self-referencing external URLs
7. Writes detailed JSON to `data/broken-links.json`
8. Exits non-zero if any broken links or missing images are found

Currently exits 1 due to 9 missing DALL-E images. Will pass once images are added to `static/images/`.
