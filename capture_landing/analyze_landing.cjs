const fs = require('fs');
const html = fs.readFileSync('capture_landing/page.html', 'utf8');

// Find all headings
const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g) || [];
console.log('--- HEADINGS (' + headings.length + ') ---');
headings.forEach(h => console.log(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

// Find all image sources
const imgRegex = /<img[^>]+src="([^">]+)"/g;
let match;
const images = new Set();
while ((match = imgRegex.exec(html)) !== null) {
  images.add(match[1]);
}
console.log('\n--- UNIQUE IMAGES (' + images.size + ') ---');
Array.from(images).slice(0, 30).forEach(src => console.log(src));

// Find all links
const linkRegex = /<a[^>]+href="([^">]+)"[^>]*>([\s\S]*?)<\/a>/g;
const links = [];
while ((match = linkRegex.exec(html)) !== null) {
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  if (text) {
    links.push({ text, href: match[1] });
  }
}
console.log('\n--- TEXT LINKS (' + links.length + ') ---');
links.forEach(l => console.log(l.text, '->', l.href));
