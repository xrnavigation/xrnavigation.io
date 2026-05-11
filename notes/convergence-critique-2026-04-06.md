# Convergence Strategy Critique Notes
## 2026-04-06

**GOAL:** Identify false confidence and wasted work risks in the current WP→Hugo visual parity approach.

**OBSERVED:**
- 180 baselines (90 slugs × 2 viewports), last full-suite run was R11 on 2026-04-01 (avg 27.09%)
- 15 commits since R11, all page-specific template work targeting ~20 slugs
- comparison-results.json is stale: only 2 entries (about page), not the full 180-point ledger
- Latest partial run (20 slugs) shows avg 12.00%, desktop 8.02%, mobile 15.97% — but only for pages that received direct attention
- 70 of 90 slugs untested since R11 — their current state is unknown
- 17 specialized wp-* layout directories exist (proliferation from generic → per-page templates)
- parity-workstream.md has 0/6 phases checked off despite significant work
- The pixelmatch threshold is 0.1 (fairly sensitive), diff > 5% writes a diff PNG
- Height mismatches dominate the diff metric — even small height deltas inflate diffPercent significantly due to the penalty formula (lines 260-266 of visual-comparison.spec.ts)
- The comparison harness crops to min(width,height) overlap, then penalizes the non-overlapping region at 100% diff — this means a page that's pixel-perfect in content but 10% taller scores terribly
- Round-over-round notes show: R5 46%, R6 45%, R7 44%, R8 32%, R9 27%, R11 27% — plateau since R9
- Global CSS changes caused regressions on embed pages (documented), leading to per-page template strategy
- Blog single, collection, and standard-single were worst families — some got template work, many didn't
- No CI pipeline runs the comparison suite — it's manual only

**KEY FINDINGS:**
1. The diff metric conflates height mismatch with visual mismatch. A page with perfect CSS but one extra <br> at the bottom scores 20%+.
2. No full-suite run since the template proliferation — could be regressing on untouched pages without knowing.
3. 17 wp-* layouts = 17 maintenance surfaces. Each must independently track WordPress DOM changes.
4. The baselines are static PNGs captured once — if the live WP site changed since capture, parity target is wrong.
5. Embed pages (50 of 90 slugs) were already <5% desktop by R8. They're half the page count but the easiest half.
6. The "percentage improved" narrative obscures that the hardest pages haven't moved.

**BLOCKER:** No full-suite run means current state is literally unknown for 78% of pages.

## Second Pass Findings

**Template proliferation confirmed:**
- 9 wp-* layout templates totaling 592 lines of standalone HTML
- Zero of them use Hugo partials — they are all self-contained HTML blobs
- wp-about alone is 210 lines. wp-accessibility-statement is 126 lines.
- These templates don't share header/footer partials, meaning any global chrome change (nav link, footer text, logo) must be updated in 9+ places manually

**Content type assignments:**
- 49 pages → audiom-embed (the easy half, already <5% desktop)
- 13 wp-* typed pages (1 each to specialized templates)
- 3 collection pages (explicit layout: collection)
- 13 pages have NO type or layout — fall through to _default/single.html
- The 13 untyped pages include: gallery, implementation, map-evaluation-tool, privacy-policy, nfb25, and several others
- These untyped pages are likely among the untested 70 and may have regressed

**The false confidence shape:**
- 49 embed pages were already easy. 13 wp-* pages got bespoke templates. That's 62/90.
- The remaining 28 pages (13 untyped + 3 collection + 11 blog + 1 homepage) are where the hard problems live
- The partial run (20 slugs, avg 12%) measured mostly the pages that just got template work
- Blog family and collection family haven't been retested post-R11

**Diff metric structural flaw:**
- Lines 260-266 of visual-comparison.spec.ts: non-overlapping area penalized at 100% diff
- A page that is pixel-perfect in CSS but 200px taller than baseline (e.g., one extra paragraph) gets ~15-25% diff from height alone
- This means the diff% number cannot distinguish "layout is wrong" from "content is slightly longer"
- Teams have been optimizing to reduce this number, but the number doesn't tell you what's actually wrong
