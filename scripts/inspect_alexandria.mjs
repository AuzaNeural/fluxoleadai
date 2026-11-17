import fs from 'fs';

const html = fs.readFileSync('alexandria_search.html', 'utf8');

// Find all text inside
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
console.log('--- Alexandria Text Preview ---');
console.log(text.substring(text.indexOf('Nova busca'), text.indexOf('Nova busca') + 2500));

// Find JSON data if any
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
console.log('Scripts count:', scripts.length);
scripts.forEach((s, idx) => {
  if (s.includes('Gilvan Ferreira') || s.includes('Casa do Cuscuz') || s.includes('Alexandria')) {
    console.log(`Script ${idx} contains Alexandria data!`);
    fs.writeFileSync(`alexandria_data_script_${idx}.js`, s);
  }
});
