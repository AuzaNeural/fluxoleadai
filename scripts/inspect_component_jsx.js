import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');

// Search for the section Buscando empresas no mapa
const idx = content.indexOf('Buscando empresas no mapa');
if (idx !== -1) {
  console.log('--- BUSCANDO EMPRESAS NO MAPA (RADAR) ---');
  console.log(content.substring(idx - 500, idx + 1500));
}

// Search for Nova busca
const idx2 = content.indexOf('Nova busca');
if (idx2 !== -1) {
  console.log('--- NOVA BUSCA (SUMMARY) ---');
  console.log(content.substring(idx2 - 300, idx2 + 1500));
}
