# Baseline Test Fix Report

**Date:** 2026-03-30
**Commit:** e60054d

## Changes Made

### `tests/visual-baseline.spec.ts`
- **Per-page timeout fallback:** Replaced `waitUntil: 'networkidle'` in `page.goto()` with `waitUntil: 'domcontentloaded'`, followed by a `Promise.race` between `networkidle` and a 10-second ceiling. Pages with persistent connections (reCAPTCHA, analytics) no longer block the run.
- **Skip existing screenshots:** Before capturing, checks if the screenshot file already exists in `tests/baseline/`. Skips it if so.
- **Error isolation:** Individual page failures are logged and collected but do not abort the run. A summary prints at the end with counts and failed filenames.

### `tests/playwright.config.ts`
- **Timeout increased** from 60 seconds to 30 minutes (30 * 60,000ms) to accommodate ~90 pages x 2 viewports.

## Run Results

- **Total URLs found:** 90 (up from 86 previously noted; sitemap grew slightly)
- **Previously captured:** 140 screenshots (skipped)
- **Newly captured:** 40 screenshots
- **Failed:** 0
- **Total baseline screenshots:** 180
- **Run time:** ~3.3 minutes (only captured missing ones)

## Pages That Failed

None. All 40 missing screenshots were captured successfully.
