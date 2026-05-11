# Collection Pages Migration - 2026-03-30

## Starting diffs
- universities: 68.82% (baseline 4689px, current 2848px)
- health-care-facilities: 76.00% (baseline 5466px, current 3462px)
- corporate-campuses: 65.76% (baseline 4885px, current 3158px)

## Observed WP layout values (from chrome inspection)
- Hero: min-height 911px, bg image with overlay, padding 10px
- Hero titles differ from page titles (e.g. "Transform Your Campus with Audiom..." not "Universities")
- Info-box sections: padding 190.5px 0px (first), 0px 0px 190.5px (second)
- Feature cards section: padding 190.5px 0px, bg #f9fafb
- CTA section: padding 0px 0px 100px
- Extra content sections vary per page

## Hugo current layout values
- Hero: min-height 60vh (~547px), padding 80px 32px
- Info-box: padding 32px (2rem)
- Feature cards: padding 32px (2rem)
- CTA: padding 48px 32px

## Root cause of height difference
Hugo pages are ~1800px shorter than WP because:
1. Hero is 364px too short (911 vs 547)
2. Info-box sections missing ~320px padding each
3. Feature cards missing ~320px padding
4. CTA section missing ~50px padding

## 2026-03-30 session 2 observations

Current diffs: universities 59%, health-care 75%, corporate 68%.

**CSS values in wordpress-compat.css are already correct** (911px min-height, 190px padding, etc.) — confirmed via curl of served file. But Playwright renders different values (60vh, 32px padding). Browser also shows wrong values.

**Root cause found**: The CSS rules exist at line 1593+ of wordpress-compat.css with correct WP-matched values. However the browser computes different values (hero min-height 546.6px = 60vh, padding 80px/32px). No overriding rules found in main.css or dark-mode.css. No inline styles. Suspicion: browser may be caching an older version of the CSS file.

**Visual diff analysis** (from screenshots):
1. Header nav layout differs (Hugo has extra items like "Audiom Kiosk", "About Our Partnership")
2. Hero height roughly close but not exact
3. Info-box sections padding is too small → cumulative height drift
4. Feature cards padding too small
5. Footer completely different (Hugo has contact form, WP is simpler)
6. Hugo page is ~856px shorter than baseline (3833 vs 4689)

## Playwright measurements (actual rendered values)

**CSS IS applying correctly in Playwright** (browser was just cached). Hero=911px, info-box=190px padding. Confirmed via curl + Playwright.

### Universities: Hugo 3833px vs WP 4689px (diff 856px)
| Section | WP height | Hugo height | Gap |
|---------|-----------|-------------|-----|
| Hero | 1080 (100vh) | 911 (911px) | +169 |
| Info-box 1 | 862 | 861 | ~0 |
| Info-box 2 | 591 | 528 | +63 |
| Feature cards | 711 | 681 | +30 |
| CTA | 918 (85vh, bg-img) | 326 (no min-h, no bg) | +592 |
| Footer | 526 | 526 | 0 |

### Health-care-facilities: WP 5466px
- Hero: 1080 (100vh, bg-img)
- Section 1: 783 (pt/pb 192)
- Section 2: 591 (pb 192)
- Section 3: 649 (pt/pb 192, bg) — this is feature cards with bg
- Section 4: 918 (bg) — extra content section?
- Section 5: 918 (pb 100, bg) — CTA
- Footer: 526

### Corporate-campuses: WP 4885px
- Hero: 1080 (100vh, bg-img)
- Section 1: 783 (pt/pb 192)
- Section 2: 591 (pb 192)
- Section 3: 918 (pb 100, bg) — CTA
- Footer: 526
- NOTE: only 4 root sections visible (missing extra-content + feature-cards area — these may be between sections 2 and 3 but not root containers)

### Key fixes needed
1. **Hero min-height: 100vh** not 911px (WP uses 100vh)
2. **CTA section needs**: min-height 85vh, background-image, background overlay (dark)
3. **CTA background images**: universities=blind-man-reading-2022-08-18-14-49-22-utc.webp
4. Need to check HC and corporate CTA bg images too
5. Hero images need to be set in frontmatter (universities hero_image missing)
6. Info-box padding is 192px on WP vs 190px in CSS — close enough
7. Health-care has an extra bg section (section 4, 918px) that may be the "extra_sections" or "feature cards" with a bg image

## WP background images per page
- **Universities**: hero=DALL·E...university-campus.webp, CTA=blind-man-reading-2022-08-18-14-49-22-utc.webp
- **Health-care**: hero=ambulance-vehicles-on-an-hospital-parking-emergen-2021-08-26-18-12-54-utc.webp, CTA=young-blind-man-with-white-cane-walking-across-the-2023-10-05-23-59-55-utc-e1697653999503.webp
- **Corporate**: hero=DALL·E-2023-10-17-13.21.37-A-composite-image...corporate-campus.webp, CTA=young-blind-person-with-long-cane-walking-in-a-cit-2021-08-29-01-16-07-utc.webp
- All images confirmed present in static/images/

## Changes in progress
1. CSS: hero min-height changed from 911px → 100vh ✓
2. CSS: CTA section gets min-height 85vh, bg-image support, dark overlay (.has-bg) ✓
3. CSS: CTA h2/p get white text when .has-bg ✓
4. Still need: z-index on CTA p and buttons, template update for CTA bg-image, frontmatter hero_image + cta.image for all 3 pages

## After first round of fixes - diff results
- universities: 59% → 25.94% (4594 vs 4689, 95px short)
- health-care: 75% → 47.55% (5320 vs 5466, 146px short)
- corporate: 68% → 37.79% (4952 vs 4885, 67px TALL)

## Remaining issues to fix
1. Info-box padding 190→192 to match WP exactly (gains ~4px per section)
2. Feature-cards padding 190→192
3. Health-care: feature-cards (sec3) has dark bg (#04203e) with white text in WP — need frontmatter support
4. Health-care: extra_sections + CTA share bg image (both 85vh) — need template change to wrap them
5. CTA buttons need white text when on dark bg
6. Universities CTA button colors need to work on dark overlay
7. Header nav differences (minor, structural)

## Done so far
- All hero_image and cta.image frontmatter set ✓
- CSS hero: 100vh ✓, CTA: 85vh + bg + overlay ✓
- Template: CTA bg-image support ✓
- Info-box padding 190→192, feature-cards padding 190→192 ✓
- CSS: feature-cards .dark-bg variant (dark bg, white text) ✓
- CSS: extra-content .has-bg variant (85vh, bg-image, overlay, white text) ✓
- Template: feature-cards supports features_dark flag, extra_sections support .image bg ✓
## Round 2 results (25-40% range)
universities: 25.46% (4604 vs 4689, 85px short)
health-care: 40.38% (5804 vs 5466, 338px TALL)
corporate: 37.09% (4937 vs 4885, 52px tall)

### Universities section comparison (Hugo vs WP)
| Section | Hugo | WP | Delta |
|---------|------|-----|-------|
| Hero | 1080 | 1080 | 0 |
| Info-box 1 | 865 | 862 | +3 |
| Info-box 2 | 530 | 591 | -61 |
| Feature cards | 685 | 711 | -26 |
| CTA | 918 | 918 | 0 |
| Footer | 526 | 526 | 0 |
Gap = -85px, mainly from info-box-2 (-61) and feature-cards (-26)

### Health-care: 338px too tall because:
- Extra-content section: 918px (85vh) — WP also has 918px BUT
- WP total was 5466, Hugo is 5804. Extra diff = 338px
- WP info-box-1: 783, Hugo: 971 (+188!!)
- WP info-box-2: 591, Hugo: 779 (+188!!)
- The info-box text is wrapping more on WP due to different container width?
- Health-care info boxes are much taller on Hugo. Need to investigate.

### Key blockers
1. Universities: info-box-2 and feature-cards are shorter than WP (content height difference)
2. Health-care: info-boxes are WAY taller than WP (+188px each). Probably container width issue.
3. Corporate: slightly tall, same class of issue

## Container width fix
- WP uses max-width 70% for inner containers (= 1344px at 1920), Hugo had 1200px → changed to 70%
- WP info-box columns: text 45% / image 55% (not 50/50) → updated flex
- Changing info-box-image flex to match (currently 50%, should be 55%)
- Updated image flex to 55%, text to 45% ✓

## Round 3 results
- universities: 21.30% (4658 vs 4689, 31px short) — improving
- health-care: 48.94% (6054 vs 5466, 588px TALL) — worse, info-boxes too tall
- corporate: 39.60% (4988 vs 4885, 103px tall)

## Width analysis: health-care info-boxes
Hugo: text 587px (h=378), img 717px (h=724), section 1344px
WP:   text 575px (h=?),   img 699px, section inner 1344px

Hugo images are 724px tall, much taller than expected. WP images were ~399px (inner-blocks height).
The IMAGES are driving the section height, not text. Images at 717px wide * aspect ratio = 724px tall.
WP images were in a 699px column but the images themselves were likely constrained differently.

The core issue: Hugo images render at full column width (717px → 724px tall), while WP images were smaller.
Need to check if WP images had a max-height or were sized differently.

## Round 3 image fix
- WP images are 1024x585 (landscape crop), Hugo images are square → applied aspect-ratio: 1024/585; object-fit: cover
- This fixed health-care dramatically: 49% → 29%, height now nearly matches

## Round 3 container width fix
- WP info-box inner: max-width 70% (1344px), text 45%, image 55% → applied all three
- WP feature-cards/extra-content: also 70% max-width → applied

## Round 3 corporate section order
- WP corporate: extra_section heading "Join the Movement" + feature cards are in ONE combined group
- Hugo renders features then extra_sections separately → added features_heading/features_text to template
- Updated corporate frontmatter to use features_heading instead of extra_sections for combined section
- Added CSS for .feature-cards-heading (full width, centered)

## Round 4 results
- universities: 21.30% (4658 vs 4689)
- health-care: 29.25% (5439 vs 5466)
- corporate: 36.50% (4805 vs 4885)

## Key remaining finding: feature-cards full-width
WP feature-cards section is FULL WIDTH (1920px) with #f9fafb bg, inner content constrained to 70%.
Hugo has max-width:70% on the entire section → need to remove max-width, make it full-width, use inner padding/margin to constrain cards content.
Also feature-cards on WP has no border-radius (it's full-width).

## Linter reverted template + content files
Template and all 3 content files were reverted by a linter. Re-applied all changes via Write.

## Round 5 results (after reapply + full-width feature-cards)
- universities: 21.29% (4658 vs 4689, -31px)
- health-care: 27.79% (5439 vs 5466, -27px)
- corporate: 36.97% (4775 vs 4885, -110px)

## Corporate diff analysis
Big red areas in corporate diff:
1. Feature-cards + heading section: layout is fundamentally different. WP has a single bg-group wrapping heading+cards in two-column layout. Hugo has heading full-width above a grid of cards.
2. Info-box images: crop differences from aspect-ratio enforcement
3. CTA section: bg image position/rendering differs
4. Footer offset (-110px)

Corporate is the hardest because the WP layout has a complex two-column grid for the feature-cards area that doesn't match the Hugo flex-wrap layout.

## What to focus on for biggest impact
1. Corporate: the feature-cards section has 5 cards in a 2-column grid on WP, with heading overlapping. Hugo shows them in a row. Need to force 2-column grid layout for 5-card pages.
2. All pages: info-box images still show heavy crop diff. May need to check individual image aspect ratios from WP.
3. The header nav and footer differences are structural and unfixable per task constraints.
