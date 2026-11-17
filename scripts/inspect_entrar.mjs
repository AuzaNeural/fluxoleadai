import fs from 'fs';

const html = fs.readFileSync('entrar_page.html', 'utf8');
const scriptMatches = html.match(/src="[^"]+"/g) || [];
console.log('Scripts in /entrar:');
scriptMatches.forEach(s => console.log(' ', s));

// Text preview
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
console.log('Text preview:', text.substring(0, 1000));

