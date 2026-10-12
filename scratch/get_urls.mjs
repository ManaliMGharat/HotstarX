async function getFileInfo(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|derivatives&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  const info = page.imageinfo?.[0];
  console.log(title, 'URL:', info?.url);
  console.log('Derivatives:', info?.derivatives?.map(d => ({ type: d.type, url: d.url })));
}

async function run() {
  await getFileInfo("File:2018 Davis Cup Americas Zone - Uruguay vs Mexico - 03.webm");
  await getFileInfo("File:2018 FIFA U-17 Women's World Cup - New Zealand vs Canada - 21.webm");
  await getFileInfo("File:Learn About Living & Working in Space with two NASA Astronauts.webm");
}

run();
