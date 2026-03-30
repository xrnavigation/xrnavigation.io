# Report: Hugo Project Scaffold
Date: 2026-03-30
Commit: 2b16d83

## What Was Created

### Hugo Project Root
- `hugo.toml` — site config: title, baseURL, menus (primary nav, footer quick links, footer learn more), permalinks, markup settings
- `.gitignore` — excludes public/, resources/_gen/, .hugo_build.lock (plus pre-existing node_modules/, tests/baseline/*.png)
- `archetypes/default.md` — default frontmatter template
- `archetypes/audiom-embed.md` — template for audiom map pages with audiom_id param

### Theme: themes/xrnav/

**Layouts:**
- `layouts/_default/baseof.html` — base template with skip link, header, main, footer, JS includes
- `layouts/_default/single.html` — standard page layout
- `layouts/_default/list.html` — list page with pagination
- `layouts/blog/single.html` — blog post with featured image, date, author
- `layouts/blog/list.html` — blog post grid (responsive: 1/2/3 columns)
- `layouts/page/audiom-embed.html` — audiom iframe embed via frontmatter audiom_id
- `layouts/partials/head.html` — meta, Google Fonts (Lato + Montserrat), CSS links, analytics placeholder
- `layouts/partials/header.html` — logo, primary nav with aria-current="page", mobile toggle
- `layouts/partials/footer.html` — quick links, learn more, Netlify contact form, logo, copyright
- `layouts/partials/theme-switcher.html` — Default/Dark/High Contrast buttons with aria-pressed
- `layouts/shortcodes/audiom.html` — iframe shortcode: `{{</* audiom id="xxx" */>}}`
- `layouts/404.html` — custom 404 page

**CSS:**
- `static/css/main.css` — all styles using CSS custom properties, mobile-first responsive (breakpoints 544px, 921px), focus styles on all interactive elements, no frameworks
- `static/css/dark-mode.css` — `[data-theme="dark"]` and `[data-theme="hc"]` overrides

**JS:**
- `static/js/theme-switcher.js` — 3-mode toggle with localStorage persistence
- `static/js/mobile-menu.js` — hamburger menu with Escape key close + focus management

## How to Build / Preview

```bash
cd C:\Users\Q\src\audiom\xrnavigation.io
hugo server
# Open http://localhost:1313/
```

Build for production:
```bash
hugo
# Output in public/
```

## Decisions Made

1. **data-theme attribute over class-based switching**: Used `[data-theme="dark"]` and `[data-theme="hc"]` on `<html>` instead of the WordPress site's `.bw-theme`/`.hc-theme` classes. Cleaner, avoids inline style hacks from the WP snippets.

2. **Single contact form**: The WP site had duplicate forms (mobile/desktop) with JS hacks to fix duplicate IDs. Hugo template uses one form with unique IDs — no duplicate-ID problem to solve.

3. **aria-current="page" in template**: Set server-side in Hugo template via menu URL comparison, not via JS post-render like the WP site.

4. **Blog card images are decorative**: Set `alt="" aria-hidden="true"` on blog grid card images since the card title link is the accessible name. Eliminates the redundant-link problem the WP site solved with JS hacks.

5. **Content files already existed**: Prior migration work had already exported and committed content/ files. The scaffold commit adds only the theme, config, and archetypes.

6. **Homepage content preserved**: The externally-modified content/_index.md with full WP homepage content was already tracked — no changes needed.

7. **Netlify Forms**: Contact form uses `data-netlify="true"` with proper autocomplete attributes (name, email) baked into HTML — no JS fixup needed.
