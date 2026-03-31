# Task: Fix Typography and Spacing to Match WordPress

## Problem
Cumulative differences in font-size, line-height, margins, and padding cause height mismatches on nearly every page. Most pages differ by 5-15% in total height.

## What to Do

### 1. Audit current CSS vs spec
Read `data/wp-css-spec.md` for the exact values. Then read `themes/xrnav/static/css/wordpress-compat.css` and `themes/xrnav/static/css/main.css` to check if they match.

Key values that must be exact:
- body: Lato 16px, line-height 25.6px (1.6), color #000
- h1: Montserrat 40px/800, line-height 56px, margin-bottom 20px
- h2: Montserrat 40px/700, line-height 50px, color #04203e, margin-bottom 20px
- h3: Montserrat 24px/600, line-height 31.2px, color #04203e, margin-bottom 16px
- p: 16px, line-height 24px (homepage) or 25.6px (pages), margin-bottom 16px or 25.6px
- Responsive: h1→30px, h2→25px, h3→20px at <=921px

### 2. Check Astra's base stylesheet
Read `data/wp-css/astra-theme-css.css` for Astra's default margin/padding rules on headings, paragraphs, lists, and other block-level elements. These are the rules that create the spacing rhythm.

### 3. Check UAGB block spacing
Read `data/wp-css/uagb-blocks-common-frontend.css` for UAGB-specific spacing on containers, headings, and paragraphs.

### 4. Fix the CSS
Update `themes/xrnav/static/css/wordpress-compat.css` to match every typography and spacing value from the WP CSS files. Pay special attention to:
- margin-top and margin-bottom on headings (Astra often resets margin-top to 0)
- padding on UAGB containers (the per-block styles in inline-uagb-style use specific padding per section)
- list item spacing
- blockquote styling
- figure/figcaption margins

### 5. Verify
Run `hugo` to confirm build. Compare a few page heights between baseline and current screenshots if possible.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
- Commit with descriptive message
- Include commit hash in report

## Report
Write to `reports/migration-fix-typography.md`
