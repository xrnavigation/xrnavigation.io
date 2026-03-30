# Task: Scaffold Hugo Project + Theme

## Goal
Initialize a Hugo project in this repo and create a custom theme that matches the current xrnavigation.io design. The theme skeleton should be ready to receive exported content.

## Context
Read these files for design details:
- `notes/wp-audit.md` — full site audit (navigation, content types, page patterns)
- `notes/design-tokens.md` — colors, fonts, typography values

## Site Structure (from audit)

### Navigation
- **Primary nav**: Home, About, Audiom Gallery, Blog, Audiom For Personal Use (external link to https://www.audiom.net/), Contact
- **Footer**: Quick Links (Home, About, Blog, LinkedIn), Learn More (Contact Us, Evaluate Your Map, Audiom for Personal Use, Accessibility Statement), contact form, XR Navigation logo
- **Mobile**: hamburger menu with Escape key closing + focus management

### Content Types
1. **Regular pages** — title + content (About, Contact, Privacy Policy, Accessibility Statement, etc.)
2. **Audiom embed pages** (~40+) — title + optional text + iframe to `www.audiom.net/embed/{id}`. Create a shortcode `audiom` that takes an `id` parameter and renders the iframe (width 100%, height 560, border 0, title from page title).
3. **Blog posts** — standard posts with featured images, in `content/blog/`
4. **Blog list page** — grid of posts with titles and excerpts
5. **Homepage** — complex landing page (this will be a custom layout, create a placeholder)

### Design Tokens
```
Colors:
  --color-text: #15191d
  --color-heading: #04203e
  --color-accent: #5a7969
  --color-black: #000000
  --color-bg: #f9fafb
  --color-white: #FFFFFF
  --color-border: #e2e8f0
  --color-muted: #94a3b8

Typography:
  Body: Lato, sans-serif — 16px
  Headings: Montserrat, sans-serif — weight 800
  H1: 40px

Theme modes (localStorage key: "theme"):
  Default: above colors
  Dark (.bw-theme): bg #000, text #fff, images grayscale
  High Contrast (.hc-theme): bg #000, text #0000FF
```

## Deliverables

### Hugo Project
- `hugo.toml` — site config with title "XR Navigation", baseURL "https://xrnavigation.io/", menu config for nav items
- `content/_index.md` — homepage placeholder
- `content/blog/_index.md` — blog list page
- `static/` — will hold images/media later
- `archetypes/default.md` — default frontmatter template
- `archetypes/audiom-embed.md` — template for map pages with `audiom_id` param

### Theme (`themes/xrnav/`)
- `layouts/_default/baseof.html` — base template with skip link, header, nav, main, footer
- `layouts/_default/single.html` — standard page layout
- `layouts/_default/list.html` — list page layout
- `layouts/blog/single.html` — blog post layout
- `layouts/blog/list.html` — blog post grid
- `layouts/page/audiom-embed.html` — audiom iframe embed layout
- `layouts/partials/header.html` — logo + nav + mobile menu toggle
- `layouts/partials/footer.html` — footer with quick links, learn more, contact form, logo
- `layouts/partials/head.html` — meta tags, Google Fonts (Lato + Montserrat), CSS links, analytics placeholders
- `layouts/partials/theme-switcher.html` — Default/Dark/HC mode buttons
- `layouts/shortcodes/audiom.html` — iframe embed shortcode
- `layouts/404.html` — custom 404 page
- `themes/xrnav/static/css/main.css` — all styles using CSS custom properties from design tokens
- `themes/xrnav/static/css/dark-mode.css` — dark mode + high contrast overrides
- `themes/xrnav/static/js/theme-switcher.js` — theme toggle with localStorage persistence
- `themes/xrnav/static/js/mobile-menu.js` — hamburger menu with Escape key + focus management

### CSS Requirements
- Use CSS custom properties for all colors (easy theme switching)
- `[data-theme="dark"]` and `[data-theme="hc"]` selectors for mode overrides
- Mobile-first responsive: breakpoints at 544px and 921px
- No CSS frameworks — plain CSS
- Focus styles on all interactive elements
- `aria-current="page"` on active nav item (not a JS hack)

### Contact Form
- Use a simple HTML form with `data-netlify="true"` attribute (Netlify Forms)
- Fields: Name (text, autocomplete="name"), Email (email, autocomplete="email"), Message (textarea)
- Footer has this form; contact page can reuse the partial

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Hugo Installation
- Install Hugo extended via `winget install Hugo.Hugo.Extended` or download from https://github.com/gohugoio/hugo/releases
- Verify with `hugo version`
- If winget doesn't work, try `choco install hugo-extended` or download the binary directly

## Git Instructions
- `git add hugo.toml content/ themes/ archetypes/ .gitignore`
- Do NOT add `public/` (Hugo build output) — add it to .gitignore
- `git commit -m "Scaffold Hugo project with xrnav theme"`
- Include the commit hash in your report

## Report
Write your report to `reports/migration-hugo-scaffold.md` with:
- What was created (file list)
- How to build/preview (`hugo server`)
- The commit hash
- Any decisions made
