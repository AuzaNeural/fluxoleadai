const fs = require('fs');
const html = fs.readFileSync('capture_landing/page.html', 'utf8');

const regex = /<span class="ekit-accordion-title">([\s\S]*?)<\/span>[\s\S]*?<div class="elementskit-card-body[^"]*">([\s\S]*?)<\/div>/g;
let m;
const faqs = [];
while ((m = regex.exec(html)) !== null) {
  const q = m[1].replace(/<[^>]+>/g, '').trim();
  const a = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  faqs.push({ q, a });
  console.log('Q:', q);
  console.log('A:', a);
  console.log('---');
}

fs.writeFileSync('capture_landing/faqs.json', JSON.stringify(faqs, null, 2), 'utf8');
console.log('Saved', faqs.length, 'FAQs to capture_landing/faqs.json');
