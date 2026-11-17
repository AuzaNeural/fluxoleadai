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
  console.log('Fetching https://fluxoleadai.com.br/login ...');
  const html = await get('https://fluxoleadai.com.br/login');
  
  // Find all script src
  const scriptRegex = /src="(\/_next\/static\/[^"]+)"/g;
  let match;
  const scriptUrls = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scriptUrls.push('https://fluxoleadai.com.br' + match[1]);
  }
  
  console.log(`Found ${scriptUrls.length} scripts in login page.`);
  
  for (const sUrl of scriptUrls) {
    console.log(`Checking ${sUrl}...`);
    try {
      const code = await get(sUrl);
      if (code.includes('Buscar empresas') || code.includes('Clique para escolher o nicho') || code.includes('PROSPECÇÃO') || code.includes('banho e tosa')) {
        console.log(`>>> MATCH FOUND IN ${sUrl}!`);
        fs.writeFileSync('extracted_search_chunk.js', code);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Also check if there's a manifest or other chunks
  const manifestMatch = html.match(/\/_next\/static\/([^\/]+)\/_buildManifest\.js/);
  if (manifestMatch) {
    const buildId = manifestMatch[1];
    console.log('Build ID:', buildId);
    const manifestUrl = `https://fluxoleadai.com.br/_next/static/${buildId}/_buildManifest.js`;
    const manifestCode = await get(manifestUrl);
    console.log('Manifest length:', manifestCode.length);
    fs.writeFileSync('buildManifest.js', manifestCode);
    
    // Find all chunks in manifest
    const chunkRegex = /"static\/chunks\/[^"]+"/g;
    const allChunks = [...new Set(manifestCode.match(chunkRegex) || [])];
    console.log(`Found ${allChunks.length} chunks in manifest.`);
    
    for (const chunk of allChunks) {
      const chunkPath = chunk.replace(/"/g, '');
      const fullChunkUrl = `https://fluxoleadai.com.br/_next/${chunkPath}`;
      try {
        const code = await get(fullChunkUrl);
        if (code.includes('Clique para escolher o nicho') || code.includes('banho e tosa') || code.includes('Escolha na lista ou digite')) {
          console.log(`>>> FOUND SEARCH CHUNK IN: ${fullChunkUrl}`);
          fs.writeFileSync('extracted_search_chunk.js', code);
          break;
        }
      } catch (e) {}
    }
  }
}

main().catch(console.error);

