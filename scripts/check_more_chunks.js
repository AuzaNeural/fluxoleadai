import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkAllChunks() {
  const chunks = [
    '/static/chunks/0xh689j1yax2f.js',
    '/static/chunks/2gvu8dyrhibpa.js',
    '/static/chunks/0ik18iu9wbrg_.js',
    '/static/chunks/0umf92h1sb77c.js',
    '/static/chunks/20jt2_pyx9qjv.js',
    '/static/chunks/3silp77xmz3jh.js',
    '/static/chunks/44ov6z39j5m4x.js',
    '/static/chunks/0cz1d0mv5g_q7.js'
  ];

  for (const chunk of chunks) {
    const url = `https://fluxoleadai.com.br/_next${chunk}`;
    try {
      const res = await fetch(url, { headers: { 'Cookie': cookieHeader } });
      if (res.ok) {
        const text = await res.text();
        const kw = ['Localizando', 'Ver lista', 'radar', 'maplibre', 'MapLibre', 'empresas encontradas', 'Gilvan', 'whatsapp', 'WhatsApp', 'Criar site'];
        const found = kw.filter(k => text.includes(k));
        if (found.length > 0) {
          console.log(`Chunk ${chunk} matched keywords:`, found);
          fs.writeFileSync(`chunk_${chunk.replace(/[^a-zA-Z0-9]/g, '_')}.js`, text);
        }
      }
    } catch (e) {}
  }
}

checkAllChunks();
