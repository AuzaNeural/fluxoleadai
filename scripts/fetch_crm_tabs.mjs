import fs from 'fs';

const cookie = 'flux_session=fciCzJCbWxwb_NUpvTCMWBSQ5HDmyCIkY7qpCDgdqNo';

const tabs = ['tabela', 'lembretes', 'mensagens'];

async function run() {
  for (const tab of tabs) {
    try {
      const res = await fetch(`https://fluxoleadai.com.br/app/crm?aba=${tab}`, {
        headers: {
          Cookie: cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      const html = await res.text();
      fs.writeFileSync(`scripts/live_dumps/crm_${tab}.html`, html, 'utf-8');
      console.log(`Saved crm_${tab}.html, length: ${html.length}`);
    } catch (e) {
      console.error(`Error fetching ${tab}:`, e.message);
    }
  }
}

run();
