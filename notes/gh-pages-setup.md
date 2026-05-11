# GitHub Pages Setup — 2026-03-31

## Done
- Created public repo `xrnavigation/xrnavigation.io`
- Removed 3 large video files from git history via `git filter-repo` (P1144681.mov 122MB, two 80MB+ mp4s)
- The `-1` variants (29MB each) are the ones actually used on the site; originals were migration artifacts
- Pushed clean main branch, 123 commits
- Added `.github/workflows/hugo.yml` — Hugo 0.156.0 extended, deploys via Actions
- Enabled Pages on repo (build_type: workflow)
- Pushed workflow commit, build should be running now
- Staging URL: https://xrnavigation.github.io/xrnavigation.io/

## Note
- `baseURL` in hugo.toml is `https://xrnavigation.io/` but the workflow overrides it via `--baseURL` from `configure-pages` output
- Org is on free plan — Pages works because repo is public
- `.gitignore` updated to exclude `*.log`, `*.mov`, the two large mp4 originals, and `test-results/`

## Next
- Check if the Actions build succeeds
- Verify the site loads at the Pages URL
