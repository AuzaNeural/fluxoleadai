import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const videoPath = 'scripts/crm_video.mkv';
const outputDir = 'scripts/crm_frames';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get video info
let info = '';
try {
  execSync(`"${ffmpeg}" -i "${videoPath}"`);
} catch (e) {
  info = (e.output ? e.output.join('\n') : '') + '\n' + (e.stderr ? e.stderr.toString() : '');
}

console.log('Video Info:');
const durMatch = info.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/);
console.log('Duration:', durMatch ? durMatch[1] : 'unknown');

// Extract 1 frame per second
console.log('Extracting 1 frame per second...');
execSync(`"${ffmpeg}" -y -i "${videoPath}" -vf "fps=1" "${outputDir}/frame_%03d.jpg"`);

const frames = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
console.log(`Extracted ${frames.length} frames.`);
