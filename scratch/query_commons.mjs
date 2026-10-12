async function queryCommons(category) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${category}&cmtype=file&cmlimit=20&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' }
  });
  const data = await res.json();
  console.log(`Category ${category}:`, data.query?.categorymembers?.map(m => m.title));
}

async function run() {
  await queryCommons('Videos_of_association_football');
  await queryCommons('Videos_of_tennis');
  await queryCommons('Videos_of_spaceflight');
  await queryCommons('Videos_of_cooking');
}

run();
