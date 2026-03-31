# WordPress Computed CSS Specification

Extracted: 2026-03-30
Source: https://xrnavigation.io/ (live WordPress site)
Theme: Astra + UAGB (Ultimate Addons for Gutenberg)

## CSS Custom Properties (Astra Global Colors)

| Variable | Value | Usage |
|---|---|---|
| `--ast-global-color-0` | `#15191d` | Dark text, near-black, below-footer bg |
| `--ast-global-color-1` | `#04203e` | Dark blue - headings, nav links, primary footer bg |
| `--ast-global-color-2` | `#5a7969` | Muted green - accent/brand |
| `--ast-global-color-3` | `#000000` | Black |
| `--ast-global-color-4` | `#f9fafb` | Off-white - body background |
| `--ast-global-color-5` | `#FFFFFF` | White |
| `--ast-global-color-6` | `#e2e8f0` | Light gray - borders |
| `--ast-global-color-7` | `#cbd5e1` | Medium gray |
| `--ast-global-color-8` | `#94a3b8` | Gray - muted text |

## Responsive Breakpoints

| Name | Rule | Behavior |
|---|---|---|
| Desktop | `min-width: 922px` | Full nav, desktop header |
| Tablet | `max-width: 921px` | Hamburger menu, desktop header hidden |
| Mobile | `max-width: 544px` | Further font-size reductions |
| UAGB | `max-width: 768px` | UAGB-specific responsive adjustments |

## Typography

### Desktop (>922px)

| Element | Font | Size | Weight | Line-Height | Color |
|---|---|---|---|---|---|
| body | Lato, sans-serif | 16px | 400 | 25.6px | #000000 |
| h1 | Montserrat, sans-serif | 40px | 800 | 56px | context-dependent |
| h2 | Montserrat, sans-serif | 40px | 700 | 50px | #04203e |
| h3 | Montserrat, sans-serif | 24px | 600 | 31.2px | #04203e |
| p | Lato, sans-serif | 16px | 400 | 24px | #777 (homepage) / #000 (pages) |
| nav links | Lato, sans-serif | 16px | 700 | - | #04203e |

### Tablet/Mobile (<=921px)

| Element | Size |
|---|---|
| h1 | 30px |
| h2 | 25px |
| h3 | 20px |
| p | 16px (unchanged) |

### Margins

- h1: margin-bottom 20px
- h2: margin-bottom 20px
- h3: margin-bottom 16px
- p: margin-bottom 16px (homepage) / 25.6px (standard pages)

## Header

- Height: 80px
- Background: transparent (overlays hero/content)
- Position: static
- No border-bottom

### Logo
- Width: 83px, Height: 47px

### Nav Links
- font-family: Lato, sans-serif
- font-size: 16px
- font-weight: 700
- color: #04203e
- text-transform: capitalize
- letter-spacing: 0.3px
- padding: 0px 16px (between items)

### Mobile Nav
- Hamburger appears at 921px (Astra Builder breakpoint)
- Desktop header (`#ast-desktop-header`) hides at max-width: 921.9px
- Mobile header (`#ast-mobile-header`) hides at min-width: 922px

## Body / Background

- background-color: #f9fafb (off-white)
- font-family: Lato, sans-serif
- font-size: 16px
- line-height: 25.6px (1.6)
- color: #000

## Content Layout

Pages use full-width UAGB container blocks. There is no single max-width content wrapper. Each section constrains its inner blocks via percentage-based max-width.

Common inner max-widths:
- 70% (~1330px at 1920 viewport) - most content sections
- 80% (~1536px at 1920 viewport) - hero, feature sections
- min(100%, 1200px) - constrained sections

## Homepage Sections (10 UAGB containers)

| # | Padding Top | Padding Bottom | Inner Max-Width | Background |
|---|---|---|---|---|
| 0 (hero) | 152px | 152px | 80% | bg image |
| 1 | 10px | 10px | 70% | transparent |
| 2 | 104px | 160px | 70% | transparent |
| 3 | 0px | 100px | 70% | transparent |
| 4 | 10px | 10px | 80% | transparent |
| 5 | 100px | 100px | min(100%, 1200px) | #f9fafb |
| 6 | 85px | 85px | 70% | transparent |
| 7 | 50px | 200px | 70% | transparent |
| 8 | 10px | 10px | 70% | transparent |
| 9 | 10px | 0px | min(100%, 1200px) | transparent |

## Footer

### Primary Footer
- background-color: #04203e (dark blue)
- padding: 45px 95.25px
- Grid: 2 columns (repeat(2, 1fr)), gap 50px

### Footer Headings
- font-family: Montserrat, sans-serif
- font-size: 24px
- font-weight: 800
- color: #fff

### Footer Links
- font-size: 16px
- color: #fff
- text-decoration: none

### Footer Form
- Input: padding 6px 10px, border-radius 2px, border 1px solid #ccc, height 38px
- Button: bg #eee, color #333, padding 10px 15px, font-weight 800

### Below Footer (Copyright)
- background-color: #15191d
- padding: 10px 0 0
- grid: single column 1200px

## Blog (UAGB Post Grid)

### Grid Layout
- display: grid
- grid-template-columns: 380px 380px 380px (3 columns)
- gap: 30px
- 11 cards visible

### Blog Card
- padding: 30px 40px 10px
- box-shadow: rgba(0,0,0,0.44) 10px 10px 20px -8px
- border-radius: 10px
- background-color: #f6f6f6
- No border

### Card Title
- font-family: Montserrat, sans-serif
- font-size: 20px
- font-weight: 800
- color: #f9fafb

### Card Excerpt
- font-size: 16px
- color: #f9fafb
- line-height: 24px

### Card Image
- Container height: 261px
- overflow: hidden
- Object-fit: cover (inferred)

### Card Meta
- font-size: 14px
- color: #fff

## Audiom Embed Page

- Page title: Montserrat 40px/800, color #04203e
- Wrapper section: padding 160px top/bottom
- Inner max-width: min(100%, 1200px)
- iframe: auto width/height, no border, max-width 100%

## Standard Pages (/about/)

- Page title: Montserrat 40px/800, line-height 56px, color #f9fafb (on dark bg)
- Inner content widths: 55%, 70%, min(100%, 1200px)
- Images: border-radius 20px, max-width 100%
- Paragraph: 16px, line-height 25.6px, color #000, margin-bottom 25.6px

## Buttons (CTA)

### Primary Button
- background: #f9fafb
- color: #15191d
- padding: 15px 20px
- border-radius: 4px
- font: Montserrat 16px/600
- border: 1px solid #04203e
- text-transform: capitalize
- letter-spacing: 0.3px

### Secondary Button
- background: #fff
- color: #04203e
- padding: 15px 20px
- border-radius: 4px
- font: Montserrat 16px/700
- border: 1px solid #333
- text-transform: capitalize
