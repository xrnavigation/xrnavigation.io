/**
 * Export WordPress content from xrnavigation.io to Hugo-ready Markdown.
 * Uses the WP REST API (no auth needed for published content).
 *
 * Usage: node scripts/wp-export.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");
const TurndownService = require("turndown");

const SITE = "xrnavigation.io";
const API_BASE = `https://${SITE}/wp-json/wp/v2`;

// ── HTTP helper ──────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "wp-export/1.0" } }, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          // 400 on out-of-range page is normal (end of pagination)
          if (res.statusCode === 400) return resolve({ data: [], totalPages: 0 });
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const totalPages = parseInt(res.headers["x-wp-totalpages"] || "1", 10);
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ data: JSON.parse(body), totalPages });
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchAll(endpoint) {
  const items = [];
  let page = 1;
  while (true) {
    const url = `${API_BASE}/${endpoint}?per_page=100&page=${page}`;
    console.log(`  GET ${url}`);
    const { data, totalPages } = await fetchJSON(url);
    if (!data.length) break;
    items.push(...data);
    if (page >= totalPages) break;
    page++;
  }
  return items;
}

// ── Turndown setup ───────────────────────────────────────────────────────────

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  // Keep iframes as raw HTML (Hugo supports it)
  td.addRule("iframe", {
    filter: "iframe",
    replacement: (_content, node) => {
      const attrs = [];
      for (const a of ["src", "width", "height", "style", "allow", "allowfullscreen", "frameborder", "title"]) {
        const v = node.getAttribute(a);
        if (v) attrs.push(`${a}="${v}"`);
      }
      return `\n\n<iframe ${attrs.join(" ")}></iframe>\n\n`;
    },
  });

  // Strip Spectra wrapper divs — just pass through their content
  td.addRule("spectraWrappers", {
    filter: (node) => {
      if (node.nodeName !== "DIV") return false;
      const cls = node.getAttribute("class") || "";
      return (
        cls.includes("wp-block-uagb-container") ||
        cls.includes("uagb-container-inner-blocks-wrap") ||
        cls.includes("wp-block-uagb-")
      );
    },
    replacement: (content) => content,
  });

  return td;
}

// ── Audiom embed extraction ──────────────────────────────────────────────────

function extractAudiomId(html) {
  const match = html.match(/audiom\.net\/embed\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// ── HTML → Markdown conversion ───────────────────────────────────────────────

function htmlToMarkdown(html, turndown) {
  if (!html || !html.trim()) return "";
  return turndown.turndown(html).trim();
}

// ── Frontmatter + file writing ───────────────────────────────────────────────

function buildFrontmatter(item, audiomId) {
  const lines = ["---"];
  const title = decodeHtmlEntities(item.title.rendered || "");
  lines.push(`title: ${yamlString(title)}`);
  lines.push(`date: ${item.date.split("T")[0]}`);
  lines.push(`lastmod: ${item.modified.split("T")[0]}`);
  lines.push(`slug: "${item.slug}"`);
  if (audiomId) {
    lines.push(`layout: "audiom-embed"`);
    lines.push(`audiom_id: ${audiomId}`);
  }
  lines.push(`draft: false`);
  lines.push("---");
  return lines.join("\n");
}

function yamlString(s) {
  if (/[:"'{}\[\]#&*!|>%@`]/.test(s) || s.startsWith(" ") || s.endsWith(" ")) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return `"${s}"`;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&nbsp;/g, " ");
}

function writeMarkdown(filePath, frontmatter, body) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const content = body ? `${frontmatter}\n\n${body}\n` : `${frontmatter}\n`;
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  wrote ${filePath}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const root = path.resolve(__dirname, "..");
  const contentDir = path.join(root, "content");
  const turndown = makeTurndown();

  const stats = { pages: 0, posts: 0, audiomEmbeds: 0, warnings: [] };

  // Fetch pages and posts
  console.log("Fetching pages...");
  const pages = await fetchAll("pages");
  console.log(`  found ${pages.length} pages`);

  console.log("Fetching posts...");
  const posts = await fetchAll("posts");
  console.log(`  found ${posts.length} posts`);

  // Process pages
  for (const page of pages) {
    const html = page.content.rendered || "";
    const audiomId = extractAudiomId(html);
    const body = htmlToMarkdown(html, turndown);
    const fm = buildFrontmatter(page, audiomId);

    if (audiomId) stats.audiomEmbeds++;

    let filePath;
    if (page.slug === "home" || page.link === `https://${SITE}/`) {
      filePath = path.join(contentDir, "_index.md");
    } else {
      filePath = path.join(contentDir, `${page.slug}.md`);
    }

    writeMarkdown(filePath, fm, body);
    stats.pages++;
  }

  // Process posts
  for (const post of posts) {
    const html = post.content.rendered || "";
    const audiomId = extractAudiomId(html);
    const body = htmlToMarkdown(html, turndown);
    const fm = buildFrontmatter(post, audiomId);

    if (audiomId) stats.audiomEmbeds++;

    const filePath = path.join(contentDir, "blog", `${post.slug}.md`);
    writeMarkdown(filePath, fm, body);
    stats.posts++;
  }

  // Summary
  console.log("\n=== Export Summary ===");
  console.log(`Pages exported: ${stats.pages}`);
  console.log(`Posts exported: ${stats.posts}`);
  console.log(`Audiom embeds detected: ${stats.audiomEmbeds}`);
  if (stats.warnings.length) {
    console.log("Warnings:");
    stats.warnings.forEach((w) => console.log(`  - ${w}`));
  }

  // Write stats to a JSON file for the report
  fs.writeFileSync(
    path.join(root, "scripts", "wp-export-stats.json"),
    JSON.stringify(stats, null, 2),
    "utf8"
  );
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
