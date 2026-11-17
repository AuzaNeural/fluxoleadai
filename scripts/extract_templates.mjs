import fs from 'fs';

const content = fs.readFileSync('scripts/live_dumps/templates.html', 'utf8');

const regex = /<article data-catalogue-card="true"[\s\S]*?<\/article>/gi;
const templates = [];
let m;

while ((m = regex.exec(content)) !== null) {
  const card = m[0];
  const imgMatch = card.match(/src="([^"]+)"/);
  const altMatch = card.match(/alt="([^"]+)"/);
  const catMatch = card.match(/text-accent">\[ <!-- -->([\s\S]*?)<!-- --> \]/);
  const titleMatch = card.match(/<h3 class="[^"]*">([^<]+)<\/h3>/);
  const descMatch = card.match(/<p class="[^"]*line-clamp-3[^"]*">([\s\S]*?)<\/p>/);
  const demoMatch = card.match(/href="([^"]+)" target="_blank"/);

  templates.push({
    id: `template-${templates.length + 1}`,
    thumbnail: imgMatch ? imgMatch[1] : '',
    alt: altMatch ? altMatch[1] : '',
    category: catMatch ? catMatch[1].trim() : 'Outros',
    name: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    demoUrl: demoMatch ? demoMatch[1] : '#'
  });
}

console.log(`Extracted ${templates.length} templates.`);
fs.writeFileSync('src/data/templates.json', JSON.stringify(templates, null, 2));
console.log('Saved to src/data/templates.json');
