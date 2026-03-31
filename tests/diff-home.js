const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default;
const fs = require('fs');

const baselinePath = 'tests/baseline/home-desktop.png';
const currentPath = 'tests/current/home-desktop.png';
const diffPath = 'tests/diffs/home-diff.png';

const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
const img2 = PNG.sync.read(fs.readFileSync(currentPath));

console.log(`Baseline: ${img1.width}x${img1.height}`);
console.log(`Current:  ${img2.width}x${img2.height}`);

const width = Math.max(img1.width, img2.width);
const height = Math.max(img1.height, img2.height);

function padImage(img, targetWidth, targetHeight) {
  if (img.width === targetWidth && img.height === targetHeight) {
    return img.data;
  }
  const padded = Buffer.alloc(targetWidth * targetHeight * 4, 255);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const srcIdx = (y * img.width + x) * 4;
      const dstIdx = (y * targetWidth + x) * 4;
      padded[dstIdx] = img.data[srcIdx];
      padded[dstIdx + 1] = img.data[srcIdx + 1];
      padded[dstIdx + 2] = img.data[srcIdx + 2];
      padded[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }
  return padded;
}

const data1 = padImage(img1, width, height);
const data2 = padImage(img2, width, height);

const diff = new PNG({ width, height });
const numDiffPixels = pixelmatch(data1, data2, diff.data, width, height, { threshold: 0.1 });
const totalPixels = width * height;
const diffPercent = (numDiffPixels / totalPixels * 100).toFixed(2);

console.log(`Diff pixels: ${numDiffPixels} / ${totalPixels}`);
console.log(`Diff: ${diffPercent}%`);

fs.writeFileSync(diffPath, PNG.sync.write(diff));
console.log(`Diff image saved to ${diffPath}`);

// Analyze where diffs are concentrated
const rowDiffs = new Array(height).fill(0);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    if (diff.data[idx] > 200 && diff.data[idx + 1] < 100) {
      rowDiffs[y]++;
    }
  }
}

const regionSize = Math.floor(height / 10);
const regions = [];
for (let i = 0; i < 10; i++) {
  const start = i * regionSize;
  const end = Math.min(start + regionSize, height);
  let regionDiff = 0;
  for (let y = start; y < end; y++) {
    regionDiff += rowDiffs[y];
  }
  const regionPercent = (regionDiff / (width * (end - start)) * 100).toFixed(2);
  regions.push({ region: `${start}-${end}px (${(i*10)}%-${((i+1)*10)}%)`, diffPercent: regionPercent });
}

console.log('\nDiff by vertical region:');
regions.forEach(r => {
  const bar = '#'.repeat(Math.round(parseFloat(r.diffPercent)));
  console.log(`  ${r.region}: ${r.diffPercent}% ${bar}`);
});
