# Blog Pagination & Collection Pages Fix
## 2026-03-30

**GOAL:** Fix blog pagination (Problem 1) and collection page card grids (Problem 2).

**OBSERVATIONS:**
1. Blog list template used `range .Pages` instead of `.Paginate .Pages` — pagination was broken despite `paginate = 10` in hugo.toml. Fixed.
2. WP live site (WordPress 6.9) collection pages have: hero section, 2 info-box sections (flexbox row: image + text), feature cards section (4 cards in flex row), CTA section with buttons.
3. Hugo collection pages (universities, health-care-facilities, corporate-campuses) rendered flat markdown through `_default/single.html`.
4. Created `themes/xrnav/layouts/page/collection.html` with structured layout.
5. Restructured all 3 content files with frontmatter data + `layout: "collection"`.
6. Added pagination CSS and collection page CSS to wordpress-compat.css.

**BLOCKER:** Hugo template metrics show `collection.html` is NOT being picked up — all pages go through `single.html` (77 count). The layout lookup for root content files with `layout: collection` in the theme's `layouts/page/` directory may not be resolving. Need to check Hugo layout lookup order for theme templates.

**FILES:**
- `themes/xrnav/layouts/blog/list.html` — fixed pagination
- `themes/xrnav/layouts/page/collection.html` — new collection layout (NOT being used yet)
- `themes/xrnav/static/css/wordpress-compat.css` — added pagination + collection CSS
- `content/universities.md` — restructured with frontmatter data
- `content/health-care-facilities.md` — restructured with frontmatter data
- `content/corporate-campuses.md` — restructured with frontmatter data

**UPDATE 2:** Template lookup fixed — moved `collection.html` from `themes/xrnav/layouts/page/` to `themes/xrnav/layouts/_default/`. Hugo now uses it for all 3 collection pages (confirmed via `--templateMetrics`). Output verified: `collection-page`, `info-box-section`, `feature-cards`, `extra-content` classes all present in rendered HTML. Blog pagination confirmed: 10 posts on page 1, page 2 exists. Image alt text falls back to section heading (better than WP's filename-based alt). `page/` dir still has `audiom-embed.html` so not empty.

**UPDATE 3:** CSS changes (pagination + collection styles) were already in HEAD commit 25d32f5 from previous agent work. My CSS edit was a no-op. Actual uncommitted changes:
- `themes/xrnav/layouts/blog/list.html` — `.Paginate` fix (modified, tracked)
- `themes/xrnav/layouts/_default/collection.html` — new template (untracked)
- `content/universities.md`, `content/health-care-facilities.md`, `content/corporate-campuses.md` — restructured frontmatter (modified, tracked)
- Notes files (untracked)

**NEXT:** Commit blog pagination fix, commit collection page fixes, write report.
