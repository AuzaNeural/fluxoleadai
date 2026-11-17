import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Let's create cropped snapshots of key frames at different times:
// t=1s (frame_002), t=15s (frame_016), t=30s (frame_031), t=45s (frame_046), t=60s (frame_061), t=75s (frame_076)
const keyFrames = ['frame_002.jpg', 'frame_015.jpg', 'frame_030.jpg', 'frame_045.jpg', 'frame_060.jpg', 'frame_075.jpg'];

for (const kf of keyFrames) {
  // Let's crop header/nav area (x=260, y=70, w=1600, h=400)
  execSync(`"${ffmpeg}" -y -i "scripts/crm_frames/${kf}" -vf "crop=1600:400:260:70" "scripts/crm_frames/crop_header_${kf}"`);
  // Let's crop content area (x=260, y=300, w=1600, h=700)
  execSync(`"${ffmpeg}" -y -i "scripts/crm_frames/${kf}" -vf "crop=1600:700:260:300" "scripts/crm_frames/crop_content_${kf}"`);
}

console.log('Cropped snapshots created.');
