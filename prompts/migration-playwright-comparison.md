# Task: Playwright Visual Comparison — Hugo vs WordPress Baseline

## Goal
Screenshot every page on the Hugo site and compare against the WordPress baseline screenshots. Report all differences.

## Steps

### 1. Build and serve Hugo locally
```bash
cd C:\Users\Q\src\audiom\xrnavigation.io
hugo server --port 1314 --bind 0.0.0.0 &
```
Wait a few seconds for it to start, then verify with `curl -s http://localhost:1314/ | head -5`.

### 2. Create a comparison test
Create `tests/visual-comparison.spec.ts` that:
1. Reads all existing baseline screenshots from `tests/baseline/`
2. For each `{slug}-{viewport}.png` baseline file, navigates to `http://localhost:1314/{slug}/` at the matching viewport
3. Takes a screenshot and saves it to `tests/current/{slug}-{viewport}.png`
4. Compares against the baseline using Playwright's `toMatchSnapshot` or a pixel-diff library
5. Logs the per-page diff percentage

### 3. Alternative simpler approach
If `toMatchSnapshot` is complex to set up, just:
1. Take screenshots of every page on the Hugo site at both viewports
2. Save to `tests/current/`
3. Use a Node.js script with `pixelmatch` (npm package) to diff each pair
4. Output a report: per-page diff percentage, sorted worst-first

Install: `npm install pixelmatch pngjs`

### 4. Slug-to-URL mapping
- Baseline files are named `{slug}-desktop.png` and `{slug}-mobile.png`
- The slug `home` maps to `/`
- All other slugs map to `/{slug}/`
- Some slugs contain nested paths with dashes

### 5. Handle mismatches
For pages with >5% pixel difference, save a visual diff image to `tests/diffs/{slug}-{viewport}-diff.png` highlighting the changed pixels.

### 6. Report results
Write a summary showing:
- Total pages compared
- Pages matching (<2% diff)
- Pages with minor differences (2-10% diff)
- Pages with major differences (>10% diff)
- Top 10 worst pages by diff percentage

## After Comparison
- Kill the Hugo server
- Do NOT commit the current/ or diffs/ screenshots (add to .gitignore)
- Commit only the test script and the comparison report

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- `git add tests/visual-comparison.spec.ts` (or whatever script you create)
- Add `tests/current/` and `tests/diffs/` to `.gitignore`
- `git commit -m "Add visual comparison test and run initial comparison"`
- Include commit hash in report

## Report
Write your report to `reports/migration-playwright-comparison.md` with:
- Total pages compared
- Match/minor/major breakdown
- Top 10 worst pages with diff percentages
- Assessment: what's causing the biggest differences
- Commit hash
