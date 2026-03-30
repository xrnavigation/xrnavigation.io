#!/usr/bin/env node

/**
 * Download all media from the WordPress REST API at xrnavigation.io
 * into static/images/, and write a manifest.json for URL rewriting.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://xrnavigation.io/wp-json/wp/v2/media';
const OUT_DIR = path.resolve(__dirname, '..', 'static', 'images');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const DELAY_MS = 100;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchAllMedia() {
  const allItems = [];
  let page = 1;

  while (true) {
    const url = `${BASE_URL}?per_page=100&page=${page}`;
    console.log(`Fetching media list page ${page}...`);
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 400 || res.status === 404) {
        console.log(`Page ${page} returned ${res.status} — done enumerating.`);
        break;
      }
      throw new Error(`Unexpected status ${res.status} on page ${page}`);
    }

    const items = await res.json();
    if (!items.length) break;

    allItems.push(...items);

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    console.log(`  Got ${items.length} items (page ${page}/${totalPages})`);

    if (page >= totalPages) break;
    page++;
    await sleep(DELAY_MS);
  }

  return allItems;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Enumerating media from WordPress REST API...\n');
  const items = await fetchAllMedia();
  console.log(`\nFound ${items.length} media items.\n`);

  const manifest = [];
  let totalSize = 0;
  let downloaded = 0;
  const failures = [];

  for (const item of items) {
    const sourceUrl = item.source_url;
    if (!sourceUrl) {
      console.log(`  SKIP (no source_url): id=${item.id}`);
      continue;
    }

    const filename = path.basename(new URL(sourceUrl).pathname);
    const destPath = path.join(OUT_DIR, filename);

    const entry = {
      id: item.id,
      wp_url: sourceUrl,
      local_path: `static/images/${filename}`,
      alt_text: item.alt_text || '',
      title: item.title?.rendered || '',
      slug: item.slug || '',
      mime_type: item.mime_type || '',
    };

    try {
      console.log(`  Downloading: ${filename}`);
      const size = await downloadFile(sourceUrl, destPath);
      entry.size_bytes = size;
      totalSize += size;
      downloaded++;
    } catch (err) {
      console.error(`  FAILED: ${filename} — ${err.message}`);
      entry.error = err.message;
      failures.push({ filename, url: sourceUrl, error: err.message });
    }

    manifest.push(entry);
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\n=== Summary ===`);
  console.log(`Downloaded: ${downloaded} files`);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Failures:   ${failures.length}`);
  if (failures.length) {
    for (const f of failures) {
      console.log(`  - ${f.filename}: ${f.error}`);
    }
  }
  console.log(`Manifest:   ${MANIFEST_PATH}`);

  // Write a summary JSON for the report script to consume
  const summaryPath = path.join(OUT_DIR, '.download-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    total_items: items.length,
    downloaded,
    total_size_bytes: totalSize,
    failures,
  }, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
