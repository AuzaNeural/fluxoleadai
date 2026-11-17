import fs from 'fs';

const text = fs.readFileSync('chunk__static_chunks_44ov6z39j5m4x_js.js', 'utf8');
console.log('Size:', text.length);

const idx = text.indexOf('76720');
if (idx !== -1) {
  console.log('--- MODULE 76720 ---');
  console.log(text.substring(idx - 100, idx + 1000));
}
