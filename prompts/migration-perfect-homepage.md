# Task: Get Homepage to 0% Visual Diff — Tight Iteration Loop

## Goal
Make the Hugo homepage IDENTICAL to the WordPress baseline screenshot. Currently at ~69% diff. Get it to <1%.

## Method: TIGHT LOOP
Iterate inside this single agent session. Do NOT exit after one attempt. Keep going until diff is <1%.

### Loop:
1. Start Hugo: `hugo server --port 1314 &`
2. Screenshot homepage at desktop (1920x1080): navigate to `http://localhost:1314/`, wait for load, fullPage screenshot
3. Diff against `tests/baseline/home-desktop.png` using pixelmatch
4. Analyze WHERE pixels differ
5. Fix CSS/template
6. Kill Hugo, restart, screenshot, diff again
7. Repeat until <1%

## What You Have
- Baseline: `tests/baseline/home-desktop.png`
- Live WP page: https://xrnavigation.io/ (use MCP chrome tools to inspect computed styles)
- Hugo template: `layouts/index.html` (the homepage template with 9 sections from frontmatter)
- Hugo content: `content/_index.md` (frontmatter data for all sections)
- WP CSS files: `data/wp-css/` — especially `inline-uagb-style-frontend-135.css` which has per-block padding/sizing for every homepage section
- WP HTML snapshot: `data/wp-html/homepage.md`
- Hugo CSS: `themes/xrnav/static/css/wordpress-compat.css`, `main.css`

## Homepage Sections (from content/_index.md and layouts/index.html)
1. Hero — dark bg, h1, CTA button
2. Three-step process — 3-column grid
3. Why XR Navigation — 2-column features
4. Video — Able Player
5. Client logos — flex row
6. What Is Audiom — text + CTA
7. Use Cases — 2x2 grid
8. Team bios — 2-column
9. Contact form

## Key Approach
The WordPress homepage has 10 UAGB container sections, each with UNIQUE padding values documented in `data/wp-css-spec.md`:

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

Each section in `layouts/index.html` must have these EXACT padding values. Compare against what's currently in the template and CSS.

Also use `data/wp-css/inline-uagb-style-frontend-135.css` — this has the actual per-block styles keyed by hash. Find the homepage blocks and extract their exact styles.

## Technique for Finding Differences
Use the browser to compare computed styles between WP and Hugo side by side:
1. Open WP homepage in browser, run JS to get computed styles on each section
2. Open Hugo homepage (localhost:1314), run same JS
3. Compare the values — find mismatches
4. Fix them

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit each iteration: "Homepage iteration N: fix X (Y% → Z%)"
- Final commit when <1%

## Report
Write to `reports/migration-perfect-homepage.md`
