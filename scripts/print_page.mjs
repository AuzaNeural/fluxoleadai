import fs from 'fs';

function printClean(filename) {
  const content = fs.readFileSync('scripts/live_dumps/' + filename, 'utf8');
  const mainMatch = content.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) return;
  let text = mainMatch[0];
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG]');
  console.log(text);
}

printClean(process.argv[2]);
