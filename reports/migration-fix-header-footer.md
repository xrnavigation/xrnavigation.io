# Migration Fix: Header & Footer

**Date:** 2026-03-30
**Commit:** 25d32f5
**Branch:** master

## Summary

Rewrote Hugo header and footer partials to match the live WordPress site's Astra Builder HTML structure. This was identified as the highest-leverage fix, contributing an estimated 15-25% of every page's pixel diff.

## What Changed

### Header (`themes/xrnav/layouts/partials/header.html`)

| Element | Before (Hugo) | After (matches WP) |
|---------|---------------|---------------------|
| `<header>` classes | `site-header` only | `site-header header-main-layout-1 ast-primary-menu-enabled ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline` |
| Schema markup | None | `itemtype`, `itemscope`, `itemid` attributes |
| `#ast-desktop-header` | No attributes | `data-toggle-type="dropdown"` |
| Logo | `<span class="site-title">XR Navigation</span>` (text) | `<img class="custom-logo" width="83" height="47">` inside `<span class="site-logo-img"><a class="custom-logo-link">` |
| Desktop nav `<nav>` id | `ast-hf-menu-1` | `primary-site-navigation-desktop` (WP's actual nav id) |
| Desktop nav classes | `site-navigation` | `site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item` |
| Menu `<ul>` classes | `main-header-menu ast-menu-nesting-squish` | `main-header-menu ast-menu-shadow ast-nav-menu ast-flex submenu-with-border stack-on-mobile` |
| `.ast-builder-menu-1` classes | Just that one class | Added `ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item` |
| Mobile bar classes | Minimal | Full WP set: `ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default` |
| Mobile hamburger | Bare `<svg>` with rect-based paths | WP's `<span class="mobile-menu-toggle-icon"><span class="ahfb-svg-iconset ast-inline-flex svg-baseline"><svg>` with correct path data |
| Mobile button aria-label | "Menu" | "Main menu toggle" (matches WP) |
| Active menu item | `aria-current` only | Added `current-menu-item` class on `<li>` |

### Footer (`themes/xrnav/layouts/partials/footer.html`)

| Element | Before (Hugo) | After (matches WP) |
|---------|---------------|---------------------|
| Above-footer tier | Missing entirely | Added 2-col grid with Quick Links + Learn More (col 1) and newsletter form (col 2) |
| Primary footer grid | 2-column | 4-column matching WP: logo, Quick Links, More Resources, contact form |
| Primary footer classes | `ast-builder-grid-row-container` | Added `ast-builder-grid-row-4-equal ast-builder-grid-row-tablet-2-equal` |
| Column 1 | Quick Links list | Logo image (UAGB image block structure) |
| Column 2 | Learn More + Contact form | Quick Links via `ast-footer-html-1` widget structure |
| Column 3 | Did not exist | More Resources via `ast-footer-html-2` widget structure |
| Column 4 | Did not exist | Contact form (Name, Email, Message) |
| Copyright wrapper | Single `div.ast-footer-copyright` | Double-wrapped: `div.ast-builder-layout-element.ast-flex.ast-footer-copyright > div.ast-footer-copyright` |
| Below-footer classes | Basic | Added `ast-builder-grid-row-full ast-builder-grid-row-tablet-full` |
| Inner wrap classes | Basic | Added `site-above-footer-inner-wrap`, `site-primary-footer-inner-wrap`, `site-below-footer-inner-wrap` |

### CSS (`themes/xrnav/static/css/wordpress-compat.css`)

- Primary footer grid changed from `repeat(2, 1fr)` to `repeat(4, 1fr)`
- Added `.ast-builder-grid-row-4-equal` selector
- Added above-footer `.custom-footer` widget styles (headings, lists, links)
- Added `.ast-footer-html-1` / `.ast-footer-html-2` column styles
- Added footer logo image styles (max-width 150px, no border-radius)
- Added newsletter form styles
- Added `.ast-flex-grow-1` and `.navigation-accessibility` rules
- Added `.mobile-menu-toggle-icon` and `.ahfb-svg-iconset` wrapper styles
- Added `.current-menu-item > a` active state selector
- Footer responsive: tablet gets 2-col primary footer, mobile gets 1-col

## Method

1. Used MCP Chrome tools to extract live WP header/footer DOM structure from xrnavigation.io
2. Compared element-by-element against existing Hugo templates
3. Rewrote templates to match WP's Astra Builder output
4. Updated CSS for new structural elements
5. Verified Hugo build succeeds (98 pages, no errors)

## Files Modified

- `themes/xrnav/layouts/partials/header.html`
- `themes/xrnav/layouts/partials/footer.html`
- `themes/xrnav/static/css/wordpress-compat.css`
- `notes/migration-fix-header-footer.md`
