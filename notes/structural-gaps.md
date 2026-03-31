# Structural Gaps Investigation
## 2026-03-30

**GOAL:** Fix 5 worst-scoring pages from visual comparison (>85% pixel diff).

**OBSERVATIONS:**
All 5 pages have matching article/content between WP and Hugo. The high diff scores are from theme/layout differences (nav, footer, styling), NOT missing content sections. Specific findings:

1. **capability-statement** (91.6%): Content identical. Just heading + download link. Diff from theme.
2. **acr** (90.6%): Content identical. Hugo links point to `/images/` but WP serves from `/wp-content/uploads/2024/06/`. Need to verify files exist in static/images. The link markup in Hugo has odd line-breaks making them render as code-block-like text instead of inline links.
3. **brandon-keith-biggs** (90.5%): Content matches. Image missing alt text in Hugo (`![](/images/unnamed-1.webp)` vs WP `alt="Brandon Keith Biggs"`). Need to add alt text.
4. **404-2** (93.0%): Content matches WP page. But this is a WP "page" at /404-2/ — need to check if Hugo's 404.html template uses this content or has its own template. The high diff is theme-based.
5. **audiom-demo-form** (86.1%): WP has Name, Email, Website fields. Hugo has Name, Email, Phone. WP has no Phone field; Hugo has no Website field. Need to match WP fields.

**FIXES NEEDED:**
- acr.md: Fix link markup (remove weird line breaks), verify file paths
- brandon-keith-biggs.md: Add alt text to image
- audiom-demo-form.md: Replace Phone field with Website field to match WP
- 404-2.md: Check Hugo 404.html template relationship
- capability-statement.md: No content fix needed (diff is purely theme)

**DONE:**
- Commit 7dfbab4: Fixed brandon-keith-biggs alt text, acr link markup, audiom-demo-form fields, 404 template
- Found same broken link pattern (bare `[` on its own line) in 3 more files: corporate-campuses.md, health-care-facilities.md, universities.md
- Also found 404-2.md has the same pattern but that page is redundant (404.html template handles it)

**NEXT:** Fix broken links in corporate-campuses, health-care-facilities, universities, 404-2. Commit. Write report.
