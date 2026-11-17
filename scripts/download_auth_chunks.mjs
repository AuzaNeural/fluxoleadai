import https from 'https';
import fs from 'fs';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const chunks = [
    '2r4s4h5xul1n-.js',
    '0xh689j1yax2f.js',
    '2gvu8dyrhibpa.js',
    '0ik18iu9wbrg_.js',
    'turbopack-2c3mg3r-05n1w.js',
    '0umf92h1sb77c.js',
    '45bgmdlwmau4u.js',
    '0cz1d0mv5g_q7.js',
    '1ckvzn7sfprko.js'
  ];

  for (const c of chunks) {
    const url = `https://fluxoleadai.com.br/_next/static/chunks/${c}`;
    console.log('Downloading', c);
    const content = await get(url);
    if (content.includes('signIn') || content.includes('login') || content.includes('supabase') || content.includes('firebase') || content.includes('/api/auth')) {
      console.log('--> Relevant chunk:', c);
      fs.writeFileSync(`chunk_${c}`, content);
    }
  }
}

main().catch(console.error);

