const fs = require('fs');
const html = fs.readFileSync('capture_landing/page.html', 'utf8');
const idx = html.indexOf('id="valor"');
const endIdx = html.indexOf('</section>', idx);
console.log(html.slice(idx, endIdx + 2000).replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean).join('\n'));
