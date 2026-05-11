# Collection Next Slice Analysis — 2026-04-06

## Current state (from comparison-results.json)

| Page | Viewport | Diff% | Overlap% | Baseline H | Current H | Delta |
|------|----------|-------|----------|-----------|-----------|-------|
| corporate-campuses | desktop | 17.8 | 17.1 | 4885 | 4845 | -40 |
| corporate-campuses | mobile | 42.3 | 41.0 | 5892 | 5769 | -123 |
| health-care-facilities | desktop | 17.4 | 17.0 | 5466 | 5439 | -27 |
| health-care-facilities | mobile | 40.8 | 38.2 | 5532 | 5303 | -229 |
| universities | desktop | 11.8 | 11.2 | 4689 | 4658 | -31 |
| universities | mobile | 32.1 | 30.7 | 4539 | 4632 | +93 |

## Key observation

Mobile is 20-25pp worse than desktop on every page. Mobile is the dominant problem.
Desktop heights are close (deltas -27 to -40px). Mobile heights vary more (-229 to +93px).

## Mobile CSS at ≤921px breakpoint (wordpress-compat.css lines 2654-2782)

- Hero: `min-height: auto; padding: 40px 10px` (desktop: 100vh, padding 10px)
- Info-box: `flex-direction: column; padding: 40px 20px` (desktop: row, 192px 0)
- Feature cards: `padding: 40px 20px` (desktop: 192px 0), grid collapses to 1fr
- CTA: `min-height: auto; padding: 40px 20px` (desktop: 85vh, 0 0 100px)
- Extra-content dark-panel: `min-height: auto; padding: 48px 20px`
- Inner wrappers: `width: 100%; max-width: 100%`
- Hero h1/CTA h2/extra h2: 30px/40px line-height
- Info-box h2: 25px/35px

At ≤544px: info-box padding drops to `20px 10px`.

## What WP baselines look like (need to verify)

Mobile viewport is 375×812. WP baselines are full-page screenshots.
- corporate mobile baseline: 5892px tall
- health-care mobile baseline: 5532px tall  
- universities mobile baseline: 4539px tall

## Recent context

- Successful: intro-card white cards, feature card compaction, CTA/dark-panel full-width inners
- Failed & reverted: section-specific mobile text compaction on info-box sections
- The info-box text compaction was tried and didn't help — avoid that direction

## Visual comparison findings (WP baseline vs Hugo current, mobile)

Examined all 6 mobile screenshots (3 baseline, 3 current) and 3 diff images.

### Universities mobile diff (32.1%)
- Hero: moderate red — text wrapping differs but structural match is close
- Info-boxes: heavy red in body text — every paragraph line wraps differently
- Feature cards (no-intro, 4 cards): moderate red — text offset, cards close structurally
- CTA: heavy red — mostly cascaded vertical offset from above
- Overall pattern: distributed text-flow differences, not one broken section

### Corporate mobile diff (42.3%)
- Hero + info-boxes: moderate red, similar text-flow issues
- Feature cards (has-intro, 5 cards, dark bg + white cards): MASSIVE red zone — 40%+ of total diff area. Structural layout is fundamentally different, not just text flow.
- CTA: heavy red, partly cascaded offset
- The feature-cards-five section is the single largest red block in any diff image

### Health-care mobile diff (40.8%)
- Hero: significant red
- Info-boxes: moderate red, text flow differences
- Feature cards (no-intro, 4 cards, dark bg): moderate red
- Dark panel extra section: moderate red
- CTA: heavy red
- More evenly distributed than corporate

### Key finding: mobile horizontal padding mismatch

At ≤544px (which includes the 375px test viewport), info-box sections get `padding: 20px 10px` — only 10px horizontal padding. Content width = 375 - 20 = 355px.

Meanwhile, every OTHER collection section on mobile keeps 20px horizontal padding (content width = 335px).

WP's Astra CSS variables at ≤544px: `--wp--custom--ast-default-block-left-padding: 1.5em` = 24px. WP mobile info-box content is narrower.

This 20-28px width difference causes EVERY line of text in info-box sections to wrap differently. WP text is narrower → more line wraps → different section heights → cascading vertical offset through entire page.

Evidence: WP baseline text visually fits fewer words per line in info-box paragraphs than Hugo (comparing "University campuses are intricate mazes of..." line lengths).

### Why this explains the desktop-to-mobile gap
Desktop info-box content uses `max-width: min(100%, 70%)` with 45%/55% text/image split — consistent between WP and Hugo (already matched). Mobile switches to full-width stacked layout where the 10px vs 20px+ padding difference becomes material.

### Secondary issue: corporate feature-cards-five
This is a separate, corporate-specific structural problem. The five-card `has-intro` section renders fundamentally differently on mobile. Needs separate investigation.
