import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const width = 513;
const height = 568;
const buf = fs.readFileSync('scripts/image_raw.rgba');

// Let's find rows where there are at least 150 consecutive white pixels (the top edge of the white QR card)
let cardMinY = 0;
let cardMaxY = 0;
let cardMinX = 0;
let cardMaxX = 0;

for (let y = 100; y < 450; y++) {
  let consecutive = 0;
  let startX = 0;
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
    if (r > 240 && g > 240 && b > 240) {
      if (consecutive === 0) startX = x;
      consecutive++;
      if (consecutive > 200) {
        if (!cardMinY) {
          cardMinY = y;
          cardMinX = startX;
        }
        cardMaxY = y;
      }
    } else {
      consecutive = 0;
    }
  }
}

// Find cardMaxX from the cardMinY row
for (let x = width - 1; x >= 0; x--) {
  const idx = (Math.floor((cardMinY + cardMaxY) / 2) * width + x) * 4;
  const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
  if (r > 240 && g > 240 && b > 240) {
    cardMaxX = x;
    break;
  }
}

for (let x = 0; x < width; x++) {
  const idx = (Math.floor((cardMinY + cardMaxY) / 2) * width + x) * 4;
  const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
  if (r > 240 && g > 240 && b > 240) {
    cardMinX = x;
    break;
  }
}

console.log({ cardMinX, cardMaxX, cardMinY, cardMaxY, w: cardMaxX - cardMinX, h: cardMaxY - cardMinY });

const cropW = cardMaxX - cardMinX;
const cropH = cardMaxY - cardMinY;
const img = 'C:/Users/alecs/.gemini/antigravity/brain/f0f51e9a-f2d5-49d8-9c3b-5a5c4cb9ee8a/.user_uploaded/media_1794878049247_51e5b8d6.png';
const outPng = 'public/brand/whatsapp-qr.png';

execSync(`"${ffmpeg}" -y -i "${img}" -vf "crop=${cropW}:${cropH}:${cardMinX}:${cardMinY}" -update 1 "${outPng}"`);
console.log('Successfully cropped exact QR card to:', outPng);
