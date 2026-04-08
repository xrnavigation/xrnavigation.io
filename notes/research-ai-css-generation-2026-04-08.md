# Research: AI/ML Approaches for CSS Generation from Visual Targets

Date: 2026-04-08

Context: Hugo site needs pixel-identical appearance to WordPress site. Currently hand-crafting CSS. Researching whether AI can automate this.

---

## 1. Vision-Model-Driven CSS Generation (Screenshot to Code)

### Tools That Exist

- **screenshot-to-code** (github.com/abi/screenshot-to-code) -- 53k+ GitHub stars. Uses GPT-4V to analyze screenshot, generates HTML+CSS (Tailwind, React, Vue, Bootstrap). Has iterative refinement loop where it screenshots its own output and re-prompts to close the gap. Open source.
  - URL: https://github.com/abi/screenshot-to-code

- **Fronty** (fronty.com) -- Commercial. Upload JPEG/PNG, get HTML+CSS back.
  - URL: https://fronty.com/

- **IMG2HTML** (img2html.com) -- Similar upload-and-convert flow.
  - URL: https://www.img2html.com/

- **ScreenCoder** (github.com/leigest519/ScreenCoder) -- Clean HTML/CSS from screenshots.
  - URL: https://github.com/leigest519/ScreenCoder

### Accuracy Reality

- Marketing claims "pixel-perfect." Actual benchmarks: never truly pixel-perfect. Best results score ~2/3 on fidelity scales meaning "very close but not identical."
- Divide-and-conquer approaches (splitting page into sections, generating each) improve accuracy by ~13% (CLIP score) vs direct single-prompt generation.
- Chain-of-thought prompting often drops CSS entirely (70% of outputs in one study had no CSS at all).
- Layout hierarchy inference is the hard part: containers, nesting, flex/grid relationships.
- **Bottom line for our case: these tools generate FROM SCRATCH. They don't patch existing CSS. They'd produce Tailwind output that has nothing to do with our Hugo theme structure. Not directly useful for incremental convergence.**

### Research Paper

- "Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach" (arxiv.org/html/2406.16386v2) -- best academic treatment of the problem.

---

## 2. Visual Diff to CSS Patch (The Dream Workflow)

### What Exists

- **auto-image-diff** (github.com/AdamManuel-dev/auto-image-diff) -- THIS IS THE CLOSEST THING TO THE DREAM.
  - Aligns two screenshots using computer vision (subimage search, phase correlation, feature matching)
  - Classifies diffs: style, layout, size, structural changes (with confidence scores)
  - `--suggest-css` flag generates CSS fix suggestions
  - Outputs structured JSON designed for AI agent consumption
  - Explicitly built for "AI Coding Agents to call with a screenshot of the design against a screenshot of the current implementation"
  - URL: https://github.com/AdamManuel-dev/auto-image-diff

- **Round-trip screenshot testing with Claude Code** (Tal Rotbart, Feb 2026 Medium post)
  - Workflow: make CSS change -> screenshot -> feed to Claude vision -> Claude identifies visual regressions
  - "Claude Code catches a significant number of visual issues before I even start reviewing"
  - Limitations: no accuracy metrics published; depends on Claude's visual perception; better for catching regressions than generating fixes
  - URL: https://medium.com/@rotbart/giving-claude-code-eyes-round-trip-screenshot-testing-ce52f7dcc563

- **CSS Refactoring with an AI Safety Net** (Daniela Baron blog post)
  - Uses Claude to compare before/after screenshots during CSS refactoring
  - Claude describes differences like "the card border radius looks slightly sharper"
  - Good enough to direct manual fixes, not to auto-generate them
  - URL: https://danielabaron.me/blog/css-refactoring-with-an-ai-safety-net/

- **inspecta** (inspecta.design) -- Browser extension that lets you visually edit CSS and export changes as prompts for AI code editors.
  - URL: https://inspecta.design/

### Assessment

auto-image-diff is the most promising tool here. The workflow would be:
1. Screenshot WordPress page
2. Screenshot Hugo page
3. Run auto-image-diff with --suggest-css
4. Feed structured diff + CSS suggestions to Claude
5. Claude generates actual CSS patch for our theme

This is buildable today. The CSS suggestions from auto-image-diff are heuristic (not AI-generated), so quality may vary. The real power is the structured diff data feeding an LLM.

---

## 3. DOM Comparison Approaches

### Visual Regression Tools (BackstopJS, Percy, Chromatic)

- **BackstopJS** -- Free, open source, Puppeteer-based. Takes screenshots, diffs them, reports changes. NO fix suggestions. Detection only.
- **Percy** (BrowserStack) -- Cloud SaaS, screenshot comparison dashboard. Approve/reject changes. NO fix suggestions.
- **Chromatic** -- Storybook-focused. Component-level visual testing. NO fix suggestions.
- **Diffy** (diffy.website) -- WordPress/Drupal focused. Screenshots + email alerts. NO fix suggestions.

**None of these tools suggest CSS fixes. They are all detection-only.** The gap between "here's a red overlay showing what changed" and "here's the CSS to fix it" is where all the unsolved work lives.

### CSS Diff Tools

- **CSS-Diff Chrome Extension** (github.com/kdzwinel/CSS-Diff) -- Compare computed styles of two HTML elements side by side in DevTools. Manual, element-by-element.
- **cssdiff** (github.com/stoyan/cssdiff) -- CLI tool for visual CSS diffing.
- **SemanticDiff** (semanticdiff.com) -- Online CSS text diff that parses CSS into structure before comparing.
- **cssdiff Chrome Extension** (github.com/borgstrom/cssdiff-chrome-extension) -- Shows patch-style listing of live CSS edits made in inspector.

### Assessment

The DOM comparison approach is viable but requires custom tooling. No off-the-shelf tool does "compare DOM of page A to DOM of page B and generate CSS patch." You'd have to build it.

---

## 4. Puppeteer/Playwright Computed-Style Extraction

### The Approach

Use headless browser to visit WordPress page, extract `getComputedStyle()` for every element, then apply those values to the Hugo page's DOM.

### Implementation

```javascript
// Basic pattern - works in both Puppeteer and Playwright
const styles = await page.evaluate(() => {
  const elements = document.querySelectorAll('*');
  return Array.from(elements).map(el => ({
    tag: el.tagName,
    classes: el.className,
    id: el.id,
    styles: {
      // extract specific properties of interest
      margin: getComputedStyle(el).margin,
      padding: getComputedStyle(el).padding,
      fontSize: getComputedStyle(el).fontSize,
      // ... etc
    }
  }));
});
```

### Known Issues

- `getComputedStyle()` returns resolved values (px) not authored values (rem, %). The extracted CSS would be brittle and non-responsive.
- DOM structures between WordPress and Hugo differ, so element-to-element mapping is non-trivial. WordPress has deeply nested divs from Gutenberg/page builders; Hugo has cleaner markup.
- Extracting ALL computed properties produces enormous output (300+ properties per element). Need to filter to layout-relevant properties.
- Puppeteer issue #5009: `page.evaluate` sometimes returns incorrect computed styles in headless mode.
- **Key article**: Sean Ryan's "Scraping accurate computed CSS styles from a website by element or by coordinates via Puppeteer" (https://medium.com/@mr.sean.ryan/scraping-accurate-computed-css-styles-from-a-website-by-element-or-by-coordinates-via-puppeteer-e8487d14c6b2)

### Assessment

Computed-style extraction is a building block, not a solution. The hard problem is mapping WordPress DOM elements to Hugo DOM elements. Once you have that mapping, diffing computed styles is straightforward. Nobody has built a general-purpose "extract styles from site A, apply to site B" tool because the DOM mapping problem is site-specific.

A viable custom approach for this project:
1. Define a mapping of CSS selectors (WordPress selector -> Hugo selector)
2. Extract computed styles for mapped elements from both sites
3. Diff the computed values
4. Generate CSS rules for the Hugo selectors with the WordPress values
5. Filter to properties that actually differ

---

## 5. Website Appearance Replication Tools

### AI-Powered Cloners

- **UXMagic** (uxmagic.ai) -- Claims 95% accuracy. Exports to Figma or React/HTML/CSS. Captures layout, typography, colors, spacing.
  - URL: https://uxmagic.ai/clone-any-website

- **Zoer** (zoer.ai) -- Goes beyond UI, attempts to reconstruct backend infrastructure from visual analysis.
  - URL: https://zoer.ai/

- **WebsiteCloner.io** -- Generates Tailwind CSS from cloned sites.
  - URL: https://websitecloner.io/

- **ai-website-cloner-template** (github.com/JCodesMore/ai-website-cloner-template) -- "Clone any website with one command using AI coding agents."
  - URL: https://github.com/JCodesMore/ai-website-cloner-template

- **website-cloner skill for Claude** (lobehub.com) -- LobeHub skill plugin.
  - URL: https://lobehub.com/skills/horuz-ai-claude-plugins-website-cloner

### Traditional Cloners

- **HTTrack** -- Downloads static HTML/CSS/JS/images. Does not execute JavaScript, so misses dynamically-computed styles.
- **wget -r -k -p -E** -- Same limitations as HTTrack.

### Assessment

These tools clone the ENTIRE site from scratch. They don't help with incremental convergence of an existing Hugo site toward a WordPress target. They'd give you a new static HTML site that looks like WordPress but has nothing to do with your Hugo theme, content structure, or build pipeline.

However: UXMagic or similar could be useful as a REFERENCE -- clone the WordPress site, then compare its CSS output to your Hugo CSS to identify gaps.

---

## Recommended Approach for This Project

Given the research, the most practical workflow combines several approaches:

### Tier 1: Build Now (highest ROI)

1. **Computed-style extraction script** (Playwright): Extract key layout properties from WordPress pages and Hugo pages. Diff them per-element. Generate CSS patches. This is ~200 lines of custom JS and directly addresses the problem.

2. **Claude vision loop**: Screenshot both sites, feed side-by-side to Claude with the current CSS file, ask for specific CSS fixes. This is what the "round-trip screenshot testing" approach does. No new tooling needed -- just a prompt pattern.

### Tier 2: Evaluate (promising but unproven)

3. **auto-image-diff**: Install and test the `--suggest-css` feature against actual WordPress vs Hugo screenshots. If the CSS suggestions are useful, integrate into the workflow.

### Tier 3: Not Worth It

4. Screenshot-to-code tools (generate from scratch, wrong paradigm)
5. Website cloners (generate from scratch, lose Hugo structure)
6. Visual regression tools (detection only, no fix generation)

### The Ideal Pipeline (Buildable Today)

```
WordPress page ---[Playwright]--> screenshot + computed styles
Hugo page -------[Playwright]--> screenshot + computed styles
                                      |
                            [computed style diff]
                                      |
                            [CSS patch draft]
                                      |
                     [Claude vision: verify screenshot match]
                                      |
                            [refined CSS patch]
                                      |
                     [apply to Hugo theme, re-screenshot, iterate]
```

This is automatable. Each step uses existing tools. The Claude vision step is the "intelligence" layer that handles ambiguity in the style mapping.
