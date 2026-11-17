import fs from 'fs';

const content = fs.readFileSync('chunk__static_chunks_2jgw8kai3gnah_js.js', 'utf8');

// Find definitions of function I( or const I = or function z(
const idxI = content.indexOf('function I(');
const idxZ = content.indexOf('function z(');

console.log('idxI:', idxI, 'idxZ:', idxZ);
if (idxI !== -1) {
  console.log('--- FUNCTION I ---');
  console.log(content.substring(idxI, idxI + 1500));
}
if (idxZ !== -1) {
  console.log('--- FUNCTION Z ---');
  console.log(content.substring(idxZ, idxZ + 1500));
}
