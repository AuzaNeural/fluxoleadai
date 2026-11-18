const fs = require('fs');
const html = fs.readFileSync('capture_landing/page.html', 'utf8');

// Extract FAQ items
const faqRegex = /<div class="elementor-accordion-item">([\s\S]*?)<\/div>\s*<\/div>/g;
let m;
console.log('--- FAQ ITEMS ---');
const accordionMatch = html.match(/<div class="elementor-accordion"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
if (accordionMatch) {
  // Let's find question and answers inside
  const qRegex = /<a class="elementor-accordion-title"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<div class="elementor-tab-content[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  let qm;
  while ((qm = qRegex.exec(html)) !== null) {
    console.log('Q:', qm[1].replace(/<[^>]+>/g, '').trim());
    console.log('A:', qm[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log('---');
  }
}

// Extract Pricing details
const priceSection = html.match(/<section[^>]*id="valor"[\s\S]*?<\/section>/);
if (priceSection) {
  console.log('Found #valor section, length:', priceSection[0].length);
}
