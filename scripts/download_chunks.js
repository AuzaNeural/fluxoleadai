import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function inspectChunks() {
  const html = fs.readFileSync('alexandria_search.html', 'utf8');
  const chunkMatches = [...html.matchAll(/\/static\/chunks\/[a-zA-Z0-9_\-\.]+\.js/g)].map(m => m[0]);
  const uniqueChunks = [...new Set(chunkMatches)];
  console.log('Found chunks:', uniqueChunks);

  for (const chunk of uniqueChunks) {
    const url = `https://fluxoleadai.com.br/_next${chunk}`;
    try {
      const res = await fetch(url, {
        headers: { 'Cookie': cookieHeader }
      });
      if (res.ok) {
        const text = await res.text();
        console.log(`Chunk ${chunk}: ${text.length} bytes`);
        if (text.includes('Ordem da fonte') || text.includes('Criar site') || text.includes('Localizando')) {
          console.log(`*** MATCH in ${chunk}! ***`);
          fs.writeFileSync(`chunk_${chunk.replace(/[^a-zA-Z0-9]/g, '_')}.js`, text);
        }
      }
    } catch (e) {
      console.log(`Failed to fetch ${chunk}:`, e.message);
    }
  }
}

inspectChunks();
