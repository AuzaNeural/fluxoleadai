import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Check which frames show activity or tab switching
const frames = fs.readdirSync('scripts/crm_frames').filter(f => f.endsWith('.jpg')).sort();

console.log(`Checking ${frames.length} frames for visual activity and text...`);

// Let's sample every 5 frames and print OCR/text if possible, or check file sizes/differences
for (let i = 0; i < frames.length; i += 5) {
  const f = frames[i];
  const stat = fs.statSync(`scripts/crm_frames/${f}`);
  console.log(`Frame ${f} (size: ${stat.size})`);
}
