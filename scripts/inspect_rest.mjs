import fs from 'fs';

for (const p of ['projetos', 'sites', 'assinatura', 'historico', 'configuracoes', 'suporte']) {
  const html = fs.readFileSync(`./scripts/live_dumps/${p}.html`, 'utf-8');
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  console.log(`\n================== ${p.toUpperCase()} ==================`);
  console.log(main.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 700));
}
