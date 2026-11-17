import fs from 'fs';

const html = fs.readFileSync('buscar_result_page.html', 'utf8');
const links = html.match(/href="\/_next\/static\/chunks\/[^"]+\.css"/g) || [];
console.log('CSS links in result page:');
links.forEach(l => console.log(' ', l));

