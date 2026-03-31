# Task: Rewrite Hugo Theme CSS to Match WordPress Astra Theme

## Goal
Rewrite `themes/xrnav/static/css/main.css` so the Hugo site visually matches the live WordPress site. Use the extracted CSS specification at `data/wp-css-spec.md` as the authoritative reference for every value.

## Context
Read these files first:
- `data/wp-css-spec.md` — THE TRUTH. Every CSS value in this file was extracted from the live WordPress site's computed styles.
- `data/wp-computed-styles.json` — same data in JSON form
- `themes/xrnav/static/css/main.css` — current Hugo theme CSS to rewrite
- `themes/xrnav/static/css/dark-mode.css` — dark mode overrides (don't break these)

## What Must Match

### Global
- Body: bg #f9fafb, font Lato 16px/1.6, color #000
- No global max-width wrapper — sections use percentage-based inner max-widths

### Header (80px height)
- Height: 80px, background: transparent, position: static
- Logo: 83px x 47px
- Nav links: Lato 16px/700, color #04203e, text-transform capitalize, letter-spacing 0.3px, padding 0 16px
- Hamburger at 921px breakpoint

### Typography
- h1: Montserrat 40px/800, line-height 56px, margin-bottom 20px
- h2: Montserrat 40px/700, line-height 50px, color #04203e, margin-bottom 20px
- h3: Montserrat 24px/600, line-height 31.2px, color #04203e, margin-bottom 16px
- p: Lato 16px/400, line-height 24px (homepage) or 25.6px (pages), margin-bottom 16px or 25.6px
- Responsive: h1→30px, h2→25px, h3→20px at <=921px

### Content Layout
- Each section is full-width with inner content constrained by percentage
- Common inner widths: 70%, 80%, min(100%, 1200px)
- Homepage sections have specific padding values (see wp-css-spec.md section table)

### Footer
- Primary footer: bg #04203e, padding 45px 95.25px, 2-column grid, gap 50px
- Footer headings: Montserrat 24px/800, white
- Footer links: 16px, white, no underline
- Footer form inputs: padding 6px 10px, border-radius 2px, border 1px solid #ccc, height 38px
- Footer button: bg #eee, color #333, padding 10px 15px, font-weight 800
- Below-footer: bg #15191d, padding 10px 0 0

### Blog Grid
- 3 columns at 380px each, gap 30px
- Cards: padding 30px 40px 10px, box-shadow rgba(0,0,0,0.44) 10px 10px 20px -8px, border-radius 10px, bg #f6f6f6
- Card title: Montserrat 20px/800, color #f9fafb
- Card excerpt: 16px, color #f9fafb
- Card image container: 261px height, overflow hidden, object-fit cover

### Audiom Embed Pages
- Wrapper: padding 160px top/bottom
- Inner: max-width min(100%, 1200px)
- Title: Montserrat 40px/800, color #04203e

### Standard Pages
- Images: border-radius 20px, max-width 100%
- Content widths: 55%, 70%, min(100%, 1200px) depending on section

### Buttons
- Primary: bg #f9fafb, color #15191d, padding 15px 20px, border-radius 4px, font Montserrat 16px/600, border 1px solid #04203e, text-transform capitalize
- Secondary: bg #fff, color #04203e, same padding/radius, font Montserrat 16px/700, border 1px solid #333

## Implementation Notes
- Rewrite main.css from scratch if needed — don't try to patch, just make it right
- Keep CSS custom properties for colors (--color-*) so dark mode overrides still work
- Keep the focus styles that were already merged (--outline-color etc.)
- Don't break dark-mode.css — it depends on the custom property names
- Make sure responsive breakpoints match: 921px and 544px

## Also Update Templates If Needed
If the CSS spec reveals structural HTML differences (e.g., footer needs a 2-column grid wrapper, blog cards need different markup), update the Hugo templates to match. The CSS can't fix wrong HTML structure.

Files that might need template changes:
- `themes/xrnav/layouts/partials/footer.html`
- `themes/xrnav/layouts/blog/list.html`
- `themes/xrnav/layouts/page/audiom-embed.html`
- `themes/xrnav/layouts/_default/single.html`

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Verify
After rewriting, run `hugo` to confirm it builds cleanly.

## Git Instructions
- `git add themes/ layouts/`
- `git commit -m "Rewrite theme CSS to match WordPress Astra computed styles"`
- Include commit hash in report

## Report
Write your report to `reports/migration-css-rewrite.md` with:
- What was changed (summary of major CSS differences fixed)
- Any template changes made
- Hugo build verification
- Commit hash
