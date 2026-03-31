# Migration Perfect Embed Template Notes
## 2026-03-30

**GOAL:** Get audiom embed pages under 5% diff by fixing the shared template and CSS.

**OBSERVATIONS:**
- 51 pages use `type: "audiom-embed"`
- Template at `themes/xrnav/layouts/audiom-embed/single.html` - wraps content in UAGB container divs
- Content pages have: title, optional description paragraphs, iframe(s) to audiom.net/embed/{id}
- Some pages (nasa-jpl-campus-map) also embed YouTube iframes
- baseof.html wraps in: `#page > header + #content > .ast-container > #primary > main#main`
- CSS files: main.css, wordpress-compat.css, dark-mode.css
- Baselines exist for audiom-demo, nasa-jpl-campus-map, audiom-covid-map (desktop + mobile)
- Prior rounds: R7 had ~66 standard pages >= 50%, embed-heavy audiom demos dominate worst pages

**CURRENT SCORES (desktop):**
- audiom-demo: 9.35% (1920x1809 vs baseline 1920x1797 — 12px taller)
- lske-map-1: 9.28% (1920x1807 vs 1920x1806 — 1px taller)
- csun: 10.40% (1920x1807 vs 1920x1806)
- audiom-covid-map: 23.90% (2336px vs 2195px — 141px taller)
- nasa-jpl-campus-map: 31.90% (2284px vs 2133px — 151px taller)
- events: 19.31% (6854px vs 5449px — 1405px taller, complex page)
- audiom-demo-form: 49.58% (1080px vs 1191px — 111px shorter)

**VISUAL DIFF ANALYSIS (audiom-demo):**
From comparing WP baseline vs Hugo screenshot:
1. Hugo shows "Audiom Demo" h1 title that WP does NOT show — WP goes straight to content text
2. Header differs — WP white bg with dark text, Hugo dark header (this is shared, not embed-specific)
3. Footer layout slightly different (logo area, copyright placement)
4. Height diff (12px) is minimal, likely from the extra h1

**KEY INSIGHT:** The audiom-embed template renders an h1 from .Title inside a uagb-heading div. But the WP version does NOT show this heading — the page title exists only as the HTML <title>, not as visible content. The page content starts with the instruction paragraph.

**SIMPLER PAGES (audiom-demo, lske, csun):** Already 9-10%. Removing the spurious h1 should get them under 5%.
**COMPLEX PAGES (nasa-jpl, covid-map):** Have more content (multiple paragraphs, YouTube embeds) causing larger height diffs. May need content/spacing fixes too.

**WP HTML ANALYSIS (audiom-demo):**
- WP has NO separate page title h1 — the h1 IS the content text ("Activate Enable sounds...")
- WP structure: `.entry-content > .uagb-container > .uagb-container-inner-blocks-wrap > .uagb-advanced-heading > h1.uagb-heading-text`
- The h1 content matches what's in the markdown `# Activate...`
- Hugo template adds EXTRA "Audiom Demo" h1 from .Title — WP doesn't show this

**FAILED EXPERIMENT:** Removed .Title h1 from template. Result: 9.35% -> 19.00% (WORSE).
- Page got shorter (1733px vs baseline 1797px, was 1809px) — 64px too short now
- The content h1 doesn't have `uagb-heading-text` class, gets different styling
- Vertical offset of all content below shifted, creating pixel diffs everywhere
- Reverted template to original state.

**BLOCKER:** Need to understand exactly where the 9.35% diff comes from before making changes.
The diff image shows:
- Header differences (dark vs white bg — shared header issue, not embed-specific)
- Slight text positioning shifts in content area
- Footer layout differences (logo/links placement)
- Height: Hugo 1809px vs WP 1797px (12px taller)

**REAL APPROACH NEEDED:**
Instead of removing the h1, need to use Chrome MCP tools to compare computed styles
between live WP and Hugo pages to find exact CSS differences.
The 9.35% is split across: header diffs, footer diffs, and minor content spacing.
Header/footer diffs are shared across ALL pages, not embed-specific.

**WP BLOCK CSS (from inline styles in audiom-demo.html):**
- Container: `padding-top: 10em; padding-bottom: 10em` (=160px) desktop, `10px/10px` mobile
- Inner: `--inner-content-custom-width: min(100%, 1200px)` desktop, `1024px` tablet, `767px` mobile
- Inner: `row-gap: 20px; column-gap: 20px` between children, `flex-direction: column; align-items: center`
- Heading: `text-align: center; padding-bottom: 50px`
- Hugo CSS has `padding: 160px 0` on container — matches desktop. Missing responsive breakpoints.
- Hugo CSS has `max-width: min(100%, 1200px)` on inner — matches desktop. Missing responsive.
- Hugo CSS MISSING: `row-gap: 20px`, `text-align: center` on heading, `padding-bottom: 50px` on heading

**TEMPLATE CHANGE (iteration 2):**
- Removed .Title h1 AND .page-content wrapper div
- Template now: `.entry-content > .uagb-container > .uagb-container-inner-blocks-wrap > {{ .Content }}`
- This means the content h1 from markdown goes directly into the inner-blocks-wrap
- Need CSS to style `.audiom-embed-page h1` (no .uagb-heading-text class) as center-aligned with padding

**ITERATION 2 RESULTS:**
- audiom-demo: 9.35% -> 4.77% (UNDER 5%, heights match exactly 1797px)
- lske-map-1: 9.28% -> 10.68% (WORSE, 1794 vs baseline 1806, 12px shorter)
- csun: 10.40% -> 11.55% (WORSE)
- covid-map: 23.90% -> 23.21% (slightly better but still bad)
- nasa-jpl: 31.90% -> 29.55% (slightly better)

**CRITICAL DISCOVERY: TWO DIFFERENT WP STRUCTURES**
WP audiom-embed pages have TWO layouts:
1. **With UAGB container** (audiom-demo): `.entry-content > .uagb-container.alignfull > .inner-blocks-wrap > [content]`
   - Container: padding 160px 0, inner: max-width 1200px, row-gap 20px
   - h1 at y=160, iframe constrained to 1200px width
2. **Without UAGB container** (lske-map-1, csun, covid-map, nasa-jpl): `.entry-content > [spacer, h1, spacer, p, spacer, iframe, spacer]`
   - No container padding, h1 at y=115
   - iframe at full/wider width (~1326px)
   - wp-block-spacer divs between elements

Hugo template wraps ALL pages in the UAGB container, which is WRONG for most pages.
audiom-demo is the outlier that actually uses the container in WP.

**CURRENT STATE:**
- Template: removed .Title h1, removed .page-content wrapper, content goes directly into inner-blocks-wrap
- CSS: added flex/center/gap to inner-blocks-wrap, center-aligned h1 with padding-bottom 50px

**CONTAINER SURVEY (14 pages):**
- WITH UAGB container (2): audiom-demo, audiom-neighborhood-demo
- WITHOUT container (12): lske-map-1/2, csun, audiom-covid-map, nasa-jpl, events, nfb24, human-skeleton, bovine-manus, gatech, atia

**ITERATION 3: REMOVED UAGB CONTAINER FROM TEMPLATE**
Template now: `.entry-content > {{ .Content }}` (flat structure)
CSS targets direct children: h1, p, iframe

**WP vs HUGO element positions (lske-map-1):**
| Element | WP y | Hugo y | Match? |
|---------|------|--------|--------|
| h1 | 115 | 115 | YES |
| p | 271 | 271 | YES |
| iframe | 473.375 | 447.78 | 25px off |

Root cause of iframe offset: WP p has margin-bottom: 25.6px between paragraph and spacer.
Hugo had margin-bottom: 0 on p. Fixed to 25.6px.

**ITERATION 3 SCORES:**
- lske-map-1: 10.55% (was 9.28% original, 10.68% iter2)
- csun: 10.85% (was 10.40%)
- audiom-demo: 13.81% (was 4.77% iter2 — REGRESSED because this page uses UAGB container in WP)
- audiom-covid-map: 27.03% (was 23.21%)

**PROBLEM:** audiom-demo regressed because it's one of 2 pages that actually uses the UAGB container.
The majority-optimized template hurts the 2 container pages.

**ITERATION 3 FINAL SCORES (with p margin-bottom fix + conditional template):**
- audiom-demo: 5.33% (container variant, heights match 1797px)
- lske-map-1: 3.24% (UNDER 5%)
- csun: 3.34% (UNDER 5%)
- audiom-covid-map: 28.50% (2416 vs 2195, 221px taller)
- nasa-jpl: 35.23% (2365 vs 2133, 232px taller)
- human-skeleton: 51.42% (1799 vs 1506, 293px taller)
- events: 14.81% (9006 vs 5449, way taller)

**SPACING PROBLEM:** Fixed 100px margins work for lske pages (which have spacers) but BREAK other pages.
WP pages have INCONSISTENT spacing — some have 100px spacers, some have NO spacers.

**WP spacing patterns (from Playwright inspection):**
- lske-map-1: 115px top spacer, 100px between all elements, 100px bottom
- audiom-covid-map: 115px top spacer, NO spacer between h1/p, NO spacer between p/iframe, 61px before YouTube
- human-skeleton: 115px top spacer, NO spacer between h1/p, NO spacer between p/iframe, NO bottom spacer
- Pattern: 115px top spacer is consistent. Between-element spacers vary per page.

**ITERATION 4:** Removed large margins (100px -> 0) on p and iframe. Only keep 115px top margin on h1.
This should help skeleton (293px too tall -> closer) and covid (221px too tall -> closer).
Will hurt lske-map-1 (was 3.24% with 100px spacers matching).

**TEMPLATE:** Conditional on `uagb_container` frontmatter param. audiom-demo.md has flag set.
- With flag: wraps in `.uagb-container.alignfull > .uagb-container-inner-blocks-wrap`
- Without: flat `.entry-content > {{ .Content }}`

**SPACER SURVEY (22 pages):**
- 1 spacer (115px top only): 11 pages (skeleton, bovine, rat, sheep, airplane, eclipse, election, jernigan, gatech, atia, nfb24)
- 4 spacers (top+between+bottom): 6 pages (lske-1/2/3/4, csun, tvm-1)
- 2 spacers: 2 pages (covid-map, nasa-jpl)
- 0 spacers (container): 2 pages (audiom-demo, neighborhood-demo)
- 0 spacers (none): 1 page (events)

**ITERATION 4: Three layout variants via frontmatter**
1. `uagb_container: true` — UAGB container with 160px padding, 1200px inner (audiom-demo)
2. `spacers: "full"` — 100px margins between all elements, 1326px iframe (lske, csun, tvm)
3. Default — 115px top margin on h1, no inter-element margins, full-width iframe (majority)

**ITERATION 4 SCORES:**
- lske-map-1: 3.24% (spaced variant, UNDER 5%)
- csun: 3.34% (spaced variant, UNDER 5%)
- audiom-demo: 5.33% (container variant)
- skeleton: 17.31% (default — iframe was constrained to 1326px but WP has full 1920px)
- covid-map: 27.46% (default — page too short, 2016 vs 2195)
- nasa-jpl: 33.94% (default — page too short, 1965 vs 2133)

**ITERATION 5 FIX:** Removed max-width: 1326px from default iframe (only apply to spaced variant).
1-spacer pages like skeleton have full-width iframes in WP.

**ITERATION 5 RESULTS (BROAD TEST):**
Under 5%: 31+ pages (all 1-spacer and 4-spacer pages working)
5-10%: audiom-demo (5.33%)
Still bad: 11 pages with special content (YouTube embeds, forms, tables, multiple iframes)

**OUTLIER ANALYSIS:**
- gatech (22.66%): Dynamic iframe content diff, not CSS
- covid-map (27.46%), nasa-jpl (33.94%): YouTube embeds render as raw iframes (no aspect ratio), wrong width
- magicmap (41.52%), rose-quarter (33.23%), peachability (29.56%): Multi-iframe pages with spacing issues
- wisconsin (53.76%): Page too short (1080 vs 1583), likely missing content
- audiom-demo-form (49.58%): Form content, different layout entirely
- table-vs-map (44.26%): Table content
- sonification (14.57%): Very long page with many sections
- events (14.81%): No spacers, unique layout

**NEXT:** Commit current changes, then investigate remaining outliers
