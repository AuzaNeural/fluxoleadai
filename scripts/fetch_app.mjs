import https from 'https';
import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

console.log('Using Cookie:', cookieHeader);

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookieHeader
      }
    }, res => {
      console.log(url, 'Status:', res.statusCode, 'Location:', res.headers.location);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await get('https://fluxoleadai.com.br/app');
  fs.writeFileSync('app_authenticated.html', html);
  console.log('Saved app_authenticated.html, size:', html.length);
  
  // Find all links
  const hrefMatches = html.match(/href="\/app[^"]*"/g) || [];
  console.log('App links:', [...new Set(hrefMatches)]);
  
  // Find all script tags
  const scriptMatches = html.match(/src="[^"]+"/g) || [];
  console.log('Scripts:');
  scriptMatches.forEach(s => console.log(' ', s));
}

main().catch(console.error);

