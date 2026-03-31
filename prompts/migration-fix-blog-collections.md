# Task: Fix Blog Pagination and Collection Page Card Grids

## Problem 1: Blog Pagination (90% diff)
Hugo's blog listing renders ALL posts (14723px mobile) while WordPress paginated (5162px). Fix: set Hugo's pagination to match WordPress.

### Fix
In `hugo.toml`, set `paginate = 10` (or whatever number WordPress used — check the blog baseline screenshot height to estimate). The UAGB post grid on WP showed approximately 9-11 posts per page.

Verify the blog list template (`themes/xrnav/layouts/blog/list.html`) uses Hugo's pagination:
```go
{{ $paginator := .Paginate .Pages 10 }}
{{ range $paginator.Pages }}
```

Add pagination navigation at the bottom matching WP's style.

## Problem 2: Collection Pages Missing Card Grids (80-86% diff)
Three pages render as plain text lists but should be card grids with images:
- `/universities/` (85.88% diff, 2417px vs 4689px baseline)
- `/health-care-facilities/` (84.27% diff, 2558px vs 5466px baseline)
- `/corporate-campuses/` (81.06% diff, 2631px vs 4885px baseline)

### Investigation
Use the browser (MCP chrome tools) to look at these pages on the live WP site. Capture the HTML structure — they likely use UAGB info-box or container blocks with images arranged in a grid.

Then read the Hugo content files (`content/universities.md`, etc.) to see what content is there.

### Fix
These pages probably need custom layouts or shortcodes to render their content as visual card grids instead of flat markdown. The content (images, text, links) should already be in the markdown files — it just needs to be wrapped in the right HTML structure.

If the content files have the data but as flat markdown, restructure them with frontmatter data (like the homepage) and create a card grid template.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit separately: blog pagination fix, then collection page fixes
- Include commit hashes in report

## Report
Write to `reports/migration-fix-blog-collections.md`
