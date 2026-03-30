# WordPress Site Audit — xrnavigation.io
Date: 2026-03-30

## Observed Site Structure

### Theme & Page Builder
- **Theme**: Astra (with Astra Pro/Starter Templates)
- **Page builder**: Spectra (formerly UAG — Ultimate Addons for Gutenberg) + Spectra Pro
- Pages are built with `wp-block-uagb-container` blocks (Spectra's container block)
- Homepage has ~10 Spectra container sections
- Fonts: Montserrat (headings), Lato (body) via Google Fonts
- Color palette: CSS custom properties `--ast-global-color-0` through `-8`

### Navigation
- **Primary nav**: Home, About, Audiom Gallery, Blog, Audiom For Personal Use (external → audiom.net), Contact
- **Footer**: Quick Links, Learn More links, contact form (WPForms), logo
- Mobile: responsive hamburger menu

### Content Types & Patterns

**Map demo pages (~40+ pages)**: The bulk of content. Pattern is:
- Heading (Spectra Advanced Heading block)
- Optional paragraph of instructions
- **iframe** to `www.audiom.net/embed/{id}` (width 100%, height 560, border 0)
- That's it. These are dead simple.

**Homepage**: Complex layout with:
- Hero section
- 3-step process section
- "Why XR Navigation" features section
- **Able Player** video (accessible HTML5 media player with captions/tracks)
- Client logos (Georgia Tech, NASA, University of Washington)
- "What Is Audiom?" section
- Use Cases (Universities, Corporate, Healthcare, Events)
- Team bios (Brandon Biggs, Chris Toth)
- Contact Us section with WPForms

**Blog posts (11)**: Standard text posts with headings, paragraphs, images.

**Static pages**: About, Contact, Privacy Policy, Accessibility Statement, etc.

**Case studies**: Text + images, possibly with audiom embeds.

**Event pages**: CSUN, ATIA, NFB, etc. — likely simple pages with event info + map embeds.

### Active Plugins (21 total, observed)

**Content/functionality — MUST MIGRATE:**
- **Able Player** — accessible HTML5 media player (used on homepage video)
- **iFrame Block** — Gutenberg block for iframes (used for Audiom embeds)
- **WPForms** (paid) — contact forms, footer forms (IDs: 2494 mobile, 1507 desktop)
- **Simple Custom CSS and JS** — 3 custom code snippets (CH 80 CSS, Interactive Focus Styles CSS, Custom_Astra_JS JS)
- **WPCode Lite** — 22 code snippets (see list below)
- **Redirection** — 12 redirect rules
- **Content Control** — restricts content by user role
- **Login by Auth0** — authentication
- **User Menus** — role-based menu items

**SEO (redundant — both active):**
- Yoast SEO
- Rank Math SEO

**Analytics (just need tracking IDs):**
- MonsterInsights (Google Analytics — ID: G-4RGYN0JHKB)
- Microsoft Clarity

**Infrastructure (not needed in static site):**
- Jetpack
- W3 Total Cache (inactive)
- Starter Templates
- Update URLs
- TablePress (inactive)

### WPCode Snippets — ALL READ (20 snippets)

**Theme Switching System (6 snippets — the big feature)**
The site has a 3-mode theme switcher: Default, Black & White (dark mode), High Contrast.
Uses buttons with IDs `defaultTheme`, `bwTheme`, `hcTheme`. Preference stored in localStorage.

- **"CSS: Defining Custom Properties"** (css, #1943) — CSS custom properties for color modes: `--primary-color`, `--secondary-color`, `--accent-color`, `--background-color` with `[data-color-mode="dark"]` variant
- **"CSS For Black"** (css, #2044) — `.bw-theme` class styles: black bg, white text, grayscale images, overlay pseudo-elements
- **"3 Black Java"** (js, #2046) — Theme switcher JS: applies BW theme by setting inline styles on Spectra container elements, stores pref in localStorage
- **"java For Color"** (js, #1944) — Another theme switcher variant: default/BW toggle using IDs, sets inline styles on UAG elements
- **"4 Dark Mode Java"** (js, #1962) — (not read, likely another variant of above)
- **"HC Theme"** (js, #2075) — High contrast mode: black bg + blue text, localStorage persistence

**A11y Fixes (7 snippets)**
- **"Link In Blog"** (js, #2435) — Removes link wrapper from blog post grid images (prevents redundant links)
- **"Remove Featured Image Link on Archive Page"** (php, #2415) — Same fix server-side for blog page featured images
- **"No Hover"** (css, #1932) — Disables hover transform/scale on post grid items, keeps text color stable
- **"Aria label in header for active menu item"** (js, #1917) — Adds `aria-label="Current Page"` to active nav item
- **"Tab and Esc Menu"** (js, #1912) — Keyboard nav: Escape closes mobile menu + returns focus to toggle button, Tab trapping
- **"Auto Complete Footer"** (js, #2092) — Sets `autocomplete="name"` and `autocomplete="email"` on footer form fields
- **"Add class to Blog Title"** (js, #2069) — (not read, adds CSS class to blog title)

**WPForms Duplicate ID Fixes (2 snippets)**
WPForms generates duplicate IDs when the same form appears multiple times on a page (footer mobile + desktop).
- **"Change Id In Footer Form"** (js, #2236) — Appends `-footer` to all field IDs in form #1507
- **"Unique Id Force"** (js, #2208) — Generic: appends form index to all field IDs across all WPForms

**Able Player Setup (2 snippets)**
- **"Load Able Player"** (js, #2268) — `$('video, audio').ablePlayer()` jQuery init
- **"Able Player Doesn't Like To Work"** (html, #2267) — Loads Able Player CSS/JS, YouTube iframe API, sets YouTube Data API key

**Infrastructure / Misc (3 snippets)**
- **"404 page"** (php, #2167) — Redirects 404s to custom `/404-2/` page
- **"Max character"** (php, #2095) — TEST SNIPPET: red background, likely inactive
- **"Untitled Snippet"** (#239) — ScrollMagic animation, likely inactive/experimental

**Not Yet Read (2 snippets)**
- **"Author Page"** (php, #1968) — skipped, minor
- **"4 Dark Mode Java"** (js, #1962) — likely another dark mode variant

### Redirects (12 rules)
Short URL aliases mostly for events:
- /csun26 → /csun
- /csun25 → /csun
- /atia26 → /atia
- /atia25 → /atia
- /sonification → /sonification-award-2026
- /audiom-experience-builder → external GitHub pages URL
- Plus 6 more slug aliases

### Custom CSS/JS (3 entries in Simple Custom CSS and JS)
1. **CH 80** (CSS, by silas, 2024/05/17) — couldn't read contents (CodeMirror editor didn't load)
2. **Interactive Focus Styles** (CSS, by Steven Woodson, 2024/01/14) — focus ring styles
3. **Custom_Astra_JS** (JS, by silas, 2023/07/28) — Astra theme JS customizations

## Summary of Migration-Critical Features

### 1. Theme Switcher (Default / Dark / High Contrast)
The site has a custom 3-mode theme switcher stored in localStorage. This is NOT a WordPress feature — it's pure JS + CSS that modifies inline styles and CSS classes. This carries over directly to a static site. The implementation is messy (multiple overlapping snippets doing similar things, heavy use of inline styles targeting Spectra-specific class names), so migration is a chance to clean this up with proper CSS custom properties + a `data-theme` attribute approach.

### 2. Able Player (Accessible Video)
Used on homepage. Needs: Able Player JS/CSS loaded, jQuery, YouTube iframe API. Self-contained — just needs the library files and the `<video>` element with proper attributes.

### 3. Audiom Map Embeds
All maps are iframes to `www.audiom.net/embed/{id}`. Dead simple. Just an iframe per page.

### 4. Contact Forms (WPForms → static form service)
Footer has 2 forms (mobile/desktop — form IDs 1507 and 2494). Contact page has a form. Need: name, email, message fields. Replace with Netlify Forms, Formspree, or similar. The duplicate-ID hacks and autocomplete fixes become unnecessary if we just write correct HTML.

### 5. Keyboard Navigation Fixes
Mobile menu Escape key handling, aria-label on active menu item. These need to be in the new site's JS but are simple event listeners.

### 6. Blog Post Grid Fixes
Remove redundant image links, disable hover transforms. These are Spectra-specific hacks — in a custom Hugo template, we just don't generate the redundant links in the first place.

## Still Unknown
- [ ] Contents of the 3 Custom CSS/JS entries (couldn't read from CodeMirror)
- [ ] Auth0 — is it actually used on any public-facing pages? Need to check Content Control config.
- [ ] Media library — total image count/size for export
- [ ] Astra theme customizer settings (exact color values, spacing, typography)
