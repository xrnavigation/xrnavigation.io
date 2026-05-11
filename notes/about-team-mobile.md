# About Page Team Sections Mobile Fix

**Date:** 2026-04-08

**GOAL:** Fix team member sections (Brandon, Chris, James) mobile layout — currently 49-56% diff on mobile vs 6-9% desktop.

**Observations:**
- Block IDs: uagb-block-4084160e, 55dd86c5, b49613d3
- Desktop: side-by-side layout (photo left + info right), inner-blocks-wrap uses `flex` with `width: min(100%, 60%)`
- Image containers (8f705a85, 253df222, e7587deb): `flex: 0 0 286px` on desktop
- At 921px: flex-direction changes to column, gap 40px, image containers get `flex: 0 0 auto` — this is correct
- At 544px: inner-blocks-wrap gets fixed `width: 347px; max-width: 347px` — this constrains too much
- Images at desktop: `width: 289px; max-width: 100%; height: 189px` — fixed dimensions need to become fluid at mobile
- No mobile override for image dimensions (width/height) found in 544px breakpoint

**DONE:**
1. Split team block inner-blocks-wrap out of the shared 347px rule; now uses `calc(100% - 28px)` for fluid width
2. Image containers (8f705a85, 253df222, e7587deb) and info containers (1cbef3a3, 75636745, 25c8dd88) get `flex: 0 0 auto; width: 100%` at 544px
3. Team images changed from `width: 347px; height: 227px` to `width: 100%; height: auto` at 544px
4. Hugo build passes cleanly
