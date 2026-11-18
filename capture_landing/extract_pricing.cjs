const fs = require('fs');
const html = fs.readFileSync('capture_landing/page.html', 'utf8');

const idx = html.indexOf('Fluxo Lead Mensal');
if (idx !== -1) {
  console.log('--- PRICING SNIPPET ---');
  console.log(html.slice(idx - 100, idx + 2500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}

const tIdx = html.indexOf('O que os clientes falaram');
if (tIdx !== -1) {
  console.log('\n--- TESTIMONIALS SNIPPET ---');
  console.log(html.slice(tIdx - 100, tIdx + 1500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
