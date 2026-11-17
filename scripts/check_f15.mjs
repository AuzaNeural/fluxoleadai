import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Let's dump frame_015 (15s into the video) to raw rgba
execSync(`"${ffmpeg}" -y -i "scripts/crm_frames/frame_015.jpg" -f rawvideo -pix_fmt rgba scripts/frame_015.rgba`);
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

// Sample points
console.log('Top left (50, 50):', getPixel(50, 50));
console.log('Center (960, 540):', getPixel(960, 540));
console.log('Right area (1400, 540):', getPixel(1400, 540));
console.log('Left area (300, 540):', getPixel(300, 540));
console.log('Bottom (960, 1000):', getPixel(960, 1000));
