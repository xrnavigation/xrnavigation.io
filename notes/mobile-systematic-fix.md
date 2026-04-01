# Systematic Mobile CSS Fix Notes
## 2026-04-01

**GOAL:** Close mobile avg 31% vs desktop 22.67% gap by fixing responsive CSS systematically.

**PRIOR WORK (from existing notes):**
- Embed pages mobile: already ~10-12% (mostly iframe dynamic content)
- Footer swap (above/primary) at <=921px already implemented
- Footer grid collapse already fixed (specificity bug)
- Responsive typography added to main.css (h1-h6 sizes at <=921px)
- But main.css overrides wordpress-compat.css responsive rules (load order issue identified)
- Standard pages: aquarium 13.6%, privacy-policy 19.4%, a11y-statement 27.9%, fcoi 47.5%, wcag 60%

**WP MEDIA QUERY INVENTORY (from inline-astra-theme-css-inline-css.css):**
95 @media blocks total. Key responsive rules:
1. <=921px: html font-size 91.2%, h1 30px, h2 25px, h3 20px
2. <=544px: same font sizes repeated, block padding 1.5em/1em
3. <=921px: .ast-container flex-direction column, #primary padding 0
4. <=921px: desktop header hidden, mobile header shown
5. <=921px: footer grid/builder display rules
6. <=921px: block padding vars: 3em/2em/3em/2em
7. <=544px: block padding vars: 3em/1.5em/3em/1.5em
8. <=921px: .site-title display:none
9. >=922px: .ast-container max-width 1240px
10. >=1200px: #primary margin-top/bottom 60px

**CURRENT HUGO CSS (wordpress-compat.css) has these @media blocks:**
- Line 386: <=921px header swap (desktop hidden, mobile shown) ✓
- Line 395/405: >=922px desktop header/sticky ✓
- Line 423: <=767px mobile header dark bg ✓
- Line 941: <=921px blog grid 2-col ✓
- Line 947: <=544px blog grid 1-col ✓
- Line 1230: <=921px footer responsive ✓
- Line 1436+: more responsive rules...

**MISSING FROM HUGO CSS (compared to WP):**
1. html { font-size: 91.2% } at <=921px and <=544px — CRITICAL (affects ALL sizing)
2. Block padding custom props at <=921px and <=544px
3. .ast-container max-width: 1240px at >=922px (need to check if present)
4. Many footer builder display rules
5. .ast-plain-container background at mobile
6. Various article padding rules at <=544px

**FULL CSS READ COMPLETE. KEY GAPS IDENTIFIED:**

1. **html font-size: 91.2% at <=921px** — WP blocks 20/21 set this. NOT in Hugo CSS. This scales ALL rem/em units down on mobile. CRITICAL.
2. **Block padding custom props at <=921px/544px** — WP blocks 27/28 set --wp--custom--ast-default-block-*-padding. NOT in Hugo CSS.
3. **ast-container max-width: 1240px at >=922px** — WP block 22. Need to verify if in Hugo.
4. **.site-content .ast-container flex-direction: column at <=921px** — WP block 24. Need to verify.
5. **Collection pages have NO mobile responsive rules for info-box-section width/padding** — 70% max-width at mobile is too narrow.
6. **Homepage sections use 70% max-width** — at <=921px switches to 90%. Already in Hugo.
7. **Footer builder display rules** — many blocks (36-78) set footer widget display:block at mobile. May already work.
8. **Article background white at mobile** — WP blocks 81-88. Cosmetic.
9. **Single post max-width 1055px at >=922px** — WP block 25. Not sure if in Hugo.

**LOAD ORDER (head.html):** wordpress-compat.css FIRST, then main.css. Responsive typography in BOTH files (wordpress-compat line 1526, main.css line 273). main.css wins cascade for h1-h6 sizes. Both have the same values so this is OK now.

**CURRENT STATE:**
- Hugo server running on port 1314
- 90 mobile baselines exist
- Batch test script written, not yet run
- Need to run baseline diffs BEFORE making changes

**BASELINE SCORES (pre-fix):**
- home: 35.94% (542px taller)
- privacy-policy: 19.26% (3619px taller)
- a11y-statement: 30.15% (386px taller)
- fcoi: 47.69% (214px shorter)
- about-audiom: 46.64% (101px shorter)
- blog: 56.61% (1359px taller)
- aquarium: 13.59% (2890px taller)
- audiom-demo: 10.93% (6px shorter)
- universities: 44.24% (3544px taller)
- bovine: 11.43%, skeleton: 12.35% (good)
- wcag-table: 60.28% (295px shorter)
- contact: 67.19% (592px shorter)
- events: 19.18% (265px taller)

**FIXES APPLIED (batch 1):**
1. html { font-size: 91.2% } at <=921px
2. .ast-container max-width: 1240px (was 100%)
3. .site-content .ast-container { display: flex }
4. Block padding custom properties at <=921px and <=544px
5. .site-title display:none at <=921px
6. .site-content .ast-container flex-direction: column at <=921px
7. #primary padding/margin zero at <=921px
8. Collection page mobile: full-width info-box, padding 20px
9. WP column collapse at <=544px

**POST-FIX SCORES (batch 1):**
- privacy-policy: 19.26% -> 19.21% (barely moved)
- home: 35.94% -> 35.76% (barely moved)
- blog: 56.61% -> 55.58% (slightly improved)

**DIAGNOSTIC (privacy-policy at 375px):**
- html fontSize: 14.592px (91.2% of 16px = 14.592px ✓ APPLIED)
- body fontSize: 16px (body sets explicit 16px, overrides html)
- h1 fontSize: 30px ✓
- p fontSize: 16px (NOT affected by html 91.2% — p has explicit 16px in main.css)
- container maxWidth: 100% (NOT 1240px — must be overridden by main.css mobile rule)
- container paddingLeft: 32px (2rem = 2 * 14.592px = 29.18px... wait, says 32px)
- container width: 0 (no content?)
- body classes: ast-hfb-header ast-page-builder-template (no ast-plain-container)

**ROOT CAUSE:** The html font-size 91.2% is APPLIED but has minimal effect because:
1. All text sizes are set in px, not rem/em — h1 30px, p 16px, etc. So 91.2% only affects rem/em-based spacing.
2. The real height difference is from content itself — WP pages have different content rendering.
3. Container maxWidth showing 100% not 1240px — need to check why.
4. Container padding 32px = 2rem at 16px body size (body overrides html's 91.2%).

**CONTAINER ISSUE:** main.css has `.ast-container { padding-left: 20px; padding-right: 20px; }` at <=921px. But wordpress-compat also has `.page-content-wrap .uagb-container-inner-blocks-wrap { padding: 0 2rem; }`. The 32px is 2rem from somewhere — need to trace.

**BATCH 1 FIX RESULTS (after blog hero h1 fix):**
- blog: 56.61% -> 52.55% (6267->6079px, still 917px taller than 5162px baseline)
- a11y-statement: 30.15% -> 30.14% (unchanged, 375px taller)
- universities: 44.24% -> 45.34% (slightly worse, 3257px taller than 4539px baseline)

**BLOG h1 FIX:** Added `.blog-hero h1.change-heading` responsive rule at <=921px with font-size:30px.

**COLLECTION PAGE PROBLEM:** Universities 7796px Hugo vs 4539px WP = 3257px taller. Collection sections use min-height:100vh (hero), padding:192px (info-box, feature-cards), min-height:85vh (cta) — designed for desktop. WP reduces these on mobile.

**COLLECTION FIX RESULTS:**
- universities: 45.34% -> 43.88% (7796->4866px, now only 327px taller than 4539px WP)
- Key fixes: hide info-box images on mobile, min-height:auto on hero/cta, reduce padding 192px->40px

**BLOG VISUAL COMPARISON (WP vs Hugo at 375px):**
WP blog: Hero shows h1 + subtitle on dark bg, NO hero image visible. Post cards are single-column list-style (title + excerpt + date, NO images). Very compact.
Hugo blog: Hero shows h1 + subtitle on dark bg WITH background image. Post cards are card-style with images + title + excerpt + date. Cards much taller.

**KEY BLOG DIFFERENCES:**
1. WP blog cards at mobile: list-style, NO card images visible. Hugo: card-style WITH images.
2. WP blog hero: compact, text-only bg. Hugo: has bg image, takes more space.
3. Hugo "Latest Blog Posts" h2 has large top spacing that WP doesn't.
4. WP shows ~12 posts, Hugo shows 11 — similar count.

**ROOT CAUSE:** Blog card layout is fundamentally different. WP UAGB post grid hides card images at mobile and switches to list layout. Hugo keeps card layout with images.

**ABOUT-AUDIOM (46.64%):** Haven't investigated yet.

**ACCESSIBILITY-STATEMENT (30.14%):** 375px taller. Haven't investigated visually yet.

**BLOG INVESTIGATION:**
- Blog cards have NO featured_image elements (no .uagb-post__image found). So hiding images is a no-op.
- Blog hero: 584px (padding 80px 0). WP hero looks ~300px.
- Blog grid: 4425px (11 cards, 1-col, gap 30px). WP grid ~3000px (12 posts, tighter spacing).
- Card padding: 30px 40px 10px = 80px vertical per card. WP looks like ~40px.
- Footer: 762+80 = 842px. Similar to WP.
- Added mobile card padding reduction (20px 25px 10px) and grid gap (20px).
- Still need to reduce hero height further.

**FULL BATCH RESULTS (after all batch 1+2 fixes):**
- blog: 56.61% -> 44.00% (BIG WIN -12.61)
- universities: 44.24% -> 43.88% (-0.36)
- fcoi: 47.69% -> 47.15% (-0.54)
- home: 35.94% -> 35.76% (-0.18)
- events: 19.18% -> 19.03% (-0.15)
- REGRESSIONS: audiom-demo +2.07, bovine +2.28, skeleton +2.28, about-audiom +0.64, contact +0.31

**REGRESSION CAUSE:** Global changes (html font-size 91.2%, .site-content .ast-container display:flex) hurt embed pages that were already tuned. Added `.audiom-embed-body .site-content .ast-container { display: block }` to fix.

**ABOUT-AUDIOM REGRESSION:** +0.64%, now 47.28%. Height 4992 vs 5104 baseline (112px short). Likely from padding/margin changes.

**STRATEGY PROBLEM:** Small global CSS changes yield small improvements on bad pages but cause regressions on good pages. The fundamental height differences are from CONTENT not CSS:
- privacy-policy: 3608px taller (27% taller) — text wrapping at different widths
- a11y-statement: 375px taller — text content differences
- home: 524px taller — section content/spacing
- These are NOT CSS-fixable without page-specific overrides

**HTML FONT-SIZE 91.2% REMOVED.** Caused embed regressions, barely helped others since all sizes are px-based. Embeds restored to original scores.

**CURRENT SCORES (after removing 91.2%):**
- blog: 46.57% (from 56.61%, -10 improvement)
- universities: 43.88% (from 44.24%)
- audiom-demo: 10.93% (restored)
- bovine: 11.43% (restored)
- skeleton: 12.35% (restored)
- about-audiom: 46.64% (same as original)
- home: 35.94% (same as original)
- contact: 67.19% (same as original)

**ABOUT-AUDIOM (46.64%):** Visually very close to WP! Only 101px shorter. High diff% from accumulated text-wrapping shifts (death by 1000 cuts). Hugo has "Interactive Map Benefits" extra section. Footer links differ slightly. Not CSS-fixable — content differences.

**CONTACT (67.19%):** MASSIVE structural difference:
- WP: Dark hero section with h1 "Get In Touch!" + description text, then a white card with form fields (Name, Email, Institution, Industry, Message + reCAPTCHA). Then footer.
- Hugo: NO hero section, NO dark bg. Just plain h1 + text + unstyled form fields (label beside input, not above). Form is much shorter/plainer. Then footer.
- Root cause: Contact page template is fundamentally different. WP uses a UAGB container with dark bg and a wpforms embed. Hugo has a basic form. This is a TEMPLATE issue, not CSS.

**HOMEPAGE FIX RESULTS:**
- home: 35.94% -> 28.95% (10300->9584px, now 174px SHORTER than 9758 baseline)
- Fixed: min-height:auto on hero/why/clients/what-is, reduced clients bottom padding, team bottom padding 100->40px, pre-footer padding 250->100px, video wrapper min-height auto, contact-form-card max-width 95%

**CURRENT SCORES (latest round):**
- home: 28.95% (from 35.94%, -7 improvement)  
- blog: ~46% (from 56.61%, -10 improvement)
- universities: 43.88% (from 44.24%)
- embeds: restored to original (~10-12%)

**REMAINING HIGH-DIFF PAGES:**
- contact: 67.19% — template issue, not CSS
- wcag-table: 59.71% — likely missing content
- fcoi: 47.15% — footer-dominated diff, short page
- about-audiom: 46.64% — text wrapping diffs, NOT CSS
- blog: ~46% — card height diffs
- universities: 43.88% — 327px taller

**NEXT:** Run full batch for final scores, then commit. The remaining high diffs are mostly template/content issues, not CSS.
