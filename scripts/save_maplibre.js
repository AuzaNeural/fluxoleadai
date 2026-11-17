import fs from 'fs';

const text = fs.readFileSync('0tp0_7dz0yhfe.js', 'utf8');
fs.writeFileSync('maplibre_full_extracted.js', text);
console.log('Saved maplibre_full_extracted.js, length:', text.length);
