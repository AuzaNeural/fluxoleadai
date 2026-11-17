const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

console.log('Using ffmpeg at:', ffmpeg);
const inputVideo = 'c:/Users/alecs/Downloads/Fluxo Leads.mp4';
const outputVideo = 'c:/Users/alecs/Desktop/EMPRESAS/2 - AUZA NEURAL/1 - PROJETOS/6 - FLUXO LEAD AI/fluxo_leads_compressed.mp4';

// Check duration and info
try {
  const info = execSync(`"${ffmpeg}" -i "${inputVideo}" 2>&1`, { encoding: 'utf8' });
  console.log(info.split('\n').filter(l => l.includes('Duration') || l.includes('Stream')).join('\n'));
} catch (e) {
  const out = e.stdout || e.stderr || e.message;
  console.log(out.split('\n').filter(l => l.includes('Duration') || l.includes('Stream')).join('\n'));
}

// Compress video to 720p with crf 28 (very small file, ~15-25MB)
console.log('Compressing video...');
try {
  execSync(`"${ffmpeg}" -y -i "${inputVideo}" -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset fast -c:a aac -b:a 96k "${outputVideo}"`, { stdio: 'inherit' });
  console.log('Compression complete!');
} catch (e) {
  console.error('Compression failed:', e.message);
}
