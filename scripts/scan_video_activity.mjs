import fs from 'fs';

// Check if all frames are on "Meus leads"
// In all frames, let's check the title or sidebar active item
const files = fs.readdirSync('scripts/video_frames').filter(f => f.endsWith('.jpg'));
console.log('Frames count:', files.length);

// Let's inspect frames 1, 5, 10, 15, 20, 25
