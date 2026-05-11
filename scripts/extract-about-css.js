const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'data', 'wp-html', 'about.html');
const html = fs.readFileSync(sourcePath, 'utf8');

const styleMatches = [...html.matchAll(/<style[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/style>/g)];
for (const [, id, css] of styleMatches) {
  if (!/uagb-style-frontend-203|wpforms-form-339|uagb-block-(56811aa8|5f4b1139|262e34d4|4f510e9f|e3ee6a34|99b62053|11b39758|c49031ff|8f7c6a5b|7fd0a09e|4084160e|55dd86c5|b49613d3|4b5c4fc6|b7884180|2c780bfa)/.test(css)) {
    continue;
  }

  console.log(`\n/* ${id} */\n`);
  console.log(css);
}
