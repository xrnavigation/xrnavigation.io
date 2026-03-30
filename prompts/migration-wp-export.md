# Task: Export WordPress Content to Markdown

## Goal
Export all pages and posts from the WordPress site at xrnavigation.io as Markdown files with YAML frontmatter, ready for Hugo.

## Approach
Do NOT use the wordpress-to-hugo-exporter plugin. Instead, use the WordPress REST API to fetch all content programmatically. This avoids the PHP version issues and plugin installation.

## Steps

### 1. Fetch all pages and posts via REST API
The WP REST API is public (no auth needed for published content):

```
https://xrnavigation.io/wp-json/wp/v2/pages?per_page=100&page=1
https://xrnavigation.io/wp-json/wp/v2/pages?per_page=100&page=2
https://xrnavigation.io/wp-json/wp/v2/posts?per_page=100&page=1
```

Each response is JSON with: `title.rendered`, `content.rendered` (HTML), `slug`, `date`, `modified`, `excerpt.rendered`, `status`, `link`, `featured_media`, `categories`, `tags`.

### 2. Convert HTML content to Markdown
Use a tool like `turndown` (npm package) or write a simple converter. For each page/post:
- Convert `content.rendered` HTML to Markdown
- Preserve iframe embeds as raw HTML (Hugo supports raw HTML in Markdown)
- Extract the Audiom embed ID from iframes matching `audiom.net/embed/{id}` and put it in frontmatter as `audiom_id`
- Strip WordPress/Spectra wrapper divs (`.wp-block-uagb-container`, `.uagb-container-inner-blocks-wrap`)

### 3. Write Markdown files
- Pages go to `content/{slug}.md` (or `content/{slug}/_index.md` for section pages)
- Blog posts go to `content/blog/{slug}.md`
- Homepage goes to `content/_index.md`

### 4. Frontmatter format
```yaml
---
title: "Page Title"
date: 2024-06-14
lastmod: 2025-09-28
slug: "page-slug"
layout: "audiom-embed"  # only for pages with audiom iframes
audiom_id: 38            # only for pages with audiom iframes
draft: false
---
```

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Technical Notes
- Write a Node.js script at `scripts/wp-export.js` that does the fetch + convert + write
- Install dependencies: `npm install turndown`
- The script should be re-runnable (overwrites existing files)
- Handle pagination (check `X-WP-TotalPages` response header)
- Some pages may have no meaningful content (just an iframe) — that's fine, the frontmatter carries the audiom_id

## Git Instructions
- `git add scripts/wp-export.js content/`
- `git commit -m "Export WordPress content to Markdown via REST API"`
- Include the commit hash in your report

## Report
Write your report to `reports/migration-wp-export.md` with:
- How many pages and posts were exported
- How many audiom embed pages were detected
- Any content that didn't convert cleanly
- The commit hash
