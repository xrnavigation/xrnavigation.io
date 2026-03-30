# WordPress Content Export Report

Date: 2026-03-30

## Export Summary

| Metric | Count |
|--------|-------|
| Pages exported | 79 |
| Posts exported | 11 |
| Audiom embed pages detected | 52 |
| Total files written | 90 |

## Method

Used `scripts/wp-export.js` — a Node.js script that:

1. Fetches all pages and posts from `https://xrnavigation.io/wp-json/wp/v2/` (paginated, no auth)
2. Converts HTML to Markdown via `turndown` with custom rules:
   - Iframes preserved as raw HTML (Hugo renders them)
   - Spectra wrapper divs (`wp-block-uagb-*`) stripped, content passed through
3. Extracts `audiom_id` from `audiom.net/embed/{id}` iframes into frontmatter
4. Writes pages to `content/{slug}.md`, posts to `content/blog/{slug}.md`, homepage to `content/_index.md`

## Audiom Embed Pages (52)

All pages containing an `audiom.net/embed/{id}` iframe received `layout: "audiom-embed"` and `audiom_id` in frontmatter. These are mostly map demo pages (seat maps, campus maps, COVID maps, geological maps, diagrams, etc.).

## Content That Needs Attention

- **`content/blog.md`** — WordPress blog listing page exported as a flat file. This conflicts with `content/blog/_index.md` (the Hugo section index). Should be deleted or merged into `_index.md`.
- **Homepage (`content/_index.md`)** — Complex page with many Spectra containers. Markdown conversion is structurally correct but the layout (hero, 3-step process, feature grid, team bios, logos) will need Hugo shortcodes or partial templates to look right.
- **Link formatting** — Some links converted with extra whitespace/newlines inside `[]()` due to Spectra block markup. Functional but not pretty.
- **Images** — Image URLs still point to `xrnavigation.io/wp-content/uploads/`. These need to be downloaded and paths rewritten in a separate media export step.
- **Forms** — WPForms shortcodes/blocks were stripped by the REST API (they don't appear in `content.rendered`). Contact and demo-request forms need to be rebuilt with a static form solution.
- **Able Player embed** — The homepage video player markup was partially converted. Needs manual attention for the Hugo template.

## Commit

```
44a9c52d0eedbe5988ba569aa71f46d66593c469
```
