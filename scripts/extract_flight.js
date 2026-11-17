import fs from 'fs';

const html = fs.readFileSync('alexandria_search.html', 'utf8');
const chunks = [];
const regex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
let m;
while ((m = regex.exec(html)) !== null) {
  try {
    const unescaped = JSON.parse('"' + m[1] + '"');
    chunks.push(unescaped);
  } catch (e) {
    chunks.push(m[1]);
  }
}
const full = chunks.join('\n');
fs.writeFileSync('flight_payload.txt', full);
console.log('Flight payload saved, length:', full.length);

const keywords = ['Gilvan', 'Cuscuz', 'Lanche', 'Restaurante', 'result', 'companies', 'leads'];
keywords.forEach(kw => {
  const count = (full.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`Keyword "${kw}": ${count} matches`);
});
