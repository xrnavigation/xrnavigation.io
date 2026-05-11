# Proposal: Migrate xrnavigation.io from WordPress to Hugo

## What We're Doing

We're replacing the WordPress site at xrnavigation.io with a static site built using [Hugo](https://gohugo.io), hosted from a GitHub repository in the xrnavigation org. The site will look identical to visitors. The editing experience will be radically simpler.

## Why

**WordPress is overhead we don't need.** The site is a marketing site with ~75 pages, 11 blog posts, and a contact form. There is no e-commerce, no user accounts, no dynamic content. Every page is either static text or an Audiom embed iframe. WordPress requires a hosting account, a database, PHP, plugin updates, security patches, and ongoing maintenance for all of that — to serve what is fundamentally a collection of static pages.

**What we get by leaving:**

- **No more hosting costs** for WordPress/PHP/MySQL. Static sites deploy free on GitHub Pages, Netlify, or Cloudflare Pages.
- **No more plugin updates.** The site currently has 21 plugins, 19 of which have pending updates. Two SEO plugins are running simultaneously.
- **No more security surface.** A static site has no database to hack, no admin panel to brute-force, no PHP vulnerabilities to exploit.
- **No more "the site is down."** Static files served from a CDN don't go down.
- **Version history for free.** Every change is a git commit. You can see who changed what, when, and roll back instantly.

## How People Will Edit the Site

All site content lives as Markdown files in a GitHub repository. To edit a page:

1. **In the browser:** Open the file on GitHub, click the pencil icon, make your edit, commit. Done. GitHub has a built-in Markdown editor with preview.
2. **On your computer:** Clone the repo, edit in any text editor, push. Hugo can run locally to preview changes before publishing.
3. **With an agent:** Point any AI coding tool at the repo. Markdown files are the easiest format for agents to read and write. No WordPress API, no block editor, no Gutenberg — just text files.

A typical map embed page looks like this in the repo:

```markdown
---
title: "NASA JPL Campus Map"
layout: audiom-embed
audiom_id: 42
---

Explore the NASA Jet Propulsion Laboratory campus with this accessible map.
```

That's the entire page. The template handles the iframe, the header, the footer, the nav, the styling.

Adding a new Audiom map page means creating a new file with the above format. No WordPress login required.

Blog posts work the same way — Markdown files in `content/blog/`, with the date in the filename.

## What Stays the Same

- **Visual appearance.** We are building the Hugo theme to match the current design pixel-for-pixel. We have extracted all design tokens (colors, fonts, spacing) and will use Playwright screenshot comparison against the live WordPress site as our conformance gate. The new site cannot ship until screenshots match.
- **All URLs.** Every existing page keeps its current URL path. The 12 existing redirect rules (event short URLs like `/csun26` → `/csun`) will be preserved.
- **Audiom map embeds.** All ~40+ map pages embed via iframe to `audiom.net/embed/{id}`. This works identically in static HTML.
- **Theme switcher.** The site's Default / Dark / High Contrast mode toggle carries over, cleaned up with proper CSS custom properties instead of the current inline-style approach.
- **Accessible video.** Able Player continues to handle video on the homepage.
- **Contact form.** Replaced with a static-site-compatible form service (Netlify Forms, Formspree, or similar) — same fields, same behavior.
- **SEO.** All meta tags, Open Graph data, and structured data will be generated from page frontmatter.
- **Analytics.** Google Analytics (G-4RGYN0JHKB) and Microsoft Clarity tracking codes drop into the base template.

## What Gets Better

- **Accessibility fixes become first-class.** The current site has 7 code snippets patching WordPress/Astra/WPForms accessibility issues (duplicate form IDs, missing aria-labels, keyboard traps in mobile menu, redundant image links). In Hugo, we generate correct HTML in the first place. No patches needed.
- **Performance.** Static HTML + CSS served from a CDN. No PHP rendering, no database queries, no 21 plugins loading JavaScript.
- **Editing for everyone.** Non-technical team members can edit Markdown on GitHub. Technical team members can use their preferred tools. AI agents can edit files directly.
- **Deployment is automatic.** Push to `main` → site rebuilds and deploys in seconds.

## How We Ensure Visual Parity

This is the core quality gate. Before we touch anything:

1. Playwright captures full-page screenshots of every page on the live WordPress site. This is the baseline.
2. As we build the Hugo site, Playwright captures the same pages and diffs them against the baseline.
3. The migration is not complete until screenshots pass within an acceptable threshold.

This test suite lives in the repo and runs in CI. It is not a one-time check — it protects against visual regressions going forward.

## Hosting and Deployment

The repository lives in the `xrnavigation` GitHub org. Options for hosting:

- **GitHub Pages** — Free, simplest setup, builds from the repo directly.
- **Netlify** — Free tier, automatic deploys on push, form handling built in, preview deploys for PRs.
- **Cloudflare Pages** — Free tier, fastest global CDN, automatic deploys.

All three serve static files from a CDN. Netlify is the most convenient if we want built-in form handling (no need for a third-party form service).

## What Happens to WordPress

Once the Hugo site is live and verified:

1. DNS for xrnavigation.io points to the new host.
2. The WordPress site stays up at a temporary URL for a reference period.
3. After confirming everything works, the WordPress hosting can be cancelled.

## Summary

| | WordPress (current) | Hugo (proposed) |
|---|---|---|
| Hosting cost | Monthly hosting fee | Free |
| Editing | WordPress admin login | GitHub / any text editor |
| Agent editing | WordPress API + plugins | Edit Markdown files directly |
| Security | PHP + DB + 21 plugins | Static files, no attack surface |
| Deploys | Manual or plugin-based | Automatic on git push |
| Uptime | Depends on host + PHP + DB | CDN-backed static files |
| Visual design | Astra + Spectra blocks | Matched Hugo theme |
| Accessibility | 7 patches on top of WP | Correct HTML from the start |
