# Foreman Progress — Migration Prep
Date: 2026-03-30

## STATUS: 3 of 6 agents complete, 3 running

## COMPLETED AGENTS

### 1. Playwright baseline (test suite) — DONE, VERIFIED
- Commit: 44a9c52
- Files: tests/visual-baseline.spec.ts, tests/playwright.config.ts, tsconfig.json, package.json, .gitignore
- Fetches URLs from sitemaps, screenshots at desktop (1920) + mobile (375), waits for fonts+network idle.

### 2. WP content export — DONE, VERIFIED
- Commits: 44a9c52, 1b1d8af
- Files: scripts/wp-export.js, 90 content/*.md files (79 pages + 11 posts)
- 52 audiom embed pages detected with audiom_id in frontmatter
- Follow-up needed:
  - content/blog.md conflicts with content/blog/ directory — delete it
  - Image URLs still point to WP uploads — need rewriting pass using manifest.json
  - Homepage needs manual template work
  - Forms need rebuilding (not in REST API)

### 3. Media download — DONE, VERIFIED
- Commits: b3ccd4b, c76ae21
- Files: scripts/download-media.js, static/images/ (189 files, 396MB), static/images/manifest.json
- Zero failures. 6 videos (~367MB), rest are images/PDFs/VTT/DOCX.

## RUNNING AGENTS

### 4. hugo-scaffold — STILL RUNNING
- Building Hugo project structure + custom theme

### 5. redirects-forms-css — STILL RUNNING
- Exporting redirects, form structure, Custom CSS/JS via browser (tab 429210767)

### 6. run-baseline — STILL RUNNING (dispatched after agent 1 completed)
- Actually running the Playwright screenshots against live site (~86 pages x 2 viewports)
- This one takes a while — network idle wait on each page

## POTENTIAL ISSUES
- Multiple agents committed to same repo — possible git history tangles. Need to check git log after all finish.
- WP export commit hash 44a9c52 same as Playwright — suspicious, may be coincidence or conflict.
- 396MB of media committed to git — repo will be large. May want git-lfs later.

## NEXT (after all agents complete)
1. Read remaining 3 reports, verify against plan
2. Check git log for any conflicts/overwrites between agents
3. Delete content/blog.md (conflicts with content/blog/)
4. Image URL rewriting pass (WP URLs → local paths using manifest.json)
5. Wire exported content into Hugo theme
6. Run Playwright comparison: Hugo build vs WordPress baseline
7. Iterate until screenshots match

## KEY FACTS
- Working directory: C:\Users\Q\src\audiom\xrnavigation.io
- Repo is on `master` branch
- WP admin browser session: tab 429210767 (logged in as q.alpha)
- Site has ~86 URLs total from sitemaps
