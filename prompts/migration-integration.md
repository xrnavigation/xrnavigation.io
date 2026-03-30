# Task: Integration — Wire Exported Content into Hugo Theme

## Goal
Take the exported WordPress content and make it work with the Hugo theme. Fix paths, clean up conflicts, merge custom CSS, and verify the site builds.

## Context Files
Read these first:
- `notes/wp-audit.md` — site audit
- `notes/design-tokens.md` — color/font values
- `reports/migration-hugo-scaffold.md` — what the theme contains
- `reports/migration-wp-export.md` — what was exported and known issues
- `reports/migration-redirects-forms-css.md` — redirects, forms, focus styles

## Tasks

### 1. Delete content/blog.md
It conflicts with `content/blog/` directory (Hugo uses `content/blog/_index.md` for the blog list). Delete it:
```bash
rm content/blog.md
```

### 2. Image URL Rewriting
Exported Markdown files reference images at `https://xrnavigation.io/wp-content/uploads/...`. These need to point to the local files in `static/images/`.

Read `static/images/manifest.json` to build a mapping of WP URLs → local filenames. Then do a find-and-replace across all `content/**/*.md` files:
- Replace `https://xrnavigation.io/wp-content/uploads/YYYY/MM/filename.ext` with `/images/filename.ext`
- Write a script at `scripts/rewrite-image-urls.js` that reads the manifest and does this automatically

### 3. Merge Focus Styles
Read `data/custom-css-focus-styles.css` and merge the focus-visible rules into `themes/xrnav/static/css/main.css`. The key values:
- `--outline-color: #d01754` (pinkish-red focus ring)
- Apply `:focus-visible` on `a, button, input, select, textarea, summary`
- Don't duplicate what's already in main.css — check first and merge intelligently

### 4. Add Redirects as Hugo Aliases
For internal redirects, add `aliases` to the target page's frontmatter. For example, if `/csun26` redirects to `/csun`, add to `content/csun.md`:
```yaml
aliases:
  - /csun26
  - /csun25
```
Read `data/redirects.json` for the full list. External redirects (GitHub Pages, Google Forms) stay in `static/_redirects` only.

### 5. Verify Hugo Build
Run `hugo` and check:
- Does it build without errors?
- How many pages does it produce?
- Are there any warnings about missing content or broken references?

### 6. Homepage Assessment
Look at `content/_index.md` — the exported homepage content has raw Spectra HTML. Assess what needs to be done to make it work as a Hugo page. Don't fix it yet — just document what's needed in your report. This will be a separate task.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
After each logical chunk of work, commit:
- `git add -A && git commit -m "descriptive message"` (but review what you're adding — don't commit node_modules or baseline PNGs)
- Final commit message should summarize integration work
- Include all commit hashes in your report

## Report
Write your report to `reports/migration-integration.md` with:
- What was done (each task)
- Hugo build output (page count, warnings)
- Homepage assessment — what needs manual template work
- All commit hashes
- What's left to do
