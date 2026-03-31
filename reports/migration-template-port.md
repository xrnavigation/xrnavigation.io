# Migration Template Port Report

Date: 2026-03-30

## Summary

Rewrote all Hugo templates to produce HTML matching the WordPress Astra + UAGB DOM structure, and created a consolidated CSS file targeting those WP class names with computed values from the live site.

## What Changed

### CSS (Commit `99d8b59`)

**Created `themes/xrnav/static/css/wordpress-compat.css`** — consolidated WordPress compatibility CSS with:
- Astra global color custom properties (`--ast-global-color-0` through `--ast-global-color-8`)
- WP preset color aliases and `.has-*-color` / `.has-*-background-color` utility classes
- Astra page shell styles (`#page`, `#content.site-content`, `.ast-container`, etc.)
- Astra Builder header styles (desktop `#ast-desktop-header` + mobile `#ast-mobile-header`)
- Sticky header behavior at desktop breakpoint (922px+)
- UAGB container layout pattern (`.wp-block-uagb-container`, `.alignfull`, `.uagb-is-root-container`)
- UAGB block styles: advanced heading, info box, buttons, image, post grid
- WordPress block styles (`.wp-block-heading`, `.wp-block-list`, `.wp-block-image`)
- Astra three-tier footer (above, primary, below/copyright)
- Blog post single article styles
- Audiom embed page styles
- UAGB responsive visibility classes (`uag-hide-mob`, `uag-hide-tab`, `uag-hide-desktop`)
- Responsive breakpoints matching Astra: 922px (desktop/tablet), 544px (mobile), 768px (UAGB)

**Refactored `themes/xrnav/static/css/main.css`** — stripped to core styles only:
- Box-sizing reset
- Skip link and screen-reader-only utilities
- Focus styles (Steven Woodson's interactive focus outlines)
- Base typography (h1-h3, p, a)
- Theme switcher button styles
- Contact form shared styles
- Button base styles

**Updated `themes/xrnav/static/css/dark-mode.css`** — converted from `--color-*` to `--ast-global-color-*` custom properties, updated selectors for new footer/card class names.

### Templates (Commit `bf768bd`)

| Template | Changes |
|---|---|
| `baseof.html` | WP shell: `body.ast-hfb-header`, `div#page`, `div#content.site-content`, `div.ast-container`, `#primary.content-area`, `main#main.site-main` |
| `header.html` | Dual desktop/mobile headers with full Astra Builder grid structure. Desktop: `#ast-desktop-header` with grid row sides layout. Mobile: `#ast-mobile-header` with hamburger SVG toggle. |
| `footer.html` | Three-tier Astra footer: `.site-primary-footer-wrap` (Quick Links + Learn More/Contact) and `.site-below-footer-wrap` (copyright bar with `#15191d` bg) |
| `index.html` | **New** homepage template with 9 UAGB container sections matching WP: hero, steps grid, why/features, video, clients, what-is, use cases, team, contact |
| `single.html` | UAGB container wrapper (`alignfull uagb-is-root-container`) around content |
| `list.html` | UAGB container + advanced heading + `.wp-block-list` |
| `blog/list.html` | UAGB post grid with `uagb-post__columns-3 is-grid uagb-post__columns-tablet-2 uagb-post__columns-mobile-1 uagb-post__equal-height` |
| `blog/single.html` | WP post structure: `article.post.ast-article-single` with `.ast-post-format-.single-layout-1` |
| `audiom-embed.html` | UAGB container + advanced heading + iframe |
| `head.html` | Added `wordpress-compat.css` link, added Montserrat 700 weight |

### JavaScript (Commit `bf768bd`)

**Updated `themes/xrnav/static/js/mobile-menu.js`** — changed selectors from `.mobile-menu-toggle` / `#primary-nav` to `.menu-toggle.ast-mobile-menu-trigger-minimal` / `#ast-mobile-site-navigation` matching new Astra mobile header structure.

## CSS Consolidation Strategy

The original plan was to concatenate raw WP CSS files. This was not feasible because:
- `inline-uagb-style-frontend-135.css` is 115K tokens of per-block hash-keyed styles (e.g., `.uagb-block-450c520f`)
- `astra-main.min.css` and `astra-theme-inline.css` are 16K+ and 23K+ tokens of minified CSS

Instead, we built `wordpress-compat.css` from scratch using:
- **Class names** from `data/wp-html/structural-patterns.md` (the actual DOM structure)
- **Computed values** from `data/wp-css-spec.md` (measured CSS values from the live site)
- **Custom CSS** from `data/wp-css/inline-wp-custom-css.css` (site-specific overrides like sticky header, blog card border-radius)

This produces the same visual result without the bloat of hash-keyed block styles.

## Files Unchanged (as specified)

- `themes/xrnav/static/js/theme-switcher.js` (unchanged)
- `themes/xrnav/static/vendor/` (Able Player + jQuery, unchanged)
- `themes/xrnav/layouts/shortcodes/audiom.html` (unchanged)
- `themes/xrnav/layouts/partials/theme-switcher.html` (unchanged)
- `themes/xrnav/layouts/404.html` (unchanged)

## Hugo Build Verification

```
hugo v0.156.0 — 98 pages, 258 static files, 0 errors, 1866ms
```

## Commit Hashes

1. `99d8b59` — Add consolidated WordPress-compat CSS and refactor main.css
2. `bf768bd` — Rewrite Hugo templates to match WordPress Astra/UAGB DOM structure
3. `191f202` — Add migration template port working notes
