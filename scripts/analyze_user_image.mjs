import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const imgPath = 'C:/Users/alecs/.gemini/antigravity/brain/f0f51e9a-f2d5-49d8-9c3b-5a5c4cb9ee8a/.user_uploaded/media_1794916410892_0bf4df70.jpg';

const width = 1024;
const height = 445;

execSync(`"${ffmpeg}" -y -i "${imgPath}" -f rawvideo -pix_fmt rgba scripts/user_img_raw.rgba`);

const buf = fs.readFileSync('scripts/user_img_raw.rgba');

function getPixel(x, y) {
  const idx = (y * width + x) * 4;
  return {
    r: buf[idx],
    g: buf[idx + 1],
    b: buf[idx + 2],
    a: buf[idx + 3],
    hex: '#' + [buf[idx], buf[idx+1], buf[idx+2]].map(c => c.toString(16).padStart(2, '0')).join('')
  };
}

console.log('Outside table (x=2, y=2):', getPixel(2, 2));
console.log('Card border outer edge (x=500, y=1):', getPixel(500, 1));
console.log('Card header background (x=500, y=25):', getPixel(500, 25));
console.log('Header text EMPRESA (x=45, y=25):', getPixel(45, 25));
console.log('Row 1 background (x=500, y=80):', getPixel(500, 80));
console.log('Row 1 border line (x=500, y=55):', getPixel(500, 55));
console.log('Row 2 border line (x=500, y=118):', getPixel(500, 118));

// Let's sample badges!
// Row 1: Haroldo Azevedo Construções | Não contatado | (84) 3231-0094 | WhatsApp | Site funcionando | - | há 10 horas
// Let's find "Não contatado" badge in Row 1 (x between 250 and 380, y between 60 and 95)
console.log('\n--- Finding Não contatado badge in Row 1 ---');
let naoContatadoBg = null;
let naoContatadoBorder = null;
let naoContatadoText = null;

for (let y = 60; y < 95; y++) {
  for (let x = 280; x < 370; x++) {
    const p = getPixel(x, y);
    // Badge border or background or text
    if (p.r > p.g + 20 && p.r > 50) {
      // red/orange
      // console.log(`Red pixel at (${x}, ${y}): ${p.hex}`);
    }
  }
}

// Let's sample a cross-section of the "Não contatado" badge horizontally at y=76
console.log('\nCross section across "Não contatado" badge at y=76:');
for (let x = 280; x < 370; x += 3) {
  const p = getPixel(x, 76);
  console.log(`x=${x}: ${p.hex} R:${p.r} G:${p.g} B:${p.b}`);
}

// Cross section across "Site funcionando" badge at y=76 (x between 640 and 750)
console.log('\nCross section across "Site funcionando" badge at y=76:');
for (let x = 640; x < 750; x += 5) {
  const p = getPixel(x, 76);
  console.log(`x=${x}: ${p.hex} R:${p.r} G:${p.g} B:${p.b}`);
}

// Cross section across "WhatsApp" text/link at y=76 (x between 520 and 580)
console.log('\nCross section across WhatsApp link at y=76:');
for (let x = 520; x < 580; x += 3) {
  const p = getPixel(x, 76);
  if (p.g > p.r + 20) {
    console.log(`WhatsApp green at x=${x}: ${p.hex} R:${p.r} G:${p.g} B:${p.b}`);
  }
}

// Cross section across "Tentar WhatsApp" link in Row 2 at y=140 (x between 520 and 610)
console.log('\nCross section across Tentar WhatsApp link at y=140:');
for (let x = 520; x < 610; x += 5) {
  const p = getPixel(x, 140);
  console.log(`x=${x}: ${p.hex} R:${p.r} G:${p.g} B:${p.b}`);
}

// Cross section across "Site não informado" badge in Row 2 at y=140 (x between 640 and 760)
console.log('\nCross section across "Site não informado" badge at y=140:');
for (let x = 640; x < 760; x += 5) {
  const p = getPixel(x, 140);
  console.log(`x=${x}: ${p.hex} R:${p.r} G:${p.g} B:${p.b}`);
}

// Cross section across "Problema confirmado" badge in Row 5 at y=320 (x between 640 and 770)
console.log('\nCross section across "Problema confirmado" badge at y=320:');
for (let x = 640; x < 770; x += 5) {
  const p = getPixel(x, 320);
  console.log(`x=${x}: ${p.hex} R:${p.r} G:${p.g} B:${p.b}`);
}

// Footer at bottom (y around 425)
console.log('\nFooter at y=425:');
console.log('Footer text area (x=50, y=425):', getPixel(50, 425));
console.log('Footer border line at y=410:', getPixel(500, 410));
