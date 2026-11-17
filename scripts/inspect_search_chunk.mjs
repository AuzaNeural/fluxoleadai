import fs from 'fs';

const code = fs.readFileSync('chunk_buscar_1fc05t9bbsihw.js', 'utf8');

// Let's format or search for modules and exports
console.log('Total length:', code.length);

// Write formatted code for easier inspection
fs.writeFileSync('search_chunk_beautified.js', code);

// Search for arrays or objects
// Find all strings in the code
const stringRegex = /"([^"\\]|\\.)*"/g;
const strings = code.match(stringRegex) || [];
console.log('Total strings:', strings.length);

// Search for options, lists, niches, states
console.log('\n--- State / Nicho / Fields Search ---');
for (let i = 0; i < code.length; i += 2000) {
  const slice = code.substring(i, i + 2000);
  if (slice.includes('escolher o nicho') || slice.includes('Mostrar nos resultados') || slice.includes('Nicho') || slice.includes('País')) {
    console.log(`\n=== Offset ${i} ===`);
    console.log(slice);
  }
}

