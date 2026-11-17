import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');

// Find all string literals in the file
const strings = content.match(/"([^"\\]|\\.)*"/g) || [];
const uniqueStrings = [...new Set(strings.map(s => s.slice(1, -1)))];
console.log('Total unique strings:', uniqueStrings.length);
console.log('Sample strings:', uniqueStrings.filter(s => s.length > 3 && !s.startsWith('/') && !s.includes('class')).slice(0, 50));
