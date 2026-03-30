# Task: Run the Playwright Baseline Screenshots

## Goal
Run the Playwright visual baseline test suite to capture screenshots of every page on the live WordPress site.

## Steps

1. `cd C:\Users\Q\src\audiom\xrnavigation.io`
2. `npm install`
3. `npx playwright install chromium`
4. `npm run baseline` (or `npx playwright test --config tests/playwright.config.ts tests/visual-baseline.spec.ts`)
5. This will take several minutes — it screenshots ~86 pages at 2 viewport sizes each.
6. Screenshots land in `tests/baseline/`

## After Screenshots Complete
- Count the screenshots: `ls tests/baseline/*.png | wc -l`
- Report total count and any failures
- Do NOT commit the screenshots (they're in .gitignore and are large binary files)

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Report
Write your report to `reports/migration-run-baseline.md` with:
- Number of screenshots captured
- Any pages that failed or timed out
- Total disk size of the baseline directory
