# Task: Fix Playwright Baseline Timeout and Capture Missing Screenshots

## Problem
The baseline test at `tests/visual-baseline.spec.ts` hit a 15-minute overall timeout because `audiom-demo-form` page's `networkidle` wait never resolves (reCAPTCHA keeps connections open). 140 of ~172 screenshots were captured. Everything alphabetically after `audiom-demo-form` was skipped.

## Fix Required

Edit `tests/visual-baseline.spec.ts`:

1. **Per-page timeout with fallback**: Instead of relying solely on `networkidle`, use a race between `networkidle` and a fixed 10-second timeout. If networkidle doesn't fire within 10s, screenshot anyway. Something like:
```typescript
await Promise.race([
  page.waitForLoadState('networkidle'),
  page.waitForTimeout(10000)
]);
```

2. **Increase overall test timeout** to 30 minutes in `tests/playwright.config.ts` (currently 15 minutes was too tight for ~86 pages x 2 viewports).

3. **Skip already-captured screenshots**: If a screenshot file already exists in `tests/baseline/`, skip that URL/viewport combo. This way we only capture the missing ones without re-doing the 140 we already have.

4. **Better error handling**: If a single page fails, log it and continue to the next page. Don't let one failure kill the whole run.

## After Fixing

Run the test:
```bash
npm run baseline
```

This should only capture the ~32 missing screenshots since the 140 existing ones will be skipped.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- `git add tests/visual-baseline.spec.ts tests/playwright.config.ts`
- `git commit -m "Fix baseline test: per-page timeout fallback, skip existing screenshots"`
- Then run the test and report results
- Include commit hash in report

## Report
Write your report to `reports/migration-fix-baseline.md` with:
- What was changed in the test
- Total screenshot count after re-run
- Any pages that still failed
- Commit hash
