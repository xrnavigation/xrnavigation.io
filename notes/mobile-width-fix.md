# Mobile Width Fix Investigation

## 2026-03-30

**GOAL:** Fix mobile CSS width regression — screenshots supposedly rendering at 550px instead of 375px.

**OBSERVED SO FAR:**
- Comparison report shows Hugo mobile screenshots ARE 375px wide (e.g. `375x15087`, `375x1953`). The Playwright viewport is set correctly.
- No `min-width` on body, `#page`, or `.ast-container` in CSS.
- Grid columns collapse properly via media queries at 544px and 921px breakpoints.
- Homepage inline styles use `max-width: 70%` and `max-width: 80%` which are relative, not fixed.
- Blog pagination uses `.Paginate` correctly.
- The only min-widths found are 24px on able-player buttons and 40px/200px on minor elements.
- Chrome browser can't resize below 1920px on Q's monitor, so live testing at 375px not possible via MCP.

**ROOT CAUSE FOUND:** Footer grid specificity bug. The `.site-primary-footer-wrap.ast-builder-grid-row-4-equal .ast-builder-grid-row` selector (line 913) sets `grid-template-columns: repeat(4, 1fr)` and has higher specificity than the responsive overrides at `max-width: 921px` and `max-width: 544px` which use `.site-primary-footer-wrap .ast-builder-grid-row`. The 4-column footer grid never collapses, pushing document scrollWidth to 550px on all pages.

**FIX APPLIED:** Added `.ast-builder-grid-row-4-equal` compound selector to both media query rules in wordpress-compat.css so they match the specificity. 921px breakpoint now collapses to 2 columns, 544px to 1 column.

**FIX VERIFIED:** All 5 test pages render at exactly 375px scrollWidth. Blog pagination confirmed working (10 posts + controls). Report written. Ready to commit.
