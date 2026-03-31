# Fix: Able Player Headless Rendering and Iframe Sizing

Date: 2026-03-30

## Investigation Summary

Investigated whether Able Player renders in Playwright headless screenshots of the Hugo homepage. Ran Playwright diagnostics against both `http://localhost:1314/` (Hugo) and `https://xrnavigation.io/` (live WP).

### Finding: Able Player DOES Render in Headless

Contrary to the initial report, Able Player initializes and renders correctly in headless Chromium. Both Hugo and WP show:
- jQuery loaded (v3.7.1)
- AblePlayer constructor defined
- `.able-wrapper` and `.able-controller` present in DOM
- 11 SVG button icons in the controller bar
- Video player UI visible in screenshots

The player was rendering all along. The visual appearance matches between Hugo and WP.

## Bugs Found and Fixed

### 1. Able Player Translation 404s

**Problem:** Able Player auto-detects its `rootPath` by finding its script tag URL, then going up one directory. Script at `/vendor/ableplayer/ableplayer.min.js` yields rootPath `/vendor/`. It then looks for `/vendor/translations/en.json` -- which didn't exist, causing 404s for all 20 language files.

**Fix:**
- Added `data-root-path="/vendor/ableplayer/"` to the video element in `layouts/index.html`
- Downloaded all 20 translation JSON files from the live WP site to `themes/xrnav/static/vendor/ableplayer/translations/`

### 2. audiom-embed Layout Not Resolving (Hugo v0.156)

**Problem:** 51 content files had `layout: "audiom-embed"` in front matter, with the layout at `themes/xrnav/layouts/page/audiom-embed.html`. Hugo v0.156 reported this template as unused -- all pages fell through to `_default/single.html`. This caused iframes to render full-width (1920px) instead of being constrained by the audiom-embed layout's container.

**Fix:**
- Changed all 51 content files from `layout: "audiom-embed"` to `type: "audiom-embed"`
- Moved template to `themes/xrnav/layouts/audiom-embed/single.html`
- Hugo now correctly resolves the layout (verified via class="audiom-embed-page" in rendered output)

### 3. Iframe Height Collapsed to 150px

**Problem:** CSS rule in `wordpress-compat.css` line 1271 set `.audiom-embed-page iframe { height: auto; }`, overriding the HTML `height="560"` attribute. Cross-origin iframes can't communicate their content height, so the browser defaulted to 150px.

**Fix:** Changed `height: auto` to `min-height: 560px`.

### 4. Duplicate Iframes on Embed Pages

**Problem:** The audiom-embed layout template rendered an iframe from `audiom_id` front matter, AND the markdown content already contained an inline iframe from the WP migration. Every page had two identical audiom.net iframes.

**Fix:** Removed the `audiom_id` iframe block from the layout template since all 51 content files already have the iframe inline.

## Verification

| Check | Before | After |
|-------|--------|-------|
| Able Player init | Working | Working (no change needed) |
| Translation 404s | 20 failed requests | 0 |
| audiom-embed layout | Not resolving (used single.html) | Resolving correctly |
| Iframe width | 1920px (full viewport) | 1136px (container-constrained) |
| Iframe height | 150px (collapsed) | 560px (correct) |
| Iframe count per page | 2 (duplicate) | 1 |
| Hugo build | Clean | Clean (0 errors, 0 warnings) |

## Files Changed

- `layouts/index.html` -- added data-root-path to video element
- `themes/xrnav/static/vendor/ableplayer/translations/*.json` -- 20 new translation files
- `themes/xrnav/layouts/audiom-embed/single.html` -- moved from page/, removed duplicate iframe
- `themes/xrnav/layouts/page/audiom-embed.html` -- deleted (moved)
- `themes/xrnav/static/css/wordpress-compat.css` -- fixed iframe height rule
- 51 content files -- changed `layout:` to `type:` in front matter
