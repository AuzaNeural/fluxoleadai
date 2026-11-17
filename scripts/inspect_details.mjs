import fs from 'fs';

function inspect(filename) {
  const content = fs.readFileSync('scripts/live_dumps/' + filename, 'utf8');
  const mainMatch = content.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) return;
  const main = mainMatch[0].replace(/<svg[\s\S]*?<\/svg>/gi, '');
  console.log(`\n============================= ${filename} =============================`);
  console.log(main);
}

inspect('assinatura.html');
inspect('historico.html');
inspect('configuracoes.html');
inspect('suporte.html');
