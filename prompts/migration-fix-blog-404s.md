# Task: Fix 11 Blog Posts Returning 404

## Problem
11 blog posts were exported to `content/blog/` but return HTTP 404 when Hugo serves the site. They need to be findable at their original WordPress URLs.

## Missing Posts
These slugs 404 on the Hugo site:
1. digital-map-tool-accessibility-comparison
2. five-things-to-look-out-for-when-reading-an-accessibility-conformance-report-a-completed-vpat
3. five-ways-the-recent-nfb-digital-map-resolution-impacts-colleges-universities-and-federal-agencies
4. how-to-convert-from-a-pdf-map-to-a-vector-data-map
5. how-to-convert-from-pdf-to-geojson-using-qgis
6. how-to-make-detailed-map-text-descriptions
7. how-to-systematically-evaluate-the-text-accessibility-of-a-map-with-examples
8. how-xr-navigation-helps-federal-agencies-follow-recent-omb-accessibility-guidance
9. list-of-non-visual-drawing-tools
10. the-first-three-questions-to-ask-before-considering-any-digital-system-for-your-business
11. what-is-the-definition-of-a-map

## Investigation Steps
1. Check if the files exist in `content/blog/` — `ls content/blog/`
2. Check what URLs Hugo generates — `hugo list all` or look at `public/` after building
3. The WordPress URLs for posts are at the ROOT level (e.g., `/what-is-the-definition-of-a-map/`), NOT under `/blog/`. Check the WP post sitemap to confirm.
4. If posts were exported to `content/blog/{slug}.md` but WP served them at `/{slug}/`, Hugo needs to either:
   a. Move them to `content/{slug}.md` with proper layout, OR
   b. Add `url: /{slug}/` to their frontmatter to override the URL, OR
   c. Configure Hugo's permalinks in `hugo.toml` so blog posts render at root

## Fix
Determine the correct approach and implement it. The goal: every blog post URL that worked on WordPress must work on Hugo.

## Verify
After fixing, run `hugo server` and curl each of the 11 URLs to confirm they return 200.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit the fix with a descriptive message
- Include commit hash in report

## Report
Write your report to `reports/migration-fix-blog-404s.md`
