async function test() {
  const urls = [
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/This_is_cricket.ogv/This_is_cricket.ogv.360p.mpeg4.mov',
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/This_is_cricket.ogv/This_is_cricket.ogv.240p.vp9.webm',
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0e/This_is_batting.ogv/This_is_batting.ogv.240p.vp9.webm',
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/b/bf/This_is_bowling.ogv/This_is_bowling.ogv.240p.vp9.webm',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`${res.status} ${res.headers.get('content-type')} (${res.headers.get('content-length')} bytes) -> ${url}`);
    } catch (e) {
      console.log(`ERR: ${url} -> ${e.message}`);
    }
  }
}
test();
