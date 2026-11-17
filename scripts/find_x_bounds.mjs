import fs from 'fs';

const buf = fs.readFileSync('scripts/frame_002.rgba');
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

// Check row y=500 across x from 0 to 1920
let rowReport = [];
for (let x = 0; x < width; x += 50) {
  const p = getPixel(x, 500);
  const isDark = (p.r < 30 && p.g < 30 && p.b < 30);
  rowReport.push(`x=${x}: ${isDark ? 'DARK' : 'LIGHT'}`);
}
console.log(rowReport.join(' | '));
