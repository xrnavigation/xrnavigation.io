# Fix Relative Links for Subpath Deployment

## Problem

All internal links in Hugo templates used leading-slash paths (e.g. `/universities/`, `/images/logo.webp`). Hugo's `relURL` function treats paths starting with `/` as already root-relative and does **not** prepend the base path. This means deploying the site at a subpath like `https://example.com/audiom/` would produce broken links pointing to `/universities/` instead of `/audiom/universities/`.

## Root Cause

Hugo's `relURL` behavior:
- `"css/main.css" | relURL` with baseURL `/audiom/` produces `/audiom/css/main.css` (correct)
- `"/contact/" | relURL` with baseURL `/audiom/` produces `/contact/` (unchanged -- Hugo considers leading-slash paths already absolute)

Frontmatter values in `_index.md` and collection pages all start with `/`, so `| relURL` alone was insufficient.

## Fix Applied

### Pattern: `strings.TrimLeft "/" | relURL`

Strip the leading `/` before passing to `relURL`. This makes Hugo treat the path as relative and prepend the base path. External URLs (`https://...`) are unaffected since they don't start with `/`.

### Files Modified

**Root layout (active homepage template):**
- `layouts/index.html` -- 10 frontmatter URL/src/image references fixed, plus `data-root-path` for Able Player, plus `replaceRE` post-processing for `markdownify` output containing markdown links

**Theme layouts:**
- `themes/xrnav/layouts/index.html` -- 10 references (cta_url, src, image, link_url)
- `themes/xrnav/layouts/_default/collection.html` -- 6 references (hero_image, section images, CTA urls)
- `themes/xrnav/layouts/blog/single.html` -- 1 reference (featured_image)
- `themes/xrnav/layouts/blog/list.html` -- 2 references (hero_image, featured_image)
- `themes/xrnav/layouts/partials/header.html` -- 2 references (home logo links: `"/" | relURL` changed to `"" | relURL`)
- `themes/xrnav/layouts/404.html` -- 1 reference (home link)

**Already correct (no changes needed):**
- `themes/xrnav/layouts/partials/head.html` -- static assets already used no-leading-slash pattern
- `themes/xrnav/layouts/_default/baseof.html` -- JS assets already correct
- `themes/xrnav/layouts/partials/footer.html` -- menu `.URL` and static assets already correct
- Hugo menu system (`.URL` in header/footer) -- Hugo relativizes menu URLs automatically

### Known Limitations

Raw HTML inside markdown content files cannot use `relURL` (Hugo does not process template functions or shortcodes inside HTML blocks):

- `content/map-evaluation-tool.md` line 17: CSS `background-image: url('/images/map-eval-hero.webp')`
- `content/map-evaluation-tool.md` line 26: `<a href="/">` in raw HTML paragraph

These would need to be converted to a dedicated template (like the collection layout) to support subpath deployment.

## Verification

Built with `hugo --baseURL "https://example.com/audiom/"` and confirmed:
- All template-driven `href` attributes include `/audiom/` prefix
- All template-driven `src` attributes include `/audiom/` prefix
- All menu links include `/audiom/` prefix
- External links (`https://...`) are unchanged
- Root baseURL deployment (`https://xrnavigation.io/`) continues to work correctly
