const { PNG } = require('pngjs');
const fs = require('fs');
const diff = PNG.sync.read(fs.readFileSync('tests/current/diff-home.png'));
const w = diff.width, h = diff.height;
const bands = 20;
const bandH = Math.ceil(h / bands);
for (let b = 0; b < bands; b++) {
  let red = 0, total = 0;
  for (let y = b * bandH; y < Math.min((b+1)*bandH, h); y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      total++;
      if (diff.data[idx] > 200 && diff.data[idx+1] < 100) red++;
    }
  }
  const pct = (red/total*100).toFixed(1);
  const yStart = Math.round(b*bandH/h*100);
  const yEnd = Math.round((b+1)*bandH/h*100);
  console.log('Band ' + yStart + '-' + yEnd + '%: ' + pct + '% diff (' + red + '/' + total + ' red px)');
}
