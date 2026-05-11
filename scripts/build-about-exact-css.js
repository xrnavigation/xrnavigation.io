const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'data', 'wp-html', 'about.html');
const outputPath = path.join(__dirname, '..', 'themes', 'xrnav', 'static', 'css', 'wp-about-exact.css');

const html = fs.readFileSync(sourcePath, 'utf8');
const styleMatch = html.match(/<style id="uagb-style-frontend-203">([\s\S]*?)<\/style>/);

if (!styleMatch) {
  throw new Error('uagb-style-frontend-203 not found in about.html');
}

const css = styleMatch[1]
  .replace(/url\((["']?)\/wp-content\//g, 'url($1https://xrnavigation.io/wp-content/')
  .replace(/@media only screen/g, '@media screen');

fs.writeFileSync(outputPath, `${css}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
