# Foreman Progress — Migration
Date: 2026-03-31

## STATUS: R8 comparison running after embed template perfection

## Comparison Trend
| Round | Avg | <1% | <5% | <10% | <30% |
|-------|-----|-----|-----|------|------|
| R1 | 43.64% | 0 | 0 | 0 | — |
| R5 | 46.01% | 0 | 2 | 2 | — |
| R6 | 45.19% | 1 | 5 | 16 | 41 |
| R7 | 44.36% | 1 | 5 | 16 | 41 |
| R8 | ? | ? | ? | ? | ? |

## What Changed Since R7
- Embed template perfected: 3 layout variants, 31+ pages under 5% per agent report
- YouTube embed responsive wrappers fixed
- Per-page spacer variants implemented
- Link checker passes clean (0 broken links)
- Gallery nav link fixed
- Evaluate link fixed
- Page title format fixed ("Title - XR Navigation")
- Blog pagination to 20 posts (hugo.toml changed)

## Expected R8 Impact
Embed template fix is the highest-leverage change yet — 30+ pages improved. Expecting:
- <5% count to jump significantly (was 5, embed agent says 31+ under 5%)
- <10% count to increase substantially
- Average to drop meaningfully

## Remaining Known Issues
- Collection pages (universities, corporate, healthcare) — grid layouts still WIP
- Homepage at ~10-15% — Able Player height, contact section
- Mobile pages generally higher diff than desktop
- Some pages with complex WP layouts (case studies, events) need per-page work

## CI Gates Now Available
- `npm run check-links` — broken link checker
- `npm run baseline` — capture visual baseline
- Visual comparison test in tests/visual-comparison.spec.ts
