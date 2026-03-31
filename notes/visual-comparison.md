# Visual Comparison Notes
## 2026-03-30

**GOAL:** Screenshot Hugo site, compare against 180 WordPress baseline PNGs, report diffs.

**OBSERVATIONS:**
- 180 baseline files in tests/baseline/ (90 slugs x 2 viewports: desktop/mobile)
- Existing playwright config at tests/playwright.config.ts, baseline spec at tests/visual-baseline.spec.ts
- Hugo available (v0.156.0), config at hugo.toml, theme "xrnav"
- Viewports: desktop=1920x1080, mobile=375x812
- package.json has @playwright/test and typescript as devDeps
- Need to install pixelmatch + pngjs for diff approach
- .gitignore already has tests/baseline/*.png, node_modules/, public/

**DONE:**
- Hugo served on port 1314 (98 pages built)
- Installed pixelmatch + pngjs
- Created tests/visual-comparison.spec.ts -- screenshots Hugo, diffs against baselines
- Ran comparison: 180 baselines, 0 matching, 1 minor, 179 major, 22 errors (404s)
- 11 blog posts not yet migrated (404)
- Best match: privacy-policy desktop at 9.9% diff
- All pages differ due to theme/CSS differences -- this is expected
- Report written to reports/migration-playwright-comparison.md
- .gitignore updated with tests/current/, tests/diffs/, tests/comparison-results.json
- Hugo server killed

**NEXT:** Commit and done.
