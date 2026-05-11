# Report: Extract Computed CSS Values from Live WordPress Site

Date: 2026-03-30
Commit: 984b7bfcb317b4d1c0884fc03867213f2ea80790

## Summary

Extracted computed CSS values from the live WordPress site at xrnavigation.io using Chrome browser MCP tools. JavaScript `getComputedStyle()` was used to read actual rendered values from the DOM across four pages: homepage, about, blog, and audiom-demo.

## Pages Extracted

1. **Homepage** (/) - Header, nav, body, 10 UAGB container sections with padding/max-width, typography (h1-h3, p, a), CTA buttons, footer
2. **About** (/about/) - Page title, content width, image styling (border-radius 20px), paragraph spacing, UAGB section structure
3. **Blog** (/blog/) - UAGB Post Grid: 3-column grid (380px columns, 30px gap), card styles (shadow, border-radius, padding), card title/excerpt/meta typography
4. **Audiom Demo** (/audiom-demo/) - iframe container, page title, wrapper section padding (160px), inner max-width min(100%, 1200px)

## Responsive Breakpoints

Extracted from CSS media query rules (could not simulate viewport resize via MCP tool):

- **Desktop**: min-width 922px (full nav visible)
- **Tablet**: max-width 921px (hamburger menu, h1 drops to 30px, h2 to 25px, h3 to 20px)
- **Mobile**: max-width 544px (same font reductions as tablet)
- **UAGB-specific**: 768px breakpoint for block-level responsive

## Key Architectural Findings

- **No global max-width container.** The site uses full-width UAGB containers, each constraining inner blocks via percentage-based max-width (70%, 80%, or `min(100%, 1200px)`).
- **Footer has two layers:** primary footer (bg #04203e, 2-col grid, gap 50px, padding 45px 95px) and below-footer (bg #15191d, single 1200px column).
- **Blog grid is a UAGB Post Grid block**, not native WP query loop. Fixed 380px column widths.
- **Buttons are ghost-style:** light background, dark border, Montserrat font, 4px border-radius.
- **Header is transparent** with static positioning, 80px height. Nav uses Lato 16px/700, capitalize, letter-spacing 0.3px.

## Output Files

- `data/wp-computed-styles.json` - Structured JSON organized by component (header, body, typography, sections, footer, blog, audiom-embed, buttons) with responsive breakpoint data
- `data/wp-css-spec.md` - Human-readable specification with tables for quick reference

## Limitations

- Viewport resize via MCP tool changed window dimensions but did not change `window.innerWidth` (stayed at 1920px). Tablet/mobile responsive values were extracted from CSS media query rule text rather than from live computed styles at those viewport widths.
- Hover states could not be captured (e.g., link hover colors, button hover states).
- Some CSS values were truncated in MCP tool output; all critical values were captured via follow-up extractions.
