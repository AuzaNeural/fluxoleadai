import fs from 'fs';

const html = fs.readFileSync('scripts/live_dumps/main_tabela.html', 'utf-8');
const end = html.lastIndexOf('</table>');
console.log(html.slice(end));
