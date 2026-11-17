import fs from 'fs';

const c = fs.readFileSync('chunk_buscar_1fc05t9bbsihw.js', 'utf8');

// Let's find all of y (groups of niches)
const yStart = c.indexOf('y=[{grupo:');
console.log('yStart:', yStart);
// Find end of y array
let depth = 0;
let inArray = false;
let yEnd = -1;
for (let i = yStart + 2; i < c.length; i++) {
  if (c[i] === '[') depth++;
  else if (c[i] === ']') {
    depth--;
    if (depth === 0) {
      yEnd = i + 1;
      break;
    }
  }
}
const yCode = c.substring(yStart, yEnd);
console.log('y length:', yCode.length);
fs.writeFileSync('niches_groups.json', JSON.stringify(eval('(' + yCode.replace('y=', '') + ')'), null, 2));
console.log('Saved niches_groups.json');

// Let's find states list
const stStart = c.indexOf('[{uf:');
let stDepth = 0;
let stEnd = -1;
for (let i = stStart; i < c.length; i++) {
  if (c[i] === '[') stDepth++;
  else if (c[i] === ']') {
    stDepth--;
    if (stDepth === 0) {
      stEnd = i + 1;
      break;
    }
  }
}
const stCode = c.substring(stStart, stEnd);
console.log('States length:', stCode.length);
fs.writeFileSync('states_list.json', JSON.stringify(eval('(' + stCode + ')'), null, 2));
console.log('Saved states_list.json');

// Let's find countries and city/neighborhood APIs
const apiSlice = c.substring(0, yStart);
fs.writeFileSync('search_apis_slice.js', apiSlice);

