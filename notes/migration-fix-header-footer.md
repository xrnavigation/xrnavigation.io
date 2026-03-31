# Migration Fix: Header & Footer
## 2026-03-30

### GOAL
Match Hugo header/footer HTML to live WP site's Astra Builder output.

### OBSERVED FROM LIVE WP SITE

**Header differences (Hugo vs WP):**
- WP `<header>` has classes: `site-header header-main-layout-1 ast-primary-menu-enabled ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline` -- Hugo only has `site-header`
- WP `#ast-desktop-header` has `data-toggle-type="dropdown"` -- Hugo missing
- WP logo uses `<span class="site-logo-img"><a class="custom-logo-link"><img class="custom-logo" width="83" height="47">` -- Hugo uses text `<span class="site-title">XR Navigation</span>` instead of actual img
- WP nav id is `primary-site-navigation-desktop` with classes `site-navigation ast-flex-grow-1 navigation-accessibility` -- Hugo uses `id="ast-hf-menu-1"` which is the UL id in WP
- WP `<ul>` has `id="ast-hf-menu-1"` with classes `main-header-menu ast-menu-shadow ast-nav-menu ast-flex submenu-with-border stack-on-mobile` -- Hugo UL missing most classes
- WP `.ast-builder-menu-1` has extra classes `ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element`
- WP mobile button aria-label is "Main menu toggle" -- Hugo uses "Menu"
- WP mobile button has `<span class="mobile-menu-toggle-icon"><span class="ahfb-svg-iconset ast-inline-flex svg-baseline"><svg>` wrapper -- Hugo has raw SVG with different path data
- WP mobile header bar has extra classes: `ast-primary-header ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default`

**Footer differences (Hugo vs WP):**
- WP has THREE-TIER footer: above-footer, primary-footer, below-footer -- Hugo is MISSING the above-footer tier entirely
- WP above-footer: 2-col grid with Quick Links + Learn More links (col 1) and WPForms newsletter (col 2)
- WP primary-footer: 4-col grid (`ast-builder-grid-row-4-equal`) -- Hugo has 2-col grid
  - Col 1: Logo image (UAGB image block)
  - Col 2: HTML widget with "Quick Links" (Home, About, Blog, LinkedIn)
  - Col 3: HTML widget with "More Resources" (Contact Us, Evaluate Your Map, Audiom for Personal Use, Accessibility Statement)
  - Col 4: WPForms contact form (Name, Email, Message, Submit)
- Hugo's footer is structured completely differently - has footer_quick + footer_learn menus in 2 columns with no above-footer, no logo column
- WP copyright text: "Website By @ThreeOneSixDigital" -- Hugo: copyright year + site title
- WP below-footer has extra classes: `ast-builder-grid-row-full ast-builder-grid-row-tablet-full`
- WP copyright wrapped in `div.ast-builder-layout-element.ast-flex.site-footer-focus-item.ast-footer-copyright > div.ast-footer-copyright` (double-wrapped)

**Logo file:** `static/images/cropped-Pecise-XR-LogosArtboard-2@2x.webp` exists

### DONE
1. Rewrote header.html: logo img instead of text, correct Astra classes on all elements, WP nav IDs, mobile hamburger SVG path from WP, data-toggle-type attribute
2. Rewrote footer.html: added above-footer tier (Quick Links + Learn More + newsletter), changed primary-footer from 2-col to 4-col (logo, Quick Links, More Resources, contact form), added correct inner-wrap classes, double-wrapped copyright div
3. Updated CSS: primary footer grid changed from repeat(2) to repeat(4), added .ast-builder-grid-row-4-equal selector

### CSS CHANGES DONE
- Primary footer grid: 2-col -> 4-col, with 2-col at tablet, 1-col at mobile
- Added above-footer `.custom-footer` widget styles (h2, ul, links)
- Added `.ast-footer-html-1/.ast-footer-html-2` column heading/link styles
- Added footer logo img style (max-width 150px, no border-radius)
- Added newsletter form styles
- Added `.ast-flex-grow-1`, `.navigation-accessibility` nav styles
- Added `.mobile-menu-toggle-icon`, `.ahfb-svg-iconset` wrapper styles
- Added `.current-menu-item > a` selector for active state

### NEXT
- Build Hugo to verify no template errors
- Commit
- Write report
