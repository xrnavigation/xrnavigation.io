# Report: Extract WordPress CSS Files and HTML Structure

Date: 2026-03-30
Commit: 633f399

## Summary

Downloaded every CSS file loaded by the WordPress site and captured the HTML structure of 5 representative page types. All assets saved to `data/wp-css/` and `data/wp-html/`.

## Part 1: CSS Files (29 files, 978 KB)

### External Stylesheets (13 files, downloaded via curl)

| File | Size | Purpose |
|------|------|---------|
| `astra-main.min.css` | 45,731 | Astra theme base (reset, grid, nav, forms, widgets) |
| `astra-local-fonts.css` | 14,994 | @font-face declarations for Lato + Montserrat |
| `uagb-custom-style-blocks.css` | 263,096 | UAGB block type styles (containers, headings, buttons, post-grid, info-box, etc.) |
| `spectra-pro-style-blocks.css` | 44,426 | Spectra Pro components (login, register, instagram) |
| `spectra-block-positioning.min.css` | 335 | UAGB sticky container positioning |
| `ableplayer.min.css` | 23,050 | Able Player accessible media player |
| `ableplayer-media.css` | 59 | Playlist border override |
| `wpforms-full.min.css` | 115,596 | WPForms form styling |
| `auth0-main.css` | 468 | Auth0 login widget |
| `content-control-block-editor.css` | 1,776 | Content control visibility icons |
| `dashicons.min.css` | 59,004 | WordPress icon font |
| `astra-theme-inline.css` | 66,670 | Astra theme inline (downloaded via Chrome blob) |

### Inline Style Blocks (16 files, extracted via Python from page source)

| File | Size | Purpose |
|------|------|---------|
| `inline-astra-theme-css-inline-css.css` | 66,548 | Astra generated theme CSS (colors, typography, layout, responsive) |
| `inline-uagb-style-frontend-135.css` | 260,794 | Per-page UAGB block styles (every block's unique positioning/sizing) |
| `inline-global-styles-inline-css.css` | 14,627 | WordPress theme.json output (preset colors, spacing, font sizes) |
| `inline-wp-custom-css.css` | 14,607 | WP Customizer CSS (custom overrides) |
| `inline-wp-block-library-inline-css.css` | 3,553 | Block library base styles |
| `inline-wp-block-heading-inline-css.css` | 1,249 | Heading block styles |
| `inline-wp-block-paragraph-inline-css.css` | 741 | Paragraph block styles |
| `inline-content-control-block-styles.css` | 302 | Content control |
| `inline-wp-emoji-styles-inline-css.css` | 340 | Emoji styles |
| `inline-wp-img-auto-sizes-contain-inline-css.css` | 135 | Image auto-sizing |
| `inline-uagb-style-conditional-extension.css` | 366 | UAGB conditional |
| `inline-core-block-supports-inline-css.css` | 182 | Core block supports |
| `inline-anonymous-0.css` | 1,044 | Anonymous style block |
| `inline-anonymous-1.css` | 25 | Anonymous style block |
| `inline-anonymous-2.css` | 862 | Anonymous style block |
| `inline-anonymous-3.css` | 848 | Anonymous style block |

### Skipped (admin-only / not visual)

- `admin-bar.min.css` (WP admin bar, not visible to public)
- Google Analytics frontend CSS (tracking, not visual)
- Rank Math SEO admin bar CSS
- Yoast SEO admin bar CSS
- WordPress.com (`s0.wp.com`) CSS (hosting platform UI)

## Part 2: HTML Structure (5 pages)

Each page captured as both raw HTML (`.html`) and structured DOM tree (`.md`):

| Page | File | Sections Captured |
|------|------|-------------------|
| Homepage | `homepage.md` | header, 3 UAGB content sections, footer |
| About | `about.md` | main content (8+ UAGB sections), header, footer |
| Blog listing | `blog.md` | main content (hero + post grid), header, footer |
| Audiom demo | `audiom-demo.md` | main content (heading + iframe), header, footer |
| Blog post | `blog-post.md` | main content (standard WP blocks), header, footer |

## Part 3: Structural Patterns

Full documentation in `data/wp-html/structural-patterns.md`. Key findings:

### UAGB Container Pattern
Every content section uses:
```
div.wp-block-uagb-container.uagb-block-{hash}.alignfull.uagb-is-root-container
  div.uagb-container-inner-blocks-wrap
    [blocks]
```
Root containers have `.alignfull` + `.uagb-is-root-container`. Per-block styles are keyed by hash class in the massive inline UAGB stylesheet.

### Blog Post Grid
Uses `.wp-block-uagb-post-grid` with responsive column classes:
- `.uagb-post__columns-3` (desktop)
- `.uagb-post__columns-tablet-2`
- `.uagb-post__columns-mobile-1`
Cards are `article.uagb-post__inner-wrap` with background image position.

### Header
Dual structure: `#ast-desktop-header` (visible >= 922px) and `#ast-mobile-header` (visible <= 921px). Desktop uses Astra Builder grid with left (logo) and right (nav) sections.

### Footer
Three-tier: above-footer (2-col with nav + newsletter form), primary-footer (4-col with logo, contact info, links, contact form), below-footer (full-width copyright).

### Blog Posts (Single)
Use standard WordPress block markup (no UAGB containers): `p`, `h2.wp-block-heading`, `ol.wp-block-list`, `figure.wp-block-image`. Headings have `id` attributes for anchor links.

## Output Files

```
data/wp-css/          (29 files, 978 KB)  - All CSS
data/wp-html/         (11 files)          - HTML structure + raw HTML
  structural-patterns.md                  - Pattern summary
scripts/extract-inline-styles.py          - Inline CSS extraction tool
scripts/extract-html-structure.py         - HTML structure extraction tool
```

## Extraction Method

- External CSS: `curl` direct download
- Inline CSS: Downloaded full page HTML via `curl`, then extracted `<style>` blocks using Python regex parser (`scripts/extract-inline-styles.py`)
- HTML structure: Downloaded page HTML via Python `urllib`, then parsed with `HTMLParser` to extract tag/class/id trees (`scripts/extract-html-structure.py`)
- Browser (Chrome MCP): Used for initial stylesheet URL discovery and verification
