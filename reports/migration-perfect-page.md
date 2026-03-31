# Perfect Page: Aquarium Map Description

**Page:** /fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific/
**Date:** 2026-03-30
**Result:** 0.90% visual diff (target was <1%)

## Starting State

Previous agent got the diff from 4.81% to 3.89% with partial CSS fixes (committed as WIP in 2c0837f). When I picked up, the measured diff was 4.65%.

## Root Causes Found and Fixed

### 1. Heading color mismatch (color-1 vs color-2)
- WP Astra theme uses `--ast-global-color-2` (#5a7969, muted green) for all headings
- Hugo was using `--ast-global-color-1` (#04203e, dark blue)
- Fix: Changed `h1-h6` color in main.css

### 2. Link color and decoration
- WP links: #0054ad blue with underline
- Hugo links: #5a7969 green with no underline (due to `a:where(:not(.wp-element-button))` rule)
- Fix: Set link color to #0054ad, removed the text-decoration stripping rule

### 3. Body letter-spacing (THE BIG ONE)
- WP Astra sets `letter-spacing: 0.3px` on the body, inherited by all text
- Hugo had no letter-spacing (normal = 0px)
- This caused 11 paragraphs to wrap to one fewer line each, creating 277px cumulative height drift
- Fix: Added `letter-spacing: 0.3px` to `body.ast-hfb-header`
- This single fix brought diff from ~5% to ~1.2%

### 4. Article padding-top
- WP: 0px, Hugo: 32px
- Fix: Set `.ast-article-single` padding-top to 0

### 5. UL/OL padding and margins
- TOC list: WP wraps in `.wp-block-group` with 48px padding; Hugo applies 48px padding directly
- Non-TOC lists: WP uses browser default padding-left (40px) + margin 16px auto
- Hugo was applying 48px padding to ALL lists uniformly
- Fix: Split rules so headings get 48px padding, regular lists get 40px padding-left + 16px margin-top/bottom, TOC list keeps 48px

### 6. quick-diff.js script fix
- pixelmatch v7 requires same-size buffers; baseline and current screenshots can differ in height
- Fix: Expand both images to max(width, height) canvas with white fill before diffing
- Also outputs a diff image for visual inspection

## Remaining Diff Sources (0.90%)

- **Header (~0.3%):** Hugo has theme-switcher buttons (Default/Dark/High Contrast) that WP does not
- **Footer (~0.3%):** Hugo footer is 33px shorter due to different link counts in footer columns
- **Content (~0.3%):** Sub-pixel rounding from 25.6px margin-bottom accumulates over 224 elements

## Files Changed

- `themes/xrnav/static/css/main.css` - heading color, link color
- `themes/xrnav/static/css/wordpress-compat.css` - letter-spacing, article padding, UL/OL rules (partially from prior agent)
- `tests/quick-diff.js` - image size handling, diff output

## Method

Used Chrome MCP tools to extract computed styles from both the live WP page and the Hugo dev server. Compared element-by-element heights (all 224 direct children of `.entry-content`) and found exact CSS property mismatches via JavaScript evaluation in both tabs.
