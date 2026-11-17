import https from 'https';
import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

const states = ['SP', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'ES', 'MT', 'MS', 'PA', 'AM', 'RN', 'PB', 'MA', 'PI', 'AL', 'SE', 'RO', 'TO', 'AC', 'AP', 'RR'];

function fetchStateCities(uf) {
  return new Promise((resolve) => {
    https.get(`https://fluxoleadai.com.br/api/locais?nivel=cidades&pais=BR&estado=${uf}`, {
      headers: { 'Cookie': cookieHeader }
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          resolve({ uf, items: parsed.items || [] });
        } catch {
          resolve({ uf, items: [] });
        }
      });
    }).on('error', () => resolve({ uf, items: [] }));
  });
}

async function main() {
  const allCitiesByUf = {};
  
  // Also load RJ
  const rj = JSON.parse(fs.readFileSync('locais_cidades_pais_BR_estado_RJ.json', 'utf8'));
  allCitiesByUf['RJ'] = rj.items || [];
  
  console.log('Fetching cities for remaining UFs...');
  for (const uf of states) {
    const res = await fetchStateCities(uf);
    console.log(`Fetched ${res.items.length} cities for ${uf}`);
    allCitiesByUf[uf] = res.items;
  }
  
  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/brazilCities.json', JSON.stringify(allCitiesByUf, null, 2));
  console.log('Saved src/data/brazilCities.json');
}

main().catch(console.error);
