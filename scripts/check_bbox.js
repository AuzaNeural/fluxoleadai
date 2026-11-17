import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');
const idx = content.indexOf('bbox');
console.log('Index of bbox:', idx);
if (idx !== -1) {
  console.log(content.substring(idx - 200, idx + 400));
}

