import fs from 'fs';

const c = fs.readFileSync('chunk_result_2jgw8kai3gnah.js', 'utf8');

const idx = c.indexOf('WhatsApp');
console.log('--- WhatsApp in table ---');
console.log(c.substring(idx - 200, idx + 600));

