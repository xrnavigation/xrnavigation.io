# WP Asset Extraction Notes
Date: 2026-03-30

## Status: IN PROGRESS

## What I know
- 23 external stylesheets on homepage, from 3 hosts: xrnavigation.io, fonts.googleapis.com, s0.wp.com
- 20 inline style blocks, biggest: uagb-style-frontend-135 (260,794 chars), astra-theme-css-inline-css (66,670), global-styles-inline-css (14,627), wp-custom-css (14,607)

## Downloaded so far (to data/wp-css/)
- astra-main.min.css (45,731 bytes) - Astra theme main
- uagb-custom-style-blocks.css (263,096 bytes) - UAGB generated block styles
- wpforms-full.min.css (115,596 bytes) - WPForms
- spectra-pro-style-blocks.css (via WebFetch) - Spectra Pro login/register/instagram
- ableplayer.min.css (via WebFetch) - Able Player
- ableplayer-media.css (via WebFetch) - tiny, just removes playlist borders
- auth0-main.css (via WebFetch) - Auth0 login widget
- content-control-block-editor.css (via WebFetch) - content control visibility
- spectra-block-positioning.min.css (via WebFetch) - tiny, just sticky positioning

## CSS Extraction: COMPLETE
All 29 CSS files saved to data/wp-css/ (978.6 KB total).

### External stylesheets downloaded via curl:
- astra-main.min.css (45,731) - Astra theme base
- astra-local-fonts.css (14,994) - @font-face declarations
- uagb-custom-style-blocks.css (263,096) - UAGB block type styles
- spectra-pro-style-blocks.css (44,426) - Spectra Pro components
- spectra-block-positioning.min.css (335) - UAGB sticky positioning
- ableplayer.min.css (23,050) - Able Player media player
- ableplayer-media.css (59) - tiny playlist override
- wpforms-full.min.css (115,596) - WPForms
- auth0-main.css (468) - Auth0 login
- content-control-block-editor.css (1,776) - Content control
- dashicons.min.css (59,004) - WP dashicons icon font

### Inline styles extracted via curl + Python (scripts/extract-inline-styles.py):
- inline-astra-theme-css-inline-css.css (66,548) - CRITICAL: Astra generated theme
- inline-uagb-style-frontend-135.css (260,794) - CRITICAL: per-page UAGB block styles
- inline-global-styles-inline-css.css (14,627) - WP theme.json output
- inline-wp-custom-css.css (14,607) - WP Customizer CSS
- inline-wp-block-library-inline-css.css (3,553) - Block library
- inline-wp-block-heading-inline-css.css (1,249) - Heading block
- inline-wp-block-paragraph-inline-css.css (741) - Paragraph block
- Plus 6 smaller inline blocks

### Skipped (admin-only or irrelevant):
- admin-bar CSS, Google Analytics CSS, Rank Math SEO, Yoast SEO, WP.com CSS

## Still need: HTML structure capture
- Homepage header/content/footer
- /about/ page structure
- /blog/ post grid
- /audiom-demo/ iframe embed
- /how-to-make-detailed-map-text-descriptions/ blog post

## Next steps
1. Download remaining relevant external CSS via curl
2. Extract inline styles via Chrome JS (chunked for large ones)
3. Navigate to each page and capture HTML structure
4. Write structural-patterns.md summary
