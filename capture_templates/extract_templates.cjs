const fs = require('fs');
const html = fs.readFileSync('capture_templates/page.html', 'utf8');

const regex = /<article data-catalogue-card="true"[\s\S]*?<\/article>/g;
const matches = html.match(regex) || [];
console.log('Total articles found:', matches.length);

const templates = matches.map((art, idx) => {
  const srcMatch = art.match(/src="([^"]+)"/);
  const altMatch = art.match(/alt="([^"]+)"/);
  const catMatch = art.match(/text-accent">\[ <!-- -->([\s\S]*?)<!-- --> \]/) || art.match(/text-accent">\[([\s\S]*?)\]/);
  const titleMatch = art.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
  const descMatch = art.match(/<p class="mt-1.5 line-clamp-3[^"]*">([\s\S]*?)<\/p>/);
  const demoMatch = art.match(/href="([^"]+)"/);

  let id = '';
  if (srcMatch && srcMatch[1].includes('/api/templates/')) {
    const parts = srcMatch[1].split('/');
    id = parts[3];
  }

  return {
    index: idx + 1,
    id: id || 'template-' + (idx + 1),
    category: catMatch ? catMatch[1].trim() : '',
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    thumbnail: srcMatch ? srcMatch[1] : '',
    demoUrl: demoMatch ? demoMatch[1] : ''
  };
});

fs.writeFileSync('capture_templates/extracted_templates.json', JSON.stringify(templates, null, 2), 'utf8');
console.log('Saved', templates.length, 'templates to capture_templates/extracted_templates.json');
console.log('First 2:');
console.log(templates.slice(0, 2));
console.log('Last 2:');
console.log(templates.slice(-2));
