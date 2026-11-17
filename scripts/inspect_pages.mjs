import fs from 'fs';

function inspectTemplates() {
  const content = fs.readFileSync('scripts/live_dumps/templates.html', 'utf8');
  const navMatch = content.match(/<nav class="mb-7 flex flex-wrap gap-2"[\s\S]*?<\/nav>/i);
  console.log('--- TEMPLATES NAV ---');
  if (navMatch) console.log(navMatch[0]);

  // Extract all template cards
  const cards = [];
  const regex = /<article[\s\S]*?<\/article>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    cards.push(match[0]);
  }
  console.log('Total templates:', cards.length);
  if (cards.length > 0) {
    console.log('Sample card 1:', cards[0]);
    console.log('Sample card 2:', cards[1]);
  }
}

inspectTemplates();
