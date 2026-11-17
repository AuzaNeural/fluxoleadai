import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const sampleFrames = [5, 15, 30, 45, 60, 75];

for (const s of sampleFrames) {
  const fName = `scripts/crm_frames/frame_${String(s).padStart(3, '0')}.jpg`;
  execSync(`"${ffmpeg}" -y -i "${fName}" -vf "crop=1920:909:0:110" "scripts/crm_frames/app_${s}.jpg"`);
}

console.log('Cropped app frames created.');
