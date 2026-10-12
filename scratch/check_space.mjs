async function checkSpace() {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7a/Learn_About_Living_%26_Working_in_Space_with_two_NASA_Astronauts.webm/Learn_About_Living_%26_Working_in_Space_with_two_NASA_Astronauts.webm.360p.vp9.webm';
  const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
  console.log('Space:', res.status, res.headers.get('content-length'), url);
}
checkSpace();
