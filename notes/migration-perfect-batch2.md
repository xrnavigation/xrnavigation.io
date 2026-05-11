# Migration Perfect Batch 2 Notes
## 2026-03-30

**GOAL:** Fix worst remaining pages: blog listing (84-89%), map-eval-tool mobile (89%, 2351px), collection pages (67-70%).

**OBSERVATIONS SO FAR:**
- hugo.toml: `paginate = 10` already set
- Blog list template: Already uses `.Paginate .Pages` (fixed in prior batch)
- Collection template: exists at `themes/xrnav/layouts/_default/collection.html` (moved there in prior batch)
- Map-eval-tool: Has hero section with inline background-image and `max-width: 70%` inner container
- Prior mobile fix: Footer grid specificity fixed for 375px. But map-eval-tool mobile at 2351px suggests something else overflows.
- 11 blog posts in content/blog/ — with paginate=10, page 1 should show 10, page 2 should show 1

**CURRENT SCORES (desktop):**
- blog: 27.92% (baseline 2878px, current 8095px — page WAY too tall, 5217px extra)
- universities: 63.93% (baseline 4689px, current 2516px — 2173px too short)
- corporate-campuses: 66.49% (baseline 4885px, current 2809px — 2076px too short)
- health-care-facilities: 75.42% (baseline 5466px, current 2728px — 2738px too short)

**BLOG ANALYSIS:**
- Pagination works (10 posts on page 1, page 2 exists with 1 post)
- But page is 8095px vs baseline 2878px — blog is rendering ALL content somehow, or posts are too tall
- Blog list template uses `.Paginate .Pages` correctly
- 11 blog posts total, paginate=10, so page 1 = 10 posts. That's correct.
- The 8095px height suggests posts are showing full content/summary instead of just titles+excerpts like WP

**COLLECTION ANALYSIS:**
- All 3 collection pages are roughly HALF the height of baselines
- Collection template exists at `_default/collection.html` and was confirmed working in prior batch
- But pages are dramatically shorter — likely the collection template isn't rendering sections/features properly
- Need to check if frontmatter data (sections, features, etc.) is actually populated

**VISUAL ANALYSIS (from baseline screenshots):**

Blog (WP baseline 2878px, Hugo 8095px):
- WP has full-width dark hero with bg image (aerial campus), title "Navigating the Future: Exploring Accessibility and Innovation", intro paragraph
- "Latest Blog Posts" heading below hero
- 3-column card grid: each card has dark thumbnail, title, date, ~2-line excerpt
- All 11 posts shown on single page (no pagination visible in WP baseline)
- Hugo version: no hero, no "Latest Blog Posts" heading, posts are full-width with long summaries, 3x too tall

Collection pages (universities, corporate-campuses, health-care):
- Frontmatter data IS populated (sections, features, cta all present)
- Collection template IS rendering (9 section class matches found)
- Images ARE rendering (info-box-image divs present)
- WP has full-width dark hero with campus aerial bg image, white text
- Hugo hero section has no background image or dark styling — just plain text
- Page height ~half of WP = missing hero bg, missing visual weight/padding

Available images: hero-white-1-2.jpg, plus DALL-E images used by collection info-boxes. No blog-specific hero image. map-eval-hero.webp referenced in content but not in static/images/ root.

**ROOT CAUSES:**
1. Blog: Posts render full summaries (~70 words) instead of compact 2-line excerpts. No hero. No "Latest Blog Posts" heading. No card thumbnails.
2. Collection pages: Hero section lacks background image + dark styling. The hero_text shows but without the visual treatment (full-width dark bg, large padding).
3. Blog WP shows all 11 posts = no pagination in baseline. Hugo paginates to 10 = different count.

**PLAN:**
1. Blog: Add hero section, truncate excerpts, add "Latest Blog Posts" heading. Set paginate higher or show all.
2. Collections: Add hero bg image + dark styling to collection template/CSS.
3. Map-eval mobile: Investigate 2351px width overflow separately.

**WP BLOG HERO CSS (from blog.html inline styles):**
- `min-height: 60vh`, `background-size: cover`, `background-position: 46% 23%`, `background-attachment: fixed`
- `padding-top: 6%; padding-bottom: 3%`
- Inner: `max-width: min(100%, 85%)`
- Image: DALL-E composite campus image (already in static/images/)
- `.uagb-post__image:before` overlay: `background-color: #000; opacity: 0.7`
- Cards: `background: #f6f6f6`, `border-radius: 10px`, `padding: 30px 40px 10px`, `box-shadow`
- Title: `font-weight: 800; font-size: 20px; color: var(--ast-global-color-4)` (white)
- Grid: 3 columns, 30px gap
- Excerpts: ~15 words, truncated with ellipsis

**CHANGES MADE SO FAR:**
- blog/_index.md: Added hero_title, hero_text, hero_image frontmatter
- blog/list.html: Rewrote with hero section, "Latest Blog Posts" h2, truncated excerpts (120 chars)
- Existing CSS in wordpress-compat.css already has post grid styles (lines 830-908)

**STILL NEED:**
1. Add blog hero CSS (.blog-hero / Change-background) to wordpress-compat.css
2. Build and test blog diff
3. Fix collection page heroes
4. Investigate map-eval mobile 2351px width

**BLOG ITERATION 1:** Hero + "Latest Blog Posts" heading + truncated excerpts. 27.92% -> 50.47% (WORSE visually due to hero not rendering). Page height improved: 8095 -> 2711 (baseline 2878).

**IMAGE DOUBLE-ENCODING BUG:** Filenames on disk literally contain `%C2%B7` (not the decoded `·`). Hugo serves them at the double-encoded path `/images/DALL%25C2%25B7E-...`. The frontmatter `hero_image` value uses single-encoded `%C2%B7` which the browser decodes to `·` and gets 404. Fix: use double-encoded `%25C2%25B7` in frontmatter, or rename the files. This same issue affects collection page images.

**BLOG ITERATION 2:** Fixed image double-encoding (all collection pages too). Changed card bg to #333 (dark). Changed paginate to 20 to show all 11 posts. 50.47% -> 43.92%. Page 2711px vs 2878px baseline (167px short).

**BLOG CURRENT STATE:** Hero renders with bg image, cards visible with dark bg + white text. Main remaining diffs:
- WP cards are taller/more padded and have image backgrounds, Hugo cards are shorter with flat dark color
- Hugo page is 167px shorter (cards more compact, pagination controls showing despite all posts fitting)
- "Latest Blog Posts" heading position slightly off
- Pagination "1" link visible even though all posts fit on one page
- Blog post date shows "date" field — WP shows author name + date. Hugo only shows date (some posts lack author param)

**BLOG ITERATION 3:** Cards now dark bg (#333), text visible. 43.92% diff.
- `digital-map-tool-accessibility-comparison.md` had `url: /digital-map-tool-accessibility-comparison/` overriding its section URL — Hugo put it at root, not under /blog/. Changed to `aliases:` to keep backward compat while listing it under blog. Now 11 posts should render.
- WP blog HTML confirms 11 articles, Hugo was showing 10.
- paginate changed from 10 to 20 in hugo.toml to show all posts on one page.

**POST COUNT INVESTIGATION:** Hugo shows 10 cards, WP shows 11. All 11 posts exist in content/blog/ and have `url: /slug/` overriding permalinks to render at root. The `digital-map-tool-accessibility-comparison` was changed from `url:` to `aliases:` so it now also renders at `/blog/digital-map-tool-accessibility-comparison/`. But still only 10 h3 titles on blog page. One post may be excluded from .Pages due to having a future date or some other issue. Not critical — 10 vs 11 posts is a minor diff. Moving on to bigger wins.

**POST COUNT DETAIL:** Hugo shows 10 of 11 posts. Missing: "What is the Definition of a Map?" (date 2024-02-19). Post exists at /what-is-the-definition-of-a-map/ (200 OK). paginate=20 confirmed in hugo.toml. Yet blog/page/2/ still exists — meaning paginator is splitting 11 into 10+1. Possible Hugo server cache issue from prior paginate=10 setting. Checking page 2 next.

**PAGINATOR FIX:** `.Paginate .Pages` was capping at 10 even with paginate=20 (Hugo bug or caching issue). Switched to `.Pages` directly and removed pagination template. All 11 posts now show. Removed pagination controls.

**BLOG ITERATION 4:** Added card padding (excerpt 25px, byline 15px, title 15px). Fixed duplicate CSS rule. Changed byline color to #ccc for visibility on dark bg. Testing next.

**NEXT:** Test blog diff, then move to collection pages.
