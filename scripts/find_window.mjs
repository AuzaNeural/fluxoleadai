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

// Let's find where the URL bar / browser tab bar is
for (let y = 0; y < 400; y += 10) {
  let darkCount = 0;
  for (let x = 0; x < width; x += 10) {
    const p = getPixel(x, y);
    if (p.r < 30 && p.g < 30 && p.b < 30) darkCount++;
  }
  console.log(`y=${y}: dark pixels = ${darkCount}/${Math.floor(width/10)}`);
}
