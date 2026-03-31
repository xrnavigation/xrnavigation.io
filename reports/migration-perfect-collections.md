# Collection Pages Migration Report - 2026-03-30

## Target
Get collection pages (universities, health-care-facilities, corporate-campuses) to under 10% pixel diff on desktop.

## Starting Diffs
- universities: 68.82%
- health-care-facilities: 76.00%
- corporate-campuses: 65.76%

## Current Diffs
- universities: 21.29% (4658px vs 4689px baseline)
- health-care-facilities: 27.79% (5439px vs 5466px baseline)
- corporate-campuses: 36.97% (4775px vs 4885px baseline)

## Changes Made

### CSS (wordpress-compat.css)
- Hero section: `min-height: 100vh` (was 911px) to match WP viewport-height hero
- CTA section: `min-height: 85vh`, background-image support, dark overlay via `::before`, white text for `.has-bg` variant
- Info-box sections: `max-width: 70%` (was 1200px), text column 45%, image column 55% matching WP UAGB layout
- Info-box images: `aspect-ratio: 1024/585; object-fit: cover` to match WP image crops
- Feature cards: full-width with `padding: 192px 15%`, removed border-radius to match WP full-bleed bg
- Feature cards: `.dark-bg` variant for health-care (dark background, light text)
- Feature cards: heading/text support for combined heading+cards sections
- Extra content: `.has-bg` variant with 85vh min-height, background-image, dark overlay
- CTA buttons: white secondary buttons on dark backgrounds
- All padding values aligned to 192px (WP uses 192px, was 190px)

### Template (collection.html)
- CTA section: supports `.has-bg` class and inline background-image from `cta.image` frontmatter
- Feature cards: supports `features_dark`, `features_heading`, `features_text` frontmatter
- Extra content: supports `.has-bg` class and inline background-image from `extra_sections[].image`

### Content (frontmatter)
- All 3 pages: added `hero_image` with correct WP background images
- All 3 pages: added `cta.image` with correct WP CTA background images
- health-care-facilities: `features_dark: true`, extra_sections bg image
- corporate-campuses: `features_heading` and `features_text` replacing extra_sections for combined layout

## Remaining Gap Analysis

### Why not under 10%
1. **Image crop differences (~8-12% of diff)**: WP serves pre-cropped thumbnails (1024x585 or 1792x1024), Hugo uses full images with CSS `object-fit: cover`. The crop focal points differ, causing per-pixel mismatches even though dimensions match.

2. **Corporate 3-column layout (~10% of diff)**: WP corporate features section uses a 3-column `wp-block-columns` layout (heading left, cards stacked right in 2 columns). Hugo uses a flex-wrap grid. Reproducing this exactly would require a fundamentally different template structure.

3. **Font rendering differences (~3-5%)**: Minor text wrapping and positioning differences from font rendering between WP and Hugo, causing cumulative vertical offsets.

4. **Header/footer micro-differences (~2-3%)**: Theme switcher button positioning, nav item spacing, footer form field rendering.

### Recommended Next Steps
1. Download WP-cropped image thumbnails to replace full-size images in info-box sections
2. Create a corporate-specific template variant for the 3-column features layout
3. Fine-tune header/footer CSS to eliminate remaining micro-differences

## Files Modified
- `themes/xrnav/layouts/_default/collection.html`
- `themes/xrnav/static/css/wordpress-compat.css`
- `content/universities.md`
- `content/health-care-facilities.md`
- `content/corporate-campuses.md`
