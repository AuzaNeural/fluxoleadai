import fs from 'fs';

for (const tab of ['kanban', 'tabela', 'lembretes', 'mensagens']) {
  const file = tab === 'kanban' ? 'scripts/live_dumps/crm.html' : `scripts/live_dumps/crm_${tab}.html`;
  const html = fs.readFileSync(file, 'utf-8');
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
  if (mainMatch) {
    fs.writeFileSync(`scripts/live_dumps/main_${tab}.html`, mainMatch[0]);
    console.log(`Tab ${tab}: extracted main (${mainMatch[0].length} chars)`);
  }
}
