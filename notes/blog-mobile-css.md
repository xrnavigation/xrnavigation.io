# Blog Mobile CSS Fix — 2026-04-08

## GOAL
Fix blog-index mobile CSS: hero padding, post grid columns, inner content max-width.

## OBSERVATIONS
- `themes/xrnav/static/css/wordpress-compat.css` line 1016: `padding: 40px 10px !important` — needs `padding: 25% 5%` (no !important)
- Line 876-882: desktop `.blog-hero > .uagb-container-inner-blocks-wrap` has `max-width: min(100%, 85%)` — mobile needs `min(100%, 767px)`
- Line 1067-1069: post grid goes to 1col at 544px — should be at 921px for mobile parity
- Line 2181: second `!important` on `.blog-hero.Change-background` padding (`padding: 80px 0 !important`) inside @media 921px block at line 2111 — also conflicts
- `themes/xrnav/layouts/blog/list.html` line 19: inline `style="padding: 100px 0;"` on heading section — needs mobile override in CSS

## PLAN
1. Fix hero padding at line 1016 (remove !important, use 25% 5%)
2. Add mobile max-width rule for hero inner content
3. Move 1-column grid from 544px to 921px breakpoint
4. Fix second hero padding rule at line 2181
5. Add mobile override for heading section inline padding
