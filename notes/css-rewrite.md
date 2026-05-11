# CSS Rewrite Notes

## 2026-03-30

### Observed: Current main.css vs wp-css-spec.md differences

**Header:** Current uses sticky white bg with border-bottom, max-width 1200px wrapper. Spec: transparent bg, static position, 80px height, no border.

**Body:** Current color is --color-text (#15191d). Spec: color #000.

**Typography:** Current h1-h6 all use weight 800, line-height 1.2. Spec: h2=700, h3=600, specific line-heights (56px, 50px, 31.2px). No margin-bottom values set per heading level.

**Nav links:** Current uses --color-text, no text-transform, no letter-spacing. Spec: color #04203e, capitalize, 0.3px letter-spacing, weight 700.

**Footer:** Current uses white bg, 1-4 column grid, border-top. Spec: #04203e bg, 2-column grid, padding 45px 95.25px, gap 50px. Below-footer: #15191d bg.

**Blog grid:** Current uses 1fr columns, 1px border, white bg, 8px radius. Spec: 380px columns, no border, #f6f6f6 bg, 10px radius, specific box-shadow, card titles #f9fafb.

**Buttons:** Current .btn-primary uses accent green. Spec: primary bg #f9fafb, color #15191d, border 1px solid #04203e, Montserrat font.

**Layout:** Current uses max-width 1200px wrapper on #main-content. Spec: no global wrapper, percentage-based inner widths per section.

**Audiom embed:** Current has no special padding. Spec: 160px top/bottom padding, min(100%,1200px) inner.

**Breakpoints:** Current uses 920px max-width. Spec: 921px max-width.

### Template issues observed
- Footer has 4 columns (quick links, learn more, contact, brand). Spec says 2-column grid. Structure is fine for 2-col grid CSS.
- Blog list template structure is fine, just needs CSS fixes.
- Audiom embed template needs wrapper section for padding.

### Completed

- Rewrote main.css (615 insertions, 374 deletions)
- Updated footer.html: moved footer-bottom outside `<footer>` for separate #15191d bg
- Updated audiom-embed.html: added wrapper section for 160px padding
- Hugo build: clean, 98 pages, 0 errors
- Commit: 5f0dfac
- Report written to reports/migration-css-rewrite.md
- Dark-mode.css not modified; custom property names preserved for compatibility
