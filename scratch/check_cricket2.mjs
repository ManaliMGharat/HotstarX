async function checkCricket() {
  const list = [
    { base: '5/53', fn: 'ABC_World_Series_Cricket.ogv', q: '240p.vp9.webm' },
    { base: '0/0e', fn: 'This_is_batting.ogv', q: '240p.vp9.webm' },
    { base: 'b/bf', fn: 'This_is_bowling.ogv', q: '240p.vp9.webm' },
    { base: 'd/da', fn: 'This_is_fielding.ogv', q: '240p.vp9.webm' }
  ];

  for (const item of list) {
    const url = `https://upload.wikimedia.org/wikipedia/commons/transcoded/${item.base}/${item.fn}/${item.fn}.${item.q}`;
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'HotstarXMedia/1.0 (contact@hotstarx.local)' } });
    console.log(item.fn, res.status, res.headers.get('content-length'), url);
  }
}
checkCricket();
