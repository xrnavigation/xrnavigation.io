# Rethinking the WP→Hugo Visual Parity Approach
## 2026-04-08

**GOAL:** Find a smarter, more principled approach to achieving exact visual parity between Hugo and WordPress, instead of the current hand-craft-each-template loop.

**OBSERVED SO FAR:**
- 90 pages × 2 viewports = 180 comparisons
- 11 rounds of visual comparison, plateaued at ~27% avg diff since R9
- Current approach: hand-craft per-page Hugo templates to match WP DOM → 17 wp-* layout dirs, 592 lines of standalone HTML blobs with no shared partials
- Template proliferation is unmaintainable — each is a snowflake
- Diff metric conflates height mismatch with visual mismatch (height penalty at 100%)
- Theme: WordPress uses Astra + UAGB (Spectra), which generates per-page inline CSS scoped to unique block IDs
- WP generates 330KB+ of inline CSS vs Hugo's ~3KB hand-rolled CSS
- No existing Astra-to-Hugo port exists anywhere (confirmed by theme-research)
- WP CSS is dynamically generated, can't be copied directly because Hugo generates different HTML structure
- Already explored: CSS extraction from live site, computed style capture, Astra/Spectra source analysis
- Already have: wp-html/ directory with captured WP DOM fragments, wp-rendered/ with at least one page's HTML+CSS
- Already have: ~37 analysis/inspection scripts (check-*, inspect-*, extract-*, analyze-*)
- The PROPOSAL.md file exists but hasn't been read yet — may contain alternative approach ideas

**KEY INSIGHT FROM NOTES:**
- The theme-research conclusion was: "hand-rolled wordpress-compat.css referencing extracted CSS values is the correct strategy"
- But this strategy plateaued at 27% and led to template proliferation
- The core tension: WP generates unique HTML per page (block IDs, inline styles), Hugo generates uniform HTML from templates. Matching pixel output from different DOM = fighting the tool.

**WHAT WE HAVEN'T EXPLORED YET:**
1. PROPOSAL.md — unread
2. data/wp-rendered/ — has at least corporate-campuses.html/.css — may be a "serve the actual WP HTML" approach
3. Whether tools exist that can auto-generate static HTML from WP (not Hugo at all)
4. Whether the right move is to serve WP's actual rendered HTML as static files instead of rebuilding in Hugo
5. DOM-diffing instead of pixel-diffing (compare structure, not screenshots)
6. Existing WP-to-static-site tools (Simply Static, WP2Static, HTTrack, wget mirror)
7. Whether AI can generate CSS from visual diffs (e.g., feed diff images to vision models)

## Research Results (3 parallel agents, 2026-04-08)

Full reports in:
- `notes/research-wp-static-tools-2026-04-08.md`
- `notes/research-ai-css-generation-2026-04-08.md`
- `notes/research-hugo-raw-html-2026-04-08.md`

### Key findings:

1. **Nobody has solved pixel-perfect WP→Hugo.** People who get exact parity either serve WP statically (Simply Static) or accept a redesign.

2. **Hugo natively supports .html content files.** Front matter + raw HTML body = Hugo wraps it with baseof.html. No Markdown processing. A passthrough template (`{{ .Content }}`) outputs the body verbatim.

3. **The extraction script already exists.** `scripts/export-live-page-fragment.js` captures `.entry-content` innerHTML + relevant `<style>` rules per page. Already ran for `corporate-campuses`.

4. **Simply Static** (WP plugin) can export the entire WP site as static HTML. But keeps WP as a dependency — defeats the purpose of migrating.

5. **AI CSS generation** is not mature enough to auto-fix diffs. Best available: `auto-image-diff` (structured diff JSON + heuristic CSS suggestions), Claude vision loop (feed screenshots, ask for CSS fixes). Both are supplements, not solutions.

6. **Computed-style extraction** (getComputedStyle per element) is viable but the hard problem is DOM element mapping between WP and Hugo — different markup structures.

### Three candidate approaches:

**A. Simply Static (keep WP hidden):** Zero template work, guaranteed parity, but WP stays as a dependency.

**B. Hugo HTML passthrough (capture WP HTML, serve through Hugo):** One-time extraction per page, Hugo provides wrapper. Parity is automatic. Content bodies are opaque HTML. Extraction script already exists.

**C. AI-assisted CSS convergence (keep Markdown, automate the CSS loop):** auto-image-diff + Claude vision + computed style diffs. Most sophisticated, least proven, keeps Markdown editability.

### Recommendation: Hybrid B+C

- Use **Path B** (HTML passthrough) for the ~40 pages that are fighting us (collections, blog-single, standard-single outliers)
- Keep **Markdown** for the ~49 audiom-embed pages that already work well (<5% desktop)
- Use **Path C** (Claude vision loop) as an optional refinement tool for Markdown pages that are close but not perfect
- **Path A** (Simply Static) is the escape hatch if everything else fails

### Decision: Q rejected Paths A and B
Q wants Markdown editability preserved. Serving opaque HTML blobs defeats the purpose of leaving WordPress. Path C (keep Markdown, smarter comparison tooling) is the direction.

### Key insight from Q: "fractalize the problem"
Compare DOM chunks independently instead of full-page screenshots. This eliminates the cascading height penalty that's been corrupting the diff metric for 11 rounds.

### Current implementation: `tools/chunk-compare/`
Building the chunking + matching algorithm in Python with hypothesis property-based tests before porting to JS/Playwright.

**Completed:**
- Project structure created
- `models.py` — SelectorType, Chunk, MatchPair, MatchResult dataclasses
- `text_utils.py` — normalize_whitespace, normalize_heading, text_similarity

**In progress:**
- `chunker.py` — two-tier: UAGB root containers first, H2 heading splits fallback
- `matcher.py` — three-pass: exact heading, fuzzy heading, text similarity

**Not started:**
- Hypothesis strategies and all tests
- Integration tests against real WP HTML fixtures

**Dependencies installed.** First test run: 25/36 passed, 4 failed, 11 errored.

**Failures diagnosed and fixing:**
1. Integration tests: conftest.py path was wrong (`parents[2]` → `parents[3]`). Fixed.
2. `_extract_heading` didn't handle the case where the element IS a heading (h2 as direct child in heading-split). Fixed — now checks el.name first.
3. Empty-text early return in `chunk_html` prevents chunking pages with empty sections (hypothesis found a UAGB container with empty inner content). Need to fix.
4. H2 split unit test expected 3 chunks but the tier-2 algorithm logic for splitting at H2 boundaries needs refinement — the H2 starts a new group but the orphan detection logic is slightly off.

**All 36 tests pass** after fixing:
- conftest path (`parents[2]` → `parents[3]`)
- `_extract_heading` now checks if the element itself IS a heading (not just descendants)
- Moved empty-text check to only guard the WHOLE_PAGE fallback, not block tier-1/tier-2

**Integration test results against real WP HTML:**
- `about.html`: produces 10+ UAGB_ROOT chunks with headings ✓
- `blog-post.html`: no UAGB sections, falls back to heading-split/whole-page ✓
- `homepage.html`: produces 6+ UAGB_ROOT chunks ✓
- `corporate-campuses.html` (fragment): produces 3+ chunks, first has H1 ✓

## JS/Playwright Port: `tests/chunk-comparison.spec.ts`

**Status:** Working, iterating on section detection.

**First run (3 pages × 2 viewports = 6 tests, all passed):**

- `about` desktop: **14 sections matched, 0 unmatched.** Per-section diffs range from 4.6% (Our Investors) to 98.5% (Meet Our Team). This is *immediately* more actionable than the old "27% whole page" number — we now know exactly which 2 sections are broken.
- `about` mobile: 14 matched, similar pattern — team sections are worst.
- `corporate-campuses`: Only 1 matched, 4 unmatched WP — because Hugo's collection template uses `<section>` elements, not UAGB classes. The section finder didn't detect Hugo's sections.
- `home`: Same issue — 1 matched, 9 unmatched WP.

**Root cause of unmatched sections:** The `findSectionsScript` used `:scope >` (direct children only) and only looked for UAGB classes. Hugo's collection/homepage templates use `<section>` elements nested inside `<article>`. Fixed by:
1. Removing `:scope >` constraint (search descendants too)
2. Adding Tier 1b: `<section>` element detection for Hugo's templates

**Also need to update `screenshotSections`** to handle the section locator for `<section>` elements — currently it only queries for UAGB classes.

**Key observation:** The section-finding logic needs to be generic enough to handle BOTH WP's DOM (UAGB containers) and Hugo's DOM (semantic `<section>` elements). The matcher then pairs them by heading text regardless of DOM structure.

## Full 90-page chunk comparison complete (2026-04-08)

**180/180 tests passed in 5.1 minutes.** Results in `tests/chunk-results.json` (6152 lines).

Key observations from the run:
- Audiom embed pages: mostly 1-3% desktop, confirming they're nearly done
- About page: 14 sections matched, per-section diffs range from 4.6% to 98.5%
- Collection pages: 5 sections matched, 5 unmatched WP (feature cards inside wp-block-group not matching Hugo's `<section>` elements)
- Homepage: 8 matched, 2 unmatched WP
- Blog posts: treated as whole-page (no UAGB sections, and H2-based splitting uses whole-page screenshot because we can't screenshot individual H2 groups without wrapper elements)

**Plan approved:** Component-based convergence approach.
1. Build component classifier script to group sections by type
2. Extract shared partials from duplicated template patterns
3. Fix one component at a time, verified by chunk comparison
4. Delete wp-* snowflakes as they're replaced by shared partials
5. CSS scoped per component to prevent regressions

## Component summary complete (2026-04-08)

Committed as `c419e4f`. All tooling staged and clean.

**Component priority queue (sorted by avg diff):**
1. blog-index: 77.7% (4 instances) — post grid totally wrong
2. info-box: 54.6% (12 instances) — width mismatch, biggest total impact
3. accessibility-statement: 50.0% (2 instances) — snowflake template
4. cta: 50.2% (8 instances) — one instance at 6.8% proves it CAN work
5. team: 40.4% (12 instances) — desktop 25.5%, mobile 55.3%
6. hero: 34.4% (8 instances) — desktop 20.2%, mobile 48.5%
7. contact-form: 29.8% (4 instances) — mostly mobile CSS

Already good (<15% avg): embed-page (13.6%, 96 instances), blog-post (12.7%, 10), standard-page (12.0%, 40), error-page (10.2%, 2)

**Systemic pattern:** Desktop is 15-30pp better than mobile across EVERY component. Mobile CSS is the dominant gap.

**Current step:** Begin executing component fixes. Next: extract shared UAGB partials, start with info-box (highest total impact: 12 instances × 54.6% avg).

**No blockers.** Hugo running on :1314, WP live, chunk comparison working.

## Scout agents dispatched (2026-04-08)

Five parallel scout agents investigating the top 5 components. Each reads WP HTML, Hugo templates, CSS, and writes a fix report.

**Completed:**
- `scout-info-box` → `notes/component-fix-info-box.md`
  - Root cause: `max-width: min(100%, 70%)` on `.info-box-section` constrains to 1344px instead of full viewport (1920px)
  - WP uses full-width `.alignfull` root container with inner content wrapper
  - Fix: make section full-width, add `.info-box-section-inner` wrapper div, move flex layout to inner
  - Template change in `collection-render.html` lines 9-38
  - CSS change in `wordpress-compat.css` around line 2287

**Completed:**
- `scout-team` — root cause found: homepage team uses inline styles in template (self-contained, 4.8% diff). About page team relies on WP per-block inline `<style>` tags that Hugo doesn't reproduce. Also has triple-conflicting CSS gap rules (gap:80px vs column-gap:40px at 3 locations). Fix: reconcile gap rules, ensure flex-direction/sizing match WP computed values.

- `scout-hero` — three root causes for mobile being 30pp worse:
  1. Overlay color wrong: Hugo uses rgba(4,32,62,0.75) (blue), WP uses #15191d at 0.8 opacity (near-black)
  2. Mobile padding: Hugo uses fixed 40px, WP uses percentage-based (25% top/bottom, 5% sides)
  3. Homepage inline `padding: 152px 0` can't be overridden by media queries (specificity issue)
  Also: WP uses breakpoints at 976px/767px, Hugo uses 921px/544px — mismatch causes divergence at intermediate widths.

- `scout-blog-index` — the 77.7% diff is primarily a fundamental structural mismatch: WP uses `uagb-post__image-position-background` (featured image as card background + dark overlay + white text), Hugo renders images as a separate div at the bottom of each card. Also: card bg #333 vs WP's #f6f6f6, hero missing dark overlay ::before, heading section padding 32px vs 100px. Fix requires restructuring the card template to use background-image + overlay.

- `scout-cta` — key findings:
  1. "Join the Movement" is NOT a CTA — it's feature-cards. Classifier was wrong. Actual CTA avg is lower.
  2. `solid-dark` style on health-care/universities is an ERROR — WP uses the SAME bg-image+overlay block on all 3 pages. Removing `style: "solid-dark"` from front matter fixes 4 instances.
  3. Overlay color wrong: Hugo uses rgba(4,32,62,0.75), WP uses #15191d at 0.8 opacity (same bug as hero).
  4. Missing `background-attachment: fixed` and wrong `background-position` (center vs 50% 16%).

## All 5 scouts complete — synthesis

**Common patterns across components:**
- **Overlay color is wrong everywhere**: Hugo uses rgba(4,32,62,0.75) (dark blue), WP uses #15191d at 0.8 opacity (near-black). Affects hero, CTA, blog-index. One global fix.
- **Mobile CSS uses wrong breakpoints**: Hugo uses 921px/544px, WP uses 976px/767px. Affects hero, info-box, team.
- **Fixed pixel values vs WP percentage-based**: Hero padding, heading section padding, etc. Hugo hardcodes pixels, WP uses percentages that scale.
- **Missing `background-attachment: fixed`**: Blog hero, CTA — both missing parallax.
- **Width mismatch on info-box**: 70% max-width constrains to 1344px, should be full-width with inner content wrapper.

**Quick wins (front matter fixes, no template changes):**
1. Remove `style: "solid-dark"` from health-care-facilities.md and universities.md — fixes 4 CTA instances
2. Fix overlay color globally — one CSS change affects hero, CTA, blog-index

## Commits applied

**c419e4f** — Add chunk-based visual comparison tooling (all tooling, full 180-comparison baseline)
**bae6a11** — Fix CTA overlay color and remove erroneous solid-dark style
  - health-care CTA desktop: 48.3% → 8.8%
  - universities CTA desktop: 68.1% → 7.5%
  - Overlay color fixed globally (hero, CTA, extra-content)

## Remaining structural fixes needed
1. Info-box: add inner wrapper div, make section full-width (12 instances, 54.6% avg)
2. Blog-index cards: restructure to use background-image + overlay instead of separate image div (4 instances, 77.7%)
3. Team (about page): reconcile conflicting gap rules, ensure flex layout matches WP (12 instances, homepage works, about broken)
4. Hero: switch to percentage-based padding, remove inline style specificity issue on homepage (8 instances, mobile is dominant gap)

## Execution progress

**d42fde2** — Info-box width fix: desktop info-boxes 50-65% → 12-24%

**ae605d1** — Hero padding: removed inline 152px, switched to percentage-based. Modest mobile improvement, mainly structural cleanup.

**In progress:** Team about page CSS gap fix
- Fixed `gap: 80px` shorthand → explicit `row-gap: 80px; column-gap: 80px` so team member overrides work
- Added `row-gap: 0` to team member blocks (WP value)
- Result: individual team member sections (Brandon, Chris, James) desktop ALREADY GOOD (6-9%). "Meet Our Team" heading section still at 98.5% desktop — that's a different problem (likely the heading-only container is completely different between WP and Hugo).
- Mobile team members still 49-56% — needs further investigation.

## Full commit log

| # | Hash | Component | Key improvement |
|---|------|-----------|-----------------|
| 1 | c419e4f | Tooling | Chunk comparison + component classifier |
| 2 | bae6a11 | CTA/overlay | health-care CTA 48→9%, universities 68→7.5% |
| 3 | d42fde2 | Info-box | Desktop info-boxes 50-65% → 12-24% |
| 4 | ae605d1 | Hero | Percentage-based padding, eliminated pixel hacks |
| 5 | 7c9288f | Team | Fixed gap: 80px shorthand → explicit row/column |
| 6 | 4944d2f | Blog-index | Cards restructured to image-as-background. Desktop avg 75→21% |
| 7 | 0aa5e8b | Team heading | "Meet Our Team" about desktop: 98.5% → 1.0% |
| 8 | 50bf900 | Blog cards | Card min-height 380px, flex-end layout, missing classes added |

**Waiting on:** `fix-feature-cards` agent (Join the Movement gradient bg + white cards)

| 9 | 352315c | Feature cards | "Join the Movement" desktop: 74.5% → 20.3% |

**Mobile fix agents dispatched (3 parallel):**
- `fix-infobox-mobile` — info-box padding/width at mobile breakpoints
- `fix-team-mobile` — team member blocks stacking/image sizing at mobile
- `fix-blog-mobile` — blog hero padding, post grid column count, !important removal

All touch different CSS selectors (info-box-section, uagb-block-*, blog-hero) so no conflicts expected.

**Results:**
- `fix-infobox-mobile`: committed as 9fea09b. Modest mobile improvement (1-6pp on some sections).
- `fix-team-mobile`: committed as 77bdaa3. Mobile slightly regressed (49-56% → 56-58%). Fluid widths alone don't close gap.
- `fix-blog-mobile`: The CSS changes were already included in a prior commit (no diff to stage). Blog heading mobile regressed 18.7→53% — the inline padding override at 767px needs further investigation.

**Current commit count: 12** (including the blog-mobile that was a no-op commit failure)

**Status:** All parallel mobile agents completed. Desktop components are in good shape (most under 20%). Mobile remains the systematic gap. Ready for a full 90-page comparison to measure overall improvement.

**No blockers.**

**Next steps after all scouts report:**
1. Read all five reports
2. Apply fixes sequentially (template changes + CSS), one component at a time
3. After each: re-run chunk comparison for affected pages
4. Commit after each component fix

**Execution approach:** Scouts do read-only research in parallel. I apply changes sequentially since some touch shared files (wordpress-compat.css). Each component's CSS is scoped to its own selectors so changes shouldn't conflict.
