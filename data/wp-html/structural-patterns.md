# WordPress Structural Patterns

Extracted: 2026-03-30
Source: Live WordPress site at xrnavigation.io
Theme: Astra + UAGB (Ultimate Addons for Gutenberg / Spectra)

## Page Shell

Every page follows this outer structure:

```
body.ast-hfb-header.ast-header-break-point (at mobile)
  div#page.hfb-header.ast-page-builder-template
    header#masthead.site-header
    div#content.site-content
      div.ast-container
        div#primary.content-area
          main#main.site-main
            article.ast-article-single
              div.entry-content.clear
                [UAGB container sections]
    footer#colophon.site-footer
```

## Header Structure

Two parallel headers exist — desktop and mobile. Only one is visible at a time (breakpoint: 921px).

### Desktop Header (`#ast-desktop-header`)

```
div#ast-desktop-header
  div.ast-main-header-wrap.main-header-bar-wrap
    div.ast-primary-header-bar.main-header-bar
      div.site-primary-header-wrap.ast-builder-grid-row-container.ast-container
        div.ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center
          div.site-header-primary-section-left.site-header-section.ast-flex
            [Logo: div.ast-builder-layout-element > div.site-branding.ast-site-identity]
          div.site-header-primary-section-right.ast-grid-right-section
            [Nav: div.ast-builder-menu-1 > div.ast-main-header-bar-alignment > nav#ast-hf-menu-1]
```

### Mobile Header (`#ast-mobile-header`)

```
div#ast-mobile-header.ast-mobile-header-wrap
  div.ast-main-header-wrap.main-header-bar-wrap
    div.ast-primary-header-bar.ast-builder-grid-row-layout-default
      div.ast-builder-grid-row
        div.site-header-primary-section-left  [Logo]
        div.site-header-primary-section-right  [Hamburger toggle]
  div.ast-mobile-header-content.content-align-flex-start
    div.ast-builder-menu-mobile
      nav#ast-mobile-site-navigation.site-navigation
        div.main-navigation
          ul#ast-hf-mobile-menu.main-header-menu.ast-menu-nesting-squish
```

## UAGB Container Pattern (Content Sections)

This is the core repeating pattern for ALL content on the site. Every section uses:

```
div.wp-block-uagb-container.uagb-block-{hash}.alignfull.uagb-is-root-container
  div.uagb-container-inner-blocks-wrap
    [content blocks inside]
```

Key observations:
- Root containers always have `.alignfull` and `.uagb-is-root-container`
- Each has a unique hash class like `uagb-block-450c520f`
- Per-block styles are in `inline-uagb-style-frontend-135.css`, keyed by hash
- Inner containers omit `.alignfull` and `.uagb-is-root-container`
- Custom classes like `Change-background`, `change-heading`, `white-bg` are used for theming

### Nesting pattern for content sections:

```
Root container (.alignfull.uagb-is-root-container)
  └── .uagb-container-inner-blocks-wrap
       └── Inner container (.wp-block-uagb-container.uagb-block-{hash})
            ├── Headings (h1-h3 with .wp-block-heading or .uagb-heading-text)
            ├── Paragraphs (p with Astra color classes)
            ├── UAGB blocks (info-box, buttons, image, etc.)
            └── More inner containers (nested layouts)
```

## UAGB Block Types Used

### Info Box (`.wp-block-uagb-info-box`)
```
div.wp-block-uagb-info-box.uagb-infobox__content-wrap.uagb-infobox-icon-above-title
  div.uagb-ifb-content
    div.uagb-ifb-icon-wrap
      [SVG icon]
    div.uagb-ifb-title-wrap
      h3/h4.uagb-ifb-title
    p.uagb-ifb-desc
```

### Buttons (`.wp-block-uagb-buttons`)
```
div.wp-block-uagb-buttons.uagb-buttons__outer-wrap
  div.uagb-buttons__wrap.uagb-buttons-layout-wrap
    div.wp-block-uagb-buttons-child.wp-block-button
      div.uagb-button__wrapper
        a.uagb-buttons-repeater.wp-block-button__link[role="button"]
          div.uagb-button__link
```

### Advanced Heading (`.wp-block-uagb-advanced-heading`)
```
div.wp-block-uagb-advanced-heading.uagb-block-{hash}
  h1/h2/h3.uagb-heading-text
  p.uagb-desc-text  (optional separator/description)
```

### Image (`.wp-block-uagb-image`)
```
div.wp-block-uagb-image.wp-block-uagb-image--layout-default
  figure.wp-block-uagb-image__figure
    img
```

## Blog Post Grid (`.wp-block-uagb-post-grid`)

```
div.wp-block-uagb-post-grid.uagb-post-grid.uagb-post__image-position-background
    .uagb-post__image-enabled.uagb-post__items
    .uagb-post__columns-3.is-grid
    .uagb-post__columns-tablet-2.uagb-post__columns-mobile-1
    .uagb-post__equal-height
  article.uagb-post__inner-wrap    [repeated per card]
    h3.uagb-post__title.uagb-post__text
      a[href]
    div.uagb-post__text.uagb-post-grid-byline
      [meta: author, date]
    div.uagb-post__text.uagb-post__excerpt
      [excerpt text]
```

Key classes for responsive columns:
- `.uagb-post__columns-3` = 3 columns desktop
- `.uagb-post__columns-tablet-2` = 2 columns tablet
- `.uagb-post__columns-mobile-1` = 1 column mobile
- `.uagb-post__image-position-background` = image as card background
- `.uagb-post__equal-height` = equal height cards
- `.custom-border-radius` = custom class for rounded corners

## Blog Post (Single) Structure

Blog posts use standard WordPress block markup, not UAGB containers:

```
article.post.type-post.has-post-thumbnail.ast-article-single
  div.ast-post-format-.single-layout-1
    div.entry-content.clear
      p, h2.wp-block-heading, h3.wp-block-heading
      ol.wp-block-list, ul.wp-block-list
      figure.wp-block-image, figure.wp-block-embed
```

No UAGB container wrapping. Headings use `#slug-id` anchors (e.g., `id="pros-and-cons"`).

## Audiom Demo Page Structure

Simple page with iframe embed:

```
div.wp-block-uagb-container.alignfull.uagb-is-root-container
  div.uagb-container-inner-blocks-wrap
    div.wp-block-uagb-advanced-heading
      h1.uagb-heading-text
    p   [description]
    iframe   [Audiom embed]
```

## Footer Structure

Three-tier footer using Astra Builder grid system:

### Above Footer (`.site-above-footer-wrap`)
- 2-column grid (`.ast-builder-grid-row-2-equal`)
- Column 1: Widget area with nav links + social
- Column 2: WPForms newsletter signup widget

### Primary Footer (`.site-primary-footer-wrap`)
- 4-column grid (`.ast-builder-grid-row-4-equal`)
- Column 1: Logo image (UAGB image block)
- Column 2: HTML widget (contact info)
- Column 3: HTML widget (more info)
- Column 4: Widget with heading + WPForms contact form

### Below Footer / Copyright (`.site-below-footer-wrap`)
- Full-width single column (`.ast-builder-grid-row-full`)
- Copyright text in `.ast-footer-copyright`

### Footer grid nesting pattern:
```
div.site-{above|primary|below}-footer-wrap.ast-builder-grid-row-container
  div.ast-builder-grid-row-container-inner
    div.ast-builder-footer-grid-columns.ast-builder-grid-row
      div.site-footer-{above|primary|below}-section-{N}.site-footer-section
        aside.footer-widget-area[role="region"][aria-label="Footer Widget N"]
          section.widget
```

## Astra Color Classes

Content uses Astra's global color utility classes:
- `.has-ast-global-color-0-color` = #15191d (near-black)
- `.has-ast-global-color-1-color` = #04203e (dark blue)
- `.has-ast-global-color-2-color` = #5a7969 (muted green)
- `.has-ast-global-color-4-color` = #f9fafb (off-white)
- `.has-ast-global-color-5-color` = #FFFFFF (white)
- `.has-text-color` = marks element as having explicit color
- `.has-link-color` = marks element as having explicit link color

## Custom CSS Classes (Site-Specific)

These classes appear throughout and are styled in wp-custom-css:
- `Change-background` / `change-background` = hero/banner sections with background images
- `change-heading` / `Change-heading` = modified heading styles
- `change-body` = modified body text styles
- `white-bg` = white background override
- `custom-border-radius` = custom border-radius on blog cards

## Responsive Visibility Classes

UAGB provides hide/show classes:
- `.uag-hide-tab` = hidden on tablet
- `.uag-hide-mob` = hidden on mobile
- `.uag-hide-desktop` = hidden on desktop
