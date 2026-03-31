# Foreman Progress — Migration
Date: 2026-03-30

## STATUS: Dispatching round 4 targeted fixes (header/footer, blog/collections, typography)

## Comparison History
- Round 1: avg 43.64%, median n/a, 22 HTTP 404s
- Round 2: avg 43.64%, median 43.70%, 0 HTTP 404s (CSS rewrite alone didn't help)
- Round 3: avg 42.17%, median 38.70% (template port helped median -5pp, but still no pages <10%)

## Round 3 Analysis — Four Fix Priorities
1. **Header/footer** — mismatched on all 180 pages, est 15-25pp per page. HIGHEST LEVERAGE.
2. **Blog pagination** — Hugo shows all posts, WP paginates. Worst page at 90%.
3. **Collection card grids** — universities/healthcare/corporate render as flat text, not card grids. 80-86% diff.
4. **Typography spacing** — cumulative line-height/margin/padding drift causing 5-15% height differences.

## Prompts Written, Ready to Dispatch
- prompts/migration-fix-header-footer.md — committed c34bd3a
- prompts/migration-fix-blog-collections.md — committed c34bd3a
- prompts/migration-fix-typography.md — committed c34bd3a

## Next
1. Dispatch all 3 fix agents in parallel
2. After all complete: run round 4 comparison
3. Iterate until convergence
