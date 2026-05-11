# Repo Audit for Execution Planning
## 2026-04-06

**GOAL:** Assess current state of WP→Hugo migration for next execution plan.

**OBSERVED:**
- 90 content slugs, 180 baselines (90 desktop + 90 mobile)
- No full-suite (180-comparison) run exists since R11 (2026-04-01, noted in visual-comparison.md)
- R11 numbers: avg 27.09%, desktop 23.61%, mobile 30.57%
- Since R11, 15 commits landed (most recent: 2a39673, Apr 2) — all page-specific template work
- Recent commits targeted: about, accessibility-statement, blog single, contact, demo form, 404, standard page variants
- Latest comparison runs are partial — 20 slugs only, 40 results each
- Latest partial run (run-310200): avg 12.00%, desktop 8.02%, mobile 15.97% across 20 tested slugs
- 70 of 90 slugs have NOT been retested since the 15 post-R11 commits
- 17 specialized layout directories exist under themes/xrnav/layouts/ (wp-about, wp-contact-form, wp-demo-form, etc.)
- The parity-workstream.md phase plan has 0 of 6 phases checked off

**KEY STATE:**
- The 20-slug partial runs show strong improvement: desktop avg 8% (was 23.6% at R11 full-suite)
- But these 20 are the pages that received the most recent attention
- The untested 70 slugs include the entire blog family (11 posts), all collection pages (3), homepage, contact, and ~40 embed pages
- Embed pages were at 3-5% desktop / 10-19% mobile at R9 and have likely held or improved
- Blog, collection, and standard-single were the worst families at R11 — some got template work, many didn't

**CRITICAL GAP:** No full-suite run exists that reflects the 15 post-R11 commits. The actual current state is unknown for 70/90 pages.

**TEMPLATE COVERAGE:**
- 17 wp-* layout dirs created for specialized pages
- Still using generic single.html for many standard pages
- Blog single got Astra-structure port (commit 1a174d5, 6687abf)
- Contact got dedicated layout (d3efee2)
- About got dedicated layout (07d31f0 + subsequent tightening)
- Collection template still generic (_default/collection.html)

**RISK OBSERVATIONS:**
- Global CSS changes historically cause regressions on embed pages (documented in mobile-systematic-fix.md)
- The strategy shifted from global CSS → per-page template work around R10
- comparison-results.json only has 2 entries (about page) — stale, not the full ledger
