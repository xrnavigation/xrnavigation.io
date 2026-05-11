const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

function absolutizeWpUrls(source) {
  return source
    .replace(/(["'(])\/wp-content\//g, `$1https://xrnavigation.io/wp-content/`)
    .replace(/(["'(])\/wp-includes\//g, `$1https://xrnavigation.io/wp-includes/`);
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: node scripts/export-live-page-fragment.js <slug>");
    process.exit(1);
  }

  const url = `https://xrnavigation.io/${slug}/`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

  const fragment = await page.evaluate(() => {
    const entry = document.querySelector(".entry-content");
    if (!entry) {
      throw new Error("No .entry-content found on live page");
    }

    const html = entry.innerHTML.trim();
    const tokenMatches = html.match(
      /(uagb-block-[a-z0-9]+|wp-container-core-[a-z0-9-]+|wp-block-[a-z0-9-]+-is-layout-[a-z0-9-]+)/gi
    );
    const tokens = Array.from(new Set(tokenMatches || []));
    const bodyClasses = Array.from(document.body.classList);
    const pageIdClass = bodyClasses.find((cls) => /^page-id-\d+$/.test(cls)) || "";

    const styles = Array.from(document.querySelectorAll("style"))
      .map((style) => style.textContent || "")
      .filter((css) => {
        if (!css.trim()) return false;
        if (pageIdClass && css.includes(pageIdClass)) return true;
        return tokens.some((token) => css.includes(token));
      })
      .join("\n\n");

    return { html, styles, pageIdClass };
  });

  await browser.close();

  const outDir = path.join(__dirname, "..", "data", "wp-rendered");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, `${slug}.html`),
    absolutizeWpUrls(fragment.html) + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(outDir, `${slug}.css`),
    absolutizeWpUrls(fragment.styles) + "\n",
    "utf8"
  );

  console.log(
    JSON.stringify(
      {
        slug,
        url,
        pageIdClass: fragment.pageIdClass,
        htmlFile: path.join("data", "wp-rendered", `${slug}.html`),
        cssFile: path.join("data", "wp-rendered", `${slug}.css`),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
