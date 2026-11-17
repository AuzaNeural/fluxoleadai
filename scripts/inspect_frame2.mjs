import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Let's dump frame_002 to raw rgba (1920x1080)
execSync(`"${ffmpeg}" -y -i "scripts/crm_frames/frame_002.jpg" -f rawvideo -pix_fmt rgba scripts/frame_002.rgba`);
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

// Find any text/regions with non-black pixels
console.log('Sidebar area (x=100, y=100):', getPixel(100, 100));
console.log('Main area (x=500, y=100):', getPixel(500, 100));

// Find lines/text vertically at x=400
for (let y = 50; y < 500; y += 30) {
  console.log(`y=${y}:`, getPixel(400, y));
}
