import fs from 'fs';
import path from 'path';

const cookie = 'flux_session=fciCzJCbWxwb_NUpvTCMWBSQ5HDmyCIkY7qpCDgdqNo';

const routes = [
  { name: 'dashboard', path: '/app' },
  { name: 'vendedor', path: '/app/vendedor' },
  { name: 'buscar', path: '/app/buscar' },
  { name: 'leads', path: '/app/leads' },
  { name: 'crm', path: '/app/crm' },
  { name: 'templates', path: '/app/templates' },
  { name: 'projetos', path: '/app/projetos' },
  { name: 'sites', path: '/app/sites' },
  { name: 'assinatura', path: '/app/assinatura' },
  { name: 'historico', path: '/app/historico' },
  { name: 'configuracoes', path: '/app/configuracoes' },
  { name: 'suporte', path: '/app/suporte' },
];

const outDir = './scripts/live_dumps';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Downloading all live pages...');
  const summary = [];

  for (const r of routes) {
    try {
      const res = await fetch(`https://fluxoleadai.com.br${r.path}`, {
        headers: {
          Cookie: cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      const html = await res.text();
      fs.writeFileSync(path.join(outDir, `${r.name}.html`), html, 'utf-8');

      // Extract title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1] : '';

      // Extract main text content inside <main> if exists
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
      const mainContent = mainMatch ? mainMatch[1] : '';
      const textOnly = (mainContent || html)
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      summary.push({
        name: r.name,
        path: r.path,
        title,
        textPreview: textOnly.slice(0, 300),
      });

      console.log(`✓ ${r.path} (${r.name}) -> Title: "${title}"`);
    } catch (err) {
      console.error(`✗ ${r.path}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');
  console.log('Finished dumping all live pages!');
}

run().catch(console.error);
