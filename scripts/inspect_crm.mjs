import fs from 'fs';

const html = fs.readFileSync('./scripts/live_dumps/crm.html', 'utf-8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
console.log('CRM MAIN HTML LENGTH:', mainMatch ? mainMatch[1].length : 0);

// Print first 4000 chars of main
if (mainMatch) {
  console.log(mainMatch[1].slice(0, 4000));
}
