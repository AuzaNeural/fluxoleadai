import fs from 'fs';

const js = fs.readFileSync('scripts/crm_chunks/3silp77xmz3jh.js', 'utf-8');
const idx = js.indexOf('Seu WhatsApp para ligações');
console.log('Snippet around WhatsApp calls modal:');
console.log(js.substring(Math.max(0, idx - 800), Math.min(js.length, idx + 2500)));
