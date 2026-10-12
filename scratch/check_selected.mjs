async function checkHeaders(url) {
  const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
  console.log(res.status, res.headers.get('content-type'), res.headers.get('content-length'), url);
}

async function test() {
  await checkHeaders('https://upload.wikimedia.org/wikipedia/commons/5/50/2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_03.webm');
  await checkHeaders('https://upload.wikimedia.org/wikipedia/commons/b/b2/2018_FIFA_U-17_Women%27s_World_Cup_-_New_Zealand_vs_Canada_-_21.webm');
  await checkHeaders('https://upload.wikimedia.org/wikipedia/commons/7/7a/Learn_About_Living_%26_Working_in_Space_with_two_NASA_Astronauts.webm');
}
test();
