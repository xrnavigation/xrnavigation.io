# Able Player Integration Report
Date: 2026-03-30

## What Was Downloaded

- **Able Player v4.8.0** from GitHub release tarball (`ableplayer/ableplayer` tag `v4.8.0`)
  - `ableplayer.min.js` and `ableplayer.min.css` (built files from `build/`)
  - `button-icons/` directory (black, white, fonts — fallback for non-SVG mode)
  - Placed in: `themes/xrnav/static/vendor/ableplayer/`
- **jQuery 3.7.1 Slim** from `code.jquery.com` (70KB minified)
  - Placed in: `themes/xrnav/static/vendor/jquery.slim.min.js`
  - Able Player v4.8.0 reduced its dependency to jQuery Slim (no AJAX/effects needed)

Note: `ableplayer` is not published to npm. Downloaded from GitHub release tarball directly.

## How It Loads (Homepage Only)

**CSS** — `themes/xrnav/layouts/partials/head.html`:
```go
{{ if .IsHome }}
<link rel="stylesheet" href="{{ "vendor/ableplayer/ableplayer.min.css" | relURL }}">
{{ end }}
```

**JS** — `themes/xrnav/layouts/_default/baseof.html` (before `</body>`):
```go
{{ if .IsHome }}
<script src="{{ "vendor/jquery.slim.min.js" | relURL }}"></script>
<script src="{{ "vendor/ableplayer/ableplayer.min.js" | relURL }}"></script>
{{ end }}
```

jQuery loads before Able Player as required. Both gated behind `{{ if .IsHome }}` so non-homepage pages pay zero cost.

## Video Element Changes

In `layouts/index.html`, the `<video>` was updated from:
```html
<video controls preload="metadata">
```
to:
```html
<video id="audiom-intro" data-able-player preload="metadata">
```

Key changes:
- Added `id="audiom-intro"` for addressability
- Added `data-able-player` attribute — Able Player auto-initializes on elements with this attribute
- Removed `controls` — Able Player provides its own accessible transport controls
- Added `data-label` on each `<source>` so Able Player can present source-switching UI
- Removed fallback text (Able Player handles its own fallback)

Able Player defaults to SVG icons (`iconType = 'svg'`) and auto-detects `rootPath` from the script tag's `src` attribute. No additional configuration needed.

## Hugo Build Verification

```
hugo v0.156.0 — 98 pages, 257 static files, 0 errors, built in 1898ms
```

## Commit

`141f1ac` — "Integrate Able Player v4.8.0 for accessible homepage video"

## Files Modified

- `layouts/index.html` — video element updated with Able Player attributes
- `themes/xrnav/layouts/partials/head.html` — conditional Able Player CSS
- `themes/xrnav/layouts/_default/baseof.html` — conditional jQuery + Able Player JS
- `themes/xrnav/static/vendor/ableplayer/` — new: Able Player v4.8.0 assets
- `themes/xrnav/static/vendor/jquery.slim.min.js` — new: jQuery 3.7.1 Slim
