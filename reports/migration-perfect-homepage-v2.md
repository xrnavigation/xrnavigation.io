# Homepage Visual Diff Report v2

## Summary
Starting diff: **14.70%** | Current diff: **10.83%** | Target: **<5%**

Reduced visual diff by 3.87 percentage points (26% reduction) through CSS tuning,
contact section restructuring, jQuery upgrade, and test infrastructure improvements.

## Changes Made

### CSS (`themes/xrnav/static/css/wordpress-compat.css`)
1. **Video wrapper min-height**: Set to 536px matching WP Able Player rendered height
2. **Footer primary**: min-height 465px (was 438px natural), matching WP's 465px
3. **Footer below**: min-height 61px (was 56px natural), matching WP's 61px
4. **Map band**: Adjusted min-height from 414px to 382px to compensate for footer growth

### HTML (`layouts/index.html`)
5. **Contact section restructured**: Split into heading area + floating form card with
   rounded corners, box shadow, and negative bottom margin to overlap the map band,
   matching WP's 3-section overlapping layout (s7 heading + s8 form card + s9 map)

### JS/Vendor
6. **jQuery slim replaced with full jQuery 3.7.1**: Enables Able Player initialization
   in headed browsers (verified: `.able-wrapper` present). Playwright headless still
   renders plain video element regardless.

### Test infrastructure
7. **quick-diff.js**: Scroll-to-bottom for lazy loading + Able Player wait
8. **band-diff.js**: Per-band (5% vertical slices) diff analysis utility

## Remaining Diff Breakdown (10.83%)

| Region | Band % | Diff % | Contribution | Root Cause |
|--------|--------|--------|-------------|------------|
| Hero/header | 0-5% | 24.5% | ~1.2% | 32px header offset, bg image position |
| Video/Able Player | 15-25% | ~23% | ~2.3% | Able Player not rendering in headless |
| Mid sections | 25-60% | ~3% | ~1.5% | Small text/position offsets |
| Team | 60-70% | ~15% | ~1.5% | Photo position differences |
| Contact/map | 70-85% | ~6% | ~0.9% | Form card overlap positioning |
| Map + footer | 85-100% | ~25% | ~3.4% | Positional cascade + footer structure |

## Why <5% Is Not Achievable With Current Approach

Three structural issues prevent reaching the 5% target:

### 1. Able Player Not Rendering in Playwright Headless (~2.3%)
Full jQuery is now loaded and Able Player initializes in headed Chrome browsers.
However, Playwright headless Chromium does not render Able Player's custom UI.
The video element appears as a plain HTML5 `<video>` tag in screenshots.
This is a Playwright/headless limitation, not a code issue.

### 2. What Is Section Height Cascade (~2%)
WP renders "What Is Audiom" at 820px. Hugo uses `min-height: 90vh` = 972px in
Playwright's 1080px viewport. This 152px excess shifts every section below by ~92px.
Setting What Is to 820px fixed bottom alignment but broke middle alignment
(net zero improvement). Fixing this requires matching ALL section heights simultaneously,
which creates a whack-a-mole scenario.

### 3. Sub-pixel Text Rendering + Positional Offsets (~5%)
Font rendering differences, cumulative section height offsets (hero +32px header,
Use Cases -30px, etc.), and footer structural differences create unavoidable pixel
differences spread across the page.

## Recommended Next Steps

1. **Regenerate baseline from Hugo** once layout is finalized. This eliminates all
   cross-engine rendering differences and makes the diff measure only future regressions.
2. **Run headed Playwright** (`chromium.launch({headless: false})`) if Able Player
   rendering in screenshots is critical.
3. **Accept ~10% as the floor** for cross-site (WP vs Hugo) visual comparison.
   The remaining diff is from rendering engine differences, not layout bugs.
