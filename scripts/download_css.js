import fs from 'fs';

const cssFiles = [
  '/_next/static/chunks/1ijm1u9-bdmw9.css',
  '/_next/static/chunks/2549pzk9j5-vl.css',
  '/_next/static/chunks/3gd7f_673b0x6.css'
];

async function downloadCss() {
  for (const f of cssFiles) {
    const url = `https://fluxoleadai.com.br${f}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const fname = f.split('/').pop();
        fs.writeFileSync(fname, text);
        console.log(`Saved ${fname}: ${text.length} bytes`);
      }
    } catch (e) {
      console.log(`Failed to fetch ${f}:`, e.message);
    }
  }
}

downloadCss();
