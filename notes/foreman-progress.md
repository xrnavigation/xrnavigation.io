# Foreman Progress — Migration
Date: 2026-03-31

## STATUS: Round 6 comparison running after major bug fixes

## Key Lesson Learned
What I dismissed as "irreducible diff sources" were actual bugs:
- "Iframes render differently" → iframe height collapsed to 150px due to CSS `height: auto` on cross-origin iframes
- "Able Player doesn't work in headless" → translation files 404ing, wrong rootPath
- "Live content varies" → duplicate iframes (template + content both rendering one)
- "Layout not resolving" → Hugo couldn't find audiom-embed template, 51 pages affected

ALL FIXED. None were irreducible. Investigation > excuses.

## Bugs Fixed This Round
1. Able Player rootPath + 20 translation JSON files downloaded
2. audiom-embed layout: changed `layout` to `type` in 51 content files, moved template
3. Iframe min-height: 560px (was collapsing to 150px)
4. Removed duplicate iframes from template

## Page Perfection Status
| Page | Diff | Notes |
|------|------|-------|
| fictional-map | 0.59% | Done |
| privacy-policy | 4.66% | Done |
| homepage | 10.83% | Pre-iframe/Able Player fix |
| nfb25 | 8.02% | Pre-iframe fix |

## Awaiting: Round 6 full comparison
Should show massive improvement on all 51 audiom embed pages (iframe fix) plus homepage (Able Player fix).

## Next
- Read R6 results
- Continue page-by-page perfection on worst remaining
- No more accepting "irreducible" without investigation
