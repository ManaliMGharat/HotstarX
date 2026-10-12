import fs from 'fs';

async function download(url, outPath) {
  console.log(`Downloading ${url}...`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'HotstarXVideoAudit/1.0 (contact@hotstarx.local; educational project)'
    }
  });
  console.log(`Status: ${res.status}, Type: ${res.headers.get('content-type')}, Size: ${res.headers.get('content-length')}`);
  if (!res.ok) {
    throw new Error(`Failed HTTP ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(arrayBuffer));
  console.log(`Saved ${outPath} (${arrayBuffer.byteLength} bytes)`);
}

download(
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/This_is_cricket.ogv/This_is_cricket.ogv.240p.vp9.webm',
  'scratch/test_cricket.webm'
).catch(e => console.error(e));
