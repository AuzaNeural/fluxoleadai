import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');
fs.writeFileSync('beautified_table_chunk.js', content.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '\n}\n'));
console.log('Beautified saved');
