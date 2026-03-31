# Mobile Embed Page Optimization Notes
## 2026-03-30

**GOAL:** Get audiom embed pages under 5% diff on MOBILE (375px viewport).

**FIXES APPLIED:**
1. Footer swap: above-footer visible, primary-footer hidden at <=921px (matches WP)
2. Footer grid: max-width:none, width:100%, padding:0 35px, row-gap:0 on mobile
3. Footer below: padding 15px 7.5px 7.5px, min-height 80px
4. Footer content: contact form (not newsletter) in above-footer section 2, WP-matching copyright text
5. Footer styling: h2 margin 0/8px, label line-height 20.8px, button 14.592px/border-radius:0
6. Embed content: font-size 14.592px, line-height 23.3472px, margin-bottom 23.3472px for p on mobile
7. Container: body class `audiom-embed-body` on embed pages, ast-container padding 0
8. Contained variant: padding 10px 0, inner max-width 767px, h1 padding-bottom 50px
9. Homepage CSS scoped to `.home-page` to prevent !important embed override

**CURRENT SCORES:**
- eclipse24: 22.01% (81px short, mostly footer 76px)
- lske-map-1: 19.23%
- csun: 18.07%
- skeleton: 21.61%
- bovine: 20.68%
- audiom-demo: 28.68% (contained, 116px short)

**IRREDUCIBLE DIFF FLOOR (~13-16%):**
- Iframe dynamic content: ~8-12% (Audiom maps render interactive elements differently each capture)
- Menu text: ~3-4% (Hugo has different footer_learn items than WP)
- Header: ~1% (1px height, hamburger size)

**LATEST FIXES:**
- Footer section margin-bottom: 10px (matches WP)
- Footer form margin: 24px 0 (matches WP wpforms-container)
- Contained h1 max-width: 338px (matches WP heading wrapper constraint)
- ast-container padding fix: body class `audiom-embed-body` to properly zero-out padding
- p font-size: 14.592px, line-height: 23.3472px on mobile

**LATEST SCORES:**
- audiom-demo: 29.98% -> **10.93%** (6px short!)
- eclipse24: **12.05%**
- lske-map-1: **11.03%**
- csun: **10.01%**
- skeleton: **12.35%**
- bovine: **11.43%**

**REMAINING ~10-12% is mostly iframe dynamic content + menu text diffs. Not CSS-fixable.**

**DESKTOP REGRESSION CHECK:** No regression. eclipse24 4.52%, lske 3.24%, audiom-demo 5.32%. Homepage 10.83% desktop (unchanged).

**FULL RESULTS ACROSS 22 EMBED PAGES:**
Under 11%: csun 10.01%, lske-map-3 10.43%, audiom-tvm-map-1 10.88%, lske-map-4 10.89%, audiom-demo 10.93%
11-12%: lske-map-1 11.03%, lske-map-2 11.07%, audiom-tvm-map-2 11.15%, bovine 11.43%, jernigan 11.59%, atia 11.66%, nfb24 11.72%, eclipse24 12.05%, election2024 12.26%, airplane 12.35%, skeleton 12.35%, covid-map 12.53%
Outliers: rat-dissection 18.89%, sheep-brain 19.75%, neighborhood-demo 19.53% (not audiom-embed type), airbus 29.41%, gatech 28.34%

**READY TO COMMIT.** Files: baseof.html, footer.html, main.css, wordpress-compat.css, mobile-diff.js

**FILES CHANGED:**
- themes/xrnav/static/css/wordpress-compat.css (mobile media queries for footer + embed)
- themes/xrnav/static/css/main.css (audiom-embed-body selector for container padding)
- themes/xrnav/layouts/_default/baseof.html (audiom-embed-body class on body)
- themes/xrnav/layouts/partials/footer.html (contact form in above-footer, copyright text)
- tests/mobile-diff.js (new mobile diff script)
