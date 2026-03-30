# Migration Integration Notes
Date: 2026-03-30

## GOAL
Wire exported WordPress content into Hugo theme: fix image URLs, merge focus CSS, add redirect aliases, delete blog.md conflict, verify build.

## OBSERVATIONS
- All 6 prerequisite files confirmed to exist: content/blog.md, static/images/manifest.json, data/redirects.json, data/custom-css-focus-styles.css, themes/xrnav/static/css/main.css
- Read all 5 context files (wp-audit, design-tokens, hugo-scaffold report, wp-export report, redirects-forms-css report)
- content/blog.md exists and must be deleted (conflicts with content/blog/ directory)

## NEXT
1. Delete content/blog.md
2. Read manifest.json, write image URL rewrite script, run it
3. Read focus styles CSS + main.css, merge focus rules
4. Read redirects.json, add aliases to frontmatter
5. Run hugo build, check output
6. Assess homepage _index.md
