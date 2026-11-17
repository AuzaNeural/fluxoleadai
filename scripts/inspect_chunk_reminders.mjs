import fs from 'fs';

const js = fs.readFileSync('scripts/crm_chunks/1cs9-cy5fvqpk.js', 'utf-8');

function inspectAround(needle) {
  const idx = js.indexOf(needle);
  console.log(`=== Needle: ${needle} ===`);
  if (idx !== -1) {
    console.log(js.substring(Math.max(0, idx - 500), Math.min(js.length, idx + 2000)));
  } else {
    console.log('Not found');
  }
}

inspectAround('Novo lembrete');
inspectAround('Novo modelo');
inspectAround('Modelos para abordar seus leads');
