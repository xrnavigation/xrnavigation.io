# Fix: Mobile CSS Width Regression (550px -> 375px)

**Date:** 2026-03-30

## Problem

All 89 mobile screenshots rendered at 550px width instead of the expected 375px viewport width. Confirmed via `tests/comparison-results.json` -- every mobile `currentWidth` was 550.

## Root Cause

CSS specificity bug in the footer grid. Two competing rules:

1. **Line 913** (no media query): `.site-primary-footer-wrap.ast-builder-grid-row-4-equal .ast-builder-grid-row` sets `grid-template-columns: repeat(4, 1fr)` -- specificity `0,3,0`.
2. **Line 1152** (inside `@media max-width: 544px`): `.site-primary-footer-wrap .ast-builder-grid-row` sets `grid-template-columns: 1fr` -- specificity `0,2,0`.

The responsive override lost the specificity battle. The 4-column footer grid never collapsed, forcing all 4 footer widget columns (nav links, resources, contact form) into a 375px-wide container. The contact form in column 4 extended to x=550, setting `document.scrollWidth` to 550 on every page.

## Fix

**File:** `themes/xrnav/static/css/wordpress-compat.css`

Added the `.ast-builder-grid-row-4-equal` compound selector to both footer responsive media queries so they match or exceed the base rule's specificity:

- `@media (max-width: 921px)`: now includes `.site-primary-footer-wrap.ast-builder-grid-row-4-equal .ast-builder-grid-row` collapsing to `repeat(2, 1fr)`
- `@media (max-width: 544px)`: now includes `.site-primary-footer-wrap.ast-builder-grid-row-4-equal .ast-builder-grid-row` collapsing to `1fr`

**File:** `themes/xrnav/static/css/main.css`

Added `overflow-x: hidden` to `body` as a safety net against future horizontal overflow.

## Verification

Playwright headless Chromium at 375x812 viewport:

| Page | scrollWidth |
|---|---|
| `/` | 375 |
| `/blog/` | 375 |
| `/about/` | 375 |
| `/contact/` | 375 |
| `/health-care-facilities/` | 375 |

All pages now render at exactly 375px width.

## Blog Pagination Status

Confirmed working: `/blog/` shows 10 posts with pagination controls. The `.Paginate` call in `themes/xrnav/layouts/blog/list.html` is correct.

## Commit

`c2f71ad` Fix mobile width regression: footer grid specificity override
