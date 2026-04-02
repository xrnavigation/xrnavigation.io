# Exact Parity Workstream

Date: 2026-04-01
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
- `npm test`: passes

Latest full-suite comparison:
- `180` comparisons
- `3` exact matches (`<0.5%`)
- `42` minor (`0.5%-10%`)
- `135` major (`>10%`)
- Desktop average diff: `22.69%`
- Mobile average diff: `29.80%`

Family summary from `node scripts/build-parity-summary.js`:

| Family | Pages | Avg Diff | Desktop Avg | Mobile Avg | Owner Path |
|---|---:|---:|---:|---:|---|
| `collection` | 3 | 40.98% | 28.70% | 53.26% | `themes/xrnav/layouts/_default/collection.html` |
| `standard-single` | 24 | 40.68% | 34.22% | 47.14% | `themes/xrnav/layouts/_default/single.html` |
| `blog-single` | 11 | 40.54% | 49.03% | 32.04% | `themes/xrnav/layouts/blog/single.html` |
| `blog-index` | 1 | 39.05% | 33.96% | 44.14% | `themes/xrnav/layouts/blog/list.html` |
| `homepage` | 1 | 18.06% | 10.13% | 25.98% | `themes/xrnav/layouts/index.html` |
| `audiom-embed` | 50 | 15.20% | 11.02% | 19.37% | `themes/xrnav/layouts/audiom-embed/single.html` |

Conclusion:
- The highest leverage is not more global CSS tuning.
- The biggest remaining misses are page-family problems in `standard-single`, `blog-single`, and `collection`.
- Mobile remains weaker across almost every family.

## Operating Rules

1. The workstream stays under parity control until every phase below is complete or explicitly deferred.
2. After every passing targeted run and every passing full-suite run, reread this file and continue with the next unchecked phase.
3. Fix markup and assets before CSS when the mismatch is structural.
4. Create exact page-family variants instead of forcing more pages through generic layouts.
5. Do not record explanations like "font rendering" or "crop differences" as accepted end states.

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
- Use `scripts/build-parity-summary.js` to regenerate the family summary.
- Track each outlier by family, owner file, blocker type, and status in this document.

Commands:
```bash
hugo --gc --minify
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

## Current Backlog: First 15 Targets

| Priority | Page | Family | Current Worst Diff | Owner File | Primary Blocker |
|---|---|---|---:|---|---|
| 1 | `wisconsin-geological-survey-press-release` | `standard-single` | 76.78% mobile | `content/wisconsin-geological-survey-press-release.md` | wrong PDF/download page structure |
| 2 | `case-study-vrate-expo-2024` | `standard-single` | 76.12% mobile | `content/case-study-vrate-expo-2024.md` | wrong PDF/download page structure |
| 3 | `contact` | `standard-single` | 72.68% mobile | `content/contact.md` | exact form/page structure missing |
| 4 | `list-of-non-visual-drawing-tools` | `blog-single` | 71.04% desktop | `content/blog/list-of-non-visual-drawing-tools.md` | blog single DOM too generic |
| 5 | `audiom-demo-form` | `standard-single` | 70.64% mobile | `content/audiom-demo-form.md` | exact form/page structure missing |
| 6 | `brandon-keith-biggs` | `standard-single` | 70.45% mobile | `content/brandon-keith-biggs.md` | profile layout not ported |
| 7 | `how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance` | `blog-single` | 66.05% desktop | `content/blog/how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance.md` | blog single DOM too generic |
| 8 | `how-to-convert-from-a-pdf-map-to-a-vector-data-map` | `blog-single` | 65.51% desktop | `content/blog/how-to-convert-from-a-pdf-map-to-a-vector-data-map.md` | blog single DOM too generic |
| 9 | `wcag-map-comparison-table` | `standard-single` | 65.36% mobile | `content/wcag-map-comparison-table.md` | body content missing |
| 10 | `five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat` | `blog-single` | 65.15% desktop | `content/blog/five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat.md` | blog single DOM too generic |
| 11 | `404-2` | `standard-single` | 63.88% desktop | `content/404-2.md` | wrong shell/content structure |
| 12 | `about` | `audiom-embed` | 63.34% desktop | `content/about.md` | hybrid embed page needs specialized layout |
| 13 | `five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies` | `blog-single` | 62.44% desktop | `content/blog/five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies.md` | blog single DOM too generic |
| 14 | `corporate-campuses` | `collection` | 62.31% mobile | `content/corporate-campuses.md` | approximate collection template and crops |
| 15 | `capability-statement` | `standard-single` | 58.86% desktop | `content/capability-statement.md` | wrong PDF/download page structure |

## Immediate Execution Order

1. Audit and split the `standard-single` family before touching more global CSS.
2. Rebuild `blog-single` against exact WP post DOM.
3. Replace `collection` approximation with exact page-specific structures and exact image crops.
4. Fix `about` and other hybrid embed outliers with specialized layouts.
5. Finish homepage, blog index, header, and footer only after family templates are correct.

## Definition Of Done

This workstream is done only when:
- Every phase above is checked off or explicitly deferred by the user.
- Every page in `tests/comparison-results.json` is at exact parity for both desktop and mobile, except any explicit WordPress-owned chrome you decide to exclude.
- No note in this repo still relies on "acceptable approximation" logic for unresolved pages.
