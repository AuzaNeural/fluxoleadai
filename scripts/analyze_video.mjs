import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';

const videoPath = 'scripts/user_video.mkv';

// 1. Get video info
try {
  const info = execSync(`"${ffmpeg}" -i "${videoPath}" 2>&1`).toString();
  console.log('--- Video Info ---');
  console.log(info);
} catch (e) {
  console.log('--- Video Info (from catch) ---');
  console.log(e.stdout?.toString() || e.message);
}

// 2. Prepare frames directory
const framesDir = 'scripts/video_frames';
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
} else {
  // clean existing frames
  for (const f of fs.readdirSync(framesDir)) {
    fs.unlinkSync(`${framesDir}/${f}`);
  }
}

// 3. Extract frames: 1 frame every 1.5 seconds
try {
  console.log('Extracting frames...');
  execSync(`"${ffmpeg}" -y -i "${videoPath}" -vf "fps=1/1" "${framesDir}/frame_%03d.jpg"`);
  const files = fs.readdirSync(framesDir);
  console.log(`Extracted ${files.length} frames.`);
} catch (e) {
  console.error('Error extracting frames:', e.message);
}

// 4. Also check if there is audio to extract
try {
  execSync(`"${ffmpeg}" -y -i "${videoPath}" -vn -c:a pcm_s16le -ar 16000 "scripts/audio.wav" 2>&1`);
  console.log('Extracted audio to scripts/audio.wav');
} catch (e) {
  console.log('Audio extraction info (may have no audio):', e.stdout?.toString() || e.message);
}
