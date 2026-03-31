# Task: Extract Real CSS Measurements from Live WordPress Site

## Goal
Use the browser to extract every computed CSS value that matters for visual layout from the live WordPress site. These values will be used to rewrite the Hugo theme CSS to match pixel-for-pixel.

## Browser Access
WordPress site is live at https://xrnavigation.io. Use MCP chrome tools (tab 429210767 or create a new tab). You MUST use ToolSearch to load each MCP tool before calling it.

## What to Extract

### From the Homepage (https://xrnavigation.io/)

**Header/Nav:**
- Header element: height, padding, background-color, position (sticky/fixed/static)
- Logo: width, height
- Nav links: font-family, font-size, font-weight, color, text-transform, letter-spacing, padding between items
- Nav container: max-width, justify-content/alignment
- Mobile menu breakpoint (what width does hamburger appear?)

**Content Area:**
- Main content container: max-width, padding-left, padding-right, margin
- Section spacing: padding-top, padding-bottom between major sections
- Body: background-color, line-height

**Typography (get computed values, not CSS declarations):**
- h1: font-size, font-weight, line-height, color, margin-bottom, font-family
- h2: same
- h3: same
- p: font-size, line-height, color, margin-bottom, font-family
- a: color, text-decoration, hover color

**Footer:**
- Footer: background-color, padding, color
- Footer container: max-width, grid/flex layout, column count, gap
- Footer headings: font-size, font-weight, color
- Footer links: font-size, color
- Footer form: field styles, button styles
- Copyright/attribution: font-size, color

### From a Standard Page (https://xrnavigation.io/about/)
- Page title (h1): font-size, margin, color
- Content width on standard pages
- Image styling (border-radius, max-width)
- Paragraph spacing

### From the Blog Page (https://xrnavigation.io/blog/)
- Blog grid: columns, gap, card styling
- Blog card: border, padding, shadow, border-radius
- Blog card title: font-size, font-weight
- Blog card excerpt: font-size, color
- Blog card image: aspect ratio, object-fit
- Pagination: style, spacing

### From an Audiom Embed Page (https://xrnavigation.io/audiom-demo/)
- iframe container: padding, max-width
- Page title above iframe: font-size, margin
- Any wrapper styling around the iframe

### Responsive Values
Extract the above at THREE breakpoints:
1. Desktop (1920px)
2. Tablet (768px)
3. Mobile (375px)

Use JavaScript to extract computed styles:
```javascript
const el = document.querySelector('selector');
const s = getComputedStyle(el);
// Extract: s.fontSize, s.padding, s.margin, s.maxWidth, etc.
```

## Output
Write ALL extracted values to `data/wp-computed-styles.json` as a structured JSON object organized by component (header, nav, content, typography, footer, blog, audiom-embed) and breakpoint.

Also write a human-readable summary to `data/wp-css-spec.md`.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- `git add data/wp-computed-styles.json data/wp-css-spec.md`
- `git commit -m "Extract computed CSS values from live WordPress site"`
- Include commit hash in report

## Report
Write your report to `reports/migration-extract-css.md`
