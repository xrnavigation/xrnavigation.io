# Homepage Template Migration Notes
Date: 2026-03-30

## State: Built, committing

## What I Know
- `content/_index.md` has all homepage text, images, links — 9 sections
- `baseof.html` uses `{{ block "main" . }}` — template needs `{{ define "main" }}`
- `main.css` has design tokens, no homepage-specific styles yet
- `#main-content` has max-width and padding — homepage sections need to break out for full-width hero
- Video files: 4 mp4s in static/images/ (ASL-Only, ASL-and-Audio-Description, dupes)
- VTT caption files: 5 .vtt files in static/images/
- Footer already has Netlify contact form — can reference that pattern for contact section
- No existing `layouts/index.html` — creating from scratch

## Plan
1. Restructure `content/_index.md` frontmatter with structured section data
2. Create `layouts/index.html` extending baseof with all 9 sections
3. Add homepage CSS to main.css
4. Hugo build to verify
5. Commit and report
