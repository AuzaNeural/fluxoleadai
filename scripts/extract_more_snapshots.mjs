import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

for (const t of [46, 47, 55, 56, 62, 63]) {
  execSync(`"${ffmpeg}" -y -i "scripts/crm_frames/frame_${String(t).padStart(3, '0')}.jpg" -vf "crop=1920:910:0:110" "scripts/crm_frames/app_${t}s.jpg"`);
}
console.log('Extracted');
