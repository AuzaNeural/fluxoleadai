import fs from 'fs';

const chunks = fs.readdirSync('.').filter(f => f.startsWith('chunk_') && f.endsWith('.js'));
for (const c of chunks) {
  const text = fs.readFileSync(c, 'utf8');
  if (text.includes('76720')) {
    console.log(`Found 76720 in ${c}`);
  }
}
