# Audiom Embed Template Optimization Report
**Date:** 2026-03-30

## Goal
Get audiom-embed pages under 5% pixel diff by fixing the shared template and CSS.

## Results Summary

**31+ pages under 5%** (from 9-50%+ starting range). 3 pages 5-10%. Remaining outliers are complex multi-section content pages with per-page WP spacer customizations.

## Changes Made

### Template (`themes/xrnav/layouts/audiom-embed/single.html`)
- Removed the `.Title` h1 heading that WP never displays
- Removed UAGB container wrapper (majority of WP pages don't use it)
- Added conditional layout variants via frontmatter:
  - `uagb_container: true` -- wraps in UAGB container (audiom-demo only)
  - `spacers: "full"` -- adds 100px spacing between all elements (lske, csun, tvm pages)

### CSS (`themes/xrnav/static/css/wordpress-compat.css`)
- Flat layout with flexbox column centering matching WP structure
- 115px top margin on h1 (matches WP's standard top spacer)
- h1 centered, 1200px max-width, 40px/800/56px font styling
- Paragraph at 742px max-width (matches WP's centered text)
- Full-width iframes for default variant
- 1326px constrained iframes for spaced variant
- h2 styling with 49px top margin
- Responsive 16:9 YouTube embed figure styling
- Audiom iframe wrapper for pages with constrained iframe width

### Content Files Modified
- `audiom-demo.md` -- added `uagb_container: true`
- `lske-map-{1,2,3,4}.md`, `csun.md`, `audiom-tvm-map-{1,2,3,4}.md` -- added `spacers: "full"`
- `audiom-covid-map.md`, `nasa-jpl-campus-map.md` -- wrapped YouTube in responsive figure, audiom in width-constraining div
- `audiom-wisconsin-geological-survey-quaternary-map.md` -- fixed multi-line iframe src that Hugo's markdown processor was mangling

## Scores by Category

### Under 5% (31+ pages)
Standard single-iframe embed pages: lske-map-1/2/3/4, csun, audiom-tvm-map-1/2/3/4, audiom-human-skeleton-diagram, audiom-bovine-manus-diagram, audiom-rat-dissection-diagram, audiom-sheep-brain-diagram, audiom-airplane-aa-747-seatmap, eclipse24, election2024, jernigan-institute, atia, nfb24, audiom-airbus-lopa-a320-200-diagram, audiom-airbus-lopa-a320-200-seat-map, audiom-mean-sea-level-rise-map-fall-2024, audiom-numbers, csun-exhibit-hall-map-2024, dif25, gavilan-gilroy, gavilan-hollister, ipst, mes24, ski-map, vsa25, vrate24, wcvi, audiom-create-x-demo-day-map-2024, audiom-sole-source-justification, tvm1

### 5-10% (3 pages)
- audiom-demo: 5.33% (container variant, heights match exactly)
- audiom-covid-map: 9.34% (YouTube embed + dynamic iframe content)
- nasa-jpl-campus-map: 10.84% (same issues)

### Still above 10% (8 pages -- complex content)
- events: 14.81% -- unique layout, no spacers, many blocks
- sonification-awards: 14.57% -- very long form page, 26 children
- peachability: 17.71% -- 18 children, no spacers, complex content
- rose-quarter: 18.75% -- 5 custom spacers with non-standard heights
- gatech: 22.66% -- dynamic map content causing iframe pixel diffs
- wisconsin: 25.42% -- dynamic ESRI content in iframe
- magicmap-paloalto: 41.52% -- multi-section page with images, h2/h3, lists
- audiom-demo-form: 49.58% -- form-based page, different type entirely
- table-vs-map-example: 44.26% -- table content page

## Key Discovery
WP audiom-embed pages have three distinct layout patterns:
1. **With UAGB container** (2 pages): 160px padding, 1200px inner width, row-gap 20px
2. **With spacer blocks** (majority): flat layout with wp-block-spacer divs for spacing. Spacer heights vary per page (115px top is most common).
3. **Complex content** (handful): multi-section pages with images, forms, tables -- not standard embed pattern

## Remaining Work
The 8 pages above 10% need per-page investigation. Most have either:
- Custom WP spacer heights that differ from the standard pattern
- Non-embed content (forms, tables, multi-section articles)
- Dynamic iframe content that renders differently between captures
