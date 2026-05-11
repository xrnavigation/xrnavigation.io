# Exact Parity Workstream

Date: 2026-04-06
Source of truth: `tests/comparison-results.json` from the latest full run

## Goal

Replace the current "very similar Hugo site" posture with an execution plan that reaches exact parity with the live WordPress site in both desktop and mobile screenshots.

Allowed exception:
- Explicit WordPress-owned branding or host chrome that is not part of XR Navigation's intended site design.

Not allowed as residuals:
- Font wrapping differences
- Image crop differences
- Layout approximations
- Mobile-only drift
- Footer/header "close enough"
- Generic Markdown rendering where WordPress used specialized block structure

## Current Snapshot

Latest verified run:
- `hugo --gc --minify`: passes
- `hugo server --port 1314 --bind 127.0.0.1 --disableFastRender --noHTTPCache`: serves locally
- `npm test`: passes against the live local Hugo server

Latest full-suite comparison:
- `180` comparisons
- `2` exact / near-exact (`<1%`)
- `86` minor (`0.5%-10%`)
- `93` major (`>10%`)
- Overall average diff: `16.83%`
- Overall median diff: `10.77%`
- Desktop average diff: `13.23%`
- Desktop median diff: `4.52%`
- Mobile average diff: `20.43%`
- Mobile median diff: `18.33%`

Family summary from `node scripts/build-parity-summary.js`:

| Family | Pages | Avg Diff | Avg Overlap | Avg Abs Height Delta | Desktop Avg | Mobile Avg | Owner Path |
|---|---:|---:|---:|---:|---:|---:|---|
| `blog-index` | 1 | 49.17% | 43.94% | `384px` | 55.34% | 43.01% | `themes/xrnav/layouts/blog/list.html` |
| `collection` | 3 | 40.18% | 37.55% | `271.50px` | 28.49% | 51.86% | `themes/xrnav/layouts/_default/collection.html` |
| `blog-single` | 11 | 32.33% | 23.44% | `950.50px` | 32.24% | 32.41% | `themes/xrnav/layouts/blog/single.html` |
| `homepage` | 1 | 19.65% | 18.98% | `88.50px` | 10.77% | 28.52% | `themes/xrnav/layouts/index.html` |
| `standard-single` | 25 | 15.51% | 12.07% | `253.44px` | 10.53% | 20.48% | `themes/xrnav/layouts/_default/single.html` |
| `audiom-embed` | 49 | 11.88% | 10.05% | `97.77px` | 8.61% | 15.16% | `themes/xrnav/layouts/audiom-embed/single.html` |

Conclusion:
- The highest leverage is not more global CSS tuning.
- The current structural queue is led by `collection`, `blog-index`, `blog-single`, and a handful of hybrid `audiom-embed` pages.
- `standard-single` is no longer the dominant family by average diff; its remaining backlog is now mixed between a few true structural misses and several height-driven mobile outliers.
- Mobile remains weaker across every family, but the new overlap metric shows some pages are mostly height drift rather than broken DOM.

## Operating Rules

1. The workstream stays under parity control until every phase below is complete or explicitly deferred.
2. After every passing targeted run and every passing full-suite run, reread this file and continue with the next unchecked phase.
3. Fix markup and assets before CSS when the mismatch is structural.
4. Create exact page-family variants instead of forcing more pages through generic layouts.
5. Do not record explanations like "font rendering" or "crop differences" as accepted end states.
6. Split each backlog review into two queues:
   - structural: prioritize by `overlapDiffPercent`
   - height-driven: prioritize by `heightDelta`
7. A full-suite run is invalid unless Hugo is actively serving on `127.0.0.1:1314` for the entire `npm test` run.

## Phase Plan

- [ ] Phase 0: Maintain the parity ledger and family map
- [ ] Phase 1: Break `standard-single` into exact WordPress page variants
- [ ] Phase 2: Rebuild `blog-single` to match exact WP post DOM and spacing
- [ ] Phase 3: Replace approximate `collection` layout with exact page-specific variants
- [ ] Phase 4: Resolve high-drift `audiom-embed` outliers and hybrid pages
- [ ] Phase 5: Finish `homepage`, `blog-index`, and global chrome convergence
- [ ] Phase 6: Full-suite cleanup until the backlog is empty

## Phase 0: Parity Ledger

Deliverables:
- Keep `tests/comparison-results.json` fresh after each substantial phase.
- Use `scripts/build-parity-summary.js` to regenerate the family summary, structural queue, and height queue.
- Track each outlier by family, owner file, blocker type, and status in this document.

Commands:
```bash
hugo --gc --minify
hugo server --port 1314 --bind 127.0.0.1 --disableFastRender --noHTTPCache
npm test
node scripts/build-parity-summary.js
```

Exit criteria:
- This document stays aligned with the latest comparison file.

## Phase 1: Standard Single Variants

Problem:
- `themes/xrnav/layouts/_default/single.html` is too generic.
- Many high-diff pages are specialized WordPress pages currently rendered as plain Markdown inside a single wrapper.

Expected output:
- Additional exact layout variants under `themes/xrnav/layouts/` or `_default/`.
- Shared exact partials only where the WordPress DOM is actually shared.

Subfamilies to split out:

### 1A. PDF / Download Pages

Pages:
- `content/wisconsin-geological-survey-press-release.md`
- `content/case-study-vrate-expo-2024.md`
- `content/capability-statement.md`
- `content/this-is-a-covid-statistic-map-showing-total-cases-over-washington-oregan-and-idaho.md`
- `content/this-is-a-covid-statistic-map-showing-total-cases-over-washington-oregan-and-idaho-old.md`

Current symptom:
- Very short or structurally wrong bodies relative to WordPress.
- WordPress likely used PDF/embed/download block structure rather than a plain heading plus adjacent links.

Files to inspect or change:
- `themes/xrnav/layouts/_default/single.html`
- likely new template such as `themes/xrnav/layouts/pdf-download/single.html`
- corresponding content frontmatter in `content/*.md`

Exit criteria:
- Exact PDF/download presentation and page height match on both viewports.

### 1B. Form Pages

Pages:
- `content/contact.md`
- `content/audiom-demo-form.md`

Current symptom:
- Mobile and desktop both very high diff.
- Current forms are valid HTML but not exact WP DOM, spacing, or field block structure.

Files to inspect or change:
- `content/contact.md`
- `content/audiom-demo-form.md`
- form styling in `themes/xrnav/static/css/wordpress-compat.css`
- likely dedicated form-page layout

Exit criteria:
- Form field wrappers, labels, spacing, button sizing, and page height match WordPress exactly.

### 1C. Bio / Profile Pages

Pages:
- `content/brandon-keith-biggs.md`

Current symptom:
- Both viewports are major misses.
- Profile pages likely need exact WP image/text block composition rather than default post body flow.

Files to inspect or change:
- `content/brandon-keith-biggs.md`
- likely dedicated profile-page layout

Exit criteria:
- Image placement, text width, spacing, and mobile stacking match exactly.

### 1D. Table / Missing-Content Pages

Pages:
- `content/wcag-map-comparison-table.md`

Current symptom:
- The page body is effectively missing in Hugo.
- This is not a tuning problem. Content structure is absent.

Files to inspect or change:
- `content/wcag-map-comparison-table.md`
- source references in `data/wp-html/`

Exit criteria:
- The table/content exists and matches WP structure exactly on both viewports.

### 1E. Error / Utility Pages

Pages:
- `content/404-2.md`

Current symptom:
- Major diff suggests incorrect shell or content structure.

Exit criteria:
- 404 page body and shell match baseline exactly.

## Phase 2: Blog Single Rebuild

Problem:
- `themes/xrnav/layouts/blog/single.html` is still too simplified.
- Current notes already show desktop blog posts are among the worst remaining pages.
- WordPress blog posts use standard WP block markup and spacing, not the current compressed Hugo interpretation.

Highest-priority pages:
- `content/blog/list-of-non-visual-drawing-tools.md`
- `content/blog/how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance.md`
- `content/blog/how-to-convert-from-a-pdf-map-to-a-vector-data-map.md`
- `content/blog/five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat.md`
- `content/blog/five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies.md`

Files to inspect or change:
- `themes/xrnav/layouts/blog/single.html`
- `data/wp-html/blog-post.html`
- `data/wp-html/blog-post.md`

Required outcome:
- Exact WP post wrapper hierarchy
- Exact body width and vertical rhythm
- Exact figure/embed treatment
- Exact heading/list spacing and anchor behavior

Exit criteria:
- Blog-single family average drops out of the current top-tier failure group, with no desktop-specific drift left in the worst posts.

## Phase 3: Collection Page Exactness

Problem:
- `themes/xrnav/layouts/_default/collection.html` still encodes approximation.
- The repo already documented acceptable residuals here; those must now be treated as unfinished work.

Pages:
- `content/corporate-campuses.md`
- `content/health-care-facilities.md`
- `content/universities.md`

Files to inspect or change:
- `themes/xrnav/layouts/_default/collection.html`
- possibly split into page-specific collection layouts
- exact cropped images in `static/images/`

Known blocker classes:
- Wrong crop focal points
- Shared layout where WP used page-specific composition
- Mobile hero / CTA / feature-card divergence

Exit criteria:
- Collection family matches on both viewports.
- No `object-fit` approximation remains where WordPress used a cropped asset.

## Phase 4: Audiom Embed Outliers

Problem:
- The embed family is the best overall, but several pages are still major misses because they are not pure embed pages.

Priority outliers:
- `content/about.md`
- `content/table-vs-map-example.md`
- `content/magicmap-paloalto.md`

Reason:
- These are hybrid pages with richer body structure than the current `audiom-embed` layout assumes.

Files to inspect or change:
- `themes/xrnav/layouts/audiom-embed/single.html`
- possibly add specialized embed-rich variants

Exit criteria:
- Hybrid embed pages stop polluting the otherwise-strong embed family.

## Phase 5: Homepage, Blog Index, Global Chrome

Pages / surfaces:
- `content/_index.md`
- `content/blog/_index.md`
- `themes/xrnav/layouts/index.html`
- `themes/xrnav/layouts/blog/list.html`
- `themes/xrnav/layouts/partials/header.html`
- `themes/xrnav/layouts/partials/footer.html`
- `themes/xrnav/static/css/wordpress-compat.css`
- `themes/xrnav/static/css/main.css`

Reason this phase is later:
- These surfaces still matter, but they are not the current largest blockers.
- They should be polished after page-family structure is correct, not before.

Exit criteria:
- Homepage mobile drift is gone.
- Blog index card/grid behavior matches WP exactly.
- Footer/header no longer dominate short-page diffs.

## Current Backlog: Structural Queue

Sorted by current `overlapDiffPercent` from the 2026-04-06 full run.

| Priority | Page | Family | Current Worst Diff | Current Worst Overlap | Owner File | Primary Blocker |
|---|---|---|---:|---:|---|---|
| 1 | `corporate-campuses` | `collection` | 61.14% mobile | 55.40% mobile | `content/corporate-campuses.md` | collection layout still structurally wrong, especially mobile composition |
| 2 | `blog` | `blog-index` | 55.34% desktop | 48.44% desktop | `content/blog/_index.md` | post grid and hero still diverge from WP structure |
| 3 | `health-care-facilities` | `collection` | 50.51% mobile | 47.03% mobile | `content/health-care-facilities.md` | collection/mobile structure still off, not just spacing |
| 4 | `magicmap-paloalto` | `audiom-embed` | 52.81% mobile | 46.48% mobile | `content/magicmap-paloalto.md` | hybrid embed page needs its own richer layout treatment |
| 5 | `universities` | `collection` | 43.94% mobile | 39.76% mobile | `content/universities.md` | collection/mobile structure still off, despite desktop improvement |
| 6 | `how-to-convert-from-a-pdf-map-to-a-vector-data-map` | `blog-single` | 45.44% mobile | 38.50% mobile | `content/blog/how-to-convert-from-a-pdf-map-to-a-vector-data-map.md` | blog single DOM still diverges on embed/figure handling |
| 7 | `five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies` | `blog-single` | 43.66% desktop | 36.42% desktop | `content/blog/five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies.md` | blog single spacing and structure still off |
| 8 | `map-evaluation-tool` | `standard-single` | 46.81% mobile | 33.11% mobile | `content/map-evaluation-tool.md` | mobile standard page still structurally wrong, not only taller |
| 9 | `table-vs-map-example` | `audiom-embed` | 48.32% desktop | 30.82% desktop | `content/table-vs-map-example.md` | hybrid embed page needs specialized template or block structure |
| 10 | `covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho` | `standard-single` | 40.65% mobile | 27.84% mobile | `content/covid-statistic-text-map-showing-total-cases-over-washington-oregon-and-idaho.md` | standard page mobile structure still off |
| 11 | `peachability-walk-june-22-2025` | `audiom-embed` | 34.00% mobile | 27.69% mobile | `content/peachability-walk-june-22-2025.md` | hybrid embed/page composition mismatch |
| 12 | `the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business` | `blog-single` | 32.45% mobile | 27.55% mobile | `content/blog/the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business.md` | blog single mobile structure still off |
| 13 | `how-to-convert-from-pdf-to-geojson-using-qgis` | `blog-single` | 31.74% mobile | 27.54% mobile | `content/blog/how-to-convert-from-pdf-to-geojson-using-qgis.md` | blog single mobile structure still off |
| 14 | `implementation` | `standard-single` | 38.69% desktop | 26.57% desktop | `content/implementation.md` | generic single layout still too approximate here |
| 15 | `gallery` | `standard-single` | 39.46% desktop | 25.21% desktop | `content/gallery.md` | generic single/grid treatment still diverges |

## Current Backlog: Height-Driven Queue

These pages still matter, but their dominant problem is page height drift rather than the worst overlap mismatch.

| Priority | Page | Family | Current Worst Diff | Height Delta | Owner File | Primary Blocker |
|---|---|---|---:|---:|---|---|
| 1 | `digital-map-tool-accessibility-comparison` | `blog-single` | 64.46% desktop | `+6209px` | `content/blog/digital-map-tool-accessibility-comparison.md` | content height is catastrophically wrong; likely missing or duplicated body structure |
| 2 | `privacy-policy` | `standard-single` | 35.19% mobile | `+3617px` | `content/privacy-policy.md` | mobile text flow / page-height drift dominates |
| 3 | `fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific` | `standard-single` | 22.60% mobile | `+2887px` | `content/fictional-map-description-of-first-floor-of-the-aquarium-of-the-pacific.md` | mobile text wrap/height drift dominates despite near-perfect desktop |
| 4 | `events` | `audiom-embed` | 34.88% desktop | `+1698px` | `content/events.md` | page height drift dominates desktop diff |
| 5 | `how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples` | `blog-single` | 27.61% mobile | `-1456px` | `content/blog/how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples.md` | missing vertical space / missing body height |
| 6 | `sonification-awards-2024-application` | `audiom-embed` | 24.63% desktop | `+1427px` | `content/sonification-awards-2024-application.md` | embed-rich page height drift dominates |
| 7 | `how-to-make-detailed-map-text-descriptions` | `blog-single` | 29.85% mobile | `-658px` | `content/blog/how-to-make-detailed-map-text-descriptions.md` | mobile body height shortfall dominates |
| 8 | `how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance` | `blog-single` | 29.86% mobile | `-637px` | `content/blog/how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance.md` | mobile body height shortfall dominates |

## Immediate Execution Order

1. Finish `collection` exactness first. It is now the worst multi-page structural family, especially on mobile.
2. Rebuild `blog-index` next. It is a single page but currently the highest-average family and still structurally wrong.
3. Continue `blog-single` with the structurally worst posts first, then the height-dominated posts.
4. Fix hybrid `audiom-embed` outliers (`magicmap-paloalto`, `table-vs-map-example`, `peachability-walk-june-22-2025`) with specialized layouts instead of more generic embed tuning.
5. Tackle the remaining structural `standard-single` pages (`map-evaluation-tool`, covid-stat mobile, `implementation`, `gallery`) before broad CSS cleanup.
6. Do height-driven cleanup only after the structural queue above is reduced.
7. Finish homepage, then shared header/footer polish, after family templates are correct.

## Definition Of Done

This workstream is done only when:
- Every phase above is checked off or explicitly deferred by the user.
- Every page in `tests/comparison-results.json` is at exact parity for both desktop and mobile, except any explicit WordPress-owned chrome you decide to exclude.
- No note in this repo still relies on "acceptable approximation" logic for unresolved pages.

## 2026-04-08: Meet Our Team heading block fix

**Block:** `uagb-block-7fd0a09e` (about page, "Meet Our Team" heading container)

**Observed from WP source CSS (line 698 of about.html):**
- `background-color: var(--ast-global-color-0)` — MISSING in Hugo CSS
- `padding-left: 10px; padding-right: 10px` — MISSING
- Inner wrap: `flex-direction: column; align-items: center; justify-content: center` — MISSING
- Heading text color: `color: var(--ast-global-color-4)` on `.uagb-block-93678eb1` — MISSING (no color rule in Hugo CSS at all)
- Heading font-weight: 800 from WP — not set in Hugo CSS

**Already correct in Hugo CSS:**
- padding-top: 100px, padding-bottom: 50px (line 5252-5254)
- text-align: center on heading (line 5301)
- Inner wrap width: min(100%, 1200px) (line 5175)

**Fix:** Add background, padding-left/right, heading color, and inner wrap flex properties.

## 2026-04-08: Blog post grid card spacing fix

**Observed from WP source (uagb-block-f9f75d24):**
- Grid: `grid-template-columns: repeat(3, minmax(0, 1fr))`, gap `30px` (row and column)
- Cards: padding 30px 40px 10px, border-radius 10px, box-shadow `10px 10px 20px -8px #00000070`
- No explicit min-height in WP block CSS — cards size to content
- Missing flex layout: cards need `display: flex; flex-direction: column; justify-content: flex-end` for background-image mode
- Hugo grid container missing classes: `uagb-post__image-enabled`, `uagb-post__items`, `custom-border-radius`
- Current Hugo CSS has `gap: 30px` which matches WP. Q said 20px but WP source says 30px.
- WP uses `minmax(0, 1fr)` not plain `1fr`

## 2026-04-08: corporate-campuses feature-cards dark-bg fix

**State:** In progress. Two changes made, one cleanup remaining.

**Done so far:**
1. Added `features_dark: true` to `content/corporate-campuses.md` front matter (was missing, so `.dark-bg` class never applied)
2. Changed `.feature-cards.dark-bg` background from flat `var(--ast-global-color-1)` to `linear-gradient(135deg, rgb(4,32,62) 0%, rgb(10,77,127) 100%)`
3. Added `.dark-bg .feature-cards-intro { color: #fff }` (scoped — was previously unscoped)
4. Changed `.dark-bg .feature-card h3` from `color-4` (near-white) to `color-1` (dark) since cards now have light bg
5. Changed `.dark-bg .feature-card p` from `rgba(255,255,255,0.7)` to `#4b5563` (dark gray)
6. Added `.dark-bg.has-intro .feature-card` override after `.has-intro .feature-card` for specificity

**Current blocker:** Base `.dark-bg .feature-card` rule (line ~2444) applies to ALL dark-bg feature cards including health-care-facilities (which has dark-bg but NO has-intro, NO white card backgrounds). Need to either:
- Remove the base rule and keep only `.dark-bg.has-intro` combined selector, OR
- Restore the old health-care text colors for `.dark-bg:not(.has-intro)`

**Files modified:** `content/corporate-campuses.md`, `themes/xrnav/static/css/wordpress-compat.css`
