# CSS Extraction Notes
Date: 2026-03-30

## Status: COMPLETE

Extracted computed CSS from live WordPress site via Chrome MCP tools. Committed as 984b7bf.

## Key findings
- Theme: Astra + UAGB (Ultimate Addons for Gutenberg blocks)
- Hamburger breakpoint: 921px (Astra builder default)
- No single max-width wrapper; each UAGB section constrains inner blocks via percentage (70%, 80%, min(100%,1200px))
- Homepage has 10 UAGB container sections with varied padding
- Blog uses UAGB Post Grid: 3x380px columns, 30px gap, cards with 10px border-radius and heavy box-shadow
- Footer: primary bg #04203e, 2-col grid, below-footer bg #15191d
- Buttons are ghost-style (light bg, dark border, Montserrat 16px)
- Responsive: tablet reduces h1 to 30px, h2 to 25px, h3 to 20px

## Limitation
- Could not resize viewport to test actual tablet/mobile computed values (Chrome resize changes window size but innerWidth stayed at 1920). Extracted responsive values from CSS media query rules instead.

## Output files
- data/wp-computed-styles.json (structured JSON)
- data/wp-css-spec.md (human-readable summary)
