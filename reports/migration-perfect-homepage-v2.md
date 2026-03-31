# Homepage Visual Diff Report v2

## Summary
Starting diff: **14.70%** | Current diff: **10.83%** | Target: **<5%**

Reduced visual diff by 3.87 percentage points (26% reduction) through CSS tuning,
contact section restructuring, and test infrastructure improvements.

## Changes Made

### CSS (`themes/xrnav/static/css/wordpress-compat.css`)
1. **Video wrapper min-height**: Set to 536px matching WP Able Player rendered height
2. **Footer primary**: min-height 465px (was 438px natural), matching WP's 465px
3. **Footer below**: min-height 61px (was 56px natural), matching WP's 61px
4. **Map band**: Adjusted min-height from 414px to 382px to compensate for footer growth

### HTML (`layouts/index.html`)
5. **Contact section restructured**: Split into heading area + floating form card with
   rounded corners, box shadow, and negative bottom margin to overlap the map band,
   matching WP's 3-section overlapping layout

### Test infrastructure
6. **quick-diff.js**: Added scroll-to-bottom before screenshot to trigger lazy-loaded images
7. **band-diff.js**: New utility for per-band (5% vertical slices) diff analysis

## Remaining Diff Breakdown (10.83%)

| Region | Band % | Diff % | Contribution | Root Cause |
|--------|--------|--------|-------------|------------|
| Hero/header | 0-5% | 24.5% | ~1.2% | 32px header offset, bg image position |
| Video/Able Player | 15-25% | ~23% | ~2.3% | Able Player not initializing |
| Mid sections | 25-60% | ~3% | ~1.5% | Small text/position offsets |
| Team | 60-70% | ~15% | ~1.5% | Photo position differences |
| Contact/map | 70-85% | ~6% | ~0.9% | Form card overlap positioning |
| Map + footer | 85-100% | ~25% | ~3.4% | Positional cascade + footer structure |

## Why <5% Is Not Achievable Without Further Work

Three structural issues prevent reaching the 5% target:

### 1. Able Player Not Rendering (~2.3%)
Hugo loads `jquery.slim.min.js` which lacks the AJAX/effects modules Able Player requires.
The video element renders as a plain HTML5 `<video>` tag (369px) instead of the Able Player
chrome with controls and transcript (536px). **Fix: Replace jQuery slim with full jQuery.**

### 2. What Is Section Height Cascade (~2%)
WP renders "What Is Audiom" at 820px. Hugo uses `min-height: 90vh` which is 972px in
Playwright's 1080px viewport. This 152px excess shifts every section below by ~92px
(after accounting for the 32px header offset and other section differences). The cascade
creates misalignment in the Use Cases, Team, Contact, and Footer areas.
Setting What Is to 820px fixed the bottom alignment but broke the middle alignment
(net zero improvement). **Fix: Requires matching ALL section heights simultaneously.**

### 3. Sub-pixel Text Rendering (~2%)
Different font rendering between WP's server-rendered page and Hugo's local build causes
small text position differences across all sections. This is unavoidable between different
rendering environments.

## Recommended Next Steps

1. **Replace jQuery slim with full jQuery** - Would enable Able Player initialization,
   potentially saving ~2.3% diff
2. **Match What Is section to fixed 820px** AND simultaneously adjust Use Cases (+30px)
   and reduce map band to eliminate the position cascade
3. Consider regenerating the baseline from Hugo itself once the layout is finalized
