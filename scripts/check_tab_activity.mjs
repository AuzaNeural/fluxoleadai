import fs from 'fs';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Check which tabs are clicked in the video:
// Kanban tab is around (x=290, y=180)
// Tabela tab is around (x=380, y=180)
// Lembretes tab is around (x=460, y=180)
// Mensagens tab is around (x=550, y=180)

// Let's write a script to convert frames 2, 10, 20, 30, 40, 50, 60, 70 to raw and check the tab indicator bar!
// In crm.html:
// Kanban has: <span class="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent shadow-[0_0_10px_rgba(250,38,0,0.7)]"></span>
// Let's check where the red accent line is in each frame!

const testFrames = [2, 10, 20, 30, 40, 50, 60, 70, 77];

for (const fNum of testFrames) {
  const fName = `scripts/crm_frames/frame_${String(fNum).padStart(3, '0')}.jpg`;
  execSync(`"${ffmpeg}" -y -i "${fName}" -vf "crop=600:60:260:160" -f rawvideo -pix_fmt rgba scripts/tab_bar_${fNum}.rgba`);
  const buf = fs.readFileSync(`scripts/tab_bar_${fNum}.rgba`);
  // width=600, height=60
  // Find red pixels
  let redX = [];
  for (let y = 0; y < 60; y++) {
    for (let x = 0; x < 600; x++) {
      const idx = (y * 600 + x) * 4;
      const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
      if (r > 200 && g < 80 && b < 50) {
        redX.push(x);
      }
    }
  }
  let activeTab = 'unknown';
  if (redX.length > 0) {
    const avgX = redX.reduce((a, b) => a + b, 0) / redX.length;
    if (avgX < 90) activeTab = 'Kanban';
    else if (avgX < 180) activeTab = 'Tabela';
    else if (avgX < 280) activeTab = 'Lembretes';
    else activeTab = 'Mensagens';
    console.log(`Frame ${fNum}: Active Tab = ${activeTab} (avgX=${avgX.toFixed(1)}, redPixels=${redX.length})`);
  } else {
    console.log(`Frame ${fNum}: No red line found`);
  }
}
