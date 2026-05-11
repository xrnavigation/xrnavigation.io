# Blog Index CSS Parity — 2026-04-08

## GOAL
Reduce blog-index pixel diff (desktop 33.3%, mobile 29.3%) toward 0%.

## DONE
- Added `wp-blog-index` body class via `baseof.html` ($isBlogIndex variable)
- Added `blog-heading-section` and `blog-post-grid-section` classes to `layouts/blog/list.html`
- Changed post grid inline padding from `2rem 0` to `0 0 192px 0` in template
- Added desktop CSS: root containers get `max-width:1920px; display:flex; flex-direction:row; gap:20px`
- Added hero innerWrapper: `display:flex; justify-content:center; align-items:center; gap:20px; text-align:start`
- Added post grid innerWrapper: `flex-direction:column; justify-content:center; align-items:center; gap:20px`
- Added post grid heading: `padding:4px; margin-bottom:0; line-height:26px`
- Added mobile rules for heading section (font-size 36px, weight 700, line-height 46px)
- Added mobile post grid: width 375px, padding 0/10px, margin-bottom 38px, innerWrapper max-width 90%
- Fixed mobile root containers: 0 margins (not -20px), font-size 15px, line-height 23px

## OBSERVATIONS (from comparison runs)
- Desktop run 1 baseline: hero 16.3%, heading 4.9%, grid 45.5%
- Desktop run 2 (after first CSS batch): hero 16.3%, heading 4.5%, grid 46.6%
- Key remaining desktop diffs: heading.width computed mismatch, firstParagraph margins, post grid heading padding/margin not applying yet
- The `flex-direction: column` was wrong — WP uses `row` on root containers
- `font-size: 15px` on desktop root was wrong — WP inherits 16px on desktop, only 15px on mobile
- Mobile run 2: hero 28.1% (worse — margins fixed but layout shifted), heading 20.0%, grid 66.8%
- Mobile containers still show `flex-direction: row → column` — the mobile override needs row too
- `innerWrapper.margin-right/left: 0px → 28px` on mobile hero — existing CSS adds margins

## CURRENT STATE
- Just fixed mobile root container to use 0 margins instead of -20px
- Need to verify and iterate — haven't run comparison after latest fixes
- Existing blog CSS at lines 853-1205 may conflict with new wp-blog-index scoped rules

## FILES
- `themes/xrnav/layouts/_default/baseof.html` — added $isBlogIndex, wp-blog-index body class
- `themes/xrnav/layouts/blog/list.html` — added section classes, fixed inline padding
- `themes/xrnav/static/css/wordpress-compat.css` — new blog-index CSS block after line 1207
- `tests/chunk-comparison.spec.ts` — temporarily expanded style diff display (reverted)
