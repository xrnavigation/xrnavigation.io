# WP-to-Static Migration Tools Research
Date: 2026-04-08

## Context
WordPress site with Astra theme + UAGB/Spectra blocks, ~90 pages. Spectra generates per-page inline CSS scoped to block IDs (330KB+ per page). Rebuilding in Hugo templates is not scaling.

---

## 1. Simply Static (recommended, actively maintained)

**What it does:** WordPress plugin that crawls every page server-side and saves the fully-rendered HTML + all linked CSS/JS/images as static files. Outputs a ZIP or deploys directly to Cloudflare Pages, S3, GitHub, Netlify.

**Visual fidelity:** Captures the complete rendered HTML including all inline `<style>` blocks, UAGB/Spectra per-page CSS, and linked stylesheets. Users confirm custom CSS animations, GSAP, etc. survive intact. "The site looks exactly like the main site."

**Limitations:**
- No forms, search, comments (static = no server-side processing)
- Free version requires manual re-export on content change; Pro ($99/yr) adds auto-deploy
- No JS execution during crawl (server-side PHP render only) -- if content is loaded client-side via JS fetch, it won't appear

**Status:** Actively maintained, 40k+ users, v3.4+ (late 2025). Cloudflare recommends it officially.

**Links:**
- https://wordpress.org/plugins/simply-static/
- https://simplystatic.com/
- https://github.com/Simply-Static/simply-static
- https://developers.cloudflare.com/pages/how-to/deploy-a-wordpress-site/

## 2. WP2Static -- AVOID

**What it does:** Same concept as Simply Static (crawl + save rendered HTML).

**Status:** Effectively dead. Acquired by Strattic/Elementor, Strattic shut down Jan 1 2025. Plugin removed from WordPress directory. Unmaintained.

**Links:**
- https://github.com/elementor/wp2static
- https://headlesshostman.com/what-happened-to-wp2static-and-strattic/

## 3. Staatic (alternative)

**What it does:** Same crawl-and-save approach. Deploys to GitHub, Netlify, AWS S3, local server.

**Status:** Active, smaller community than Simply Static. Good for developers wanting fine control.

**Link:** https://wordpress.org/plugins/staatic/

## 4. wget / HTTrack mirroring

**What it does:** Downloads entire rendered site from the browser-facing URLs.

**Typical command:**
```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https://example.com
```

**What breaks:**
- **Query string filenames:** WordPress appends `?ver=X` to CSS/JS URLs. wget saves these as literal filenames (`style.css?ver=6.1`). Browsers can't find them. Fix: `find -name '*\?*' -execdir rename 's/\?.+$//' '{}' +`
- **MIME type errors:** Files with wrong extensions get blocked by strict MIME checking
- **JS-loaded content:** wget doesn't execute JS, so dynamically loaded content is missing
- **Absolute URLs:** Embedded JS/CSS may contain hardcoded WordPress domain URLs
- **Inline CSS is preserved** (it's part of the HTML document, wget saves it verbatim)

**Verdict:** Works as a quick-and-dirty archive. Requires post-processing. More fragile than Simply Static because Simply Static understands WordPress URL structures.

**Links:**
- https://osric.com/chris/accidental-developer/2024/01/converting-a-wordpress-site-to-a-static-site-using-wget/
- https://dev.to/vallu/convert-your-wordpress-site-to-static-html-19n7

## 5. Hybrid: WordPress as hidden CMS, serve static export

**Architecture:** Keep WordPress running privately (localhost, staging server, or hidden subdomain). Use Simply Static or Staatic to generate static files on content change. Deploy static files to CDN/static host.

**This is the officially recommended approach** by Simply Static, Cloudflare, and most guides. WordPress stays as the editing backend; the public site is pure static HTML.

**Advantages for our case:**
- Zero Hugo templates needed -- WordPress renders the HTML with all UAGB/Spectra styling intact
- Content editors use WordPress admin as before
- Static output gets CDN performance and security benefits
- Can run WordPress in Docker locally or on a cheap VPS

## 6. Hugo-specific WP migration tools

**wordpress-to-hugo-exporter:** Exports content as Markdown + front matter. Does NOT preserve visual fidelity, layouts, or CSS. Content-only.

**Other Hugo migration tools (blog.muffn.io, makewithhugo.com):** All content-focused. None address visual parity. Hugo community consensus: "There still isn't a simple reliable tool."

**Verdict:** No Hugo tool solves the visual parity problem. They all export content and expect you to rebuild the theme from scratch.

**Links:**
- https://gohugo.io/tools/migrations/
- https://github.com/SchumacherFM/wordpress-to-hugo-exporter
- https://discourse.gohugo.io/t/wordpress-hugo-migration-still-no-good-way/48710

## 7. Has anyone solved pixel-perfect WP-to-static?

**rtCamp Visual Automation Framework:** Uses BackstopJS for pixel-by-pixel screenshot comparison between old and new site at all viewports. Generates HTML diff reports. Used for enterprise WP migrations. Open source: https://github.com/rtCamp/visual-automation-backstop

**Key insight from rtCamp and others:** "Absolute precision to the pixel is technically impossible across browsers/OS/screen densities." Everyone doing WP migrations uses visual regression testing to *verify* parity, not tools that *guarantee* it.

**Nobody has solved this for WP-to-Hugo.** The people who achieve visual parity either (a) stay on WordPress and serve it statically, or (b) accept a redesign during migration.

---

## Recommendation for xrnavigation.io

The path of least resistance for exact visual parity:

1. **Keep WordPress as the rendering engine.** Install Simply Static (free or Pro).
2. **Export the full site as static HTML.** All 90 pages with their 330KB inline CSS, every UAGB block ID, every Spectra style -- preserved verbatim.
3. **Host the static output** on Cloudflare Pages, Netlify, or GitHub Pages (free).
4. **Keep WordPress running privately** (Docker, local, or staging VPS) for content edits.
5. **Use the existing visual comparison tests** (already in this repo) to verify parity between live WP and static export.

This eliminates the Hugo template problem entirely. The Hugo migration path requires manually recreating what WordPress + UAGB already renders -- Simply Static captures that rendering as-is.

**Trade-off:** You lose Hugo's content model, templating, and build pipeline. You gain exact visual parity with zero CSS hand-crafting. If Hugo features (taxonomies, shortcodes, Markdown authoring) matter more than visual parity, stick with the current approach but accept some visual divergence.
