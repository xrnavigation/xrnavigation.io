const { chromium } = require('playwright');
const slug = process.argv[2] || 'privacy-policy';
const url = slug === 'home' ? 'http://localhost:1314/' : `http://localhost:1314/${slug}/`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }});
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const htmlStyles = getComputedStyle(html);
    const bodyStyles = getComputedStyle(body);

    // Check key elements
    const h1 = document.querySelector('h1');
    const p = document.querySelector('.entry-content p, p');
    const container = document.querySelector('.ast-container');

    return {
      htmlFontSize: htmlStyles.fontSize,
      bodyFontSize: bodyStyles.fontSize,
      bodyClasses: body.className,
      scrollWidth: document.body.scrollWidth,
      scrollHeight: document.body.scrollHeight,
      h1FontSize: h1 ? getComputedStyle(h1).fontSize : 'N/A',
      h1Text: h1 ? h1.textContent.substring(0, 50) : 'N/A',
      pFontSize: p ? getComputedStyle(p).fontSize : 'N/A',
      containerMaxWidth: container ? getComputedStyle(container).maxWidth : 'N/A',
      containerPaddingLeft: container ? getComputedStyle(container).paddingLeft : 'N/A',
      containerWidth: container ? container.getBoundingClientRect().width : 'N/A',
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
