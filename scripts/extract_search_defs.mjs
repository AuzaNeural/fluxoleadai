import fs from 'fs';

const code = fs.readFileSync('chunk_buscar_1fc05t9bbsihw.js', 'utf8');

// Let's find where y, G, O, I, J, v, j are defined
console.log('--- Searching for definitions ---');

// Print from start to offset 12000
fs.writeFileSync('search_chunk_first_half.js', code.substring(0, 12000));
console.log('Saved first half, length:', code.substring(0, 12000).length);

