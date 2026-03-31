# Task: Download Missing Images, Clean WPForms Markup, Build Contact Page Form

## Goal
Handle the three remaining cleanup tasks that block a clean Hugo build matching the WordPress site.

## Part 1: Download Missing Images

The image URL rewrite pass found ~28 images still referencing `/wp-content/uploads/` that weren't in the manifest. These fall into two categories:

### WordPress-resized thumbnails (~20)
WordPress auto-generates resized variants like `image-1024x683.jpg` from the original `image.jpg`. The originals ARE in `static/images/` — the resized variants are not.

Fix: Search all `content/**/*.md` files for remaining `/wp-content/uploads/` references. For each:
1. Try to match it to the original filename by stripping the `-WIDTHxHEIGHT` suffix
2. If the original exists in `static/images/`, rewrite the URL to use the original
3. If no original exists, download the file directly from `https://xrnavigation.io/wp-content/uploads/...` to `static/images/`

### DALL-E images with Unicode filenames (~8)
These have `DALL·E` (with a middle dot ·) in the filename. Download them directly:
1. Find all remaining `/wp-content/uploads/` URLs in content files
2. Download each from the full WordPress URL
3. Save with a sanitized filename (replace `·` with `-`)
4. Update the content file to reference the new local filename

Write a script at `scripts/fix-missing-images.js` that does all of this.

## Part 2: Clean Dead WPForms Markup

Three content files contain dead WPForms markup (spinner SVGs, form field labels that aren't real forms):
- `content/_index.md`
- `content/contact.md`
- `content/events.md`

Search for and remove:
- `![Loading](...)` references to wpforms spinner SVGs
- Raw form field text like "Name *", "Email *", "Message" that were WPForms labels
- Any `wpforms` class references

Be surgical — only remove the WPForms artifacts, keep all other content.

## Part 3: Contact Page Form

`content/contact.md` had a WPForms form that was stripped during export. Replace it with a working Netlify Forms HTML form.

Read `data/forms.json` for the field structure (it's simple: Name, Email, Message — all required).

Add the form as raw HTML in `content/contact.md` or use a Hugo shortcode. The form should have:
- `method="POST"` `data-netlify="true"` `name="contact"`
- Name field: `<input type="text" name="name" required autocomplete="name" placeholder="Name">`
- Email field: `<input type="email" name="email" required autocomplete="email" placeholder="Email">`
- Message field: `<textarea name="message" required placeholder="Message"></textarea>`
- Submit button
- Proper `<label>` elements for each field (not just placeholders)

Also check if `content/audiom-demo-form.md` needs a similar form rebuild.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Git Instructions
Commit after each logical chunk:
1. `git commit -m "Fix missing images: download and rewrite remaining WP URLs"`
2. `git commit -m "Remove dead WPForms markup from content files"`
3. `git commit -m "Rebuild contact page form with Netlify Forms"`
Include all commit hashes in report.

## Report
Write your report to `reports/migration-cleanup.md` with:
- How many images were fixed/downloaded
- Which files had WPForms markup removed
- Contact form details
- Hugo build verification (run `hugo` and report output)
- All commit hashes
