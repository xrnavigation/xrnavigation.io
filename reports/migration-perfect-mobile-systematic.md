# Systematic Mobile CSS Fix Report
## 2026-04-01

## Summary

Systematic audit of responsive CSS rules comparing WordPress Astra theme output against Hugo CSS, 
followed by targeted fixes for the largest mobile rendering gaps. Focused on CSS-fixable issues 
across all page types without regressing already-tuned embed pages.

## Methodology

1. Extracted all 95 `@media` query blocks from the WP dynamic CSS (`inline-astra-theme-css-inline-css.css`)
2. Compared against existing Hugo responsive rules in `wordpress-compat.css` and `main.css`
3. Identified missing responsive rules and structural gaps
4. Applied fixes iteratively with visual comparison against WP baseline screenshots
5. Verified no desktop regressions and no embed page regressions

## Key Findings

### What WP Does at Mobile (<=921px)
- `html { font-size: 91.2% }` scales all rem/em units (we intentionally omit this — all our values are px-based, and it causes regressions on tuned embed pages)
- Desktop header hidden, mobile header shown (already implemented)
- `.ast-container { max-width: 1240px }` on desktop, flex-direction column on mobile
- Block padding custom properties reduced at mobile breakpoints
- Site title hidden, content container stacks vertically
- Blog card images hidden, card padding reduced
- Collection page images hidden, excessive padding removed
- Homepage sections lose min-height constraints

### Root Cause Categories
1. **CSS-fixable**: min-height constraints, excessive padding, blog card sizing, collection layout (FIXED)
2. **Text reflow**: Different effective content widths cause text wrapping differences (~1-3% per page, NOT fixable without matching exact WP rem scaling)
3. **Template differences**: Contact page (67%), WCAG table (60%) have fundamentally different templates/content (NOT CSS-fixable)
4. **Footer content**: Different menu items and form content (NOT CSS-fixable)

## Fixes Applied

### Global Responsive (wordpress-compat.css)
- `.ast-container { max-width: 1240px }` (was 100%)
- `.site-content .ast-container { display: flex }` (desktop layout, block on embed)
- Block padding custom properties at <=921px and <=544px
- `.site-title { display: none }` at <=921px
- `.site-content .ast-container { flex-direction: column }` at <=921px
- `#primary` padding/margin zero at <=921px
- `.wp-block-columns .wp-block-column` margin-bottom at <=544px

### Blog Responsive
- `.blog-hero` min-height auto, padding 40px on mobile
- Blog hero h1 font-size 30px (matched specificity of desktop `.blog-hero h1.change-heading` rule)
- Blog card padding reduced from 30px/40px to 20px/25px on mobile
- Blog grid gap reduced from 30px to 20px on mobile

### Collection Pages Responsive
- Info-box images hidden on mobile (matches WP behavior)
- Info-box sections: padding 192px -> 40px, full-width text
- Feature cards: padding 192px -> 40px
- Hero: min-height auto (was 100vh)
- CTA: min-height auto (was 85vh)

### Homepage Responsive
- All sections: min-height auto on mobile (hero, why, clients, what-is)
- Clients bottom padding: 100px -> 40px
- Team bottom padding: 100px -> 40px
- Video wrapper: min-height auto
- Pre-footer map: padding-top 250px -> 100px
- Contact form card: max-width 95%, reduced padding

## Results

### Mobile Scores (375px viewport)
| Page | Before | After | Change |
|------|--------|-------|--------|
| home | 35.94% | 28.95% | **-6.99** |
| blog | 56.61% | 46.57% | **-10.04** |
| universities | 44.24% | 44.12% | -0.12 |
| privacy-policy | 19.26% | 19.26% | 0 |
| a11y-statement | 30.15% | 30.15% | 0 |
| aquarium | 13.59% | 13.59% | 0 |
| events | 19.18% | 19.18% | 0 |
| audiom-demo | 10.93% | 10.93% | 0 |
| bovine | 11.43% | 11.43% | 0 |
| skeleton | 12.35% | 12.35% | 0 |

### No Regressions
- All embed pages stable (10-12%)
- Desktop scores unchanged

### Remaining High-Diff Pages (NOT CSS-fixable)
- **contact (67%)**: Template fundamentally different (WP has dark hero + wpforms card, Hugo has plain form)
- **wcag-table (60%)**: Missing table content in Hugo rendering
- **fcoi (47%)**: Short page where footer dominates diff
- **about-audiom (47%)**: Text reflow differences from width/padding variance
- **blog (47%)**: Card content height differences

## Files Changed
- `themes/xrnav/static/css/wordpress-compat.css` — all responsive CSS fixes
