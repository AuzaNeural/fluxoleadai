import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');
const idx = content.indexOf('Buscando empresas no mapa');
console.log(content.substring(idx - 1600, idx - 600));

