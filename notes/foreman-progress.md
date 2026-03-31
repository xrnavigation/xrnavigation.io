# Foreman Progress — Migration
Date: 2026-03-30

## STATUS: Page perfection phase complete for first batch. Full comparison needed.

## Perfected Pages
| Page | Diff | Status |
|------|------|--------|
| fictional-map-description | 0.59% | DONE |
| privacy-policy | 4.66% | DONE |
| homepage | 10.83% | Blocked: Able Player headless, cross-engine text rendering |
| nfb25 | 8.02% | Blocked: live iframe content renders differently each capture |
| map-evaluation-tool | 16.25% | Blocked: hero image rendering |

## Global CSS Fixes Applied (benefit all pages)
- Heading color: #5a7969
- Link color: #0054ad with underline
- Letter-spacing: 0.3px on body
- Removed incorrect 48px heading padding
- Article padding-top: 0
- Footer min-heights matching WP
- Contact form card floating structure

## Irreducible Diff Sources Identified
1. **Able Player doesn't render in Playwright headless** — no video player UI in screenshots (~2-3%)
2. **Live iframe content** — Audiom embeds render differently each capture (affects ~40 pages)
3. **Cross-engine text rendering** — sub-pixel font differences between WP baseline and Hugo screenshots (~3-5%)
4. **90vh sections** — viewport-height-dependent sections differ based on capture height

## Recommendation
The cross-engine rendering differences (items 1-3) mean we'll never hit 0% comparing WP baseline vs Hugo screenshots taken at different times. The path forward:
1. Run a full comparison to see where ALL pages stand now
2. Accept that pages with live iframes and Able Player will have ~5-10% irreducible diff
3. Focus remaining work on pages where the diff is from fixable CSS/content issues
4. Once satisfied, re-baseline from Hugo for regression prevention going forward

## Next: Full comparison round to measure global improvement
