import fs from 'fs';

const c = fs.readFileSync('chunk_result_2jgw8kai3gnah.js', 'utf8');

// Search for "Registro da execução"
const idx = c.indexOf('Registro da execução');
console.log('--- Around "Registro da execução" ---');
console.log(c.substring(idx - 300, idx + 1000));

