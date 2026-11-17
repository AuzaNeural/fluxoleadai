import fs from 'fs';

// Let's check files in video_frames
const files = fs.readdirSync('scripts/video_frames').filter(f => f.endsWith('.jpg'));
console.log('Total frames:', files.length);

// We want to inspect frames 6 to 22
