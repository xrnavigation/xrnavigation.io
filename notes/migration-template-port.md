# Migration Template Port Notes

## 2026-03-30

### GOAL
Rewrite Hugo templates to match WordPress DOM structure and consolidate WP CSS for visual parity.

### OBSERVATIONS
- All WP CSS files are minified (0-3 lines each for the big ones). The "line count" is misleading - they're huge single-line files.
- `inline-uagb-style-frontend-135.css` is 115K tokens - the per-block hash styles. Massive.
- `inline-astra-theme-css-inline-css.css` is 23K tokens - Astra theme generated styles.
- `astra-theme-inline.css` is 23K tokens - more Astra styles.
- `astra-main.min.css` is 16K tokens - Astra base.
- Current Hugo templates use simple semantic class names, not WP/Astra class names.
- baseof.html lacks the WP shell structure (div#page, div#content, div.ast-container, etc.)
- header.html uses simple `.site-header` / `.primary-nav` instead of Astra builder grid.
- footer.html uses simple columns instead of Astra three-tier footer.
- Blog templates use custom `.blog-grid` / `.blog-card` instead of UAGB post grid classes.

### PLAN
1. Concatenate key WP CSS files into wordpress-compat.css (using bash cat, not reading into context)
2. Rewrite baseof.html with WP shell structure
3. Rewrite header.html with Astra desktop+mobile structure
4. Rewrite footer.html with three-tier Astra structure
5. Rewrite content templates (single, blog/list, blog/single, audiom-embed)
6. Strip main.css down to just focus/dark-mode/theme-switcher styles
7. Verify hugo build

### ADDITIONAL OBSERVATIONS
- WP CSS files are all minified single-line blobs. Cannot read inline-uagb-style-frontend-135.css (115K tokens) or astra-main.min.css (16K tokens) directly.
- inline-wp-custom-css.css (491 lines) contains site-specific custom CSS: sticky header, blog card border-radius, form styles, etc.
- inline-anonymous-0.css has the focus styles (already in our main.css).
- inline-anonymous-2.css has color mode variables (data-color-mode dark/light) - WP's theme switcher used different selectors.
- inline-anonymous-3.css has custom footer styles.
- inline-global-styles-inline-css.css has WP preset variables and .has-*-color utility classes.
- Strategy shift: Since the UAGB per-block CSS is 115K tokens of hash-keyed styles, we CANNOT use it directly. Instead we need to build a consolidated CSS that reproduces the visual appearance using the computed values from wp-css-spec.md, plus the structural class names from structural-patterns.md.
- Current main.css already has correct computed values for typography, colors, spacing. It just uses wrong class names/DOM structure.
- The right approach: rewrite templates to use WP DOM structure, then build CSS that targets those WP class names with the correct computed values.

### CURRENT STATE (checkpoint 2)
All files written:
- wordpress-compat.css: Created with WP class names + computed values
- main.css: Stripped to reset/focus/theme-switcher/buttons/forms only
- dark-mode.css: Updated to use --ast-global-color-* variables
- head.html: Added wordpress-compat.css link, added Montserrat 700 weight
- baseof.html: WP shell (body.ast-hfb-header, div#page, div#content.site-content, etc.)
- header.html: Dual desktop/mobile headers with Astra builder grid classes
- footer.html: Three-tier footer (primary + below/copyright) with Astra classes
- single.html: UAGB container wrapper
- list.html: UAGB container + advanced heading
- blog/list.html: UAGB post grid with columns-3/tablet-2/mobile-1
- blog/single.html: WP post structure with .ast-post-format-/.single-layout-1
- audiom-embed.html: UAGB container + heading + iframe

NEXT: Need to update mobile-menu.js for new class names, then run hugo build to verify, then check the 404 template.

### CHECKPOINT 3 (build verified)
- Hugo build: CLEAN. 98 pages, no errors, 1891ms.
- mobile-menu.js: Updated selectors to `.menu-toggle.ast-mobile-menu-trigger-minimal` and `#ast-mobile-site-navigation`.
- Created index.html homepage template with all 9 UAGB container sections from front matter data.
- Added responsive grid collapse rules for mobile.
- All files modified, ready to commit. Two commits planned: CSS first, then templates.
- Notes files modified (visual-comparison.md, wp-asset-extraction.md) are from prior work, not this task. Will not stage those.
