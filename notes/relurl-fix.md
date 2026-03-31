# relURL Fix for Subpath Deployment
## 2026-03-30

### Findings
Templates already use `relURL` for static assets (CSS, JS, images in header/footer logo). Menu links use Hugo's `.URL` which Hugo relativizes automatically. The 404.html already uses `{{ "/" | relURL }}`.

### What needs fixing

**Templates rendering frontmatter URLs without relURL:**
1. `index.html` — 7 places: `.cta_url` (lines 18,77,148), `.src` (lines 100,103), `.image` (lines 125,175,212), `.link_url` (line 185)
2. `collection.html` — 4 places: `.url` (line 23,77), `.image`/`.` (line 31), hero_image (line 4), extra_sections image (line 61), cta image (line 71)
3. `blog/single.html` line 15 — featured image src from frontmatter
4. `blog/list.html` line 51 — featured image src from frontmatter

**Content files with raw HTML hardcoded paths:**
- `content/map-evaluation-tool.md` line 17: `url('/images/map-eval-hero.webp')` — CSS background
- `content/map-evaluation-tool.md` line 26: `href="/"` — link to home
- `content/map-evaluation-tool.md` line 57: `href="/"` and `href="/how-to-make-detailed-map-text-descriptions/"`

**Hugo menu `.URL`:** Hugo menu items get `.URL` which is already relativized by Hugo's menu system. No fix needed.

### Progress
- index.html: DONE. Fixed cta_url (3), video src (source+track), client logos, use_case images+links, team images. All 10 spots.
- collection.html: DONE. Fixed hero_image, section CTA url, section image, extra_sections bg image, CTA bg image, CTA button urls. 6 spots.
- blog/single.html: DONE. Fixed featured_image src.
- blog/list.html: DONE. Fixed hero_image bg + featured_image src.
- content/map-evaluation-tool.md: DONE. Created `rel` shortcode, used it for bg-image and href="/" in raw HTML.
- Build with subpath baseURL (`/audiom/`): succeeds, but verification shows MIXED results.
- Menu links (Hugo .URL): correctly get `/audiom/` prefix. Static assets (already had relURL): correct.
- Frontmatter URLs through templates: some NOT getting prefix despite `| relURL` in templates.
- Observed: `/audiom-demo-form/` (hero cta), `/contact/` (why cta), `/universities/` (use_case link) missing prefix.
- BUT `/audiom/contact/` appears for menu items on same page. So the template relURL should work.
- ROOT CAUSE FOUND: `layouts/index.html` at project root overrides `themes/xrnav/layouts/index.html`. The ROOT version is the one Hugo uses.
- Root layout ALREADY had relURL on most frontmatter values (lines 17,52,60,63,79,106,110,126).
- Fixed 2 missing spots: data-root-path (line 58) and $what.cta_url (line 91).
- BUT after rebuild, frontmatter URLs like `/contact/`, `/universities/` still show WITHOUT /audiom/ prefix.
- KEY OBSERVATION: `data-root-path="{{ "vendor/ableplayer/" | relURL }}"` DOES produce `/audiom/vendor/ableplayer/`. String literals work.
- Frontmatter values with `| relURL` do NOT get prefix. `$why.cta_url | relURL` where value is `/contact/` outputs `/contact/`.
- Image srcs from frontmatter also need checking — the header/footer logo (string literal) works fine.
- ROOT CAUSE CONFIRMED via debug div: Hugo's `relURL` treats leading-slash paths as already absolute.
  - `"/contact/" | relURL` => `/contact/` (UNCHANGED — Hugo considers this already rooted)
  - `"contact/" | relURL` => `/audiom/contact/` (CORRECT — Hugo prepends base path)
- This means `relURL` only works for paths WITHOUT a leading slash. Paths with leading `/` are treated as absolute from site root.
- FIX STRATEGY: Use `strings.TrimLeft` to strip leading `/` before piping to `relURL`, OR switch frontmatter values to not use leading slashes, OR use a different approach.
- Best approach: strip leading slash in template before relURL. E.g.: `{{ .cta_url | strings.TrimLeft "/" | relURL }}`
- External URLs (https://...) won't be affected by TrimLeft "/" since they don't start with `/`.
- Need to update ALL relURL calls on frontmatter values to use this pattern.

### Apply Progress
- root layouts/index.html: DONE — all frontmatter relURL calls updated to `strings.TrimLeft "/" | relURL`. Debug div removed.
- theme index.html: cta_url DONE, still need .src, .image, .link_url
- theme collection.html, blog/single.html, blog/list.html: still need updating
- header.html logo href uses `"/" | relURL` — needs TrimLeft treatment
- All theme templates updated with `strings.TrimLeft "/" | relURL` pattern:
  - theme index.html: cta_url, .src, .image, .link_url — DONE
  - collection.html: hero_image, section image, .url, extra bg, cta bg — DONE
  - blog/single.html: featured image — DONE
  - blog/list.html: hero_image bg, featured image — DONE
- header.html: Fixed `"/" | relURL` -> `"" | relURL` (both desktop+mobile). DONE.
- 404.html: Fixed same pattern. DONE.
- Rebuild verification with `--baseURL https://example.com/audiom/`:
  - ALL template-driven hrefs and srcs now have `/audiom/` prefix. PASS.
  - ALL img src attributes correct. PASS.
  - Header logo links correct. PASS.
  - ONE remaining: `/acr/` in `why.text` frontmatter — markdown link processed by `markdownify`, which doesn't apply relURL. Known limitation.
- Shortcodes in raw HTML blocks DON'T WORK — Hugo doesn't process shortcodes inside HTML blocks. Reverted `rel` shortcode usage in map-evaluation-tool.md.
- Known content-level limitations (raw HTML in markdown):
  - `content/map-evaluation-tool.md` line 17: `url('/images/map-eval-hero.webp')` in CSS
  - `content/map-evaluation-tool.md` line 26: `href="/"`
  - `content/_index.md` why.text: `[text](/acr/)` via markdownify
- Reverted shortcode in content (doesn't work in HTML blocks), deleted rel.html shortcode.
- Fixed `why.text` markdownify issue with `replaceRE` to fix `href="/` patterns in template output.
- FINAL VERIFICATION with `--baseURL https://example.com/audiom/`:
  - Homepage: ALL href and src attributes have `/audiom/` prefix. PASS.
  - Universities collection page: all links correct. PASS.
  - Blog list page: all links correct. PASS.
  - Root baseURL (`https://xrnavigation.io/`): all links correct at `/`. PASS.
- Known remaining limitations (raw HTML in content markdown):
  - `content/map-evaluation-tool.md`: 2 hardcoded paths in raw HTML blocks (bg-image, href="/"). Hugo can't process these.
- NEXT: Clean up public-test, write report, commit.

### Strategy
- Template fixes: pipe frontmatter values through `relURL`
- Content raw HTML: these are in markdown rendered with `unsafe = true`. Hugo won't process relURL in raw HTML content. Need to either convert to shortcodes or accept the limitation. For now, fix templates (high impact), note content limitation.
- Need to handle external URLs — don't relURL external (https://) URLs
