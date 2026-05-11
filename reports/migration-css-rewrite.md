# CSS Rewrite Report

Date: 2026-03-30
Commit: 5f0dfac

## Summary

Rewrote `themes/xrnav/static/css/main.css` from scratch to match WordPress Astra computed styles documented in `data/wp-css-spec.md`. All pixel values taken directly from the spec.

## Major CSS Changes

### Header
- Changed from sticky white background with border-bottom to transparent, static, 80px height
- Removed max-width wrapper constraint on header inner

### Typography
- Body color changed from #15191d to #000000 (spec value)
- h1: 40px/800/56px line-height (was generic 1.2 line-height for all headings)
- h2: 40px/700/50px line-height (was 800 weight like all headings)
- h3: 24px/600/31.2px line-height (was 800 weight)
- Added per-element margin-bottom values (20px for h1/h2, 16px for h3)
- Paragraph margin-bottom: 25.6px for standard pages, 16px for homepage

### Navigation
- Color changed from --color-text (#15191d) to --color-heading (#04203e)
- Added text-transform: capitalize, letter-spacing: 0.3px, font-weight: 700

### Footer
- Background changed from white to #04203e (dark blue)
- Grid changed from up-to-4-column to 2-column (repeat(2, 1fr))
- Padding set to 45px 95.25px, gap to 50px
- Headings: 24px/800/white
- Links: 16px/white/no-underline
- Form inputs: padding 6px 10px, border-radius 2px, border 1px solid #ccc, height 38px
- Submit button: bg #eee, color #333, padding 10px 15px, font-weight 800
- Below-footer: separate #15191d background, padding 10px 0 0

### Blog Grid
- Grid columns changed from 1fr to 380px 380px 380px at desktop
- Card bg changed from white to #f6f6f6
- Card border removed, box-shadow added: rgba(0,0,0,0.44) 10px 10px 20px -8px
- Card border-radius changed from 8px to 10px
- Card padding: 30px 40px 10px
- Card image container: 261px height, overflow hidden
- Card title: 20px/800, color #f9fafb
- Card excerpt: color #f9fafb
- Card meta: 14px, color #fff

### Buttons
- Primary button: bg #f9fafb, color #15191d, border 1px solid #04203e, Montserrat 16px/600
- Secondary button: bg #fff, color #04203e, border 1px solid #333, Montserrat 16px/700
- Both: padding 15px 20px, border-radius 4px, text-transform capitalize

### Layout
- Removed global max-width 1200px on #main-content
- Each homepage section now uses spec percentage-based inner widths (70%, 80%, min(100%, 1200px))
- Homepage section padding matched to spec (hero 152px, why 104px/160px, what-is 100px, etc.)

### Breakpoints
- Mobile nav breakpoint corrected from 920px to 921px
- Desktop breakpoint at 922px
- Responsive heading sizes: h1 30px, h2 25px, h3 20px at <=921px

### Preserved
- All CSS custom property names (--color-*, --outline-*, --font-*)
- Focus styles (Steven Woodson's Interactive Focus Styles)
- Skip link and sr-only utilities
- Dark mode compatibility (dark-mode.css still works via custom properties)

## Template Changes

### `themes/xrnav/layouts/partials/footer.html`
- Moved `.footer-bottom` div outside the `<footer>` element so it can have its own #15191d background independent of the #04203e footer background

### `themes/xrnav/layouts/page/audiom-embed.html`
- Added `.audiom-section` wrapper with `.audiom-section-inner` for 160px top/bottom padding and min(100%, 1200px) max-width constraint

## Hugo Build Verification
- Hugo built cleanly: 98 pages, 257 static files, 0 errors
