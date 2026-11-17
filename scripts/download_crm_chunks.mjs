import fs from 'fs';
import path from 'path';

const cookie = 'flux_session=fciCzJCbWxwb_NUpvTCMWBSQ5HDmyCIkY7qpCDgdqNo';

const html = fs.readFileSync('scripts/live_dumps/crm.html', 'utf-8');
const regex = /\/_next\/static\/chunks\/[a-zA-Z0-9_\-\.]+\.js/g;
const matches = [...new Set(html.match(regex) || [])];

console.log(`Found ${matches.length} chunks`);

const outDir = './scripts/crm_chunks';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  for (const m of matches) {
    const filename = path.basename(m);
    const dest = path.join(outDir, filename);
    if (!fs.existsSync(dest)) {
      try {
        const res = await fetch(`https://fluxoleadai.com.br${m}`, {
          headers: {
            Cookie: cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
        });
        const js = await res.text();
        fs.writeFileSync(dest, js, 'utf-8');
        console.log(`Saved ${filename} (${js.length} bytes)`);
      } catch (e) {
        console.error(`Failed ${filename}:`, e.message);
      }
    }
  }
}

run();
