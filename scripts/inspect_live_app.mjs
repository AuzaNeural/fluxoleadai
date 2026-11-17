import fs from 'fs';

const cookie = 'flux_session=fciCzJCbWxwb_NUpvTCMWBSQ5HDmyCIkY7qpCDgdqNo';

async function fetchPage(urlPath) {
  const res = await fetch(`https://fluxoleadai.com.br${urlPath}`, {
    headers: {
      Cookie: cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });
  const html = await res.text();
  return { status: res.status, html };
}

async function run() {
  const { html } = await fetchPage('/app');
  
  // Extract all hrefs starting with /app or other internal links
  const hrefMatches = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const uniqueHrefs = [...new Set(hrefMatches.filter(h => h.startsWith('/')))];
  console.log('--- ALL INTERNAL LINKS ---');
  console.log(uniqueHrefs);

  // Extract titles / nav labels
  const linkTexts = [...html.matchAll(/<a[^>]+href="(\/app[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => {
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return { href: m[1], text };
  });
  console.log('--- NAV LINKS AND LABELS ---');
  console.log(linkTexts);
}

run().catch(console.error);
