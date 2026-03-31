# Task: Fix Header and Footer to Match WordPress

## Problem
The header and footer differ on every page, contributing an estimated 15-25% of every page's pixel diff. This is the highest-leverage fix.

## What to Do

### Use the browser to capture EXACT header/footer HTML
Navigate to https://xrnavigation.io/ using MCP chrome tools and extract the complete rendered HTML for the header and footer elements. Use JavaScript:

```javascript
// Get header HTML (sanitize URLs to avoid cookie blocker)
document.querySelector('header#masthead').outerHTML.replace(/https?:\/\/[^\s"']+/g, '[URL]')
```

Do the same for the footer.

Then compare this HTML structure against what Hugo currently generates (read the Hugo templates and the built output).

### Fix the Hugo templates to match
Edit these files to produce matching HTML:
- `themes/xrnav/layouts/partials/header.html`
- `themes/xrnav/layouts/partials/footer.html`

The structural patterns are documented in `data/wp-html/structural-patterns.md`. The CSS is in `themes/xrnav/static/css/wordpress-compat.css`.

Key things to get right:
- Header height (80px), logo size (83x47), nav link styling
- Desktop nav hidden at <=921px, mobile nav shown
- Footer three tiers: above-footer (2-col links), primary-footer (logo + info), below-footer (copyright #15191d bg)
- Footer grid column widths and padding
- Exact Astra class names on every element

### Also fix the CSS if needed
If `wordpress-compat.css` is missing header/footer rules that exist in the WP CSS files at `data/wp-css/`, add them.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit with descriptive message
- Include commit hash in report

## Report
Write to `reports/migration-fix-header-footer.md`
