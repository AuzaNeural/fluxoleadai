import fs from 'fs';

const details = fs.readFileSync('scripts/details.txt', 'utf8');

const sections = details.split('=============================');
for (const sec of sections) {
  if (!sec.trim()) continue;
  const lines = sec.trim().split('\n');
  const title = lines[0];
  console.log('PAGE:', title);
  // print headings and h2 / h3 / p
  const headings = lines.filter(l => l.includes('<h1') || l.includes('<h2') || l.includes('<h3') || l.includes('fx-eyebrow'));
  console.log('Headings & Eyebrows:', headings);
}
