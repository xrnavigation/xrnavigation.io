#!/usr/bin/env node
/**
 * Link checker for the Hugo site.
 * Builds the site, crawls public/ for broken internal links and images.
 * Exits non-zero if any broken links are found.
 *
 * Usage: node scripts/check-links.js
 *   or:  npm run check-links
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, "data");

// ---------------------------------------------------------------------------
// HTML parsing (lightweight, no dependencies)
// ---------------------------------------------------------------------------

/**
 * Extract href and src attributes from HTML.
 * Returns [{tag, attr, url, text}]
 */
function extractLinks(html) {
  const links = [];

  // <a href="...">text</a>
  const aRe = /<a\b[^>]*\bhref\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = aRe.exec(html)) !== null) {
    const url = decodeHTMLEntities(m[1]);
    const text = m[2].replace(/<[^>]*>/g, "").trim();
    links.push({ tag: "a", attr: "href", url, text });
  }

  // <img src="...">
  const imgRe = /<img\b[^>]*\bsrc\s*=\s*"([^"]*)"[^>]*>/gi;
  while ((m = imgRe.exec(html)) !== null) {
    const url = decodeHTMLEntities(m[1]);
    const alt =
      (m[0].match(/\balt\s*=\s*"([^"]*)"/i) || [])[1] || "";
    links.push({ tag: "img", attr: "src", url, text: alt });
  }

  return links;
}

function decodeHTMLEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ---------------------------------------------------------------------------
// URL classification
// ---------------------------------------------------------------------------

function isInternal(url) {
  if (!url) return false;
  if (/^(mailto:|tel:|javascript:|data:|#)/.test(url)) return false;
  // Absolute URL pointing to our own site
  if (/^https?:\/\/(www\.)?xrnavigation\.io(\/|$)/.test(url)) return true;
  // Relative or absolute-path URLs
  if (/^\//.test(url) || !/^[a-z][a-z0-9+.-]*:/i.test(url)) return true;
  return false;
}

function isSelfReferencing(url) {
  return /^https?:\/\/(www\.)?xrnavigation\.io(\/|$)/.test(url);
}

function isHugoAlias(htmlContent) {
  // Hugo alias pages contain a meta refresh and are very short
  return (
    htmlContent.includes('http-equiv="refresh"') && htmlContent.length < 1500
  );
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

function urlPath(url) {
  try {
    // Strip fragment and query
    const cleaned = url.replace(/#.*$/, "").replace(/\?.*$/, "");
    // Handle absolute URLs pointing to our site
    const pathPart = cleaned.replace(
      /^https?:\/\/(www\.)?xrnavigation\.io/,
      ""
    );
    return decodeURIComponent(pathPart || "/");
  } catch {
    return null;
  }
}

function resolveInPublic(urlStr, sourceFile) {
  const p = urlPath(urlStr);
  if (!p) return null; // can't parse

  let target;
  if (p.startsWith("/")) {
    target = path.join(PUBLIC, p);
  } else {
    target = path.join(path.dirname(sourceFile), p);
  }

  // Check existence: exact, as directory with index.html, with .html
  const candidates = [target];
  if (!path.extname(target)) {
    candidates.push(path.join(target, "index.html"));
    candidates.push(target + ".html");
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    candidates.push(path.join(target, "index.html"));
  }

  for (const c of candidates) {
    if (fs.existsSync(c) && !fs.statSync(c).isDirectory()) {
      return null; // found it
    }
  }
  return target; // broken
}

// ---------------------------------------------------------------------------
// Crawl
// ---------------------------------------------------------------------------

function walkDir(dir, ext) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, ext));
    } else if (full.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function checkSite() {
  const brokenLinks = [];
  const missingImages = [];
  const selfRefs = [];

  const htmlFiles = walkDir(PUBLIC, ".html");

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf-8");
    const relSource = path.relative(PUBLIC, file).replace(/\\/g, "/");

    // Skip Hugo alias redirect pages
    if (isHugoAlias(html)) continue;

    const links = extractLinks(html);

    for (const link of links) {
      const { tag, attr, url, text } = link;

      // Self-referencing external
      if (isSelfReferencing(url)) {
        const suggested = urlPath(url) || "/";
        selfRefs.push({ source: relSource, url, text, suggested });
      }

      if (!isInternal(url)) continue;

      const broken = resolveInPublic(url, file);
      if (broken !== null) {
        const entry = { source: relSource, url, text, tag, attr };
        if (tag === "img") {
          missingImages.push(entry);
        } else {
          brokenLinks.push(entry);
        }
      }
    }
  }

  return { brokenLinks, missingImages, selfRefs };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // 1. Build the site
  console.log("Building Hugo site...");
  try {
    execSync("hugo", { cwd: ROOT, stdio: "pipe" });
  } catch (e) {
    console.error("Hugo build failed:");
    console.error(e.stderr?.toString() || e.message);
    process.exit(2);
  }
  console.log("Build complete.\n");

  // 2. Check links
  const { brokenLinks, missingImages, selfRefs } = checkSite();

  // 3. Deduplicate
  const dedup = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      const key = `${item.source}|${item.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const broken = dedup(brokenLinks);
  const missing = dedup(missingImages);
  const self = dedup(selfRefs);

  // 4. Write JSON report
  const report = {
    broken_links: broken,
    missing_images: missing,
    self_referencing_external: self,
    summary: {
      broken_link_count: broken.length,
      missing_image_count: missing.length,
      self_referencing_count: self.length,
    },
  };

  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(
    path.join(DATA, "broken-links.json"),
    JSON.stringify(report, null, 2)
  );

  // 5. Print results
  console.log("=== LINK AUDIT SUMMARY ===");
  console.log(`Broken internal links: ${broken.length}`);
  console.log(`Missing images:        ${missing.length}`);
  console.log(`Self-referencing URLs:  ${self.length}`);

  if (broken.length > 0) {
    console.log("\n--- BROKEN LINKS ---");
    for (const b of broken) {
      console.log(`  [${b.source}] ${b.url}`);
      if (b.text) console.log(`    text: ${b.text}`);
    }
  }

  if (missing.length > 0) {
    console.log("\n--- MISSING IMAGES ---");
    for (const img of missing) {
      console.log(`  [${img.source}] ${img.url}`);
      if (img.text) console.log(`    alt: ${img.text}`);
    }
  }

  if (self.length > 0) {
    console.log("\n--- SELF-REFERENCING EXTERNAL ---");
    for (const s of self) {
      console.log(`  [${s.source}] ${s.url}  -> ${s.suggested}`);
    }
  }

  // 6. Exit code
  const total = broken.length + missing.length;
  if (total > 0) {
    console.log(`\nFAILED: ${total} broken links/images found.`);
    process.exit(1);
  } else {
    console.log("\nPASSED: No broken links or images found.");
    process.exit(0);
  }
}

main();
