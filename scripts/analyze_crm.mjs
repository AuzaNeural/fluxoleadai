import fs from 'fs';
import path from 'path';

function findInDir(dir, needle) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findInDir(full, needle);
    } else if (f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.txt')) {
      try {
        const content = fs.readFileSync(full, 'utf-8');
        if (content.includes(needle)) {
          console.log(`Found "${needle}" in ${full}`);
        }
      } catch (e) {}
    }
  }
}

findInDir('scripts', 'Nenhum lembrete pendente');
findInDir('scripts', 'Conectar WhatsApp para ligações');
findInDir('scripts', 'Modelos para abordar seus leads');
findInDir('scripts', 'Novo modelo');
findInDir('scripts', 'Seu WhatsApp para ligações');
findInDir('scripts', 'Testar fone');
