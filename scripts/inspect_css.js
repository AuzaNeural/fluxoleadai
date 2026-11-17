import fs from 'fs';

const css = fs.readFileSync('2549pzk9j5-vl.css', 'utf8');

// Find :root
const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
if (rootMatch) {
  console.log(':root variables:\n', rootMatch[1].trim());
}

// Find color classes
const classes = css.match(/\.[a-zA-Z0-9_\-\\\:\/\[\]]+/g) || [];
console.log('Total classes in authentic CSS:', classes.length);

// Look for .bg-accent, .fx-, etc.
const fxClasses = [...new Set(classes.filter(c => c.startsWith('.fx-') || c.startsWith('.fl-') || c.includes('accent')))];
console.log('Special classes:', fxClasses.slice(0, 50));
