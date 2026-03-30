# Task: Download All Media from WordPress Site

## Goal
Download every image and video file used on xrnavigation.io into the Hugo `static/images/` directory.

## Approach
Use the WordPress REST API to enumerate all media, then download each file.

### 1. Fetch media list
```
https://xrnavigation.io/wp-json/wp/v2/media?per_page=100&page=1
https://xrnavigation.io/wp-json/wp/v2/media?per_page=100&page=2
(continue until 400 response)
```

Each item has: `source_url` (full-size file URL), `media_details.sizes` (thumbnails), `alt_text`, `title.rendered`, `slug`.

### 2. Download files
- Download each `source_url` to `static/images/{original-filename}`
- Preserve original filenames from the URL path
- Skip thumbnails/resized versions — just get originals
- Log a manifest of all downloaded files with their original URLs and alt text

### 3. Write manifest
Write `static/images/manifest.json` mapping original WP URLs to local paths and alt text. This helps during content migration to rewrite image URLs.

## Working Directory
C:\Users\Q\src\audiom\xrnavigation.io

## Technical Notes
- Write a Node.js script at `scripts/download-media.js`
- Use `fetch` (built into Node 18+) or install `node-fetch`
- Handle pagination via `X-WP-TotalPages` header
- Create `static/images/` directory if it doesn't exist
- Be polite — don't hammer the server. Add a small delay between downloads (100ms)
- Video files may be large — download them too but note file sizes in the report

## Git Instructions
- `git add scripts/download-media.js static/images/manifest.json`
- Do NOT commit the actual image/video files — add `static/images/*.png`, `static/images/*.jpg`, `static/images/*.jpeg`, `static/images/*.gif`, `static/images/*.webp`, `static/images/*.mp4`, `static/images/*.webm` to `.gitignore`
- Actually wait — we DO want images in the repo so they deploy. Commit them.
- `git add scripts/download-media.js static/images/`
- `git commit -m "Download WordPress media library"`
- Include the commit hash in your report

## Report
Write your report to `reports/migration-media-download.md` with:
- Total number of files downloaded
- Total size
- Any files that failed to download
- The commit hash
