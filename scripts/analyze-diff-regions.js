const fs = require('fs');
const { PNG } = require('pngjs');

const imagePath = process.argv[2];

if (!imagePath) {
  console.error('Usage: node scripts/analyze-diff-regions.js <diff-png>');
  process.exit(1);
}

const png = PNG.sync.read(fs.readFileSync(imagePath));
const { width, height, data } = png;

const rowDiffs = new Array(height).fill(0);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (r > 200 && g < 120 && b < 120) {
      rowDiffs[y]++;
    }
  }
}

const regionSize = Math.ceil(height / 10);
const regions = [];

for (let i = 0; i < 10; i++) {
  const start = i * regionSize;
  const end = Math.min((i + 1) * regionSize, height);
  if (start >= end) {
    break;
  }
  let diffPixels = 0;
  for (let y = start; y < end; y++) {
    diffPixels += rowDiffs[y];
  }
  const totalPixels = width * (end - start);
  const percent = totalPixels === 0 ? 0 : (diffPixels / totalPixels) * 100;
  regions.push({
    region: `${start}-${end}`,
    percent: percent.toFixed(2),
    diffPixels,
    totalPixels,
  });
}

console.log(JSON.stringify({ imagePath, width, height, regions }, null, 2));
