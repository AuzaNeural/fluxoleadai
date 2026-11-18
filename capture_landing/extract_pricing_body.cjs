const fs = require('fs');
const html = fs.readFileSync('capture_landing/page.html', 'utf8');
const idx = html.indexOf('id="valor"');
if (idx !== -1) {
  console.log('--- #VALOR BODY SNIPPET ---');
  console.log(html.slice(idx, idx + 4000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
} else {
  console.log('#valor not found, searching for 30,68...');
  const idx2 = html.indexOf('30,68');
  if (idx2 !== -1) {
    console.log(html.slice(idx2 - 500, idx2 + 1000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
}
