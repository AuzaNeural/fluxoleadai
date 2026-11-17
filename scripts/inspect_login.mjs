import fs from 'fs';

const html = fs.readFileSync('login_page.html', 'utf8');
const scriptMatches = html.match(/src="[^"]+"/g) || [];
console.log('Scripts:');
scriptMatches.forEach(s => console.log(' ', s));

// Let's find any URLs or next data
const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (nextDataMatch) {
  console.log('Found __NEXT_DATA__');
  fs.writeFileSync('next_data.json', nextDataMatch[1]);
} else {
  console.log('No __NEXT_DATA__ (likely App Router)');
}

// Search for links or paths
const paths = html.match(/"\/[^"]+"/g) || [];
console.log('Paths count:', paths.length);
const appPaths = [...new Set(paths.filter(p => p.includes('app') || p.includes('prospeccao') || p.includes('buscar') || p.includes('api')))];
console.log('App paths:', appPaths);

