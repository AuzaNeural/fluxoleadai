import fs from 'fs';

const content = fs.readFileSync('scripts/live_dumps/historico.html', 'utf8');

// Buscas
const buscasMatch = content.match(/<h2[^>]*>Buscas<\/h2><\/header>[\s\S]*?<ul class="divide-y divide-line">([\s\S]*?)<\/ul>/i);
// Atividade
const atividadeMatch = content.match(/<h2[^>]*>Atividade da conta<\/h2><\/header>[\s\S]*?<ul class="divide-y divide-line">([\s\S]*?)<\/ul>/i);

const buscas = [];
if (buscasMatch) {
  const items = buscasMatch[1].match(/<li[\s\S]*?<\/li>/gi) || [];
  for (const it of items) {
    const term = it.match(/<p class="truncate text-sm text-fg">([\s\S]*?)<\/p>/);
    const dateLine = it.match(/<p class="text-xs text-fg-3">([\s\S]*?)<\/p>/);
    const statsLine = it.match(/<p class="text-xs text-fg-3">pedidas([\s\S]*?)<\/p>/);
    const status = it.match(/text-success">([\s\S]*?)<\/span>/);
    buscas.push({
      term: term ? term[1].replace(/<!-- -->/g, '').trim() : '',
      dateInfo: dateLine ? dateLine[1].replace(/<!-- -->/g, '').trim() : '',
      stats: statsLine ? ('pedidas' + statsLine[1].replace(/<!-- -->/g, '')).trim() : '',
      status: status ? status[1].trim() : 'Concluída'
    });
  }
}

const atividades = [];
if (atividadeMatch) {
  const items = atividadeMatch[1].match(/<li[\s\S]*?<\/li>/gi) || [];
  for (const it of items) {
    const title = it.match(/<p class="text-sm text-fg-2">([\s\S]*?)<\/p>/);
    const date = it.match(/<p class="text-xs text-fg-3">([\s\S]*?)<\/p>/);
    atividades.push({
      title: title ? title[1].replace(/<!-- -->/g, '').trim() : '',
      date: date ? date[1].replace(/<!-- -->/g, '').trim() : ''
    });
  }
}

console.log('Buscas count:', buscas.length);
console.log('Atividades count:', atividades.length);
fs.writeFileSync('src/data/historico.json', JSON.stringify({ buscas, atividades }, null, 2));
console.log('Saved to src/data/historico.json');
