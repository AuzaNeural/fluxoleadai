import fs from 'fs';
import path from 'path';

const outDir = './scripts/live_dumps';

const pages = [
  'dashboard',
  'vendedor',
  'buscar',
  'leads',
  'crm',
  'templates',
  'projetos',
  'sites',
  'assinatura',
  'historico',
  'configuracoes',
  'suporte'
];

for (const p of pages) {
  const filePath = path.join(outDir, `${p}.html`);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf-8');

  // Extract <main> or the primary content
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const content = mainMatch ? mainMatch[1] : html;

  // Extract all headings (h1, h2, h3)
  const headings = [...content.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => {
    return `${m[1].toUpperCase()}: ${m[2].replace(/<[^>]+>/g, '').trim()}`;
  });

  // Extract buttons
  const buttons = [...content.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map(m => {
    return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }).filter(b => b.length > 0 && b.length < 50);

  // Extract eyebrows (fx-eyebrow or text uppercase)
  const eyebrows = [...content.matchAll(/class="[^"]*?(?:fx-eyebrow|tracking-widest|uppercase)[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/gi)].map(m => {
    return m[1].replace(/<[^>]+>/g, '').trim();
  }).filter(e => e.length > 0 && e.length < 40);

  console.log(`\n======================================================`);
  console.log(`PAGE: ${p.toUpperCase()}`);
  console.log(`Eyebrows:`, [...new Set(eyebrows)]);
  console.log(`Headings:`, headings);
  console.log(`Buttons:`, [...new Set(buttons)].slice(0, 15));
}
