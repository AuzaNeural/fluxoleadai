import fs from 'fs';

const text = fs.readFileSync('0tp0_7dz0yhfe.js', 'utf8');
console.log('Size:', text.length);

// Search for maplibre, style, tiles, openfreemap, etc.
const kw = ['maplibre', 'style', 'tiles', 'openfreemap', 'maptiler', 'tile', 'center', 'zoom', 'pitch', 'bearing'];
for (const k of kw) {
  let idx = 0;
  while ((idx = text.indexOf(k, idx)) !== -1) {
    console.log(`[${k}]`, text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 150)));
    idx += 150;
    if (idx > 2000) break;
  }
}
