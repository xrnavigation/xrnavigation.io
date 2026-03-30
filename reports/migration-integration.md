# Migration Integration Report
Date: 2026-03-30

## Summary

Wired exported WordPress content into the Hugo theme: fixed image paths, merged custom focus CSS, added redirect aliases, deleted the blog.md conflict, and verified the site builds cleanly.

## Tasks Completed

### 1. Deleted content/blog.md
The flat `content/blog.md` file conflicted with the `content/blog/` directory. Hugo uses `content/blog/_index.md` for the blog section list page. Deleted `blog.md`.

### 2. Image URL Rewriting
Created `scripts/rewrite-image-urls.js` which reads `static/images/manifest.json` (189 entries) and rewrites WordPress upload URLs in content files.

**Pass 1** (full URLs): 34 replacements across 10 files. Targeted `https://xrnavigation.io/wp-content/uploads/YYYY/MM/filename.ext` patterns.

**Pass 2** (relative paths): 11 additional replacements across 4 files. Targeted `/wp-content/uploads/YYYY/MM/filename.ext` patterns without the domain prefix.

**Total**: 45 URLs rewritten across 14 files.

**Remaining `/wp-content/` references (not rewritten):**

| Category | Count | Reason |
|----------|-------|--------|
| WordPress-resized thumbnails (-1024xNNN, -300xNNN) | ~20 | Not in manifest — WP auto-generated size variants. Original full-size images ARE downloaded. |
| External ICAD conference PDFs (icad2022.icad.org, icad2019.icad.org, icad2018.icad.org) | ~8 | These are on OTHER websites, not xrnavigation.io. Correct as-is. |
| WPForms spinner SVG (wpforms/assets/images/submit-spin.svg) | 3 | Dead reference from WPForms plugin markup on contact, events, and homepage. Will be removed when forms are rebuilt. |
| DALL-E generated images with Unicode characters in filename | ~8 | Files contain `DALL·E` (middle dot) in filename. May need manual download with correct encoding. |

### 3. Focus Styles Merged
Replaced the generic focus styles in `themes/xrnav/static/css/main.css` with Steven Woodson's Interactive Focus Styles (WP snippet post 1442):

- Added CSS custom properties: `--outline-color: #d01754`, `--outline-offset`, `--outline-size`, `--outline-style`
- `:focus` fallback for older browsers + `:focus-visible` for modern browsers
- Targets: `a, button, input, select, textarea, summary` plus checkbox/radio pseudo-elements
- Removed WPForms-specific selectors (`div.wpforms-container-full .wpforms-form *`) since Hugo won't use WPForms
- Added `border-radius: 0.5rem` and `z-index: 1` on focus-visible

### 4. Redirect Aliases Added
Added Hugo `aliases` frontmatter to 7 content files for 8 internal redirects:

| Source | Target File |
|--------|-------------|
| /csun26, /csun25 | content/csun.md |
| /atia26, /atia25 | content/atia.md |
| /sonification | content/sonification-award-2026-...md |
| /audiom-disability-innovation-forum-2025-map | content/dif25.md |
| /gavilan-college-hollister-campus-map | content/gavilan-hollister.md |
| /gilroy-campus-map | content/gavilan-gilroy.md |
| /peach | content/peachability-walk-june-22-2025.md |

External redirects (/audiom-experience-builder to GitHub Pages, /conference-contact to Google Forms) remain in `static/_redirects` only — Hugo aliases can't handle external URLs.

### 5. Hugo Build Verification

```
                  | EN
------------------+-----
 Pages            |  98
 Paginator pages  |   9
 Non-page files   |   0
 Static files     | 196
 Processed images |   0
 Aliases          |  13
 Cleaned          |   0

Total in 2148 ms
```

**Zero errors. Zero warnings.** 98 pages, 13 aliases (8 from redirects + 5 existing), 196 static files.

### 6. Homepage Assessment

`content/_index.md` contains the exported homepage content. It renders as a single long markdown page. Here is what needs template work to match the WordPress site layout:

**Structural issues:**
1. **Hero section** — The intro paragraph and "Demo Audiom" CTA button are plain markdown. Needs a hero partial or shortcode with proper visual treatment.
2. **3-step process** — Steps One/Two/Three are H3s with paragraphs. On the WP site these are in a 3-column grid with icons. Needs a shortcode like `{{< steps >}}` or a custom partial.
3. **"Why XR Navigation" features** — "Fully Accessible" and "True Inclusion" are H3s. On WP these are feature cards in a grid. Needs a features shortcode or partial.
4. **Client logos** — Georgia Tech, NASA, UW logos are plain `![alt](/images/...)` images in a row. Needs a logo bar partial with proper flex/grid layout.
5. **Use cases section** — 4 cards (University, Corporate, Healthcare, Events) each with image + heading + paragraph + link. Needs a card grid shortcode.
6. **Team bios** — Brandon Biggs and Chris Toth with portrait images. Needs a team member partial with side-by-side or card layout.
7. **Contact form** — WPForms markup was stripped by the REST API. What remains is plain text labels ("Name *", "Email *", etc.) and a dead spinner SVG. Needs to be replaced with the Netlify form from the footer partial, or a dedicated homepage form shortcode.
8. **Able Player video** — Referenced in the WP audit as being on the homepage, but the exported markdown doesn't contain it. Likely was in a Spectra block that didn't export through the REST API. Needs manual recreation.

**Recommended approach:** Create a custom `layouts/index.html` (homepage template) that replaces the markdown content with structured Hugo partials. The content data (text, images, links) is all present in the markdown — it just needs to be moved into template structures.

## Commits

| Hash | Description |
|------|-------------|
| c604f73 | Delete content/blog.md that conflicts with content/blog/ directory |
| b20762d | Rewrite WordPress image URLs to local paths in content files |
| 05be59a | Merge focus styles into theme CSS and add redirect aliases |
| 46bc1ed | Rewrite relative /wp-content/uploads/ paths to local /images/ paths |

## What's Left To Do

1. **Homepage template** — Build `layouts/index.html` with structured partials (hero, steps, features, logos, use cases, team, contact form). Data is in the markdown; it needs layout.
2. **Missing images** — ~20 WordPress-resized thumbnails and ~8 DALL-E images with Unicode filenames need to be downloaded. Run the media download script targeting these specific files, or download full-size originals and let Hugo handle resizing.
3. **Dead WPForms references** — Remove `Submit![Loading](...)` spinner SVG markup from contact.md, events.md, and _index.md.
4. **Able Player video** — Recreate the homepage video player with Able Player library integration.
5. **Contact forms** — Rebuild contact page form and any other page-specific forms using Netlify Forms (footer form is already done in the theme).
6. **Theme switcher testing** — The dark mode and high contrast CSS/JS are in the theme but haven't been verified against actual content.
