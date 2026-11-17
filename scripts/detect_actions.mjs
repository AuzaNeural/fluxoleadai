import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Check which frames differ from each other to detect all user interactions in the video
const frames = fs.readdirSync('scripts/crm_frames').filter(f => f.startsWith('frame_') && f.endsWith('.jpg')).sort();

console.log(`Analyzing ${frames.length} frames for actions...`);

// Let's sample every 3 frames and extract a small signature
// Check text around tabs (y=180-220 inside app, which is y=290-330 in frame)
let previousSignature = '';
for (let i = 0; i < frames.length; i += 2) {
  const f = frames[i];
  // Calculate average color in 4 quadrants
  const rawPath = `scripts/temp_quad_${i}.raw`;
  execSync(`"${ffmpeg}" -y -i "scripts/crm_frames/${f}" -vf "scale=8:8" -f rawvideo -pix_fmt gray "${rawPath}"`);
  const buf = fs.readFileSync(rawPath);
  fs.unlinkSync(rawPath);
  const sig = buf.toString('hex');
  if (previousSignature && sig !== previousSignature) {
    console.log(`Action/Change detected at frame ${f} (second ${i})`);
  }
  previousSignature = sig;
}
