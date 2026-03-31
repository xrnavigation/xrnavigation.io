# Migration Fix: Blog Pagination & Collection Page Card Grids

## Problem 1: Blog Pagination (90% diff)

**Root cause:** Blog list template used `range .Pages` which rendered all posts on a single page. Despite `paginate = 10` being set in `hugo.toml`, the template never called `.Paginate`.

**Fix:** Changed `range .Pages` to `range ($paginator := .Paginate .Pages)` in `themes/xrnav/layouts/blog/list.html`. Hugo's built-in `_internal/pagination.html` was already included but had nothing to paginate.

**Result:** Blog page 1 now shows 10 posts. Page 2 exists at `/blog/page/2/`. Pagination navigation renders at bottom.

**Commit:** 6fb7d96

## Problem 2: Collection Pages Missing Card Grids (80-86% diff)

**Pages:** `/universities/`, `/health-care-facilities/`, `/corporate-campuses/`

**Root cause:** All three pages rendered through `_default/single.html` which dumps `.Content` as flat HTML. The content was plain markdown (headings, paragraphs, images, links) with no structural layout.

**WP site structure (observed via Chrome MCP tools):**
- Hero section: centered h1 + intro paragraph
- 2 info-box sections: flexbox row with image on one side, text + CTA button on other (alternating sides)
- Feature cards section: flex row of 4 cards (Inclusivity, Belonging/Comfort, Compliance, Reputation) on light gray background
- CTA section: centered heading + text + buttons
- Some pages have extra content sections (Healthcare has "Accessible Map Features", Corporate has "Join the Movement")

**Fix:**
1. Created `themes/xrnav/layouts/_default/collection.html` — a frontmatter-driven template that renders hero, info-box sections (alternating image/text layout), feature cards, extra content sections, and CTA sections.
2. Restructured all 3 content files: moved body content into frontmatter fields (`hero_text`, `sections[]` with heading/paragraphs/cta/image, `features[]` with title/text, `extra_sections[]`, `cta` with heading/text/buttons).
3. Added `layout: "collection"` to frontmatter.

**CSS:** Pagination and collection page styles were already committed in 25d32f5 by the header/footer fix agent (the CSS file included these styles as part of a larger update).

**Result:** All three collection pages render with:
- Structured info-box sections with image + text in flexbox rows
- Feature card grids
- CTA sections with styled buttons
- Responsive breakpoints: column layout on tablet, single-column cards on mobile

**Commit:** ce0f579

## Files Changed

| File | Change |
|------|--------|
| `themes/xrnav/layouts/blog/list.html` | Use `.Paginate` for pagination |
| `themes/xrnav/layouts/_default/collection.html` | New collection page layout |
| `content/universities.md` | Restructured with frontmatter data |
| `content/health-care-facilities.md` | Restructured with frontmatter data |
| `content/corporate-campuses.md` | Restructured with frontmatter data |
| `themes/xrnav/static/css/wordpress-compat.css` | Already had pagination + collection CSS (no change needed) |

## Template Lookup Note

Initially placed collection template at `themes/xrnav/layouts/page/collection.html` — Hugo did not resolve it. Moved to `themes/xrnav/layouts/_default/collection.html` and it resolved correctly for root-level content files with `layout: "collection"` in frontmatter.
