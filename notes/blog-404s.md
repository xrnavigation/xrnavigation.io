# Blog 404s Fix

## 2026-03-30

**Problem:** 11 blog posts in `content/blog/` 404 because Hugo renders them at `/blog/{slug}/` (per `[permalinks] blog = "/blog/:slug/"` in hugo.toml) but WordPress served them at `/{slug}/` (root level).

**Observed:** All 11 files exist in `content/blog/`. Frontmatter has `slug` but no `url` override. Hugo config confirms `/blog/:slug/` permalink pattern.

**Fix:** Added `url: /{slug}/` to each post's frontmatter so Hugo serves them at root-level URLs matching WordPress.

**Status:** DONE. All 11 posts verified via hugo build (public/{slug}/index.html exists) and hugo server (curl returns HTTP 200). Commit c793da8.
