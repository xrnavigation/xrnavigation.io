# Mobile Embed Page Visual Fidelity Report
## 2026-03-30

## Summary

Mobile (375px viewport) visual fidelity for audiom embed pages improved from **27-61% diff** to **10-12% diff** for standard pages. The remaining diff is primarily from dynamic iframe content and menu text differences that are not CSS-addressable.

## Starting State

Mobile baselines captured from live WP site at 375px width showed large diffs:
- audiom-demo: 61.35% (Hugo 868px taller)
- audiom-human-skeleton-diagram: 40.38%
- csun: 28.81%
- lske-map-1: 25.64%

## Root Causes Found

1. **Footer visibility inverted**: WP shows above-footer (2-col links+form) on mobile, hides primary-footer (4-col). Hugo had this backwards.
2. **ast-container padding**: `.audiom-embed-page .ast-container` selector was wrong -- `.audiom-embed-page` is on the article (child of ast-container), not an ancestor. Content was 335px instead of 375px.
3. **No mobile responsive CSS for embed pages**: Desktop values (160px padding, 40px font) applied unchanged at 375px.
4. **Homepage CSS leaking**: `.wp-block-uagb-container.alignfull .uagb-container-inner-blocks-wrap` with `!important` was overriding embed inner padding.
5. **Footer grid width**: Inner container had max-width:1200px and margin:auto shrinking it inside grid parent. Grid lacked the 35px side padding WP uses.
6. **Footer form content**: Hugo had newsletter form, WP has contact form on mobile.
7. **Font size**: WP uses 14.592px body font on mobile, Hugo had 16px on paragraphs.

## Fixes Applied

### Templates
- `baseof.html`: Added `audiom-embed-body` class to body for embed pages
- `footer.html`: Contact form in above-footer section 2 (was newsletter), WP-matching copyright text (already committed by prior agent)

### CSS (wordpress-compat.css)
- Footer swap: above-footer `display:grid`, primary-footer `display:none` at `<=921px`
- Footer grid: `max-width:none; width:100%` on inner, `padding:0 35px` on grid, `row-gap:0`
- Footer sections: `margin-bottom:10px`, form `margin:24px 0`
- Footer below: `padding:15px 7.5px 7.5px; min-height:80px`
- Footer h2: `margin-top:0; margin-bottom:8px`
- Footer labels: `line-height:20.8px`
- Footer button: `font-size:14.592px; border:1px solid #ddd; border-radius:0`
- Embed content: `font-size:14.592px; line-height:23.3472px` for p on mobile
- Contained variant: `padding:10px 0`, inner `max-width:min(100%,767px)`, h1 `padding-bottom:50px; max-width:338px`
- Homepage CSS scoped to `.home-page` to prevent embed override

### CSS (main.css)
- Fixed selector: `.audiom-embed-body .ast-container` (was `.audiom-embed-page .ast-container`)

## Final Results

### Standard embed pages (10-12%):
| Page | Diff | Height (Hugo vs WP) |
|------|------|---------------------|
| csun | 10.01% | 2297 vs 2310 (-13px) |
| lske-map-3 | 10.43% | 2255 vs 2268 (-13px) |
| audiom-tvm-map-1 | 10.88% | 2255 vs 2268 (-13px) |
| lske-map-4 | 10.89% | 2255 vs 2268 (-13px) |
| audiom-demo | 10.93% | 2118 vs 2124 (-6px) |
| lske-map-1 | 11.03% | 2255 vs 2268 (-13px) |
| lske-map-2 | 11.07% | 2255 vs 2268 (-13px) |
| audiom-tvm-map-2 | 11.15% | 2255 vs 2268 (-13px) |
| audiom-bovine-manus | 11.43% | 1997 vs 2010 (-13px) |
| jernigan-institute | 11.59% | 2020 vs 2033 (-13px) |
| atia | 11.66% | 1997 vs 2010 (-13px) |
| nfb24 | 11.72% | 1903 vs 1916 (-13px) |
| eclipse24 | 12.05% | 1857 vs 1870 (-13px) |
| election2024 | 12.26% | 1903 vs 1916 (-13px) |
| audiom-airplane | 12.35% | 1903 vs 1916 (-13px) |
| audiom-skeleton | 12.35% | 1997 vs 2010 (-13px) |
| audiom-covid-map | 12.53% | 2232 vs 2249 (-17px) |

### Outliers (>15%):
| Page | Diff | Reason |
|------|------|--------|
| audiom-rat-dissection | 18.89% | Multi-section page, text wrapping diffs |
| audiom-sheep-brain | 19.75% | Multi-section page, text wrapping diffs |
| audiom-airbus-lopa | 29.41% | Complex SVG seat map renders differently |
| gatech | 28.34% | Dynamic map content in iframe |

### Desktop regression check:
- eclipse24: 4.52% (stable)
- lske-map-1: 3.24% (stable)
- audiom-demo: 5.32% (stable)
- home: 10.83% (stable)

## Irreducible Diff Floor (~10%)

The remaining 10-12% comes from:
- **Iframe dynamic content (6-8%)**: Audiom maps render interactive elements (avatars, controls, tooltips) differently between captures
- **Menu content differences (2-3%)**: Hugo footer_learn has 4 items (Contact Us, Evaluate Your Map, Audiom for Personal Use, Accessibility Statement) vs WP's 3 items (Evaluate Your Map, Accessibility Statement, More Info)
- **Header (1%)**: 1px height difference, hamburger button slightly different size
- **13px systematic height gap**: Footer section content height differs slightly due to menu text and form wrapper padding

## Files Changed
- `themes/xrnav/layouts/_default/baseof.html`
- `themes/xrnav/static/css/wordpress-compat.css`
- `themes/xrnav/static/css/main.css`
- `tests/mobile-diff.js` (new)
