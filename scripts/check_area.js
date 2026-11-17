import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');
const idx = content.indexOf('area:');
while (idx !== -1) {
  console.log('area: at', idx, content.substring(idx - 100, idx + 200));
  break;
}

