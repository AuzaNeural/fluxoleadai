import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkSearch() {
  const searchId = 'f36a6861-b4f5-4fe5-8f0b-a98ffddd9a8e';
  
  // Try fetching /api/buscar or /api/buscas or /api/search or similar
  const endpoints = [
    `https://fluxoleadai.com.br/app/buscar/${searchId}`,
    `https://fluxoleadai.com.br/api/buscar/${searchId}`,
    `https://fluxoleadai.com.br/api/buscas/${searchId}`,
    `https://fluxoleadai.com.br/api/busca/${searchId}`,
    `https://fluxoleadai.com.br/api/leads/${searchId}`,
    `https://fluxoleadai.com.br/api/empresas/${searchId}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log(url, '=> Status:', res.status, 'Type:', res.headers.get('content-type'));
      if (res.status === 200 && res.headers.get('content-type')?.includes('json')) {
        const data = await res.json();
        console.log('Got JSON from', url, Object.keys(data));
        fs.writeFileSync('search_api_result.json', JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log(url, 'error:', e.message);
    }
  }
}

checkSearch();
