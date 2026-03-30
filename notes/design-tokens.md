# Design Tokens — xrnavigation.io
Date: 2026-03-30

## Color Palette (Astra Global Colors)
```
--ast-global-color-0: #15191d  (dark text / near-black)
--ast-global-color-1: #04203e  (dark blue — headings, strong text)
--ast-global-color-2: #5a7969  (muted green — accent/brand)
--ast-global-color-3: #000000  (black)
--ast-global-color-4: #f9fafb  (off-white — body bg)
--ast-global-color-5: #FFFFFF  (white)
--ast-global-color-6: #e2e8f0  (light gray — borders)
--ast-global-color-7: #cbd5e1  (medium gray)
--ast-global-color-8: #94a3b8  (gray — muted text)
```

## Typography
- **Body**: Lato, sans-serif — 16px — black (#000)
- **Headings**: Montserrat, sans-serif — H1: 40px, weight 800
- **Nav**: Lato, sans-serif — 16px

## Layout
- Body background: #f9fafb (off-white)
- Header background: transparent (overlays hero)
- Footer background: transparent
- Footer text: black

## Theme Switching CSS Custom Properties (from snippet #1943)
```css
:root {
    --primary-color: #5a5a5a;
    --secondary-color: #fff;
    --accent-color: #007bff;
    --background-color: #f8f9fa;
}

[data-color-mode="dark"] {
    --primary-color: #cccccc;
    --secondary-color: #333333;
    --accent-color: #1a73e8;
    --background-color: #222222;
}
```

## Dark Mode (.bw-theme class)
- Background: #000
- Text: #fff
- Images: grayscale(100%)
- Links: #fff

## High Contrast Mode (.hc-theme class)
- Background: #000
- Text: #0000FF (blue)
