# Homepage CSS Parity Session — 2026-04-08

**GOAL:** Reduce homepage desktop diff (currently ~10.8%) and mobile diff (~21.6%) toward 0%.

**KEY FINDINGS:**
- Root `layouts/index.html` (NOT `themes/xrnav/layouts/index.html`) is the active template — uses semantic classes (.hero, .steps, .why, etc.)
- Theme's index.html uses UAGB classes but is overridden and NOT rendered
- CSS lives in `themes/xrnav/static/css/wordpress-compat.css` lines ~3133-3966
- Comparison tool: `container` = section element, `heading` = first h1/h2/h3, `firstParagraph` = first p, `innerWrapper` = first direct div child

**CURRENT STATE (from comparison run):**
Desktop diffs: Hero 16.4%, Steps 5.0%, Why 14.3%, Clients 6.1%, What Is 3.6%, Use Cases 23.5%, Team 4.8%, Contact 24.9%
Mobile diffs: Hero 30.6%, Steps 23.1%, Why 10.6%, Clients 8.7%, What Is 14.5%, Use Cases 39.3%, Team 46.9%, Contact 69.4%

**SYSTEMIC ISSUES:**
1. WP root containers: `display: flex`, Hugo sections: `display: block` — FIXED in shared base
2. WP: `text-align: start`, Hugo: `text-align: center` — FIXED in shared base
3. Mobile: `font-size: 15px → 16px`, `line-height: 23px → 26px` — NOT YET FIXED
4. Contact section: `padding-bottom: 200px → 10px` — NOT YET FIXED
5. Use Cases: `padding-right/left: 80px → 10px` — NOT YET FIXED

**CHANGES MADE SO FAR:**
- Shared section base: added `display: flex; flex-direction: column; text-align: start;`
- Hero: min-height 648px, flex-direction column, gap 20px 0px, text-align start, removed align/justify center
- Hero h1: color #f9fafb, max-width 100%, removed text-align center
- Hero text: width 742px, margin-left/right 243px, removed text-align center
- Hero inner: removed flex centering

**DESKTOP FIXES APPLIED (not yet verified):**
- Shared base: display flex, flex-direction column, text-align start on all sections
- Hero: min-height 648px, gap 20px 0px, text-align start, h1 color #f9fafb, paragraph width/margins
- Why: min-height 0px, gap 20px 100px, paragraph color #15191d + margin-bottom 0
- Clients: padding 0 0 100px (removed side padding), min-height 0, gap 30px 20px, paragraph margin-bottom 0
- Use Cases: padding 100px 80px (was 10px sides), gap 20px, h2 margin-bottom 15px
- Contact: padding-bottom 200px (was 10px), gap 20px, h2 margin-bottom 0, heading-area margin-bottom 0, paragraph color #04203e

**NOT YET DONE:**
- Mobile base font-size 15px / line-height 23px (currently 16px/26px)
- Mobile Team padding (64px 24px 64px 24px per WP)
- Mobile Contact padding (0 all sides per WP)
- Haven't run comparison yet to verify desktop fixes

**RUN 2 RESULTS (after first batch):** Things got WORSE because flex-direction:column was wrong.
- WP containers use flex-direction:ROW (not column) with a single inner-blocks-wrap child
- WP container text-align is START, but inner wrappers/headings are CENTERED
- Fixed: shared base now flex-direction:row, text-align:start
- Fixed: .section-inner gets text-align:center, hero-inner gets text-align:center
- Fixed: contact-heading-area gets display:flex, flex-direction:column, centered

**STILL IN PROGRESS (not yet verified):**
- Use Cases .section-inner needs max-width min(100%,1200px), display:flex, flex-direction:column
- Use case paragraph color changed to #000, text-align left
- Clients .section-inner now has flex/column/centered/gap
- Team section needs gap 30px 20px, paragraph color #15191d, margin-bottom 0
- Need to fix firstParagraph.margin-bottom: 30px→0 on use-cases (WP wants 30px)
- Mobile fixes not started yet

**NEXT:** Finish use-cases/team innerWrapper fixes, run comparison, then mobile
