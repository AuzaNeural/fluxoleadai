import fs from 'fs';

const html = fs.readFileSync('scripts/live_dumps/main_kanban.html', 'utf-8');

// Let's print out the first column and its cards
const colMatch = html.match(/<section aria-label="Etapa Novo lead"[\s\S]*?<\/section>/);
if (colMatch) {
  console.log('=== FIRST KANBAN COLUMN ===');
  console.log(colMatch[0]);
}
