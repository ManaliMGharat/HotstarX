import { spawn } from 'node:child_process';
import fs from 'node:fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = 'C:\\Users\\Manish Gharat\\.gemini\\antigravity\\brain\\f55c5ad5-dbb5-44fb-8dce-4c55e363e261\\scratch\\edge_capture_multi';
try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}

const sizes = [
  { w: 1440, h: 900, name: 'desktop_1440' },
  { w: 1150, h: 800, name: 'desktop_1150' },
  { w: 768, h: 1024, name: 'tablet_768' }
];

for (const s of sizes) {
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9248',
    `--user-data-dir=${profileDir}`,
    `--window-size=${s.w},${s.h}`,
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2200));
  const versionRes = await fetch('http://127.0.0.1:9248/json/list');
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

  await send('Page.enable');
  await new Promise(r => setTimeout(r, 1500));

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`C:\\Users\\Manish Gharat\\.gemini\\antigravity\\brain\\f55c5ad5-dbb5-44fb-8dce-4c55e363e261\\scratch\\${s.name}.png`, Buffer.from(ss.data, 'base64'));
  console.log(`Saved screenshot ${s.name}`);

  edgeProcess.kill();
  await new Promise(r => setTimeout(r, 800));
}

process.exit(0);
