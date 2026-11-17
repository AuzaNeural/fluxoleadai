import fs from 'fs';

const buf = fs.readFileSync('scripts/frame_015.rgba');
const width = 1920;
const height = 1080;

function getPixel(x, y) {
  const idx = (y * width + x) * 4;
  return {
    r: buf[idx],
    g: buf[idx + 1],
    b: buf[idx + 2],
    hex: '#' + [buf[idx], buf[idx+1], buf[idx+2]].map(c => c.toString(16).padStart(2, '0')).join('')
  };
}

// Find top edge where y is dark (at x=960)
let topY = 0;
for (let y = 0; y < height; y++) {
  const p = getPixel(960, y);
  if (p.r < 30 && p.g < 30 && p.b < 30) {
    topY = y;
    break;
  }
}

// Find left edge at y=500
let leftX = 0;
for (let x = 0; x < width; x++) {
  const p = getPixel(x, 500);
  if (p.r < 30 && p.g < 30 && p.b < 30) {
    leftX = x;
    break;
  }
}

// Find right edge at y=500
let rightX = width - 1;
for (let x = width - 1; x >= 0; x--) {
  const p = getPixel(x, 500);
  if (p.r < 30 && p.g < 30 && p.b < 30) {
    rightX = x;
    break;
  }
}

// Find bottom edge at x=960
let bottomY = height - 1;
for (let y = height - 1; y >= 0; y--) {
  const p = getPixel(960, y);
  if (p.r < 30 && p.g < 30 && p.b < 30) {
    bottomY = y;
    break;
  }
}

console.log(`App Bounding Box in video: X: ${leftX} to ${rightX} (w=${rightX - leftX}), Y: ${topY} to ${bottomY} (h=${bottomY - topY})`);
