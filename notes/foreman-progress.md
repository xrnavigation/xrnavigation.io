# Foreman Progress — Migration Prep
Date: 2026-03-30

## STATUS: 5 of 6 agents complete. Waiting on run-baseline (screenshots).

## COMPLETED AGENTS

### 1. Playwright baseline (test suite) — DONE, VERIFIED
- Commit: 44a9c52
- Test suite created, fetches URLs from sitemaps, screenshots desktop+mobile.

### 2. WP content export — DONE, VERIFIED
- Commits: 44a9c52, 1b1d8af
- 79 pages + 11 posts = 90 Markdown files. 52 audiom embed pages detected.
- Follow-up: delete content/blog.md, rewrite image URLs, homepage template work.

### 3. Media download — DONE, VERIFIED
- Commits: b3ccd4b, c76ae21
- 189 files, 396MB. Zero failures. Manifest at static/images/manifest.json.

### 4. Hugo scaffold — DONE, VERIFIED
- Commits: 2b16d83, 76d0ee5
- Full theme: 12 layouts, 2 CSS, 2 JS. Builds clean, 98 pages.
- A11y done right: aria-current server-side, decorative blog images, single form, data-theme switching.

### 5. Redirects/forms/CSS — DONE, VERIFIED
- Commits: aa10e54, 63c58c7
- 12 redirects (all 301), both forms documented (identical: name/email/message).
- Only "Interactive Focus Styles" had real CSS (outline-color #d01754, :focus-visible rules). CH 80 and Custom_Astra_JS were empty.
- Focus styles need merging into Hugo theme CSS.

## RUNNING AGENTS

### 6. run-baseline — STILL RUNNING
- Actually capturing Playwright screenshots against live site. Takes several minutes.

## INTEGRATION TASKS (after run-baseline completes)
1. Check git log — multiple agents committed, need to verify no conflicts/overwrites
2. Delete content/blog.md (conflicts with content/blog/ directory)
3. Image URL rewriting pass: WP URLs → local paths using manifest.json
4. Merge focus styles (data/custom-css-focus-styles.css) into themes/xrnav/static/css/main.css
5. Homepage template — exported markdown has raw Spectra HTML, needs Hugo partials
6. Able Player setup on homepage
7. hugo server → verify it builds and serves
8. Run Playwright comparison: Hugo screenshots vs WordPress baseline
9. Iterate until screenshots match
