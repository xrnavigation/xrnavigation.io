# Task: Fix Mobile CSS Width Regression

## Problem
All mobile screenshots render at 550px width instead of 375px. Something in recent CSS changes introduced a min-width or overflow that prevents the page from fitting in a 375px viewport.

## Investigation
1. Run `hugo server --port 1314`
2. Open a Playwright browser at 375px width and check what's causing the page to be wider
3. Use browser dev tools or JavaScript to find the widest element:
```javascript
let widest = { el: null, w: 0 };
document.querySelectorAll('*').forEach(el => {
  const w = el.scrollWidth;
  if (w > widest.w) widest = { el: el.tagName + '.' + el.className.split(' ')[0], w };
});
widest;
```

## Likely Causes
- A CSS `min-width` on body, `#page`, or `.ast-container`
- A fixed-width element (like the blog grid's `380px 380px 380px` columns) not being responsive
- An `overflow-x: visible` allowing content to expand beyond viewport
- The footer grid or header not collapsing properly at mobile widths

## Fix
Find the offending CSS rule and fix it. Add `overflow-x: hidden` to body as a safety net if needed, but find the actual cause.

Check `themes/xrnav/static/css/wordpress-compat.css` and `themes/xrnav/static/css/main.css` for any rules that set fixed widths without responsive breakpoints.

Also verify the blog pagination fix actually landed — round 4 report says blog is still showing all posts. Check `themes/xrnav/layouts/blog/list.html` for proper `.Paginate` usage.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit with descriptive message
- Include commit hash in report

## Report
Write to `reports/migration-fix-mobile-width.md`
