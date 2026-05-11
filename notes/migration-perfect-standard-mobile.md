# Standard Pages Mobile Fix Notes
## 2026-03-30

**GOAL:** Get standard (non-embed, non-collection, non-homepage) pages to <10% mobile diff.

**OBSERVED SO FAR:**
- Mobile baseline screenshots exist at tests/baseline/{slug}-mobile.png (375px viewport)
- Mobile diff script exists at tests/mobile-diff.js (375px x 812px viewport, Playwright)
- Desktop diff script at tests/quick-diff.js (1920x1080 viewport)
- CSS files: main.css, wordpress-compat.css, dark-mode.css in themes/xrnav/static/css/
- Prior mobile fix: footer grid specificity was fixed for 375px (4-equal column collapse)
- Prior desktop fixes: letter-spacing 0.3px, heading colors, link colors, h2/h3 sizes, article padding
- Hugo server should run on port 1314
- Need to identify standard pages with desktop <15% but mobile >30%

**SCORES (desktop -> mobile):**
Best candidates (desktop <15%, mobile >30%):
- fictional-map (aquarium): desktop 0.41%, mobile NOT YET TESTED — need to run
- fcoi: desktop 5.32%, mobile 33.68% — GOOD CANDIDATE
- privacy-policy: desktop 4.72%, mobile 21.65% — decent candidate
- wcag-map-comparison-table: desktop 4.81%, mobile 56.98% — GOOD CANDIDATE
- about-audiom: desktop 15.14%, mobile 37.97% — borderline desktop

Other pages with high mobile diff:
- about: desktop 29.31%, mobile 43.45%
- accessibility-statement: desktop 36.40%, mobile 31.97%
- contact: desktop 58.90%, mobile 58.45%
- events: desktop N/A, mobile 29.10%
- gallery: desktop 38.47%, mobile 19.46%
- brandon-keith-biggs: desktop 61.24%, mobile 65.35%
- capability-statement: desktop 58.36%, mobile 43.00%
- implementation: desktop 37.63%, mobile 32.09%
- what-is-the-definition-of-a-map: desktop 36.72%, mobile 29.89%
- five-things-vpat: desktop 48.39%, mobile 44.65%
- how-to-make-map-descriptions: desktop 27.33%, mobile 20.45%
- list-of-non-visual-drawing-tools: desktop 47.75%, mobile 46.87%
- table-vs-map-example: desktop 42.52%, mobile 46.42%

NOTE: "about" baseline is 2720px wide (not 1920) — baseline taken at different viewport. Desktop score inflated by width mismatch.

**BEST CANDIDATES for mobile fix (desktop already good):**
1. fcoi: 5.32% desktop, 33.68% mobile — 28% gap, short page
2. wcag-map-comparison-table: 4.81% desktop, 56.98% mobile — 52% gap, short page
3. privacy-policy: 4.72% desktop, 21.65% mobile — 17% gap, long text page

Need to also test fictional-map on mobile (desktop is 0.41%, likely good mobile candidate).

**AQUARIUM MOBILE:** desktop 0.41%, mobile 14.44%. Hugo 21774px vs baseline 19085px = 2689px taller. Text wraps more on mobile in Hugo.

**VISUAL COMPARISON (from screenshots):**

FCOI (33.68% mobile):
- WP: smaller h1 font on mobile, hamburger menu, proper top padding, "Download" button separate from link text
- Hugo: HUGE h1 on mobile (not responsive), no top padding before title, XR logo in footer (WP has none), different footer sections
- Key fix: h1 font-size at mobile breakpoints, header/content padding

WCAG table (56.98% mobile):
- WP: Shows table at top with grid, then footer with Quick Links/Learn More, contact form
- Hugo: Only shows footer — page content appears completely missing or table doesn't render on mobile
- Key fix: table content missing, need to investigate

Aquarium (14.44% mobile):
- Hugo 2689px taller — text wraps more at 375px. Likely heading font sizes too large on mobile causing more wrapping.

**COMMON MOBILE ISSUES IDENTIFIED:**
1. h1/h2/h3 font-sizes NOT responsive — desktop sizes used at mobile viewport
2. Missing header top padding on mobile
3. Footer structure diffs (Hugo vs WP footer content differs)
4. Content padding at mobile viewport

**CSS MEDIA QUERIES FOUND (wordpress-compat.css):**
- Lines 386, 941, 1223, 1422, 1499, 1799, 2343: @media (max-width: 921px)
- Lines 423, 1478: @media (max-width: 767px/768px)
- Lines 947, 1454, 1539, 1822, 2386: @media (max-width: 544px)
- Lines 395, 405, 1484, 1490: min-width queries

**ROOT CAUSE #1: CSS Load Order Kills Responsive Typography**
- head.html loads wordpress-compat.css FIRST (line 12), then main.css (line 13)
- wordpress-compat.css line 1497 has `@media (max-width: 921px) { h1 { font-size: 30px } }` — CORRECT
- main.css line 91 has `h1 { font-size: 40px }` — NO media query, overrides the responsive rule
- Same specificity (`h1`), main.css wins because it's loaded later
- Result: h1 stays 40px on mobile. Confirmed via Playwright: h1 fontSize="40px" at 375px viewport
- Same issue likely applies to h2, h3, h4, h5, h6

**ROOT CAUSE #2: Zero Content Padding on Mobile**
- article.ast-article-single has padding: 0px at mobile (Playwright confirmed)
- entry-content has paddingLeft: 0px, paddingRight: 0px
- Content elements are full 375px wide — text goes edge-to-edge
- WP baseline shows text with ~16px left/right padding on mobile
- The `.page-content-wrap .uagb-container-inner-blocks-wrap { padding: 0 2rem }` rule exists (line 1464) but single.html no longer has .uagb-container-inner-blocks-wrap wrapper

**ROOT CAUSE #3: Aquarium page 2689px taller on mobile**
- Hugo: 21774px, WP baseline: 19085px
- With h1 at 40px instead of 30px AND 0px padding (text at full 375px width), text wraps differently
- Fixing font sizes and adding padding should reduce height significantly

**FIX APPLIED: Responsive typography + mobile content padding in main.css**
Added @media (max-width: 921px) block at end of main.css with h1-h6 responsive sizes and article padding 16px.

**RESULTS AFTER FIX:**
- aquarium: 14.44% -> 13.60% (slight improvement, still 2580px too tall)
- fcoi: 33.68% -> 47.52% (WORSE — page got shorter, 1129 vs 1397 baseline)
- wcag: 56.98% -> 59.98% (WORSE — page got shorter, 881 vs 1229 baseline)
- privacy-policy: 21.65% -> 19.44% (improved)
- about-audiom: 37.97% -> 48.41% (WORSE)
- accessibility-statement: 31.97% -> 27.89% (improved)

**ANALYSIS OF WORSENING:**
- fcoi/wcag: Hugo page is SHORTER than baseline. Adding padding + smaller headings made it even shorter.
- The height gap is from FOOTER differences. WP mobile footer has contact form + "Quick Links" + "Learn More" sections with reCAPTCHA badge. Hugo footer has same Quick Links + More Resources but different layout.
- fcoi WP baseline: 1397px. Hugo fcoi: 1129px = 268px SHORT. The WP footer on mobile is taller.
- wcag WP baseline: 1229px. Hugo: 881px = 348px SHORT. Content area (table) seems completely missing or minimal in Hugo.

**VISUAL COMPARISON (post-fix):**
- fcoi Hugo: header looks close to WP now (30px h1, dark bg). Content area matches. Footer is where all the diff is.
- wcag Hugo: NO visible table content at all — just goes straight to footer. The table isn't rendering.
- about-audiom: padding made content area narrower, but WP baseline appears to have full-width content on mobile.

**KEY INSIGHT:** The padding fix helps text-heavy pages (aquarium, privacy-policy, accessibility-statement) but HURTS short pages where the footer dominates the diff. The footer structure is fundamentally different and accounts for most of the diff on short pages.

**DECISION POINT:** Focus on pages where content area diffs dominate (aquarium at 13.6%, privacy-policy at 19.4%, accessibility-statement at 27.9%) rather than footer-dominated short pages. The footer would need structural changes beyond CSS tweaks.

**PLAN:**
1. Investigate why aquarium is still 2580px too tall — likely content wrapping differences at 343px vs WP width
2. Check WP mobile content padding to match exactly
3. Check if about-audiom needs different treatment (no article padding on non-standard pages?)
4. Investigate wcag table missing content
