# Migration Perfect Homepage Notes
## 2026-03-30

**GOAL:** Get homepage to <1% visual diff from WP baseline screenshot.

**STATE:** Initial investigation complete. Reading files.

**OBSERVED:**
- Baseline: tests/baseline/home-desktop.png exists
- layouts/index.html: 9 sections (hero, steps, why, video, clients, what-is, use-cases, team, contact)
- content/_index.md: frontmatter with all section data
- CSS: themes/xrnav/static/css/wordpress-compat.css (Astra/UAGB compat), main.css (reset/typography)
- WP CSS spec in data/wp-css-spec.md has exact per-section padding values
- WP per-block styles in data/wp-css/inline-uagb-style-frontend-135.css

**KEY PADDING VALUES (from wp-css-spec.md):**
| Section | Pad Top | Pad Bottom | Inner Max-Width |
|---------|---------|------------|-----------------|
| Hero | 152px | 152px | 80% |
| Steps | 10px | 10px | 70% |
| Why | 104px | 160px | 70% |
| Video | 0px | 100px | 70% |
| Logos | 10px | 10px | 80% |
| What Is | 100px | 100px | min(100%,1200px) |
| Use Cases | 85px | 85px | 70% |
| Team | 50px | 200px | 70% |
| Contact | 10px | 10px | 70% |

**OBSERVED (round 2):**
- NO homepage-specific CSS exists anywhere. Classes like .hero, .steps, .why, .video-section, .clients, .what-is, .use-cases, .team, .contact-section have ZERO styles.
- wordpress-compat.css has Astra shell, header, footer, WP utility classes, collection pages — but nothing for homepage sections.
- Hugo server running on port 1314, returning 200.
- Created tests/screenshot-home.js and tests/diff-home.js for the iteration loop.
- Playwright chromium installed.

**INITIAL DIFF:** 56.32% — baseline 1920x6770, current 1920x8180 (1410px too tall)

**ROOT CAUSE:** Zero homepage section CSS exists. All 9 sections unstyled.

**WP BLOCK MAPPING (from UAGB CSS):**
- `450c520f` = Hero: 8%/8% pad, 80% inner, 60vh min-height, bg image, overlay
- `0c8bfb8f` = Steps outer: 10px/10px, 70% inner
- `d401f737` = Steps card row: -75px margin-top, rounded, shadow, row layout
- `ce063dbc/12ec790a/ec1fc462` = Step cards: 33% width each, 40px/40px padding
- `efd08189` = Why: 104px/160px, 70% inner, row layout, 100px col-gap
- `c0bec334` = Video: 0px/100px, 70% inner
- `0ed2e7f3` = Logos: 10px/10px
- `11cfca31` = What Is: 100px/100px/80px/80px, bg ast-global-color-4
- `4e4fbd70` = Use Cases: 85px/85px
- `4b5c4fc6` = Team: 50px/200px
- Contact: 10px/10px (via wp-css-spec)

**Hero bg image exists:** static/images/DALL%C2%B7E-2023-10-17-15.50.05-...university-campus...webp

**ITERATION 1:** Wrote comprehensive homepage CSS (~350 lines) appended to wordpress-compat.css. Covers all 9 sections with WP-matching padding, layout, colors. About to screenshot+diff.

**WP HTML STRUCTURE (from homepage.md):**
- Section 0 (hero): uagb-block-450c520f root > inner > uagb-block-7cba2e14 (h1, p, button)
- Section 2 (steps): uagb-block-0c8bfb8f root > inner > uagb-block-d401f737 (3 step cards)
- Why section (efd08189) has 2-column row layout with 100px gap
- Video section (c0bec334) is separate, 0px/100px padding

**ITERATION 1 RESULT:** 56.32% -> 46.93%. Page 6357px vs baseline 6770px (413px short).

**KEY VISUAL DIFFS OBSERVED (comparing screenshots):**
1. Hero too short — needs more padding
2. Why section + Video are separate sections but WP has them as 2-column (text left, video right)
3. Client logos area has positional offset due to above issues
4. What Is Audiom section looks OK but position shifted
5. Use Cases at 11.86% — close
6. Team at 7.84% — close
7. Contact + footer bottom 20% at 39-81% — big footer/contact diff

**ITERATION 2 RESULT:** 56.32% -> 44.09%. Page 5590px (Playwright) / 5248px (browser) vs baseline 6770px.

**CRITICAL DISCOVERY: wp-css-spec.md padding table is WRONG from row 3 onward!**
Measured actual WP live site vs what I was using:

| Section | WP ACTUAL pt/pb | I WAS USING pt/pb |
|---------|----------------|-------------------|
| Hero | 152/152 | 8%/8% (169px) |
| Steps | 10/10 | 10/10 (correct) |
| Why | 104/160 | 104/160 (correct) |
| Clients | 0/100 | 10/10 (WRONG) |
| What Is | 10/10 | 100/100 (WRONG) |
| Use Cases | 100/100 | 85/85 (WRONG) |
| Team | 85/85 | 50/200 (WRONG) |
| Contact | 50/200 | 10/10 (WRONG) |

The spec table was offset by 1 section from row 3. Fixing all padding values now.

WP also has 2 extra sections at bottom (8,9) with 10px/10px and 10px/0px — probably pre-footer band sections we don't have in Hugo.

**WP heights:** Hero=678, Steps=303, Why=1257, Clients=412, WhatIs=820, UseCases=1126, Team=619, Contact=391, footer=526, total=6568

**ITERATION 3 IN PROGRESS — fixes applied:**
1. Hero padding: 8% -> 152px fixed
2. Clients padding: 10/10 -> 0/100
3. What Is: 100/100 -> 10/10, added min-height:90vh, bg image (blind-man-with-guide-dog), dark overlay rgba(20,24,28,0.84), white text
4. Use Cases: 85/85 -> 100/100, need to add bg color #f9fafb
5. Team: 50/200 -> 85/85
6. Contact: 10/10 -> 50/200

Still need:
- Use Cases bg color (#f9fafb)
- Pre-footer map band (section 9: min-height 50vh, bg image map-for-bottomArtboard)
- Section 8 spacer (10/10 transparent)

**ITERATION 3 RESULT:** 44.09% -> 35.14%. Page 6614px vs baseline 6770px (156px short).

**Good regions:** 60-70% at 4.67%, 70-80% at 1.17% (team+contact area)

**Problem regions from diff image:**
1. Hero (0-10%, 59%): still offset — header is overlapping hero differently in WP vs Hugo. WP header is transparent overlay ON the hero, Hugo header pushes content down.
2. Clients+What Is (30-40%, 72%): The "Our Clients" section is ~100px offset from baseline. The client logos in WP are in a single horizontal row but bigger/more spread. The "What Is Audiom" dark band starts too early or too late.
3. Use Cases area (40-50%, 38%): shifted due to cumulative offset from above sections
4. Bottom (80-100%): Pre-footer map band and footer are shifted — the map band image might not be loading or is positioned wrong. Footer structure differs.

**Key insight:** WP header is transparent and overlays the hero (static position but visually overlapping). Hugo header takes up 80px of vertical space BEFORE the hero starts. This shifts everything down by ~80px.

**ITERATION 4 RESULT:** 35.14% -> 31.44%. Page 6675px vs baseline 6770px (95px short).

**Good regions:** 70-80% at 1.05%, 60-70% at 4.99%

**Section height comparison (Hugo vs WP):**
| Section | Hugo | WP | Diff |
|---------|------|-----|------|
| Hero | 667 | 678 | -11 |
| Steps | 234 | 303 | -69 |
| Why | 906 | 1257 | -351 |
| Clients | 321 | 412 | -91 |
| What Is | 911 | 820 | +91 |
| Use Cases | 1096 | 1126 | -30 |
| Team | 440 | 619 | -179 |
| Contact | 886 | 927(s7+s8) | -41 |

**Key findings:**
- WP header wrap is position:fixed, overlays hero — Hugo matches this
- Team photos load with height=0 (lazy loading issue in browser, Playwright gets them at 300px wide)
- WP team photos are 184x184. Hugo photos are 512x512 native but display at 300x? (lazy load issue)
- WP Contact section (s7) has NO FORM — just heading+text. Form is in footer above-section (s8).
- WP logos are ~435x141 each — increased max-height to 141px
- Client section inner max-width corrected to 70%

**Remaining big diffs:**
- Hero (59%): bg image rendering difference (fixed attachment)
- 30-40% (64%): Clients/What Is transition - clients section taller now with bigger logos but position still off
- 50-60% (46%): Use Cases still shifted
- 80-90% (43%): Contact/pre-footer area

**ITERATION 5 RESULT:** 31.44% -> 25.06% with min-height:1257px on Why. But page 7001px (231px too tall).

**Remaining issues by priority:**
1. Hero bg image (57%): parallax `background-attachment:fixed` renders differently in Playwright headless vs baseline. Dominant diff source.
2. Page 231px too tall: min-height:1257px on Why overshoots because Able Player renders differently in Hugo (shorter). Need to tune.
3. Bottom (80-100%): pre-footer map band + footer shifted due to extra height above.
4. Why section: WP has 2 children in right column (video player 536px + transcript 419px = 993px). Hugo just has video (~370px).

**APPROACH CHANGE:** Remove Why min-height. Instead fix hero bg to not use fixed attachment (matches Playwright rendering of baseline). Focus on getting total page height closer to 6770px.

**CRITICAL FIX FOUND:** Hero bg image was 404! The filename has literal `%C2%B7` in it so CSS URL needs double-encoding `%25C2%25B7`. Fixed. What Is bg image loads fine.

Removed Why min-height:1257px (was making page too tall).

**ITERATION 6 RESULT:** Hero bg fix: 59% -> 18% in hero region. Overall: 27.30% (without Why min-h) -> 22.08% (with min-h:1001px). Page 6745px vs 6770px (25px short).

**Diff image analysis — remaining problem areas:**
- 30-40% (55%): Clients section starts ~200px earlier in Hugo than baseline. The Hugo clients section is shorter and the "What Is" dark band starts too early. Logos are in a row but WP logos appear bigger/more spaced.
- 50-60% (45%): Use Cases section shifted up ~200px due to cumulative offset
- 80-90% (28%): Contact area is close but still some offset
- 70-80% (1.07%): Nearly perfect

**Root cause of 30-40% offset:** The Why section in Hugo is ~350px shorter than WP (Able Player renders differently — WP has video+transcript stacked at 975px, Hugo has just video at ~370px). Even with min-height:1001px, the section is ~250px short of WP's 1257px. This cascades to all sections below.

**DECISION POINT:** Can't match WP Able Player height exactly. Options:
A: Increase Why min-height to ~1200px to close the gap (risk: overshooting again)
B: Accept the Why section height diff and focus on other fixes
C: Add padding/spacing to multiple sections to distribute the gap
CHOOSING: A — try min-height:1160px (splits the difference between 1001 and 1257)

**ITERATION 7 RESULT:** 22.44%. Page 6774px vs 6770px baseline (4px off — perfect height match).

Pre-footer map bg loads fine (200 OK).

**Region breakdown:**
- 0-10%: 18% (hero bg image — position/rendering diff)
- 10-20%: 16% (steps — text wrapping/card height)
- 20-30%: 15% (Why section — video player size)
- 30-40%: 51% (WORST — Clients/What Is transition, ~200px offset)
- 40-50%: 19% (What Is / Use Cases boundary)
- 50-60%: 44% (Use Cases area shifted)
- 60-70%: 7% (good)
- 70-80%: 1% (excellent)
- 80-90%: 33% (contact/pre-footer)
- 90-100%: 18% (footer)

**Key remaining problem:** Sections are still offset from ~30% onward. The Why section at 1030px min-h is still ~227px shorter than WP's 1257px. This shifts Clients/What Is/Use Cases sections upward. The offset gradually resolves by Team section (70-80%).

The 50-60% diff (44%) is the Use Cases section — it's at the right HEIGHT now but shifted up because cumulative sections above are shorter.

**ITERATION 8 IN PROGRESS:**
- Steps grid: max-width to min(70%,1200px), align-items: stretch (matching WP card widths)
- Contact form: added floating card styling (bg, padding, border-radius:30px, shadow)
- Pre-footer map: margin-top:-200px to overlap contact section (matching WP floating card effect)

WP contact structure: section 7 (heading, 50px/200px pad) -> section 8 (form card, -15% margins, floating) -> section 9 (map band, -17px bottom margin). Hugo approximates this with contact-section + pre-footer-map.

**ITERATION 8 RESULT:** Contact card styling and map overlap both made things worse. Reverted to 22.14%.

**CURRENT STATE: 22.14%, page 6798px vs baseline 6770px (28px over)**

**Remaining diff breakdown:**
- 0-10% (18%): Hero bg image position diff — hard to reduce further
- 10-20% (16%): Steps — close enough
- 20-30% (12%): Why section — getting close
- 30-40% (47%): BIGGEST — Clients/What Is transition offset ~300px
- 40-50% (17%): What Is ending / Use Cases start
- 50-60% (42%): Use Cases offset ~200px from baseline
- 60-70% (7%): Good
- 70-80% (1%): Excellent
- 80-90% (34%): Contact/pre-footer area
- 90-100% (24%): Footer diff

**ROOT CAUSE ANALYSIS:** The 30-40% and 50-60% diffs are positional offsets from the Why section being ~227px shorter. Everything after Why is shifted up. This cascading offset is responsible for ~40% of remaining diff pixels. Cannot fix without matching Able Player video height.

**DECISION:** Stop trying to match heights. Focus on visual appearance fixes within each section that are independent of position. Commit and write report.

**NEXT:** Commit iteration 8 changes, write report
