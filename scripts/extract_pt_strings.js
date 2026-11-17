import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');
const strings = content.match(/"([^"\\]|\\.)*"/g) || [];
const ptStrings = strings.map(s => s.slice(1, -1)).filter(s => 
  s.length > 2 && 
  !s.startsWith('/_next') && 
  !s.startsWith('M') && 
  !s.startsWith('static/') &&
  !s.includes('px') &&
  !s.includes('rounded') &&
  !s.includes('flex')
);
console.log(JSON.stringify([...new Set(ptStrings)], null, 2));
