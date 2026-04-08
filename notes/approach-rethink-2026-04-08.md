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

**Current step:** Building `scripts/build-component-summary.js` to classify the chunk results into component types.

**No blockers.**
