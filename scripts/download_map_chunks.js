import fs from 'fs';

async function downloadMapChunks() {
  const files = [
    '/static/chunks/0eh3hg0a099nx.css',
    '/static/chunks/0tp0_7dz0yhfe.js'
  ];

  for (const f of files) {
    const url = `https://fluxoleadai.com.br/_next${f}`;
    const res = await fetch(url);
    if (res.ok) {
      const text = await res.text();
      const fname = f.split('/').pop();
      fs.writeFileSync(fname, text);
      console.log(`Saved ${fname}: ${text.length} bytes`);
    } else {
      console.log(`Failed to fetch ${f}: ${res.status}`);
    }
  }
}

downloadMapChunks();
