import fs from 'fs';

const c = fs.readFileSync('chunk_result_2jgw8kai3gnah.js', 'utf8');
console.log('Total length:', c.length);

// Search for the radar and search states
const idxRadar = c.indexOf('Ver lista enquanto busca');
console.log('--- Around "Ver lista enquanto busca" ---');
console.log(c.substring(Math.max(0, idxRadar - 500), Math.min(c.length, idxRadar + 1000)));

// Search for the table and actions
const idxTable = c.indexOf('Criar site');
console.log('--- Around "Criar site" ---');
console.log(c.substring(Math.max(0, idxTable - 500), Math.min(c.length, idxTable + 1000)));

