import fs from 'fs';

const content = fs.readFileSync('scripts/live_dumps/leads.html', 'utf8');

// Find all select elements or dropdowns
const selects = content.match(/<select[\s\S]*?<\/select>/gi) || [];
console.log('Select count in leads.html:', selects.length);
selects.forEach((s, i) => {
  console.log(`--- SELECT ${i + 1} ---`);
  console.log(s);
});

// Also check table rows in leads.html
const tableMatch = content.match(/<tbody[\s\S]*?<\/tbody>/i) || content.match(/<table[\s\S]*?<\/table>/i);
if (tableMatch) {
  console.log('--- TABLE SNIPPET ---');
  console.log(tableMatch[0].slice(0, 1500));
}
