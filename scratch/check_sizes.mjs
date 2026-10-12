import fs from 'fs';

for (const f of ['sample-video.mp4', 'videos/bear-river.mp4', 'videos/bunny-animation.mp4', 'videos/jellyfish-nature.mp4', 'videos/mov-bbb.mp4', 'videos/racing-demo.mp4', 'videos/sintel-action.mp4']) {
  const stat = fs.statSync(`public/${f}`);
  console.log(`${f}: ${(stat.size / 1024).toFixed(1)} KB`);
}
