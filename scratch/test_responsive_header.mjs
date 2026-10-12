import { spawn } from 'node:child_process';
import fs from 'node:fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = 'C:\\Users\\Manish Gharat\\.gemini\\antigravity\\brain\\f55c5ad5-dbb5-44fb-8dce-4c55e363e261\\scratch\\edge_resp_check';
try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}

const widths = [1024, 1150, 1280, 1440];

for (const w of widths) {
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9246',
    `--user-data-dir=${profileDir}`,
    `--window-size=${w},900`,
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2200));
  const versionRes = await fetch('http://127.0.0.1:9246/json/list');
  const pages = await versionRes.json();
  const target = pages.find(p => p.url.includes('localhost:5173')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let reqId = 1;
  const callbacks = new Map();
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  await new Promise(r => ws.onopen = r);
  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id).resolve(data.result);
      callbacks.delete(data.id);
    }
  };

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const navLinks = Array.from(document.querySelectorAll('header nav a'));
      const liveLink = navLinks.find(a => a.textContent.includes('Live'));
      const searchBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Search') || b.getAttribute('aria-label')?.includes('Search'));
      const hero = document.querySelector('div[role="region"]');
      const cw = document.getElementById('continue-watching');
      const firstRailHeader = cw ? cw.querySelector('h2') : null;

      const liveRect = liveLink ? liveLink.getBoundingClientRect() : null;
      const searchRect = searchBtn ? searchBtn.getBoundingClientRect() : null;
      const firstRailRect = firstRailHeader ? firstRailHeader.getBoundingClientRect() : null;

      const collision = liveRect && searchRect ? liveRect.right > searchRect.left : false;

      return {
        windowWidth: window.innerWidth,
        liveRight: liveRect ? liveRect.right : null,
        searchLeft: searchRect ? searchRect.left : null,
        collision,
        heroBottom: hero ? hero.getBoundingClientRect().bottom : null,
        firstRailTop: firstRailRect ? firstRailRect.top : null,
        firstRailBottom: firstRailRect ? firstRailRect.bottom : null,
        windowHeight: window.innerHeight
      };
    })()`,
    returnByValue: true
  });

  console.log(`Width ${w}px result:`, JSON.stringify(evalRes.result.value, null, 2));

  edgeProcess.kill();
  await new Promise(r => setTimeout(r, 800));
}

process.exit(0);
