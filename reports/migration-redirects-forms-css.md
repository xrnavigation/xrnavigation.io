# Migration Export: Redirects, Forms, Custom CSS/JS
Date: 2026-03-30
Commit: aa10e54

## Part 1: Redirects

**12 redirect rules captured** from the Redirection plugin. All are 301 (permanent).

Written to:
- `data/redirects.json` — structured JSON array
- `static/_redirects` — Netlify-compatible format

Notable redirects:
- 4 event shortlinks: /csun26, /csun25, /atia26, /atia25 (all point to their base event pages)
- 1 external redirect: /audiom-experience-builder -> GitHub Pages (xrnavigation.github.io/Audiom-Esri/)
- 1 external redirect: /conference-contact -> Google Forms
- 5 internal slug aliases: /sonification, /audiom-disability-innovation-forum-2025-map, /gavilan-college-hollister-campus-map, /gilroy-campus-map, /peach
- 1 duplicate: /atia25 appears twice (with and without trailing slash) pointing to /atia

## Part 2: Form Structure

**2 forms documented** (IDs 1507 and 2494). Both are identical in structure:

| Field | Type  | Required | Placeholder |
|-------|-------|----------|-------------|
| Your Name | name | Yes | Name |
| Your Email | email | Yes | Email |
| Your Message | text | Yes | Message |

- Form 1507: "Footer Form - Desktop"
- Form 2494: "Footer Form - Mobile"

Written to: `data/forms.json`

Migration note: In Hugo, a single responsive HTML form replaces both. The WPForms duplicate-ID workaround snippets become unnecessary.

## Part 3: Custom CSS/JS

**1 of 3 entries had actual code content.**

| Post ID | Name | Type | Status |
|---------|------|------|--------|
| 2177 | CH 80 | CSS | EMPTY — no code in snippet |
| 1442 | Interactive Focus Styles | CSS | EXTRACTED (1072 chars) |
| 102 | Custom_Astra_JS | JS | EMPTY — no code in snippet |

The Interactive Focus Styles CSS (by Steven Woodson) defines custom focus ring properties:
- Custom properties: --outline-color (#d01754), --outline-offset, --outline-size, --outline-style
- Applies to :focus and :focus-visible on interactive elements (a, button, input, select, textarea, summary)
- Includes WPForms-specific selectors and checkbox/radio pseudo-element selectors
- This is the only custom CSS/JS that needs to carry over to Hugo

Written to:
- `data/custom-css-focus-styles.css` — the extracted focus styles
- `data/custom-css-ch80.css` — placeholder noting empty snippet
- `data/custom-js-astra.js` — placeholder noting empty snippet

### Extraction method
The CodeMirror editor textarea was empty for all 3 entries (known issue from earlier audit). Content was retrieved from the plugin's compiled output files at `wp-content/uploads/custom-css-js/{post_id}.css|js`. The cookie blocker required sanitizing special characters (`/?.=&:` replaced with `_`) in the return path; the CSS was then manually reconstructed from the sanitized output.
