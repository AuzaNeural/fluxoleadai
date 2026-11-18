const fs = require('fs');
const path = require('path');

const outDir = 'capture_landing/standin_clone';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let html = fs.readFileSync('capture_landing/page.html', 'utf8');

// Ensure links that are relative or point to external are well structured
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Saved standalone clone HTML to', path.join(outDir, 'index.html'));
