import fs from 'fs';
import path from 'path';

const dir = 'scripts/crm_chunks';
const files = fs.readdirSync(dir);

const needles = [
  'Seu WhatsApp para ligações',
  'Testar fone',
  'Novo lembrete',
  'Novo modelo',
  'Mensagens em massa',
  'Esta conexão usa um cliente não oficial'
];

for (const n of needles) {
  let found = false;
  for (const f of files) {
    const full = path.join(dir, f);
    const content = fs.readFileSync(full, 'utf-8');
    if (content.includes(n)) {
      console.log(`Found "${n}" in ${f}`);
      found = true;
    }
  }
  if (!found) {
    console.log(`NOT found: "${n}"`);
  }
}
