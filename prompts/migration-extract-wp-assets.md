# Task: Download WordPress CSS Files and Capture HTML Structure

## Goal
Download every CSS file loaded by the WordPress site and capture the actual HTML structure of key page types. These will be used to rewrite Hugo templates for pixel-perfect visual parity.

## Part 1: Download All CSS Files

Use the browser (MCP chrome tools) to get a list of every stylesheet loaded on the homepage, then download each one.

### Method
Navigate to https://xrnavigation.io/ and run JavaScript to extract all stylesheet URLs:
```javascript
[...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href)
```

Also extract any inline `<style>` blocks — these contain Astra's inlined CSS.

For each stylesheet URL, download the file to `data/wp-css/`. Use WebFetch or the browser to get the raw content. Key files to expect:
- Astra theme stylesheet (may be inlined)
- UAGB/Spectra blocks CSS
- WordPress block library CSS
- Any plugin CSS (WPForms, Able Player, etc.)
- Astra customizer output (inline CSS with custom properties, responsive rules)

Also capture the FULL inline CSS from the page's `<head>` — this contains Astra's generated styles (colors, typography, layout rules). This is often the most important CSS on Astra sites.

Save each file to `data/wp-css/{descriptive-name}.css`.

## Part 2: Capture HTML Structure

For each of these representative pages, capture the HTML structure of the main content area. We need the actual DOM tree with class names and nesting — not just content.

### Pages to capture:

1. **Homepage** (https://xrnavigation.io/)
   - Header (everything in `<header>`)
   - First 2 content sections (enough to see the UAGB container pattern)
   - Footer (everything in `<footer>` and below)

2. **Standard page** (https://xrnavigation.io/about/)
   - Main content area — how UAGB containers wrap the content

3. **Blog listing** (https://xrnavigation.io/blog/)
   - The post grid — card structure, class names, nesting

4. **Audiom embed page** (https://xrnavigation.io/audiom-demo/)
   - How the iframe is wrapped

5. **Blog post** (https://xrnavigation.io/how-to-make-detailed-map-text-descriptions/)
   - Post content structure

### How to capture HTML structure
For each page, use JavaScript to get the `outerHTML` of key elements. To avoid the cookie blocker, sanitize URLs:
```javascript
const html = document.querySelector('header').outerHTML;
// Replace URLs to avoid cookie blocker
html.replace(/https?:\/\/[^\s"']+/g, '[URL]').substring(0, 5000);
```

Or use the structure-walking approach (tag + class names + nesting depth) that worked earlier.

Save the HTML snapshots to `data/wp-html/{page-name}.md` with the structure documented.

## Part 3: Identify Key CSS Class Patterns

From the HTML captures, document the repeating structural patterns:
- What classes does UAGB use for container blocks?
- What's the nesting: outer wrapper → inner wrapper → content?
- How does the blog grid work (classes, structure)?
- What's the header DOM structure?
- What's the footer DOM structure?

Write a summary to `data/wp-html/structural-patterns.md`.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- `git add data/wp-css/ data/wp-html/`
- `git commit -m "Extract WordPress CSS files and HTML structure patterns"`
- Include commit hash in report

## Report
Write your report to `reports/migration-extract-wp-assets.md`
