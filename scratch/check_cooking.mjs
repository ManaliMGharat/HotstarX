async function checkCooking() {
  const titles = [
    'File:Cooking Salmon 20200410 141528.webm',
    'File:Cooking with Laura Homemade Pasta.webm',
    'File:Canard au sang.webm',
    'File:Cooking Squilla mantis with tomato sauce.webm'
  ];
  for (const t of titles) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(t)}&prop=imageinfo&iiprop=url|size&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
    const data = await res.json();
    const info = Object.values(data.query.pages)[0].imageinfo?.[0];
    if (info) console.log(t, (info.size/1024/1024).toFixed(2), 'MB', info.url);
  }
}
checkCooking();
