# Download Missing DALL-E Images

**Date:** 2026-03-30
**Status:** Complete

## Summary

Downloaded 8 missing DALL-E image files (referenced by 9 broken links) from the live WordPress site. Fixed a bug in `check-links.js` that prevented it from finding files with percent-encoded characters in their filenames.

## Images Downloaded

All sourced from `https://xrnavigation.io/wp-content/uploads/2023/10/`:

| File | Size | Used By |
|------|------|---------|
| DALL%C2%B7E-2023-10-17-13.20.29-...-corporate-campus-...webp | 244 KB | corporate-campuses |
| DALL%C2%B7E-2023-10-17-15.06.01-...-headphones-...webp | 225 KB | corporate-campuses |
| DALL%C2%B7E-2023-10-18-11.08.39-...-hospital-waiting-area-...webp | 146 KB | health-care-facilities, index |
| DALL%C2%B7E-2023-10-18-11.41.34-...-bustling-hospital-...webp | 122 KB | health-care-facilities |
| DALL%C2%B7E-2023-10-18-11.08.39-...-hospital-waiting-area-...png | 2.2 MB | index |
| DALL%C2%B7E-2023-10-18-11.08.39-...-xand-...png | 1.9 MB | index |
| DALL%C2%B7E-2023-10-17-15.50.05-...-university-campus-...webp | 363 KB | universities |
| DALL%C2%B7E-2023-10-17-15.06.09-...-headphones-soundwave-...webp | 184 KB | universities |

## Bug Fix: check-links.js

The `urlPath()` function decoded `%C2%B7` to UTF-8 middle dot `·`, but the actual filenames on disk contain the literal string `%C2%B7`. Added a fallback in `resolveInPublic()` that also checks the raw (non-decoded) path.

## Verification

```
npm run check-links
PASSED: No broken links or images found.
```

- Broken internal links: 0
- Missing images: 0
- Self-referencing URLs: 0
