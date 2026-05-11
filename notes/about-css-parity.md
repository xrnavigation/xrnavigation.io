# About Page CSS Parity Fix

**Date:** 2026-04-08

**GOAL:** Reduce about page desktop diff from ~21.6% and mobile from ~31.2% toward 0%.

**Current diffs (from run 1):**

Desktop (14 sections):
- Section 13 (95.7%): bg should be transparent not #15191d, innerWrapper collapsed to 0px width
- Section 12 (52.9%): innerWrapper needs justify-content:center, align-items:center, gap:20px
- "Experience How Audiom" (26.0%): paragraph color rgb(0,0,0) -> rgb(119,119,119), should be black
- "Problem Is Massive" (19.9%): container needs padding 80px, display:flex, gap 0 40px; paragraph color wrong
- "CONTACT US" (13.0%): heading color wrong, paragraph font-weight wrong
- "But We have Solution" (11.0%): same as Problem section
- Team bios (6-9%): heading/paragraph colors should be light (#f9fafb) not dark
- "Our Partners" (8.5%): needs bg rgb(249,250,251), heading font-weight:800

Mobile (14 sections):
- Nearly every section: container.margin-right/left: 0px -> -20px (Hugo has -20px margins)
- Team bios (56-58%): heading font-size 36px->24px wrong, colors wrong
- "Meet Our Team" (54.4%): heading width, innerWrapper gaps
- "About Xr Navigation" hero (42.3%): bg-attachment fixed->scroll, margins
- "Experience How Audiom" (35.8%): margins, colors

**Key block IDs:**
- 56811aa8 = hero "About Xr Navigation"
- 5f4b1139 = "Experience How Audiom" section  
- 4f510e9f = "Publications"
- e3ee6a34 = "The Problem Is Massive"
- 99b62053 = "But We have The Solution"
- 11b39758 = "Our Partners"
- 8f7c6a5b = "Our Investors"
- 7fd0a09e = "Meet Our Team"
- 4084160e = Brandon, 55dd86c5 = Chris, b49613d3 = James
- 4b5c4fc6 = "CONTACT US"
- b7884180 = section 12 (overlap section)
- 2c780bfa = section 13 (map/footer section)

**CSS file:** about-page selectors span lines 5175-6267

**DONE:**
1. Section 13 (2c780bfa): fixed bg-color to transparent, min-height to 540px, added innerWrapper flex/centering/width rules

**DONE:**
2. Section 12 (b7884180): added justify-content/align-items/gap to innerWrapper

**BLOCKER:** Linter/formatter keeps modifying the CSS file between Read and Edit calls, causing "file modified since read" errors. The file has been reordered — accessibility section now starts at line 6468 instead of 6311.

**RUN 2 RESULTS (after first batch):**
Desktop: Section 13 95.7->58.4%, Section 12 52.9->19%, team bio colors FIXED, Experience paragraph FIXED
Mobile: -20px margins FIXED across all sections, team bio font-size FIXED

**REMAINING ISSUES (run 2):**
Desktop:
- Problem/Solution (19.9%/11%): container.padding 80px missing, gap 0 40px missing. Existing rules at 5589-5598 set padding:100px 0 — need to change to include horizontal padding
- Our Partners (8.6%): innerWrapper needs justify-content/align-items, heading text-align wrong (start vs left)  
- Publications (5%): paragraph color still #777, innerWrapper row-gap 0->80px
- CONTACT US (9.6%): heading color rgb(21,25,29) -> rgb(4,32,62) — my override used wrong value? paragraph font-weight still 400
- Section 13 (58.4%): no style diffs reported — likely image/content diff
Mobile:
- Team bios (52-57%): innerWrapper.margin 0->14px, widths differ (327->299px), font-size 15->16px
- Our Partners/Investors: heading text-align center->left (should be center on mobile)
- About hero (43.4%): bg-attachment fixed->scroll (already in existing 544px rule), innerWrapper max-width
- Meet Our Team (45.1%): heading width 320->270px, gaps
