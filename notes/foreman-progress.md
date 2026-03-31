# Foreman Progress — Migration
Date: 2026-03-30

## STATUS: CSS rewrite didn't close the gap. Need a different approach.

## Round 2 Comparison Results
- 180 comparisons, 0 matching (<2%), average diff 43.64%
- Best page: 11.86% (fictional-map-description desktop)
- 404s fixed (0 vs 22 in round 1)
- But CSS parity actually regressed slightly — privacy-policy went from 9.9% to >10%

## Root Cause Analysis
The CSS rewrite applied correct VALUES but the HTML STRUCTURE is different. The WP site uses:
- UAGB container blocks with percentage-based inner max-widths (70%, 80%)
- Specific section padding per container (152px hero, 104px features, etc.)
- Blog: UAGB Post Grid with 380px 3-column fixed layout
- Footer: 2-column grid at specific dimensions

The Hugo theme has different HTML structure that can't be fixed with CSS values alone. We need to match the LAYOUT PATTERNS, not just the numbers.

## What's Actually Needed

### Approach change: Extract and replicate the actual WordPress CSS
Instead of approximating, we should:
1. Download the actual Astra + UAGB stylesheet from the live site
2. Adapt it for Hugo's HTML structure (or adapt Hugo's HTML to match WP's structure)
3. OR: accept the visual differences are structural and focus on the CONTENT areas matching

### Specific fixable issues:
1. **Blog page** (85-91% diff) — pagination showing all posts. Fix: limit to match WP's post count per page
2. **Universities/Corporate/Healthcare** (75-83% diff) — missing card grid layouts
3. **Height mismatches** — margins/padding accumulate differently
4. **Header/footer** — structural HTML differences cause cascading layout shifts

## Decision Point
Two paths:
A. Keep iterating CSS — diminishing returns, fundamental HTML structure mismatch
B. Extract WP's actual compiled CSS and port Hugo templates to use WP-compatible class names — more work but would converge

Need Q's input on acceptable diff threshold and whether the current visual identity is "close enough" or needs pixel-perfect matching.
