import fs from 'fs';

const html = fs.readFileSync('scripts/live_dumps/main_mensagens.html', 'utf-8');
console.log('--- MENSAGENS HTML ---');
console.log(html.slice(html.indexOf('<nav class="mb-5')));
