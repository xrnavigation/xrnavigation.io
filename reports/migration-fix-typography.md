# Migration: Fix Typography and Spacing

**Date:** 2026-03-30
**Status:** Complete

## Summary

Updated `themes/xrnav/static/css/wordpress-compat.css` and `themes/xrnav/static/css/main.css` to match WordPress Astra + UAGB typography and spacing values extracted from the live site CSS.

## Changes Made

### wordpress-compat.css (193 lines added)

**New CSS custom properties:**
- WP spacing presets (`--wp--preset--spacing--20` through `--80`)
- WP font-size presets (`--small`, `--medium`, `--large`, `--x-large`, `--normal`, `--huge`)
- `--ast-body-line-height: 1.6em`

**WP layout flow/constrained classes:**
- `.is-layout-flow > *` — 24px `margin-block-start` with first/last-child reset
- `.is-layout-constrained > *` — same rhythm
- `.is-layout-flex`, `.is-layout-grid` — 24px gap, flex-wrap
- Alignment helpers (`.alignleft`, `.alignright`, `.aligncenter`)

**Utility classes:**
- Font-size: `.has-small-font-size` through `.has-huge-font-size`
- Text alignment: `.has-text-align-center/left/right`
- Border colors: `.has-ast-global-color-{0-8}-border-color`

**Typography — h4, h5, h6 (previously missing):**
- Added for `.wp-block-heading`, `.uagb-heading-text` selectors
- Responsive sizes at <=921px breakpoint

**Entry-content spacing (Astra rhythm):**
- `.entry-content :where(h1-h6)` — margin-bottom: 20px
- `.entry-content p` — margin-bottom: 25.6px (standard pages)
- `.home-page .entry-content p` — margin-bottom: 16px, line-height: 24px (homepage)
- `.entry-content li > p` — margin-bottom: 0
- `.entry-content ul, ol` — padding/margin: revert
- `.entry-content > :last-child` — margin-bottom: 0
- `.entry-content[data-ast-blocks-layout] > figure` — margin-bottom: 1em
- `.entry-content > .wp-block-buttons` — margin-bottom: 1.5em
- `.entry-content .wp-block-columns` — margin-bottom: 0

**Blockquote (from Astra):**
- border-left: 5px solid, padding: 20px, font-style: italic
- margin: 1.5em 1em 1.5em 3em (responsive: left margin shrinks)
- Pullquote decorative quote mark

**Figure/figcaption:**
- figure: margin 0 (reset)
- figcaption: 13px, centered, gray

**Content width constraint (from WP custom CSS):**
- `body p, body li` — max-width: 80ch, overflow-wrap: break-word

**Background padding for blocks:**
- `p.has-background` — padding: 1.25em 2.375em
- `h1-h6.wp-block-heading.has-background` — same

### main.css (21 lines added)

- Added h4, h5, h6 base typography rules matching Astra theme values

## Source Reference

Values extracted from:
- `data/wp-css/astra-main.min.css` — reset, blockquote, heading margins
- `data/wp-css/inline-astra-theme-css-inline-css.css` — font families/sizes/weights, entry-content rules
- `data/wp-css/inline-global-styles-inline-css.css` — layout flow/constrained, spacing presets, utility classes
- `data/wp-css/inline-wp-block-heading-inline-css.css` — heading background padding
- `data/wp-css/inline-wp-block-paragraph-inline-css.css` — paragraph utilities
- `data/wp-css/inline-wp-custom-css.css` — 80ch max-width, blockquote, responsive rules
- `data/wp-css-spec.md` — computed values specification

## Verification

Hugo build passes (98 pages, 0 errors).
