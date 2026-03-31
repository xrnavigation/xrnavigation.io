# Migration Perfect Page Notes
## 2026-03-30

**GOAL:** Get fictional-map page to <1% visual diff from WP baseline.

**STATE:** Initial investigation. Have read the prompt, content file, directory structure.

**OBSERVED:**
- Baseline screenshot exists at tests/baseline/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific-desktop.png
- Hugo CSS: themes/xrnav/static/css/ has main.css, wordpress-compat.css, dark-mode.css
- WP CSS: 29 files in data/wp-css/
- Content is a long text-heavy page (aquarium map description)
- Playwright config exists at tests/playwright.config.ts with 30min timeout
- Tests dir has visual-comparison.spec.ts and visual-baseline.spec.ts

**OBSERVED (round 2):**
- Hugo server running on port 1314, page returns 200
- Read all templates: baseof.html, single.html, header.html, footer.html
- Read main.css (reset, typography, focus styles) and wordpress-compat.css (Astra layout, header, footer, UAGB blocks)
- single.html wraps content in `.ast-article-single > .entry-content > .wp-block-uagb-container.alignfull > .uagb-container-inner-blocks-wrap`
- Header is fixed position on desktop (sticky), 80px height
- Footer has 3 tiers: above-footer, primary-footer, below-footer
- Content page is pure markdown (h1-h4, p, ul, links) — no audiom iframe despite prompt saying there is one
- ward blocks `node -e` inline scripts, need to use script files instead
- Created tests/screenshot.js for taking screenshots

**ITERATION 1 IN PROGRESS — applying fixes based on WP vs Hugo computed style comparison:**

Key differences found via browser JS comparison (WP tab 429210856, Hugo tab 429210844):
- WP page height: 17366, Hugo: 17746 (+380px)
- WP h2: 32px/40px line-height, Hugo: 40px/50px — WRONG, too big
- WP h3: 26px/33.8px, Hugo: 24px/31.2px — WRONG, too small
- WP footer above-section: display:none (0px), Hugo: display:block (539px) — HUGE diff
- WP footer primary: 465px (display:grid), Hugo: 438px (display:block)
- WP footer below: 61px, Hugo: 81px
- WP has NO .uagb-container-inner-blocks-wrap — content is directly in .entry-content at 1905px wide
- WP .entry-content width: 1905px, Hugo container: 1200px (but max-width:80ch constrains text similarly)
- p count: WP 109, Hugo 110 (1 extra)

Fixes applied so far:
1. Added `display: none` to `.site-above-footer-wrap` in wordpress-compat.css
2. Changed h2 from 40px/50px to 32px/40px in main.css
3. Changed h3 from 24px/31.2px to 26px/33.8px in main.css

Still need to apply:
4. Same h2/h3 fixes in wordpress-compat.css (h2.wp-block-heading, h2.uagb-heading-text, h3 variants)
5. Fix single.html template — remove uagb container wrapper to match WP structure
6. Fix footer primary/below section sizing

**ITERATION 1 RESULT:** 4.81% -> 4.46% (hid above-footer, fixed h2/h3 sizes, removed uagb wrapper)
**ITERATION 2 RESULT:** 4.46% -> 3.89% (added content width constraints: max-width 1200px + 48px padding on headings/lists)

Page height: baseline 17334, current 17145 (189px short). Footer still dominates bottom 10% at 22.58%.

Remaining issues:
- Page still 189px too short — cumulative spacing diffs across ~110 headings
- Content regions at 1-2% diff throughout — likely horizontal position differences (headings centering, paragraph widths)
- Footer mismatch: Hugo footer 494px vs WP 526px (465+61)
- WP header bar is 81px fixed; need to verify Hugo header matches
- WP has no content container wrapper — content elements use `body p { max-width: 80ch }` and `.wp-block-group` wrappers with margin centering
- Hugo h1 at left:0 full-width vs WP h1 at left:352.5 within 1200px group

**AGENT 2: 2026-03-30**
Starting: 4.65% diff (after previous agent's uncommitted CSS was auto-applied by linter)

Fixes applied:
1. Heading color: changed from color-1 (#04203e) to color-2 (#5a7969) — matches WP Astra theme heading color
2. Link color: changed to #0054ad blue with underline — matches WP
3. Removed `a:where(:not(.wp-element-button))` rule that was killing text-decoration
4. Article padding-top: 32px → 0 (matches WP)
5. UL/OL margin: `revert` → explicit `margin-top:0; margin-bottom:0; padding-left:40px` (matches WP)
6. **letter-spacing: 0.3px on body** — THE BIG FIX. WP Astra sets this globally. Without it, 11 paragraphs wrapped to one fewer line, causing 277px cumulative height drift.
7. Fixed quick-diff.js: handles different image sizes by expanding to max dimensions

Results: 4.65% → 1.18%
Remaining diff sources:
- Header (0.3%): Hugo has theme-switcher buttons WP doesn't
- Footer (0.3%): Hugo footer is 32px shorter (different content/links)
- Content-area text position (~0.5%): subtle horizontal sub-pixel differences

In Playwright (screenshot context), ALL 224 element heights now match WP exactly.

**KEY DISCOVERY:** Previous agent's WIP commit (2c0837f) already included letter-spacing, padding-top, UL fixes in wordpress-compat.css. My edits to that file were redundant — the linter may have applied them before I started. My actual new changes are only in main.css (heading color to color-2, link color to #0054ad blue, removed a:where rule).

**CURRENT STATE (Playwright diff):** 1.18% diff
- Page height: 17285 vs baseline 17334 (49px short)
- Content element heights: ALL 224 elements match WP exactly in Playwright
- Footer: Hugo 494px vs WP 526px = 32px diff (content/link count differences, not CSS)
- Below-footer: Hugo 56px vs WP 61px = 5px diff
- Remaining content height: 16px from inter-element margin collapsing

**DIFF BY REGION:**
- Header 0-200: 5.51% (theme switcher buttons not in WP baseline)
- Content 200-16200: 0.1-1.3% per band (thin horizontal position diffs from cumulative spacing)
- Footer 16400+: 3-37% (height mismatch shifts entire bottom)

**BLOCKER for sub-1%:** The header theme switcher (adds ~0.3% globally) and footer height diff (adds ~0.4%) together account for ~0.7% that cannot be fixed via CSS alone.

**STAGED FOR COMMIT:** main.css (heading color, link color), quick-diff.js (size handling), notes file

**NEXT:** Commit, then try to reduce content-area horizontal text-shift diffs
