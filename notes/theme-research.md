# Theme Research Notes
Date: 2026-04-01

## Status: COMPLETE

Report written to `reports/migration-theme-research.md`.

## Key Findings

1. No Astra-to-Hugo port exists anywhere. Nobody has done it.
2. Astra official GitHub repo (`brainstormforce/astra`) is inaccessible; used `projectestac/wordpress-theme-astra` mirror instead (cloned to `~/src/astra-mirror`).
3. Spectra/UAGB cloned to `~/src/wp-spectra` from `brainstormforce/wp-spectra`.
4. Astra's visual identity lives in dynamically generated inline CSS (67KB), not the static main.min.css (46KB). Static file is a generic framework.
5. Spectra generates per-page inline CSS scoped to unique block IDs. Homepage alone: 72 blocks, 261KB CSS.
6. The current project approach (hand-rolled `wordpress-compat.css` referencing extracted CSS values) is the correct strategy. Copying WP CSS directly would not work because Hugo generates different HTML structure.
7. Hugo theme CSS is 2982 lines / ~3KB vs WP's 330+KB of inline CSS -- much more efficient, same visual result.

## Repos Cloned
- `~/src/astra-mirror` -- Astra theme (community fork)
- `~/src/wp-spectra` -- Spectra/UAGB blocks plugin

## Analysis Script
- `scripts/analyze-uagb-css.py` -- counts unique block IDs and class frequencies in extracted Spectra CSS
