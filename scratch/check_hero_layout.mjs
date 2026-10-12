import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = 'C:\\Users\\Manish Gharat\\.gemini\\antigravity\\brain\\f55c5ad5-dbb5-44fb-8dce-4c55e363e261\\scratch\\edge_layout_check';
try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}

const edgeProcess = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9244',
  `--user-data-dir=${profileDir}`,
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2500));
const versionRes = await fetch('http://127.0.0.1:9244/json/list');
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
await new Promise(r => setTimeout(r, 2000));

const info = await send('Runtime.evaluate', {
  expression: `(() => {
    const hero = document.querySelector('div[role="region"]');
    const metas = Array.from(document.querySelectorAll('.animate-hero-meta'));
    const sidebar = document.querySelector('aside');
    const header = document.querySelector('header');
    const prevBtn = document.querySelector('button[aria-label*="Previous"]');
    const nextBtn = document.querySelector('button[aria-label*="Next"]');
    const cw = document.getElementById('continue-watching');
    const thumbs = document.querySelector('.group\\/thumb');
    
    return {
      windowWidth: window.innerWidth,
      heroRect: hero ? hero.getBoundingClientRect() : null,
      metas: metas.map(m => ({
        text: m.innerText,
        rect: m.getBoundingClientRect(),
        overflow: window.getComputedStyle(m).overflow
      })),
      sidebarRect: sidebar ? sidebar.getBoundingClientRect() : null,
      headerRect: header ? header.getBoundingClientRect() : null,
      prevBtnRect: prevBtn ? prevBtn.getBoundingClientRect() : null,
      nextBtnRect: nextBtn ? nextBtn.getBoundingClientRect() : null,
      cwRect: cw ? cw.getBoundingClientRect() : null,
      thumbRect: thumbs ? thumbs.parentElement?.getBoundingClientRect() : null
    };
  })()`,
  returnByValue: true
});
console.log('Layout Info:', JSON.stringify(info.result.value, null, 2));

const ss = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('C:\\Users\\Manish Gharat\\.gemini\\antigravity\\brain\\f55c5ad5-dbb5-44fb-8dce-4c55e363e261\\scratch\\home_layout.png', Buffer.from(ss.data, 'base64'));
console.log('Screenshot saved.');

edgeProcess.kill();
process.exit(0);
