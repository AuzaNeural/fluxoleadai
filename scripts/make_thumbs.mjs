import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const sampleFrames = [5, 15, 25, 35, 45, 55, 65, 75];

for (const s of sampleFrames) {
  const fName = `scripts/crm_frames/frame_${String(s).padStart(3, '0')}.jpg`;
  // Downscale to 480x270 for quick overview
  execSync(`"${ffmpeg}" -y -i "${fName}" -vf "scale=480:270" "scripts/crm_frames/thumb_${s}.jpg"`);
}
console.log('Thumbs created.');
