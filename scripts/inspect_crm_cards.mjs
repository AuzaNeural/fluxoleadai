import fs from 'fs';

const html = fs.readFileSync('./scripts/live_dumps/crm.html', 'utf-8');
const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];

// Print all sections and cards
const stages = [...main.matchAll(/<section aria-label="Etapa ([^"]+)"[\s\S]*?<header[^>]*>([\s\S]*?)<\/header>([\s\S]*?)<\/section>/g)].map(m => {
  const name = m[1];
  const count = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const cards = [...m[3].matchAll(/<article[\s\S]*?>([\s\S]*?)<\/article>/g)].map(c => {
    return c[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  });
  return { name, count, cards };
});

console.log('CRM STAGES & CARDS:');
console.log(JSON.stringify(stages, null, 2));
