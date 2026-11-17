import https from 'https';
import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

const citiesToFetch = [
  { p: 'BR', s: 'RJ', c: 'Rio de Janeiro' },
  { p: 'BR', s: 'RJ', c: 'Niterói' },
  { p: 'BR', s: 'RJ', c: 'São Gonçalo' },
  { p: 'BR', s: 'RJ', c: 'Duque de Caxias' },
  { p: 'BR', s: 'RJ', c: 'Nova Iguaçu' },
  { p: 'BR', s: 'RJ', c: 'Petrópolis' },
  { p: 'BR', s: 'RJ', c: 'Cabo Frio' },
  { p: 'BR', s: 'RJ', c: 'Arraial do Cabo' },
  { p: 'BR', s: 'SP', c: 'São Paulo' },
  { p: 'BR', s: 'SP', c: 'Campinas' },
  { p: 'BR', s: 'SP', c: 'Guarulhos' },
  { p: 'BR', s: 'SP', c: 'São Bernardo do Campo' },
  { p: 'BR', s: 'SP', c: 'Santo André' },
  { p: 'BR', s: 'SP', c: 'Osasco' },
  { p: 'BR', s: 'SP', c: 'Santos' },
  { p: 'BR', s: 'SP', c: 'Ribeirão Preto' },
  { p: 'BR', s: 'MG', c: 'Belo Horizonte' },
  { p: 'BR', s: 'MG', c: 'Uberlândia' },
  { p: 'BR', s: 'MG', c: 'Contagem' },
  { p: 'BR', s: 'MG', c: 'Juiz de Fora' },
  { p: 'BR', s: 'MG', c: 'Montes Claros' },
  { p: 'BR', s: 'RS', c: 'Porto Alegre' },
  { p: 'BR', s: 'RS', c: 'Caxias do Sul' },
  { p: 'BR', s: 'PR', c: 'Curitiba' },
  { p: 'BR', s: 'PR', c: 'Londrina' },
  { p: 'BR', s: 'PR', c: 'Maringá' },
  { p: 'BR', s: 'SC', c: 'Florianópolis' },
  { p: 'BR', s: 'SC', c: 'Joinville' },
  { p: 'BR', s: 'BA', c: 'Salvador' },
  { p: 'BR', s: 'BA', c: 'Feira de Santana' },
  { p: 'BR', s: 'PE', c: 'Recife' },
  { p: 'BR', s: 'PE', c: 'Jaboatão dos Guararapes' },
  { p: 'BR', s: 'CE', c: 'Fortaleza' },
  { p: 'BR', s: 'GO', c: 'Goiânia' },
  { p: 'BR', s: 'DF', c: 'Brasília' },
  { p: 'BR', s: 'ES', c: 'Vitória' },
  { p: 'BR', s: 'ES', c: 'Vila Velha' },
  { p: 'BR', s: 'AC', c: 'Rio Branco' },
  { p: 'AO', s: 'BGU', c: 'Benguela' },
  { p: 'AO', s: 'LUA', c: 'Luanda' },
  { p: 'PT', s: '11', c: 'Lisboa' },
  { p: 'PT', s: '13', c: 'Porto' }
];

function fetchBairros(p, s, c) {
  return new Promise(resolve => {
    const q = `nivel=bairros&pais=${encodeURIComponent(p)}&estado=${encodeURIComponent(s)}&cidade=${encodeURIComponent(c)}`;
    https.get('https://fluxoleadai.com.br/api/locais?' + q, {
      headers: { 'Cookie': cookieHeader }
    }, res => {
      let d = ''; res.on('data', chunk => d += chunk); res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          resolve({ key: `${p}:${s}:${c}`, items: parsed.items || [] });
        } catch {
          resolve({ key: `${p}:${s}:${c}`, items: [] });
        }
      });
    }).on('error', () => resolve({ key: `${p}:${s}:${c}`, items: [] }));
  });
}

async function main() {
  const bairrosCache = {};
  console.log('Fetching bairros for top cities...');
  for (const item of citiesToFetch) {
    const res = await fetchBairros(item.p, item.s, item.c);
    console.log(item.c, ':', res.items.length, 'bairros');
    bairrosCache[res.key] = res.items;
  }
  fs.writeFileSync('src/data/bairrosCache.json', JSON.stringify(bairrosCache, null, 2));
  console.log('Saved src/data/bairrosCache.json!');
}

main().catch(console.error);

