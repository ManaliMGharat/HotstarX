async function testTranscoded(base, fn) {
  const qualities = ['240p.vp9.webm', '360p.vp9.webm', '480p.vp9.webm', '360p.mpeg4.mov'];
  for (const q of qualities) {
    const url = `https://upload.wikimedia.org/wikipedia/commons/transcoded/${base}/${fn}/${fn}.${q}`;
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
    if (res.ok) {
      console.log(`${q}: ${res.status} ${res.headers.get('content-length')} bytes -> ${url}`);
    }
  }
}

async function run() {
  console.log('Tennis:');
  await testTranscoded('5/50', '2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_03.webm');
  console.log('Football:');
  await testTranscoded('b/b2', '2018_FIFA_U-17_Women%27s_World_Cup_-_New_Zealand_vs_Canada_-_21.webm');
}

run();
