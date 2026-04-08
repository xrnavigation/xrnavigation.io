# Research: Hugo Raw HTML / WP-rendered content approaches

Date: 2026-04-08

## Context

The site currently hand-recreates WordPress's UAGB/Astra HTML structure inside Hugo templates (single.html has 225 lines of WP-mimicking markup, branching on `type` for each page variant). Content .md files use front matter params fed into these templates. A proof-of-concept exists in `data/wp-rendered/corporate-campuses.html` -- an extracted WP body fragment with its companion `.css`.

## 1. Hugo raw HTML content files

**Yes, Hugo natively supports .html content files.** Put front matter at the top (even empty `---\n---`), and Hugo treats the file as content, applying the matching layout template just like .md files. The body HTML lands in `{{ .Content }}`.

- File extensions: `.html`, `.htm`
- The HTML is NOT processed through Goldmark/Markdown -- it passes through as-is
- Templates (baseof.html, single.html) wrap it normally
- `markup.goldmark.renderer.unsafe = true` is already set in this project's hugo.toml, but that only matters for HTML inside .md files; .html content files don't go through Goldmark at all

**Gotcha (Hugo >= v0.123.0):** HTML files with front matter are always treated as content files. HTML files without front matter are copied as static files. This is a hard rule with no override.

**Gotcha:** Hugo does NOT process Go template syntax (`{{ }}`) inside content files. Content is data, not a template. So you cannot use `relURL`, `partial`, etc. inside the HTML body of a content file. This is fine for our use case -- WP rendered HTML has no Hugo template calls.

## 2. Hugo passthrough template

A minimal template that just outputs `{{ .Content }}` works perfectly:

```html
{{ define "main" }}
{{ .Content }}
{{ end }}
```

If the content IS the WP HTML fragment, this outputs it verbatim inside baseof.html's `<main>` tag. The existing baseof.html already provides Astra-compatible wrapper divs (`#page > #content > .ast-container > #primary > main#main`), so WP body fragments that start at the `entry-content` or root container level would slot in correctly.

A dedicated layout type (e.g., `type: wp-rendered`) with a passthrough template would cleanly separate these pages from the hand-built ones.

## 3. Capturing WordPress rendered HTML per-page

**Approach:** Use Puppeteer/Playwright to load each WP page, extract innerHTML of the content area, save as HTML fragment.

Concrete script pattern:
```js
const html = await page.evaluate(() => {
  const main = document.querySelector('main#main') 
    || document.querySelector('.entry-content');
  return main ? main.innerHTML : document.body.innerHTML;
});
```

Key decisions:
- **Where to cut:** Extract from `<main>` (includes article wrapper) or from `.entry-content` (just the block content). Given baseof.html already provides `<main>`, extracting `.entry-content` innerHTML is cleanest.
- **Wait strategy:** `waitUntil: 'networkidle2'` to ensure UAGB blocks render.
- **Image URLs:** Will contain absolute WP URLs. Need post-processing to rewrite to Hugo static paths.
- **The project already has a proof-of-concept:** `data/wp-rendered/corporate-campuses.html` contains exactly this kind of extracted fragment.

Tools that exist for WP content extraction:
- Puppeteer / Playwright (full render, captures JS-generated content)
- wget/curl + cheerio (fast, but misses JS-rendered blocks)
- wp-cli `wp post list --format=json` (gets stored HTML, not rendered)

Puppeteer/Playwright is the right choice because UAGB blocks may include client-side rendering.

## 4. CSS scoping

WP generates CSS in three layers:
1. **Theme CSS** (Astra) -- already largely replicated in `wordpress-compat.css`
2. **Plugin global CSS** (UAGB/Spectra) -- shared across pages
3. **Per-block inline/generated CSS** -- unique block IDs like `uagb-block-450c520f`

The per-block CSS is the problem. Each page generates unique block-ID styles. The `corporate-campuses.css` file in `data/wp-rendered/` demonstrates this -- it's large and full of unique selectors.

**Extraction approach:**
- Capture computed styles per page via Puppeteer: `page.evaluate(() => [...document.styleSheets].map(s => [...s.cssRules].map(r => r.cssText)))`
- Or capture all `<style>` tags from the page head
- Then run PurgeCSS against the extracted HTML fragment to strip unused rules

**PurgeCSS** is the right tool: `purgecss --css extracted.css --content page.html --output purged.css`. It can reduce WP's bloated CSS to only the rules actually used on that page.

**Serving strategy options:**
- Per-page CSS file loaded via front matter param: `css: "/css/wp/corporate-campuses.css"`
- Inline `<style>` block injected via head partial when front matter specifies it
- Single merged CSS file for all WP-rendered pages (simpler, slightly larger)

The inline `<style>` approach is cleanest for per-page CSS since it avoids extra HTTP requests and guarantees the right styles load for each page.

## 5. The "static HTML with Hugo wrapper" pattern

This is not a widely documented pattern by name, but it is effectively what Hugo does when you:
1. Put HTML content files with front matter in `/content/`
2. Use a passthrough template (`{{ .Content }}`)
3. Let baseof.html provide header/footer/nav

This is architecturally identical to how many CMS-to-static migrations work. Hugo's own docs describe HTML as a supported content format. The pattern is simple and well-supported.

**Advantages over the current approach (hand-rebuilt WP markup in Hugo templates):**
- Pixel-perfect by definition -- it IS the WP output
- No painstaking reverse-engineering of UAGB block structure
- No drift when WP content is updated (re-run extraction script)
- Eliminates the massive single.html template with its type-switching
- Per-page CSS ensures visual fidelity

**Disadvantages:**
- Content is opaque HTML blobs, not editable Markdown
- Image paths need rewriting (WP absolute URLs to Hugo static paths)
- WP content updates require re-running the extraction pipeline
- Per-page CSS adds weight (mitigated by PurgeCSS)
- Accessibility improvements harder to make inside opaque HTML

## Recommendation

**Serve WP's actual rendered HTML through Hugo.** The current approach -- reverse-engineering UAGB block HTML inside Hugo templates -- is enormously labor-intensive (single.html is 225 lines of hand-copied WP markup with type-switching) and will never achieve perfect parity. The HTML-passthrough approach gives pixel-perfect output by definition.

**Implementation path:**
1. Write a Playwright script that visits each WP page, extracts `.entry-content` innerHTML + all `<style>` rules
2. Run PurgeCSS to strip unused CSS per page
3. Save HTML fragments as `/content/{page}.html` with front matter (`type: wp-passthrough`)
4. Save purged CSS either inline in the HTML or as companion files referenced via front matter
5. Create a `wp-passthrough` layout: `{{ define "main" }}<article class="ast-article-single"><div class="entry-content clear" data-ast-blocks-layout>{{ .Content }}</div></article>{{ end }}`
6. Add a head partial hook to inject per-page CSS when `wp_css` front matter param exists
7. Post-process image URLs in extracted HTML to point to Hugo static assets

This pipeline is automatable, repeatable, and eliminates the parity problem entirely for content pages.
