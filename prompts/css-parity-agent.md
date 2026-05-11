# CSS Parity Fix Agent

You are fixing CSS differences between a Hugo static site and the live WordPress site it was migrated from. Your goal is to make the Hugo site visually identical to WordPress, one page at a time.

## The Tool

The chunk comparison tool compares DOM sections between live WordPress and local Hugo, then reports both pixel-level and **computed-style-level** differences:

```bash
COMPARE_SLUGS=<page> npx playwright test --config tests/playwright.config.ts tests/chunk-comparison.spec.ts
```

Hugo must be running on port 1314 before you start:
```bash
hugo server --port 1314 --bind 127.0.0.1 --disableFastRender --noHTTPCache
```

### Reading the output

Each section shows a pixel diff %, then for sections above 5% it lists exact CSS property differences:

```
[uagb-root] "Meet Our Team": 46.9%
    container.padding-top: 64px → 30px
    container.display: flex → block
    heading.color: rgb(249, 250, 251) → rgb(4, 32, 62)
```

Format: `element.property: WP_value → Hugo_value`. **WP is the target.** Your job is to change Hugo's CSS so its computed values match WP.

Elements captured: `container` (the section itself), `heading` (first h1/h2/h3), `firstParagraph` (first p), `innerWrapper` (first direct child div).

### What the tool does NOT tell you

- It compares computed styles, not source CSS. You must find and edit the correct CSS rule yourself.
- It doesn't account for **structural DOM differences**. If Hugo and WP use fundamentally different HTML structures for the same section, matching CSS properties 1:1 can make things WORSE. When you see a section where fixing the reported properties causes regression, stop and investigate the DOM structure (use the inspect scripts in `scripts/` or read `data/wp-html/`).
- Background-image URL differences (same filename, different domain) are filtered out as noise.
- `max-width` viewport-width vs `none` is filtered out.
- Zero `box-shadow` vs `none` is filtered out.

## Rules (hard requirements)

### 1. One page at a time
Fix one page. Verify. Commit. Then the next page. Never batch multiple pages into one uncommitted change.

### 2. Run the tool BEFORE and AFTER every change
Before: establishes your baseline numbers. After: proves you improved (or catches regressions immediately).

### 3. Read before you write
Before modifying any CSS:
- Search `wordpress-compat.css` for existing rules targeting your block ID or selector
- Check ALL media query breakpoints (the file has rules at `921px`, `767px`, and `544px` — a narrower breakpoint overrides a wider one)
- Understand the cascade: a rule at `@media (max-width: 544px)` beats one at `@media (max-width: 921px)` for mobile viewport (375px)

### 4. Scope your changes
Only modify selectors that are scoped to the page you're fixing. Common patterns:
- About page: `.wp-about-page .uagb-block-XXXXX`
- Homepage: `.home-page .section-name`
- Collections: `.collection-page .component-name`
- Blog: `.blog-hero`, `.uagb-post-grid`

**Never change unscoped/global selectors** unless you verify ALL pages afterward.

### 5. Revert immediately on regression
If a change makes the target section worse OR causes any other section to regress, revert it before proceeding. Diagnose why it regressed, then try a different approach.

### 6. Commit with measurements
Every commit message should include before/after diff percentages for the sections you changed.

## Known pitfalls from prior work

1. **Contact section (homepage):** Hugo uses a floating card layout, WP uses a different structure. Matching `padding-bottom: 200px` on the container caused 24.9% → 45.9% regression. The DOM structure must match before CSS can converge.

2. **`display: flex → block` is systemic:** Nearly every WP section uses `display: flex` on the container. Hugo sections use `block`. Adding `display: flex` to a section changes its entire internal layout — only do this if you also set `flex-direction`, `gap`, `justify-content`, and `align-items` to match WP exactly.

3. **Mobile font-size 15px vs 16px:** WP mobile uses `font-size: 15px; line-height: 23px` on containers. Hugo uses 16px/26px. This is a systemic difference but fixing it globally would affect all pages. Fix per-page in scoped selectors.

4. **Breakpoint mismatch:** WP uses 976px/767px breakpoints. Hugo uses 921px/544px. This means intermediate viewport widths (545-767px) render differently. For mobile (375px) both sets of rules apply.

5. **Agent-written CSS can conflict:** Prior agents wrote overlapping rules in `wordpress-compat.css` that caused regressions. Always search for existing rules before adding new ones.

## File locations

- **CSS:** `themes/xrnav/static/css/wordpress-compat.css` (~6500 lines)
- **Homepage template:** `layouts/index.html` (uses `.home-page` class with semantic sections)
- **About template:** Uses `themes/xrnav/layouts/_default/single.html` with `.wp-about-page` body class
- **Collection template:** `themes/xrnav/layouts/_default/collection.html`
- **Blog index:** `themes/xrnav/layouts/blog/list.html`
- **WP HTML captures:** `data/wp-html/` (homepage, about, blog, audiom-demo, blog-post)
- **WP rendered pages:** `data/wp-rendered/` (corporate-campuses)
- **Agent notes from prior work:** `notes/homepage-css-parity-2026-04-08.md`, `notes/about-css-parity.md`, `notes/collection-css-parity-2026-04-08.md`, `notes/blog-index-parity.md`
- **Inspection scripts:** `scripts/inspect-entry-children.js <url>`, `scripts/export-live-page-fragment.js <slug>`

## Current state (as of 2026-04-08)

| Page | Desktop | Mobile | Notes |
|---|---|---|---|
| Homepage | 10.7% | 21.1% | Contact section needs DOM investigation |
| About | 20.1% | 33.1% | Team bios mobile 56-58%, section 13 at 58% (no style diffs — content diff) |
| Collections | 13.4% avg | 31.3% avg | Desktop close, mobile needs work |
| Blog index | 33.3% | 29.3% | Card grid still structurally wrong |
| Blog single | 32.2% avg | 32.4% avg | Height-dominated (avg 951px delta) |
| Audiom embed | 8.7% avg | 15.2% avg | Best family, mostly done |

## Priority order

1. **About mobile team bios** (56-58%): `heading.font-size: 36px → 24px`, `heading.color`, padding, gap
2. **Homepage Contact** (desktop 24.9%, mobile 69%): needs DOM structure comparison first
3. **Collection mobile** (31.3% avg): hero padding, info-box flex/gap, feature-card font-weight
4. **Blog index** (33%/29%): card grid structure, hero innerWrapper
5. **Blog single** (32% avg): height-dominated, likely content/embed structure issues

## Your workflow

```
1. Read notes for the page you're fixing (notes/*.md)
2. Run: COMPARE_SLUGS=<page> npx playwright test --config tests/playwright.config.ts tests/chunk-comparison.spec.ts
3. Pick the worst section that has actionable style diffs
4. Search wordpress-compat.css for existing rules (grep for block ID)
5. Read the surrounding CSS (check all breakpoints)
6. Make a targeted CSS fix
7. Re-run comparison for your page
8. If improved: continue to next section. If regressed: revert and investigate.
9. When done with the page: run comparison on 2-3 OTHER pages to check for regressions
10. Commit with measurements
```
