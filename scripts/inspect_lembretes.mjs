import fs from 'fs';

const html = fs.readFileSync('scripts/live_dumps/main_lembretes.html', 'utf-8');
console.log('--- LEMBRETES HTML ---');
console.log(html.slice(html.indexOf('<nav class="mb-5')));
