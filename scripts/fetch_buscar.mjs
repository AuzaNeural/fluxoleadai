import https from 'https';
import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookieHeader
      }
    }, res => {
      console.log(url, 'Status:', res.statusCode);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await get('https://fluxoleadai.com.br/app/buscar');
  fs.writeFileSync('buscar_authenticated.html', html);
  console.log('Saved buscar_authenticated.html, size:', html.length);
  
  // Find all script tags
  const scriptMatches = html.match(/src="[^"]+"/g) || [];
  console.log('Scripts in /app/buscar:');
  const chunks = [];
  scriptMatches.forEach(s => {
    console.log(' ', s);
    const m = s.match(/src="(\/_next\/static\/chunks\/[^"]+)"/);
    if (m) chunks.push('https://fluxoleadai.com.br' + m[1]);
  });
  
  for (const cUrl of chunks) {
    const chunkName = cUrl.split('/').pop();
    console.log('Fetching chunk:', chunkName);
    const chunkCode = await get(cUrl);
    fs.writeFileSync(`chunk_buscar_${chunkName}`, chunkCode);
  }
}

main().catch(console.error);

