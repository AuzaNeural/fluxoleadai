import fs from 'fs';

const html = fs.readFileSync('./scripts/live_dumps/dashboard.html', 'utf-8');
const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];

console.log(main.slice(4000, 10000));
