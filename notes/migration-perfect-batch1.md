# Migration Perfect Batch 1 Notes
## 2026-03-30

**GOAL:** Get privacy-policy, map-evaluation-tool, nfb25 to <5% visual diff each (desktop).

**OBSERVED:**
- All 3 content files exist: content/privacy-policy.md, content/map-evaluation-tool.md, content/nfb25.md
- Baselines exist for all 3 (desktop + mobile)
- Round 5 scores: privacy-policy 9.96%, map-evaluation-tool 20.96%, nfb25 ~14-24%
- Previous agent got fictional-map page to 0.90% via: letter-spacing 0.3px, heading colors, link colors, h2/h3 sizing, above-footer hide, UL/OL margin fixes
- Those CSS fixes are already in the codebase (committed)
- Key CSS files: themes/xrnav/static/css/wordpress-compat.css, main.css

**CURRENT DIFFS (start of work):**
- privacy-policy: 4.67% (baseline 8964px, current 8951px — 13px short)
- map-evaluation-tool: 28.96% (baseline 5221px, current 4718px — 503px short!)
- nfb25: 34.27% (baseline 3934px, current 3259px — 675px short!)

**DIFF IMAGE OBSERVATIONS:**
- privacy-policy: Subtle text-level horizontal diffs throughout. Footer has some red. Very close already.
- map-evaluation-tool: Big red at top (hero/intro section different). Title "Introduction" styled differently. Page is 503px too short — missing content or spacing.
- nfb25: Has 3 iframes (audiom embeds) at 560px each. Page is 675px short — iframes likely not rendering at full height or at all. Top section with map image heavily red.

**CONTENT STRUCTURE:**
- privacy-policy: Pure text (h1, h2, h3, paragraphs, lists). No embeds.
- map-evaluation-tool: Text-heavy (h1-h3, ordered/unordered lists, many links). Has "Introduction" as h1. No embeds.
- nfb25: Uses layout "audiom-embed". Has 3 iframes. Title "Audiom NFB 2025 Maps".

**PRIVACY-POLICY (4.67%):** Already under 5%. Differences are h1 margin-bottom (20px vs 0px), footer height (494 vs 526), and subtle text positioning. No work needed.

**MAP-EVALUATION-TOOL (28.96%) — DETAILED ANALYSIS:**
- WP has a hero section: 541px tall, background image (DALL-E campus photo), padding 100px 10px
  - URL: https://xrnavigation.io/wp-content/uploads/2023/10/DALL·E-2023-10-17-...webp
  - Inner container: max-width 70% (1330px), padding 10px
  - H1 "Introduction" in white (rgb(249,250,251)), centered
  - Download button (centered, buttons block)
  - Intro paragraph in light text (rgb(249,250,251)), centered
- WP has a 120px spacer after hero
- WP h2s have color class has-ast-global-color-1-color (rgb(4,32,62) = dark navy)
- WP has 229 LIs vs Hugo 77 — content structure differs significantly
- Hugo page starts with bare h1 at top, no hero, no spacer
- goldmark unsafe=true is enabled, so raw HTML in content works

**PLAN:**
1. Download the hero background image to static/images/
2. Add hero HTML to map-evaluation-tool.md content (raw HTML before the markdown)
3. Add CSS for the hero section
4. Fix h2 colors for this page
5. Check list rendering differences

**MAP-EVAL ITERATION 1:** Hero as raw HTML. 28.96% -> 16.33%.
**MAP-EVAL ITERATION 2:** Removed 48px heading padding. 16.33% -> 16.28%. Also improved fictional-map (0.90% -> 0.59%) and privacy-policy (4.67% -> 4.66%).

**MAP-EVAL REMAINING ISSUES (16.28%):**
- Content h2s match between WP and Hugo (same 10 content headings)
- List structure identical (same 17 top-level lists, same item counts)
- Hero height: Hugo 553 vs WP 541 (12px diff)
- Heading colors: Hugo green (#5a7969) vs WP navy (#04203e) — every heading is different color
- Page 136px too short — hero(12) + footer(32) = 44px, remaining ~92px from margin/spacing diffs
- Paragraph/list text content at correct width (80ch/742px) and centered
- Heading text at correct width (1200px) with padding-left now 0

**BIGGEST REMAINING DIFF SOURCES:**
1. Heading color (green vs navy) — affects every heading, creates pixel diffs throughout
2. Footer height (32px shorter) — affects bottom section
3. Cumulative spacing differences across many sections

**MAP-EVAL ITERATION 3:** Added page-specific heading color CSS. 16.28% -> 16.25%. Marginal. Main diff sources are hero bg image rendering, footer, and text positions at 1920px viewport.

**NFB25 ITERATION 1:** Removed audiom-embed layout, added 10 spacers matching WP (total 662px). 34.27% -> 9.84%. Page now 3854 vs 3934 (80px short). Remaining diffs: iframe content rendering, header, footer, text positioning.

**NFB25 ITERATION 2:** Centered h1 to match WP. 8.14% -> 8.02%.
**FOOTER FIX ATTEMPT:** Changed column-gap to 80px and logo max-width to 100%. Made all pages WORSE. Reverted.

**CURRENT SCORES:**
- privacy-policy: 4.66% -- DONE (under 5%)
- map-evaluation-tool: 16.25% -- hero image rendering + content text positioning
- nfb25: 8.02% -- iframe map content is dominant blocker (~4% from iframe alone)

**BLOCKERS:**
- nfb25: First iframe (Neighborhood Map) renders live audiom.net content. The map state differs between WP baseline capture and Hugo current capture. This is uncontrollable ~4% diff.
- map-evaluation-tool: Hero background image at different positions/rendering between WP and Hugo screenshots. Content text throughout page has subtle horizontal positioning diffs. 16% is hard to reduce further without pixel-perfect layout matching.
- Footer: Consistently 32px shorter across all pages (494 vs 526). Attempted gap/logo fixes made things worse.

**CSS CHANGES MADE (kept):**
- Removed 48px heading padding (improved fictional-map 0.90%->0.59%, helped all pages)
- Page-specific heading color override for map-evaluation-tool (has-ast-global-color-1)

**CONTENT CHANGES MADE:**
- map-evaluation-tool.md: Added hero section as raw HTML (bg image, centered white h1, download button, intro paragraph), spacer, heading color style
- nfb25.md: Removed audiom-embed layout, added 10 spacers matching WP structure, centered h1

**NEXT:** Commit changes and write report. These 3 pages may not all reach <5% — the iframe and hero image rendering are fundamental blockers.
