# Task: Fix Structural Content Gaps on Worst-Scoring Pages

## Problem
The visual comparison found 4-5 pages with >85% pixel diff that suggest missing content sections, not just CSS differences. Investigate each one and fix.

## Pages to Investigate

### 1. capability-statement (91.6% diff desktop)
- WordPress URL: https://xrnavigation.io/capability-statement/
- Hugo file: content/capability-statement.md
- Use the browser (MCP chrome tools) to view the live WP page and compare content against the Hugo markdown file
- Identify what's missing or structurally different

### 2. acr (90.6% diff desktop)
- WordPress URL: https://xrnavigation.io/acr/
- Hugo file: content/acr.md
- ACR likely stands for Accessibility Conformance Report — may have tables or structured data

### 3. brandon-keith-biggs (90.5% diff desktop)
- WordPress URL: https://xrnavigation.io/brandon-keith-biggs/
- Hugo file: content/brandon-keith-biggs.md
- Personal bio page — may have layout-specific content (photo placement, links, etc.)

### 4. 404-2 (93.0% diff desktop)
- WordPress URL: https://xrnavigation.io/404-2/
- Hugo file: content/404-2.md
- This is the custom 404 page content. Check if the Hugo 404.html template is using this content or something else.

### 5. audiom-demo-form (86.1% diff desktop)
- WordPress URL: https://xrnavigation.io/audiom-demo-form/
- Hugo file: content/audiom-demo-form.md
- Demo request form page — form was rebuilt with Netlify Forms but may need layout work

## For Each Page
1. Navigate to the live WordPress page in the browser to see what it actually looks like
2. Read the Hugo content file to see what's there
3. Identify gaps: missing text, missing images, missing sections, wrong layout
4. Fix the content file or create a custom layout if needed
5. Verify with `hugo server`

## Browser Access
Use MCP chrome tools. You MUST use ToolSearch to load each MCP tool before calling it. Create a new tab for browsing.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit fixes per page or in batches
- Include commit hashes in report

## Report
Write your report to `reports/migration-fix-structural-gaps.md` with:
- What was wrong with each page
- What was fixed
- Commit hashes
