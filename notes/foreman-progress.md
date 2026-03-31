# Foreman Progress — Migration
Date: 2026-03-31

## STATUS: R6 comparison running. Bug fixes + content fixes applied.

## Recent Fixes
- Page title format: "Title - XR Navigation" matching WP (commit f3e3c30)
- Gallery nav link: /audiom-gallery/ → /gallery/ (commit b590397)
- Able Player: rootPath fix + 20 translation files (prior commit)
- audiom-embed layout: type field + template moved (51 files)
- Iframe min-height: 560px (was collapsing to 150px)
- Duplicate iframes removed from template

## Awaiting
- R6 comparison results — should show massive improvement from iframe/Able Player fixes

## Key Learning
"Irreducible" was wrong. Every claimed limitation was a bug:
- Iframe content differences → CSS height collapse to 150px
- Able Player headless → translation 404s + wrong rootPath
- Layout not matching → Hugo template resolution bug
Investigate before dismissing.

## Perfected Pages (pre-R6)
| Page | Diff |
|------|------|
| fictional-map | 0.59% |
| privacy-policy | 4.66% |
| homepage | 10.83% |
| nfb25 | 8.02% |
