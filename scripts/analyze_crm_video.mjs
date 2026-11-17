import fs from 'fs';

const frames = fs.readdirSync('scripts/crm_frames').filter(f => f.endsWith('.jpg')).sort();
console.log('Total frames:', frames.length);

// Let's print frame list sample
console.log('Sample frames:', [frames[0], frames[10], frames[25], frames[40], frames[55], frames[70], frames[frames.length - 1]]);
