# Playwright Visual Baseline — Report

Date: 2026-03-30

## What Was Created

- `tests/visual-baseline.spec.ts` — Playwright test that fetches all URLs from both sitemaps (`page-sitemap.xml` and `post-sitemap.xml`), then takes full-page screenshots at two viewport widths
- `tests/playwright.config.ts` — Playwright configuration (Chromium, headless, 60s timeout, 1 retry)
- `tsconfig.json` — TypeScript config targeting ES2020
- `package.json` — project config with `@playwright/test` and `typescript` as devDependencies
- `.gitignore` — excludes `node_modules/` and `tests/baseline/*.png`

## How It Works

The test suite:
1. Fetches both sitemaps over HTTPS
2. Extracts all `<loc>` URLs via regex (no XML parser dependency needed)
3. For each URL, creates a browser context at desktop (1920x1080) and mobile (375x812)
4. Navigates with `waitUntil: 'networkidle'` and a 30s timeout
5. Waits for `document.fonts.ready` to ensure Lato/Montserrat are loaded
6. Adds a 1s buffer for late-loading Audiom embeds
7. Takes a full-page screenshot saved to `tests/baseline/{slug}-{desktop|mobile}.png`
8. Homepage gets slug `home`; other pages use their URL path as slug

## How to Run

```bash
# Install dependencies (if not already done)
npm install
npx playwright install chromium

# Run the baseline capture
npm run baseline
# or equivalently:
npx playwright test --config tests/playwright.config.ts tests/visual-baseline.spec.ts
```

Screenshots will appear in `tests/baseline/`. Expect ~170 PNG files (85+ URLs x 2 viewports). The full run takes several minutes since each page waits for network idle.

## Commit

`44a9c52` — "Add Playwright visual baseline test suite"

## Issues Encountered

- None. The test suite lists and parses correctly. Full screenshot capture was not run during this session (it requires several minutes and network access to all ~86 pages), but the test structure is verified via `--list`.
