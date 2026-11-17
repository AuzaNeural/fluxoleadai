import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Export raw rgba
const img = 'C:/Users/alecs/.gemini/antigravity/brain/f0f51e9a-f2d5-49d8-9c3b-5a5c4cb9ee8a/.user_uploaded/media_1794878049247_51e5b8d6.png';
const rawPath = 'scripts/image_raw.rgba';

execSync(`"${ffmpeg}" -y -i "${img}" -f rawvideo -pix_fmt rgba "${rawPath}"`);

const width = 513;
const height = 568;
const buf = fs.readFileSync(rawPath);

let minX = width, maxX = 0, minY = height, maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = buf[idx];
    const g = buf[idx + 1];
    const b = buf[idx + 2];
    // Check if nearly white
    if (r > 240 && g > 240 && b > 240) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log({ minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

// Now crop the white QR code box into public/brand/qr-code.png
const cropW = maxX - minX;
const cropH = maxY - minY;
const outPng = 'public/brand/whatsapp-qr.png';

execSync(`"${ffmpeg}" -y -i "${img}" -vf "crop=${cropW}:${cropH}:${minX}:${minY}" "${outPng}"`);
console.log('Saved cropped QR code to', outPng);
