import fs from 'fs';

const pages = ['dashboard', 'templates', 'projetos', 'sites', 'assinatura', 'historico', 'configuracoes', 'suporte'];

for (const p of pages) {
  const html = fs.readFileSync(`./scripts/live_dumps/${p}.html`, 'utf-8');
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainMatch) continue;
  const content = mainMatch[1];

  // Extract eyebrow
  const eyebrowMatch = content.match(/<p class="[^"]*?fx-eyebrow[^"]*">([^<]+)<\/p>/);
  const eyebrow = eyebrowMatch ? eyebrowMatch[1].trim() : '';

  // Extract h1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // Extract subtitle (p right after h1)
  const subtitleMatch = content.match(/<h1[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/);
  const subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  console.log(`\n=== ${p.toUpperCase()} ===`);
  console.log('Eyebrow:', eyebrow);
  console.log('H1:', h1);
  console.log('Subtitle:', subtitle);
}
