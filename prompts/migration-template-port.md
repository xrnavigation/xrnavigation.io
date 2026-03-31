# Task: Port Hugo Templates to Match WordPress HTML Structure

## Goal
Rewrite all Hugo templates so they produce HTML that matches the WordPress site's DOM structure. Then use the actual WordPress CSS (already downloaded to `data/wp-css/`) to style it. The end result should be visually identical to the WordPress site.

## Context — READ ALL OF THESE FIRST
- `data/wp-html/structural-patterns.md` — THE DOM PATTERNS TO MATCH. Every template must produce this HTML structure.
- `data/wp-css-spec.md` — computed CSS values
- `data/wp-css/` — actual WordPress CSS files (29 files, 978KB)
- `data/wp-html/` — HTML snapshots of each page type
- Current Hugo templates are in `themes/xrnav/layouts/`

## Strategy

### 1. Create a consolidated WordPress CSS file
Take the most important CSS files from `data/wp-css/` and combine them into a single `themes/xrnav/static/css/wordpress-compat.css`:
- `inline-astra-theme-css-inline-css.css` (Astra's generated theme styles — colors, typography, layout)
- `inline-uagb-style-frontend-135.css` (UAGB per-block styles — THE critical file for layout)
- `astra-theme-css.css` (Astra base theme)
- `wp-block-library.css` (WordPress block styles)
- `uagb-blocks-common-frontend.css` (UAGB common styles)
- `uagb-blocks-frontend.css` (UAGB block-specific styles)

Strip out anything WordPress-admin-specific. Keep all layout, typography, color, and responsive rules.

### 2. Rewrite the base template (`baseof.html`)
The body needs these classes and structure:
```html
<body class="ast-hfb-header ast-page-builder-template">
  <div id="page" class="hfb-header ast-page-builder-template">
    {{ partial "header.html" . }}
    <div id="content" class="site-content">
      <div class="ast-container">
        <div id="primary" class="content-area">
          <main id="main" class="site-main">
            <article class="ast-article-single">
              <div class="entry-content clear">
                {{ block "main" . }}{{ end }}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
    {{ partial "footer.html" . }}
  </div>
</body>
```

### 3. Rewrite the header (`header.html`)
Must produce BOTH desktop and mobile headers matching the WP structure:

**Desktop header** (`#ast-desktop-header`):
```html
<header id="masthead" class="site-header">
  <div id="ast-desktop-header">
    <div class="ast-main-header-wrap main-header-bar-wrap">
      <div class="ast-primary-header-bar main-header-bar">
        <div class="site-primary-header-wrap ast-builder-grid-row-container ast-container">
          <div class="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
            <div class="site-header-primary-section-left site-header-section ast-flex">
              <!-- Logo -->
            </div>
            <div class="site-header-primary-section-right ast-grid-right-section">
              <!-- Nav menu -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="ast-mobile-header" class="ast-mobile-header-wrap">
    <!-- Mobile header structure -->
  </div>
</header>
```

### 4. Rewrite the footer (`footer.html`)
Three-tier footer matching WP:
- Above footer: 2-column grid with nav links + form
- Primary footer: logo + contact info columns
- Below footer: copyright bar with bg #15191d

Use the exact Astra footer class names: `.site-above-footer-wrap`, `.site-primary-footer-wrap`, `.site-below-footer-wrap`, `.ast-builder-grid-row-container`, etc.

### 5. Content templates

**Standard page (`single.html`):**
Wrap content in UAGB container pattern:
```html
<div class="wp-block-uagb-container alignfull uagb-is-root-container">
  <div class="uagb-container-inner-blocks-wrap">
    {{ .Content }}
  </div>
</div>
```

**Audiom embed page:**
Same UAGB container wrapper with the heading + iframe inside.

**Blog list (`blog/list.html`):**
Must produce the UAGB post grid structure:
```html
<div class="wp-block-uagb-post-grid uagb-post-grid uagb-post__columns-3 is-grid uagb-post__columns-tablet-2 uagb-post__columns-mobile-1 uagb-post__equal-height">
  {{ range .Pages }}
  <article class="uagb-post__inner-wrap">
    <h3 class="uagb-post__title"><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
    <div class="uagb-post__text uagb-post__excerpt">{{ .Summary }}</div>
  </article>
  {{ end }}
</div>
```

**Blog post (`blog/single.html`):**
Standard WordPress post markup with `wp-block-heading` classes on headings.

### 6. Replace main.css
Replace `themes/xrnav/static/css/main.css` with the consolidated WordPress CSS from step 1. Keep only:
- The focus styles (--outline-color etc.)
- The dark mode custom properties
- The theme switcher button styles

Everything else comes from the WordPress CSS.

### 7. Keep dark-mode.css working
The dark mode CSS uses `[data-theme="dark"]` and `[data-theme="hc"]` selectors. These must still work. The WP site's theme switcher used different selectors (`.bw-theme`), but our Hugo version is better — keep ours.

### 8. Keep these Hugo-specific files unchanged
- `themes/xrnav/static/js/theme-switcher.js`
- `themes/xrnav/static/js/mobile-menu.js` (but may need class name updates to match WP structure)
- `themes/xrnav/static/vendor/` (Able Player + jQuery)

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Verify
After all changes:
1. Run `hugo` — must build cleanly
2. Run `hugo server --port 1314` and spot-check a few pages

## Git Instructions
- Commit in logical chunks (CSS first, then templates)
- Include all commit hashes in report

## Report
Write your report to `reports/migration-template-port.md` with:
- What was changed
- Which WP CSS files were consolidated
- Template changes summary
- Hugo build verification
- Commit hashes
