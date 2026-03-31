# Homepage Visual Diff Reduction Report

Date: 2026-03-30
Baseline: `tests/baseline/home-desktop.png` (1920x6770)
Starting diff: **56.32%**
Final diff: **22.14%**
Page height: 6798px vs 6770px baseline (28px over, 0.4% difference)

## Summary

Reduced homepage visual diff from 56% to 22% across 8 iterations. Added comprehensive homepage section CSS (~350 lines) and restructured the Why+Video section template. The remaining 22% is dominated by a structural constraint: the Able Player video renders ~350px shorter in Hugo than in WordPress, creating a cascading vertical offset for all downstream sections.

## Changes Made

### Template (`layouts/index.html`)
- Merged separate Why and Video sections into a single 2-column layout (text left, video right) to match WP structure
- Added pre-footer map band `<div class="pre-footer-map">` for the decorative map image between contact and footer

### CSS (`themes/xrnav/static/css/wordpress-compat.css`)
Added ~350 lines of homepage section styles covering all 9 sections:

1. **Hero**: Background image with dark overlay (opacity 0.8), 152px padding, min-height 60vh, centered text
2. **Steps**: 3-card row with -75px margin overlap, rounded corners, box shadow, 40px card padding
3. **Why+Video**: 2-column flex row, 104px/160px padding, 100px column gap, min-height 1030px
4. **Clients**: Logo bar in horizontal flex row, 0/100px padding, 70% inner width
5. **What Is Audiom**: Background image (blind-man-guide-dog), dark overlay (rgba(20,24,28,0.84)), 90vh min-height, white text
6. **Use Cases**: 2x2 grid, rounded cards with shadows, 100px/100px padding, off-white bg
7. **Team**: Flex row of photo cards, 85px/85px padding
8. **Contact**: Centered form, 50px/200px padding
9. **Pre-footer map**: Background image (map artboard), 50vh min-height

### Key Fixes
- **Hero bg image 404**: Filename contained literal `%C2%B7` characters; CSS URL needed double-encoding (`%25C2%25B7`)
- **Padding values from wp-css-spec.md were WRONG**: The spec table was offset by 1 section from row 3 onward. Corrected all values using live WP measurements via browser JS
- **Section inner widths**: Matched WP's per-section max-width values (70%, 80%, min(100%,1200px))

## Diff by Region (Final)

| Region | Diff | Notes |
|--------|------|-------|
| 0-10% (Hero) | 18% | Background image position rendering |
| 10-20% (Steps) | 16% | Text wrapping differences |
| 20-30% (Why) | 12% | Video player height |
| 30-40% (Clients/What Is) | 47% | Vertical offset from Why section |
| 40-50% (What Is/Use Cases) | 18% | Vertical offset |
| 50-60% (Use Cases) | 42% | Vertical offset |
| 60-70% (Use Cases/Team) | 7% | Close match |
| 70-80% (Team/Contact) | 1% | Nearly identical |
| 80-90% (Contact/Map) | 34% | Contact structure differs |
| 90-100% (Map/Footer) | 24% | Footer offset |

## Remaining Diff Analysis

The 22% diff breaks down into three root causes:

### 1. Able Player Height Mismatch (~40% of remaining diff)
WP's Why section is 1257px (video player 536px + transcript block 419px + padding 264px). Hugo's Why section is 1030px. The 227px shortfall cascades to all sections below, shifting Clients, What Is, Use Cases, Team, and Contact sections upward relative to the baseline. This accounts for the high diffs in regions 30-40% (47%) and 50-60% (42%).

### 2. Contact Section Structure (~30% of remaining diff)
WP splits contact into 3 sections: heading (50px/200px), floating form card (-15% margins), and map band. Hugo has a single contact section with the form inline. The WP floating card effect overlaps both the contact heading and map band.

### 3. Background Image Rendering (~20% of remaining diff)
Hero background with `background-attachment: fixed` renders slightly differently between WP and Hugo Playwright captures. The parallax effect shows different portions of the background image.

## Files Modified
- `layouts/index.html` (template restructure)
- `themes/xrnav/static/css/wordpress-compat.css` (homepage section CSS)

## Files Created
- `tests/screenshot-home.js` (Playwright screenshot script)
- `tests/diff-home.js` (pixelmatch diff script)
- `notes/migration-perfect-homepage.md` (working notes)

## Next Steps to Reduce Further
1. Match Able Player video height by ensuring transcript block renders below video (requires Able Player config or additional HTML)
2. Replicate WP floating contact form card with negative margins overlapping the map band
3. Fine-tune background-position values for hero and What Is sections
