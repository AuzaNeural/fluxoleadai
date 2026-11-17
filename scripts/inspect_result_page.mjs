import fs from 'fs';

const html = fs.readFileSync('buscar_result_page.html', 'utf8');

// Find all script tags
const scriptMatches = html.match(/src="[^"]+"/g) || [];
console.log('Scripts in /app/buscar/[id]:');
scriptMatches.forEach(s => console.log(' ', s));

// Text preview
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
console.log('Text preview:', text.substring(0, 1500));

