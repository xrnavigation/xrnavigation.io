# Task: Build Playwright Screenshot Baseline

## Goal
Create a Playwright test suite that screenshots every page on the live WordPress site at xrnavigation.io. These screenshots are the visual truth — the Hugo site must match them.

## Context
- The site has ~86 pages total (75 pages + 11 blog posts)
- All URLs are listed in the sitemaps at:
  - https://xrnavigation.io/page-sitemap.xml
  - https://xrnavigation.io/post-sitemap.xml
- The site has a responsive design with mobile breakpoint at 544px and tablet at 921px
- Fonts: Lato (body), Montserrat (headings) — loaded from Google Fonts. Screenshots must wait for fonts to load.
- Some pages have Audiom iframe embeds (from audiom.net) — these may take time to load

## Deliverables
1. A `tests/` directory with a Playwright project
2. A script/test that:
   - Fetches all URLs from both sitemaps
   - Takes full-page screenshots of each URL at desktop (1920px) and mobile (375px) widths
   - Saves screenshots to `tests/baseline/` with filenames derived from the URL slug
   - Waits for network idle and fonts before screenshotting
3. A `package.json` with playwright as a dependency
4. A README or comment explaining how to run it

## Technical Requirements
- Use `@playwright/test`
- Use TypeScript
- Install with `npm init -y && npm install -D @playwright/test typescript`
- Run `npx playwright install chromium` to get the browser
- Screenshots go in `tests/baseline/{slug}-desktop.png` and `tests/baseline/{slug}-mobile.png`
- For the homepage, use slug `home`
- Wait for `networkidle` state before screenshotting
- Set a reasonable timeout (30s per page) since some pages have heavy embeds

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- `git add tests/ package.json package-lock.json tsconfig.json`
- Do NOT add `node_modules/` or the baseline screenshots (they'll be large)
- Add `node_modules/` and `tests/baseline/*.png` to `.gitignore`
- `git commit -m "Add Playwright visual baseline test suite"`
- Include the commit hash in your report

## Report
Write your report to `reports/migration-playwright-baseline.md` with:
- What was created
- How to run it
- The commit hash
- Any issues encountered
