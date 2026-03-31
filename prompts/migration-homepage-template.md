# Task: Build Homepage Template

## Goal
Create a custom Hugo homepage template (`layouts/index.html`) that reproduces the sectioned layout of the WordPress homepage. The content data is already in `content/_index.md` — it just needs to be rendered with proper structure instead of as flat markdown.

## Context
Read these files:
- `content/_index.md` — the exported homepage content (raw markdown with all text/images)
- `themes/xrnav/layouts/_default/baseof.html` — the base template to extend
- `themes/xrnav/static/css/main.css` — existing styles
- `notes/wp-audit.md` — section "Homepage" describes the layout
- `notes/design-tokens.md` — colors, fonts

## Homepage Sections (in order, from the WP audit)

The WordPress homepage has these sections. Build each as a partial or directly in the template:

### 1. Hero Section
- H1: "Welcome to XR Navigation with Audiom: The World's First Inclusive Digital Map"
- Subtext about exploring the world through senses
- CTA button linking to the demo

### 2. Three-Step Process
- H3: "Step One", "Step Two", "Step Three"
- Each has a paragraph explaining the step
- Layout: 3-column grid on desktop, stacked on mobile

### 3. "Why XR Navigation Is The Future"
- H3: "Fully Accessible" and "True Inclusion"
- Each with descriptive paragraph
- Layout: 2-column feature cards

### 4. Able Player Video
- H2: "Media player"
- Video with Able Player for accessible playback
- The video files are in `static/images/` — look for Intro-to-Audiom*.mp4
- Able Player needs: jQuery, ableplayer.min.js, ableplayer.min.css
- For now, use a standard HTML5 `<video>` element with controls. We can add Able Player JS later if the library files are available. Include `<track>` elements for captions if VTT files exist in static/images/.

### 5. Client Logos
- H2: "Our Clients"
- Logo images: Georgia Tech, NASA, University of Washington
- Layout: centered flex row

### 6. "What Is Audiom?"
- H2 with descriptive text and possibly an image

### 7. Use Cases Grid
- H2: "Audiom Use Cases"
- 4 cards: Universities, Corporate Campuses, Health Care Facilities, Events
- Each card has an image, heading, short text, and a link
- Layout: 2x2 grid on desktop, stacked on mobile

### 8. Team Bios
- H2: "Meet Our Team"
- Brandon Biggs and Chris Toth
- Each with portrait image and bio text
- Layout: 2-column on desktop

### 9. Contact Section
- H2: "CONTACT US"
- Reuse the Netlify contact form from the footer partial, or embed it directly

## Implementation Approach

**Do NOT try to parse the markdown content dynamically.** Instead:

1. Read `content/_index.md` and extract the actual text content for each section.
2. Create `layouts/index.html` that extends baseof.html and has hardcoded section structure with the content.
3. OR better: restructure `content/_index.md` to use Hugo frontmatter data (like a `sections` array) and have the template iterate over it.
4. OR simplest: use Hugo shortcodes in `content/_index.md` to wrap each section.

The simplest approach that works: create `layouts/index.html` as a standalone template that pulls text from page params in frontmatter. Restructure `content/_index.md` frontmatter to hold the structured data, and keep the markdown body minimal.

## CSS
Add homepage-specific styles to `themes/xrnav/static/css/main.css` or a new `homepage.css`:
- `.hero` section with the dark background (#04203e or similar from the WP site)
- `.steps-grid` — 3 column
- `.features-grid` — 2 column
- `.logo-bar` — centered flex
- `.use-cases-grid` — 2x2
- `.team-grid` — 2 column
- Responsive: all grids collapse to single column on mobile

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit after building the template: `git add layouts/ content/_index.md themes/`
- Commit message: "Build homepage template with structured sections"
- Run `hugo` to verify it builds
- Include commit hash in report

## Report
Write your report to `reports/migration-homepage-template.md` with:
- What sections were built
- How content/_index.md was restructured
- Hugo build output
- Commit hash
- What still needs work (if anything)
