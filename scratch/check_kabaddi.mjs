async function checkKabaddi() {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:Kabaddi-japan-2015-10-4.webm&prop=imageinfo&iiprop=url|size&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
  const data = await res.json();
  const info = Object.values(data.query.pages)[0].imageinfo?.[0];
  console.log('Kabaddi:', (info.size/1024/1024).toFixed(2), 'MB', info.url);
}
checkKabaddi();
