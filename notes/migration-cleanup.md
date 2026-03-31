# Migration Cleanup Notes

## 2026-03-30

### State
Working through prompt at prompts/migration-cleanup.md. Three parts: image rewrites, WPForms cleanup, contact form rebuild.

### Part 1: Image Rewrites - In Progress
Completed about.md (6 of 6 local /wp-content/ image refs rewritten to /images/).
All originals exist in static/images/ - no downloads needed.

Remaining files to rewrite:
- corporate-campuses.md: 2 DALL-E images (use %C2%B7 encoding for middle dot)
- health-care-facilities.md: 2 DALL-E images
- universities.md: 2 DALL-E images (one used twice = 3 refs)
- magicmap-paloalto.md: 2 resized images (bronze-2, 3DModelMap-scaled)
- blog/digital-map-tool-accessibility-comparison.md: 1 full-URL (Untitled-1024x642.jpg → Untitled.jpg)
- case-study-vrate-expo-2024.md: 1 full-URL (Untitled-1-1-1024x409.png → Untitled-1-1.png)
- events.md: 5 full-URL images (Untitled-1-1, Vision-Serve-Alliance-3, National-Federation-of-the-Blind, Create-X-Georgia-Tech-3, CSUN-Assistive-Technology-Conference-1)

External ICAD/conference PDF links (about.md, events.md, magicmap-paloalto.md, sonification-awards-2024-application.md) - these are links to OTHER sites, not local images. Keep as-is.

### Part 2: WPForms Cleanup - DONE
Removed from about.md, contact.md, events.md, audiom-demo-form.md. _index.md was already clean (pure front matter).

### Part 3: Contact Form Rebuild - DONE
All 4 files rebuilt with Netlify Forms HTML. Hugo builds clean.

### Commits
1. c27bad8 - image rewrites
2. 409a435 - WPForms removal
3. 05aeb03 - form rebuilds

### Status: COMPLETE
Report written to reports/migration-cleanup.md.
