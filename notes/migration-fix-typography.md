# Migration Fix Typography

## 2026-03-30

### Goal
Fix typography and spacing in wordpress-compat.css to match WP site exactly, eliminating 5-15% page height mismatches.

### Observations So Far

**Current state of wordpress-compat.css:**
- Has correct heading sizes (h1:40px/800/56px, h2:40px/700/50px, h3:24px/600/31.2px)
- Has correct heading margins (h1:20px, h2:20px, h3:16px)
- Body typography correct (Lato 16px, line-height 25.6px, color #000)
- Missing: margin-top:0 on headings in wordpress-compat (only in main.css)

**main.css:**
- Has base h1-h3 rules with margin-top:0 — good
- p: margin-top:0, margin-bottom:25.6px — matches standard pages but NOT homepage (should be 16px on homepage)
- No homepage-specific p margin rule

**Key gaps identified from WP CSS:**
1. **WP block gap**: `--wp--style--block-gap: 24px` — WP applies `margin-block-start: 24px` to `.is-layout-flow > *` and `.is-layout-constrained > *` with first-child:0. This is a critical spacing rhythm we're missing.
2. **Homepage p margin**: Should be 16px margin-bottom, not 25.6px
3. **`body p, body li` max-width: 80ch`** from inline-wp-custom-css.css — WP has this with !important
4. **List items**: `body li { max-width: 80ch }` from WP custom CSS
5. **Blockquote, figure/figcaption**: No rules at all in current CSS
6. **WP layout classes**: `.is-layout-flow`, `.is-layout-constrained`, `.is-layout-flex`, `.is-layout-grid` — missing entirely
7. **WP preset spacing vars**: `--wp--preset--spacing--20` through `--wp--preset--spacing--80` — missing
8. **Border color utility classes**: Missing from wordpress-compat.css

### Done So Far
- Added WP spacing preset vars (--wp--preset--spacing--20 through --80)
- Added WP font-size preset vars
- Added --ast-body-line-height var
- Added .is-layout-flow, .is-layout-constrained, .is-layout-flex, .is-layout-grid with block-gap rhythm (24px margin-block-start)
- Added font-size utility classes (.has-small-font-size, etc)
- Added text-align utility classes
- Added border-color utility classes for all 9 Astra colors
- Added h4-h6 for both .wp-block-heading and .uagb-heading-text
- Added entry-content heading margin rule (margin-bottom: 20px)
- Added entry-content paragraph rules (25.6px standard, 16px homepage)
- Added entry-content li>p margin-bottom:0, ul/ol revert, last-child margin:0
- Added figure/figcaption, buttons block spacing, columns margin:0
- Added blockquote styling (Astra: border-left, padding, italic, margins)
- Added pullquote decorative quote mark
- Added body p/li max-width:80ch (from WP custom CSS)
- Added p.has-background and heading .has-background padding rules

### Still Need
- Update main.css h4-h6 base rules
- Add responsive h4-h6 font sizes to media query
- Hugo build verification
- Commit
