# Task: Integrate Able Player for Accessible Video

## Goal
Replace the standard HTML5 `<video>` on the homepage with Able Player — the accessible media player that was used on the WordPress site. The WP site loaded it via the Able Player WordPress plugin + a jQuery init snippet.

## What Able Player Is
Able Player (https://ableplayer.github.io/ableplayer/) is an open-source, fully accessible HTML5 media player. It supports:
- Keyboard navigation
- Screen reader compatibility
- Captions/subtitles
- Audio description
- Multiple media source switching (the WP site had ASL+Audio Description and ASL-Only variants)

## Steps

### 1. Download Able Player
- Go to https://github.com/ableplayer/ableplayer/releases and find the latest release
- Download the built files needed: `ableplayer.min.js`, `ableplayer.min.css`, and the `images/` folder that Able Player uses for its UI icons
- Place them in `themes/xrnav/static/vendor/ableplayer/`
- Also need jQuery (Able Player depends on it). Download jQuery 3.x minified to `themes/xrnav/static/vendor/jquery.min.js`

If direct download is difficult, use npm:
```bash
npm install ableplayer jquery
```
Then copy the needed files from node_modules into the vendor directory.

### 2. Load Able Player in the Homepage Template
Edit `layouts/index.html` (or `layouts/partials/head.html` conditionally) to load:
- jQuery (before Able Player)
- `ableplayer.min.css` in `<head>`
- `ableplayer.min.js` before `</body>`

Only load these on pages that need them (homepage). Use a Hugo conditional:
```go
{{ if .IsHome }}
  <link rel="stylesheet" href="/vendor/ableplayer/ableplayer.min.css">
{{ end }}
```

### 3. Update the Video Element
The current `<video>` in `layouts/index.html` needs Able Player's data attributes. Replace it with:
```html
<video id="audiom-intro" data-able-player preload="metadata">
  <source src="/images/Intro-to-Audiom-ASL-and-Audio-Description.mp4" type="video/mp4" data-desc-src="/images/Intro-to-Audiom-ASL-and-Audio-Description.mp4">
  <source src="/images/Intro-to-Audiom-ASL-Only.mp4" type="video/mp4">
  <track kind="captions" src="/images/Intro-to-Audiom-V3-Captions.vtt" srclang="en" label="English Captions">
</video>
```

Key Able Player attributes:
- `data-able-player` — activates Able Player on this element
- Able Player auto-initializes when it finds `[data-able-player]` elements

Check the WP site's setup snippet (from the audit): the WP site used `$('video, audio').ablePlayer()` jQuery init. With the `data-able-player` attribute, explicit init may not be needed — check Able Player docs.

### 4. Verify
- Run `hugo server` and check the homepage loads with Able Player UI
- The player should show transport controls, caption toggle, and be keyboard-navigable

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- `git add themes/xrnav/static/vendor/ layouts/index.html`
- If you modified head.html: `git add themes/xrnav/layouts/partials/head.html`
- `git commit -m "Integrate Able Player for accessible homepage video"`
- Include commit hash in report

## Report
Write your report to `reports/migration-able-player.md` with:
- What was downloaded and where
- How it's loaded (conditionally on homepage only)
- Video element changes
- Hugo build verification
- Commit hash
