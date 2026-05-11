# Prompt for next agent: Mobile CSS convergence

You are continuing work on the WordPress-to-Hugo migration for xrnavigation.io. Desktop visual parity is largely solved (most components under 17% diff). Mobile is the remaining gap — every component is 30-50% diff on mobile vs 10-17% on desktop.

## Context

Read these files first:
- `notes/approach-rethink-2026-04-08.md` — full history of what was done, what worked, what didn't
- `tests/component-summary.json` — per-component diff data from the latest full run
- `tests/chunk-results.json` — per-section diff data for all 90 pages × 2 viewports

## The tooling that exists

1. **Chunk comparison** (`tests/chunk-comparison.spec.ts`): Visits both live WP (https://xrnavigation.io) and local Hugo (http://127.0.0.1:1314), finds DOM sections, screenshots each independently, matches by heading, pixelmatches each pair. Run with:
   ```bash
   hugo server --port 1314 --bind 127.0.0.1 --disableFastRender --noHTTPCache &
   COMPARE_SLUGS=slug-a,slug-b npx playwright test --config tests/playwright.config.ts tests/chunk-comparison.spec.ts
   ```

2. **Component summary** (`scripts/build-component-summary.js`): Groups chunk results by component type, shows avg/min/max diff per component. Run with `node scripts/build-component-summary.js`.

3. **WP page extraction** (`scripts/export-live-page-fragment.js`): Captures `.entry-content` innerHTML + relevant `<style>` rules from the live WP site per page.

4. **Python chunk algorithm** (`tools/chunk-compare/`): Hypothesis-validated chunker + matcher. 36/36 tests pass. Not needed for execution but documents the algorithm.

## The systematic mobile problem

Every component follows the same pattern: desktop under 20%, mobile 30-50%. The root causes identified by scouts:

1. **Breakpoint mismatch**: Hugo uses 921px and 544px. WP uses 976px (tablet) and 767px (mobile). At widths between these values, the two sites render differently.

2. **Fixed pixels vs percentages**: Hugo uses fixed pixel padding/margins at mobile. WP uses percentage-based values that scale with viewport width.

3. **Inner content width**: WP constrains inner content to `max-width: min(100%, 767px)` at mobile. Hugo often uses `100%` or fixed pixel widths.

4. **The mobile viewport is 375px**: At this width, small padding differences (10px vs 24px) cause every line of text to wrap differently, cascading into different section heights.

## Your task

Fix mobile CSS for the top components, working from worst to best. Use parallel subagents — one per component. Each agent should:

1. Read the current CSS rules for its component at mobile breakpoints
2. Read the WP source HTML (`data/wp-html/` or `data/wp-rendered/`) to understand WP's mobile layout
3. Make targeted CSS changes in `themes/xrnav/static/css/wordpress-compat.css`
4. **Do NOT change template HTML** unless absolutely necessary — this phase is CSS-only

### Component priority (mobile avg diff):

| Priority | Component | Mobile Avg | Desktop Avg | Instances | Key issue |
|----------|-----------|-----------|-------------|-----------|-----------|
| 1 | use-cases | 55.2% | 23.5% | 2 | Homepage "Audiom Use Cases" section |
| 2 | team | 51.0% | 9.3% | 12 | About page team members — stacking/image sizing |
| 3 | info-box | 47.1% | 16.7% | 12 | Collection page sections — text wrapping |
| 4 | blog-index | 47.7% | 10.6% | 4 | Blog hero + post grid mobile |
| 5 | hero | 42.1% | 15.9% | 8 | Collection/homepage heroes |
| 6 | contact-form | 40.7% | 18.9% | 4 | Homepage + about contact sections |
| 7 | why-section | 42.9% | 14.3% | 2 | Homepage "Why XR Navigation" |
| 8 | client-logos | 37.0% | 6.1% | 2 | Homepage client logo grid |
| 9 | what-is | 39.3% | 3.6% | 2 | Homepage "What Is Audiom?" |
| 10 | steps | 36.4% | 5.0% | 2 | Homepage "Step One" |
| 11 | cta | 30.2% | 11.4% | 8 | Collection CTAs |

### Approach for each agent

The most effective approach from our experience: **extract computed styles from WP at mobile viewport (375px), compare to Hugo, generate CSS patches.** Specifically:

1. Use Playwright to visit the WP page at 375px viewport width
2. Find the section by heading text
3. Extract key computed styles: padding, margin, width, max-width, font-size, line-height, flex properties
4. Do the same on Hugo
5. Diff the values and write CSS rules that close the gap
6. Scope all CSS to the component's selectors — never use generic selectors

### What NOT to do

- Don't use `!important` unless overriding an inline style
- Don't change breakpoints from 921px/544px — those are established and other rules depend on them. Instead, ADD rules at 767px where WP has its mobile breakpoint.
- Don't touch the template HTML unless the DOM structure is the cause of the mobile diff
- Don't make global CSS changes — scope everything to the component

### Verification

After each component fix:
```bash
COMPARE_SLUGS=<affected-slugs> npx playwright test --config tests/playwright.config.ts tests/chunk-comparison.spec.ts
```

Check that mobile diff dropped and desktop didn't regress.

### Commit after each fix

```
git add themes/xrnav/static/css/wordpress-compat.css
git commit -m "Fix <component> mobile CSS: <what changed>

<component> mobile: X% → Y%"
```

## Key files

- CSS: `themes/xrnav/static/css/wordpress-compat.css` (~5700 lines)
- Templates: `themes/xrnav/layouts/partials/collection-render.html`, `themes/xrnav/layouts/index.html`, `themes/xrnav/layouts/blog/list.html`, `themes/xrnav/layouts/wp-about/single.html`
- WP reference HTML: `data/wp-html/homepage.html`, `data/wp-html/about.html`, `data/wp-html/blog.html`, `data/wp-rendered/corporate-campuses.html`
- WP structural patterns: `data/wp-html/structural-patterns.md`
- Content: `content/corporate-campuses.md`, `content/health-care-facilities.md`, `content/universities.md`, `content/_index.md`
