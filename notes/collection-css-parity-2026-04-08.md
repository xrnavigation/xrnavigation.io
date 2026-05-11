# Collection CSS Parity — 2026-04-08

## Baseline (chunk comparison tool)
Corporate-campuses desktop: 12.8-20.3%, mobile: 24.3-43.7% (5 matched, 5 unmatched WP)
Health-care desktop: 8.8-48.0%, mobile: 23.8-48.6%
Universities desktop: 7.5-17.9%, mobile: 27.2-100% (100% = "Audiom: The Inclusive Digital Map Solution")

## Key patterns from diff output

### Recurring across ALL sections (mobile):
- `container.width: 375px → 335px` — Hugo is 40px narrower (likely padding issue)
- `container.display: flex → block` — WP uses flex, Hugo uses block
- `container.gap: 20px → normal` — Hugo missing gap
- `container.font-size: 15px → 16px` — Hugo 1px bigger
- `container.line-height: 23px → 26px` — Hugo line-height too big
- `container.padding-top/bottom: 50px → 20px` — info-box sections too little padding

### Hero sections (all pages):
- `container.padding: 10px → 84px` — Hugo hero has way too much padding on mobile
- `container.background-attachment: fixed → scroll` — WP uses fixed
- `container.justify-content/align-items: normal → center` — Hugo centering, WP not
- `heading.color: rgb(249, 250, 251) → rgb(255, 255, 255)` — slight color diff

### Info-box sections ("The Challenge", "The Solution", etc.):
- `container.display: flex → block` — needs flex
- `container.gap: 20px 40px → normal` — needs gap
- `heading.margin-bottom: 20px → 16px` — slightly off

### Feature cards / Inclusivity:
- `heading.font-weight: 800 → 600` — Hugo too light
- `heading.text-align: center → start` — needs center

### CTA sections:
- `container.flex-direction: row → column` — WP uses row on desktop, Hugo uses column
- `container.min-height: 690px → 0px` — Hugo missing min-height

### Desktop recurring:
- `container.display: flex → block` — same flex issue
- `container.text-align: start → center` — hero/CTA need center text on WP

## Corporate-campuses unmatched WP sections
5 sections unmatched: "Inclusivity at Its Core:", "Real-Time Adaptability:", etc.
These are feature cards that aren't rendering as matched sections.

## Rendering path
- corporate-campuses uses wp_fragment_slug → renders data/wp-rendered/corporate-campuses.html
- health-care and universities use collection-render.html partial (no wp_fragment)

## Rendering path (corrected)
All three pages use collection-render.html partial (none have wp_fragment_slug).

## Root cause of 375→335 width
`.ast-container` in main.css has `padding: 0 20px` at mobile. Collection `<article>` lives inside it.
Fix: negative margins on `.collection-page` to break out of the padding.

## Edit tool blocked by file watcher
Hugo server or something modifies the CSS file between read and edit. Using sed as workaround.

## Changes made so far
1. Added `.collection-page { margin-left: -20px; margin-right: -20px; }` at mobile to fix width
2. Changed hero mobile padding from `25% 5%` to `10px` (matching WP)
3. Changed info-box mobile padding from `40px 20px` to `50px 10px` + added `display: flex; gap: 20px 40px; font-size: 15px; line-height: 23px`

## Round 1 results (after first batch of fixes)
Mixed results. Some improvements, some regressions:
- Hero sections improved ~7% on mobile (hero padding fix helped)
- Desktop info-box mostly stable
- REGRESSION: negative margin approach to fix 375→335 width broke corporate-campuses sections
  that already had `calc(100%+40px)` + `-20px` margins — they became 415px wide
- Corporate CTA went from 25.1→55.3% (broken)
- Healthcare "Navigating" went from 23.8→34.7%

## Current state of file (messy)
- Sed insertion of `:has()` rule got mangled — ended up inline inside the hero rule
- Need to rewrite the mobile collection block (lines 3001-3278) cleanly
- The 544px block is at 3279-3284
- Desktop changes (info-box flex+gap, h2 margin, hero color, background-attachment) are OK

## Correct fix for 375→335 width
Use `.ast-container:has(.collection-page) { padding: 0; }` as a SEPARATE rule.
Then remove all `calc(100%+40px)` and `margin: -20px` compensating hacks on corporate sections.
Corporate-campuses CTA also has `calc(100%+40px)` at line ~3184.

## Plan: rewrite mobile block
1. Read full current mobile block (3001-3278)
2. Write a clean replacement with all fixes applied correctly
3. Key fixes: `:has()` rule separate, remove calc+margin hacks, hero padding 10px, info-box padding+flex+font, feature-card font-weight
