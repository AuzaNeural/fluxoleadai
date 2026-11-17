import fs from 'fs';

const content = fs.readFileSync('scripts/live_dumps/vendedor.html', 'utf8');
const scriptMatches = content.match(/src="\/_next\/static\/[^"]+"/g) || [];
console.log('Next.js scripts:', scriptMatches);
