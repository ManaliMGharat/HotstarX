async function findSmallSpace() {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Videos_of_Earth_from_space&cmtype=file&cmlimit=25&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
  const data = await res.json();
  for (const m of data.query.categorymembers) {
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(m.title)}&prop=imageinfo&iiprop=url|size&format=json`;
    const resInfo = await fetch(infoUrl, { headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
    const dInfo = await resInfo.json();
    const info = Object.values(dInfo.query.pages)[0].imageinfo?.[0];
    if (info && info.size < 15000000 && (m.title.endsWith('.webm') || m.title.endsWith('.ogv'))) {
      console.log(m.title, (info.size/1024/1024).toFixed(2), 'MB', info.url);
    }
  }
}
findSmallSpace();
