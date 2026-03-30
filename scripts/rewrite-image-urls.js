#!/usr/bin/env node
/**
 * Rewrites WordPress image URLs in content files to local paths.
 * Reads static/images/manifest.json to build a mapping of WP URLs -> local filenames.
 * Then does find-and-replace across all content markdown files.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Recursively find all .md files in a directory
function findMdFiles(dir, base) {
  base = base || dir;
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findMdFiles(full, base));
    } else if (entry.name.endsWith('.md')) {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

// Load manifest
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'static', 'images', 'manifest.json'), 'utf8')
);

// Build URL -> local path mapping
// wp_url: "https://xrnavigation.io/wp-content/uploads/2025/12/file.pdf"
// local_path: "static/images/file.pdf"
// Target URL in markdown: "/images/file.pdf"
const urlMap = new Map();
for (const item of manifest) {
  const localUrl = '/' + item.local_path.replace(/^static\//, '');
  urlMap.set(item.wp_url, localUrl);
}

console.log(`Loaded ${urlMap.size} URL mappings from manifest.`);

// Find all content markdown files
const contentDir = path.join(ROOT, 'content');
const files = findMdFiles(contentDir);

let totalReplacements = 0;
let filesModified = 0;

for (const file of files) {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Strategy 1: Direct URL match from manifest
  for (const [wpUrl, localUrl] of urlMap) {
    if (content.includes(wpUrl)) {
      const count = content.split(wpUrl).length - 1;
      content = content.split(wpUrl).join(localUrl);
      totalReplacements += count;
      modified = true;
    }
  }

  // Strategy 2: Catch any remaining WP upload URLs not in manifest
  // Match pattern: https://xrnavigation.io/wp-content/uploads/YYYY/MM/filename.ext
  const wpUrlPattern = /https?:\/\/xrnavigation\.io\/wp-content\/uploads\/\d{4}\/\d{2}\/([^)\s"'\]]+)/g;
  let match;
  const remaining = [];
  while ((match = wpUrlPattern.exec(content)) !== null) {
    remaining.push({ full: match[0], filename: match[1] });
  }

  if (remaining.length > 0) {
    for (const r of remaining) {
      // Try to find the file in static/images/
      const localUrl = `/images/${r.filename}`;
      const localFile = path.join(ROOT, 'static', 'images', r.filename);
      if (fs.existsSync(localFile)) {
        content = content.split(r.full).join(localUrl);
        totalReplacements += 1;
        modified = true;
        console.log(`  [fallback] ${file}: ${r.full} -> ${localUrl}`);
      } else {
        console.log(`  [WARNING] ${file}: No local file for ${r.full}`);
      }
    }
  }

  // Strategy 3: Catch relative /wp-content/uploads/ paths (no domain)
  const relPattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/([^)\s"'\]]+)/g;
  const relRemaining = [];
  while ((match = relPattern.exec(content)) !== null) {
    relRemaining.push({ full: match[0], filename: match[1] });
  }

  if (relRemaining.length > 0) {
    for (const r of relRemaining) {
      const localUrl = `/images/${r.filename}`;
      const localFile = path.join(ROOT, 'static', 'images', r.filename);
      if (fs.existsSync(localFile)) {
        content = content.split(r.full).join(localUrl);
        totalReplacements += 1;
        modified = true;
        console.log(`  [relative] ${file}: ${r.full} -> ${localUrl}`);
      } else {
        console.log(`  [WARNING-rel] ${file}: No local file for ${r.full}`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    console.log(`Updated: ${file}`);
  }
}

console.log(`\nDone. ${totalReplacements} replacements in ${filesModified} files.`);
