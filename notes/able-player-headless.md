# Able Player Headless Investigation
Date: 2026-03-30

## State: In Progress

## Key Finding: Able Player DOES render in headless
- Both Hugo and WP show .able-player, .able-wrapper, controller with 11 SVG buttons
- Screenshots confirm video player UI is visible in both headless screenshots
- The original claim "doesn't render" may have been from an earlier state or different test

## Issues Found
1. **Missing translations**: Able Player rootPath = `/vendor/` so it looks for `/vendor/translations/en.json` -> 404. WP has these at `/wp-content/plugins/ableplayer/translations/`. Need to copy translations dir.
2. **Missing images**: Two DALL-E use case images 404 on Hugo (not related to Able Player)
3. **Video files 404**: The MP4s at `/images/*.mp4` aren't served (net::ERR_ABORTED) - likely large files not in repo

## Fixes Applied
1. Added `data-root-path="/vendor/ableplayer/"` to video element in layouts/index.html
2. Downloaded en.json + 19 other translation files to themes/xrnav/static/vendor/ableplayer/translations/
3. All Able Player 404s now resolved

## Remaining 404s (not Able Player)
- Two DALL-E use case images (missing media)
- MP4 video files (large, not in repo)

## Iframe Sizing Issue Found
- Hugo iframes: 1920px wide (full viewport width)
- WP iframes: 1200px wide (constrained by uagb-container-inner-blocks-wrap max-width)
- Height same: 560px on both
- Root cause: Hugo `.entry-content` has no max-width; WP wraps content in 1200px container
- audiom-embed layout exists at themes/xrnav/layouts/page/audiom-embed.html but is NOT being used
- Pages like audiom-demo.md have `layout: "audiom-embed"` in front matter but render with `_default/single.html` (class="page-content-wrap" not "audiom-embed-page")
- The audiom-embed layout has `uagb-container-inner-blocks-wrap` wrapper but since it's not loaded, content goes full-width
- Need to fix: either fix layout resolution or add max-width to entry-content/single page containers

## audiom-embed Layout Not Resolving
- Hugo v0.156 reports both page/audiom-embed.html and _default/audiom-embed.html as UNUSED
- `layout: "audiom-embed"` in front matter is not being picked up
- All 74 pages use `_default/single.html` instead
- This is a pre-existing issue, not caused by my changes
- The fix: either rename the layout or use `type` instead of `layout` in front matter

## Layout Fix Applied
- Root cause: Hugo v0.156 treats `layout:` frontmatter differently. `layout: "audiom-embed"` was not resolving.
- Fix: changed all 51 content files from `layout: "audiom-embed"` to `type: "audiom-embed"`, moved template to `layouts/audiom-embed/single.html`
- Layout now resolves correctly (class="audiom-embed-page" confirmed in output)

## Iframe Width Fixed, Height Issue Found
- Width now 1136px (container-constrained) vs 1920px before - GOOD
- But height renders as 150px instead of 560px despite height="560" attribute being present
- This affects BOTH iframes on the page (the one from markdown content AND the one from audiom_id)
- WP renders the same height="560" attribute correctly at 560px
- There are duplicate iframes: one from .Content (markdown) and one from audiom_id template - need to fix that too
- CSS must be overriding the height attribute somehow

## All Fixes Applied and Verified
1. Able Player translations: downloaded 20 JSON files to vendor/ableplayer/translations/, added data-root-path
2. Layout resolution: changed 51 content files from `layout:` to `type:` frontmatter, moved template to layouts/audiom-embed/single.html
3. iframe height: CSS rule `height: auto` in wordpress-compat.css was overriding height="560" attr -> changed to `min-height: 560px`
4. Duplicate iframes: removed template's audiom_id iframe block since all content files have inline iframes

## Verification
- Homepage: Able Player renders with jQuery loaded, .able-wrapper present, 11 SVG buttons in controller
- audiom-demo: 1 iframe at 1136x560px (was 1920x150 before)
- No Able Player 404s remain
- Diagnostic scripts cleaned up

## Next
- Remove empty page/ directory
- Write report, commit
