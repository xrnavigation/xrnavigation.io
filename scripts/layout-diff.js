const { chromium } = require('playwright');

const slug = process.argv[2] || 'universities';
const viewportName = process.argv[3] || 'mobile';
const format = process.argv.includes('--json') ? 'json' : 'text';
const localPort = process.argv.includes('--port')
  ? process.argv[process.argv.indexOf('--port') + 1]
  : '1314';

const viewports = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 812 },
};

if (!viewports[viewportName]) {
  console.error(`Unknown viewport "${viewportName}". Use desktop or mobile.`);
  process.exit(1);
}

const browserSideExtract = ({ slug, source }) => {
  const pickContentRoot = () => {
    const candidates = [
      '.collection-page',
      '.entry-content',
      'main article .entry-content',
      'main article',
      '.site-main article',
      '#primary article',
      'main',
      '#primary',
    ];

    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el && el.getBoundingClientRect().height > 0) {
        return { el, selector };
      }
    }

    return { el: document.body, selector: 'body' };
  };

  const cleanText = (text) => text.replace(/\s+/g, ' ').trim();

  const importantClasses = (el) => {
    const raw = Array.from(el.classList || []);
    const keep = raw.filter((cls) =>
      /(uagb|wp-block|collection|info-box|feature|extra-content|hero|cta|card|grid|panel|entry-content|ast-|site-main|post|page|align)/i.test(cls)
    );
    return (keep.length ? keep : raw).slice(0, 6);
  };

  const getRect = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  };

  const isVisible = (el) => {
    if (!(el instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= 8 && rect.height >= 8;
  };

  const nodeKind = (el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'img') return 'image';
    if (/^h[1-6]$/.test(tag)) return 'heading';
    if (tag === 'p') return 'paragraph';
    if (tag === 'a' || tag === 'button') return 'action';
    if (tag === 'ul' || tag === 'ol') return 'list';
    if (tag === 'figure') return 'figure';

    const text = cleanText(el.innerText || '');
    const imgs = el.querySelectorAll('img').length;
    const headings = el.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
    const actions = el.querySelectorAll('a,button').length;
    const paragraphs = el.querySelectorAll('p').length;

    if (imgs > 0 && headings === 0 && text.length < 12) return 'image-block';
    if (headings > 0 && imgs > 0) return 'mixed';
    if (headings > 0 && paragraphs > 0) return 'text-block';
    if (actions > 0 && paragraphs === 0 && headings === 0) return 'action-block';
    if (imgs > 1) return 'image-group';
    return 'container';
  };

  const signatureText = (el) => {
    const heading = el.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) return cleanText(heading.innerText || '').slice(0, 80);

    const img = el.querySelector('img');
    if (img) {
      const alt = cleanText(img.getAttribute('alt') || '');
      if (alt) return alt.slice(0, 80);
    }

    return cleanText(el.innerText || '').slice(0, 80);
  };

  const childContainer = (el) => {
    if (!(el instanceof HTMLElement)) return el;
    const direct = Array.from(el.children).filter(isVisible);
    if (
      direct.length === 1 &&
      /(uagb-container-inner-blocks-wrap|feature-cards-inner|collection-hero-inner|collection-cta-inner|extra-content-inner|uagb-buttons__wrap|wp-block-columns)/i.test(
        direct[0].className || ''
      )
    ) {
      return direct[0];
    }
    return el;
  };

  const summarizeNode = (el, path) => {
    const container = childContainer(el);
    const children = Array.from(container.children)
      .filter(isVisible)
      .map((child, idx) => ({
        path: `${path}.${idx + 1}`,
        tag: child.tagName.toLowerCase(),
        kind: nodeKind(child),
        classes: importantClasses(child),
        text: signatureText(child),
        rect: getRect(child),
      }));

    return {
      path,
      tag: el.tagName.toLowerCase(),
      kind: nodeKind(el),
      classes: importantClasses(el),
      text: signatureText(el),
      rect: getRect(el),
      children,
    };
  };

  const { el: contentRoot, selector } = pickContentRoot();
  const roots = Array.from(contentRoot.children).filter(isVisible);

  return {
    slug,
    source,
    contentRootSelector: selector,
    bodyHeight: document.body.scrollHeight,
    roots: roots.map((el, idx) => summarizeNode(el, `${idx + 1}`)),
  };
};

const normalizeText = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (text) => {
  const tokens = normalizeText(text).split(' ').filter(Boolean);
  return new Set(tokens.slice(0, 12));
};

const textOverlap = (a, b) => {
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);
  if (!aTokens.size || !bTokens.size) return 0;
  let overlap = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap += 1;
  }
  return overlap / Math.max(aTokens.size, bTokens.size);
};

const classOverlap = (a, b) => {
  const aSet = new Set(a.classes || []);
  const bSet = new Set(b.classes || []);
  if (!aSet.size || !bSet.size) return 0;
  let overlap = 0;
  for (const token of aSet) {
    if (bSet.has(token)) overlap += 1;
  }
  return overlap / Math.max(aSet.size, bSet.size);
};

const similarityScore = (a, b) => {
  let score = 0;
  if (a.tag === b.tag) score += 2;
  if (a.kind === b.kind) score += 3;

  const textScore = textOverlap(a.text, b.text);
  if (textScore > 0) score += textScore * 8;

  const classScore = classOverlap(a, b);
  if (classScore > 0) score += classScore * 3;

  const heightDelta = Math.abs(a.rect.height - b.rect.height);
  const widthDelta = Math.abs(a.rect.width - b.rect.width);
  score -= Math.min(heightDelta / 250, 2);
  score -= Math.min(widthDelta / 250, 1);

  if (!a.text && !b.text && /image/.test(a.kind) && /image/.test(b.kind)) {
    score += 2;
  }

  return score;
};

const alignSequences = (left, right) => {
  const gap = -3.5;
  const rows = left.length + 1;
  const cols = right.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));
  const move = Array.from({ length: rows }, () => Array(cols).fill(null));

  for (let i = 1; i < rows; i += 1) {
    dp[i][0] = i * gap;
    move[i][0] = 'up';
  }
  for (let j = 1; j < cols; j += 1) {
    dp[0][j] = j * gap;
    move[0][j] = 'left';
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const diag = dp[i - 1][j - 1] + similarityScore(left[i - 1], right[j - 1]);
      const up = dp[i - 1][j] + gap;
      const leftMove = dp[i][j - 1] + gap;
      const best = Math.max(diag, up, leftMove);
      dp[i][j] = best;
      move[i][j] = best === diag ? 'diag' : best === up ? 'up' : 'left';
    }
  }

  const pairs = [];
  let i = left.length;
  let j = right.length;
  while (i > 0 || j > 0) {
    const step = move[i][j];
    if (step === 'diag') {
      pairs.push({ left: left[i - 1], right: right[j - 1], score: similarityScore(left[i - 1], right[j - 1]) });
      i -= 1;
      j -= 1;
    } else if (step === 'up') {
      pairs.push({ left: left[i - 1], right: null, score: gap });
      i -= 1;
    } else {
      pairs.push({ left: null, right: right[j - 1], score: gap });
      j -= 1;
    }
  }

  return pairs.reverse();
};

const matchSets = (left, right) => {
  const remainingLeft = left.map((node, index) => ({ node, index }));
  const remainingRight = right.map((node, index) => ({ node, index }));
  const pairs = [];

  while (remainingLeft.length && remainingRight.length) {
    let best = null;

    for (const l of remainingLeft) {
      for (const r of remainingRight) {
        const score = similarityScore(l.node, r.node);
        if (!best || score > best.score) {
          best = { left: l, right: r, score };
        }
      }
    }

    if (!best || best.score < 1) {
      break;
    }

    pairs.push({
      left: best.left.node,
      right: best.right.node,
      leftIndex: best.left.index,
      rightIndex: best.right.index,
      score: best.score,
    });

    const leftPos = remainingLeft.findIndex((entry) => entry.index === best.left.index);
    const rightPos = remainingRight.findIndex((entry) => entry.index === best.right.index);
    remainingLeft.splice(leftPos, 1);
    remainingRight.splice(rightPos, 1);
  }

  remainingLeft.forEach((entry) => {
    pairs.push({ left: entry.node, right: null, leftIndex: entry.index, rightIndex: null, score: 0 });
  });
  remainingRight.forEach((entry) => {
    pairs.push({ left: null, right: entry.node, leftIndex: null, rightIndex: entry.index, score: 0 });
  });

  return pairs.sort((a, b) => {
    const aIndex = a.leftIndex ?? a.rightIndex ?? 9999;
    const bIndex = b.leftIndex ?? b.rightIndex ?? 9999;
    return aIndex - bIndex;
  });
};

const summarizeDelta = (left, right) => {
  if (!left || !right) return [];
  return [
    `top ${right.rect.top - left.rect.top >= 0 ? '+' : ''}${right.rect.top - left.rect.top}`,
    `height ${right.rect.height - left.rect.height >= 0 ? '+' : ''}${right.rect.height - left.rect.height}`,
    `width ${right.rect.width - left.rect.width >= 0 ? '+' : ''}${right.rect.width - left.rect.width}`,
  ];
};

const renderNode = (node) =>
  `${node.path} ${node.tag}.${(node.classes || []).join('.')} ${node.kind} ` +
  `top=${node.rect.top} h=${node.rect.height} w=${node.rect.width} ` +
  `"${node.text}"`;

const renderAlignment = (label, pairs) => {
  const lines = [`${label}:`];

  pairs.forEach((pair, idx) => {
    lines.push(`  Pair ${idx + 1}:`);
    if (pair.left && pair.right) {
      lines.push(`    WP   ${renderNode(pair.left)}`);
      lines.push(`    HUGO ${renderNode(pair.right)}`);
      lines.push(`    DELTA ${summarizeDelta(pair.left, pair.right).join(', ')} | score=${pair.score.toFixed(2)}`);

      const childPairs = matchSets(pair.left.children || [], pair.right.children || []);
      childPairs.forEach((childPair) => {
        if (childPair.left && childPair.right) {
          lines.push(
            `      child WP ${childPair.left.kind}:${childPair.left.text || '[no text]'} ` +
              `-> HUGO ${childPair.right.kind}:${childPair.right.text || '[no text]'} ` +
              `(${summarizeDelta(childPair.left, childPair.right).join(', ')}, order ${childPair.leftIndex}->${childPair.rightIndex})`
          );
        } else if (childPair.left) {
          lines.push(`      child WP only   ${childPair.left.kind}:${childPair.left.text || '[no text]'}`);
        } else if (childPair.right) {
          lines.push(`      child HUGO only ${childPair.right.kind}:${childPair.right.text || '[no text]'}`);
        }
      });
    } else if (pair.left) {
      lines.push(`    WP only   ${renderNode(pair.left)}`);
    } else if (pair.right) {
      lines.push(`    HUGO only ${renderNode(pair.right)}`);
    }
  });

  return lines.join('\n');
};

const main = async () => {
  const browser = await chromium.launch();
  const viewport = viewports[viewportName];
  const wpUrl = `https://xrnavigation.io/${slug}/`;
  const hugoUrl = `http://127.0.0.1:${localPort}/${slug}/`;

  const collect = async (url, source) => {
    const page = await browser.newPage({ viewport });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const manifest = await page.evaluate(browserSideExtract, { slug, source });
    await page.close();
    return { url, ...manifest };
  };

  const [wp, hugo] = await Promise.all([collect(wpUrl, 'wp'), collect(hugoUrl, 'hugo')]);
  await browser.close();

  const rootAlignment = alignSequences(wp.roots, hugo.roots);
  const report = {
    slug,
    viewport: viewportName,
    wp: {
      url: wp.url,
      bodyHeight: wp.bodyHeight,
      contentRootSelector: wp.contentRootSelector,
      rootCount: wp.roots.length,
    },
    hugo: {
      url: hugo.url,
      bodyHeight: hugo.bodyHeight,
      contentRootSelector: hugo.contentRootSelector,
      rootCount: hugo.roots.length,
    },
    bodyHeightDelta: hugo.bodyHeight - wp.bodyHeight,
    alignment: rootAlignment,
  };

  if (format === 'json') {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const header = [
    `PAGE ${slug}`,
    `VIEWPORT ${viewportName} ${viewport.width}x${viewport.height}`,
    `WP   body=${wp.bodyHeight} root=${wp.contentRootSelector} roots=${wp.roots.length}`,
    `HUGO body=${hugo.bodyHeight} root=${hugo.contentRootSelector} roots=${hugo.roots.length}`,
    `BODY DELTA ${report.bodyHeightDelta >= 0 ? '+' : ''}${report.bodyHeightDelta}`,
    '',
  ];

  console.log(header.join('\n') + renderAlignment('ROOT ALIGNMENT', rootAlignment));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
