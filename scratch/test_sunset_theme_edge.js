import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = 'C:\\Users\\Manish Gharat\\.gemini\\antigravity\\brain\\f55c5ad5-dbb5-44fb-8dce-4c55e363e261\\scratch\\edge_sunset_audit';

try {
  fs.rmSync(profileDir, { recursive: true, force: true });
} catch (e) {}

console.log('====================================================');
console.log('STARTING HOTSTARX WARM SUNSET & PLUM AUDIT VIA EDGE');
console.log('====================================================');

const edgeProcess = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--autoplay-policy=no-user-gesture-required',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const versionRes = await fetch('http://127.0.0.1:9230/json/list');
  const pages = await versionRes.json();
  const target = pages.find(p => p.url.includes('localhost:5173')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  const consoleErrors = [];
  const failedRequests = [];
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
    if (data.method === 'Runtime.consoleAPICalled') {
      if (data.params.type === 'error') {
        const text = data.params.args.map(a => a.value || a.description).join(' ');
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    }
    if (data.method === 'Network.loadingFailed') {
      failedRequests.push(data.params);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');

  // Helper evaluate
  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  // 1. Audit Home Page, Sunset Canvas, Layout & Metadata
  console.log('\n[TEST 1] Auditing Home Page & Sunset Canvas...');
  await new Promise(r => setTimeout(r, 2000));
  const homeCheck = await evaluate(`
    (() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const bodyBgImg = window.getComputedStyle(document.body).backgroundImage;
      const drift1 = document.querySelectorAll('.animate-ambient-drift-1').length;
      const drift2 = document.querySelectorAll('.animate-ambient-drift-2').length;
      const arcPulse = document.querySelectorAll('.animate-arc-pulse').length;
      const rails = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim());
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(img => img.complete && img.naturalWidth === 0).length;
      
      // Check if game-controller image appears anywhere on the page
      const allImgSrcs = Array.from(document.querySelectorAll('img')).map(img => img.src);
      const gameControllerPresent = allImgSrcs.some(src => src.includes('1509198397868-475647b2a1e5'));

      // Check hero metadata row for duplicates
      const heroMetaRow = document.querySelector('.animate-hero-meta');
      const heroMetaText = heroMetaRow ? heroMetaRow.textContent : '';
      const matchMatches = (heroMetaText.match(/% Match/g) || []).length;
      const hasDuplicateMatch = matchMatches > 1;

      // Check for duplicate language dropdown triggers
      const languageButtons = Array.from(document.querySelectorAll('button')).filter(b => 
        b.getAttribute('aria-label')?.includes('Language') || 
        b.textContent?.includes('Language') ||
        b.getAttribute('title')?.includes('Language')
      );

      // Check spacing on content rails
      const continueWatching = document.getElementById('continue-watching');
      const continueWatchingMarginTop = continueWatching ? window.getComputedStyle(continueWatching).marginTop : '0px';

      return {
        bodyBg,
        hasSunsetRadialGradient: bodyBgImg.includes('radial-gradient'),
        ambientElementsCount: drift1 + drift2 + arcPulse,
        railsCount: rails.length,
        brokenImgs,
        gameControllerPresent,
        hasDuplicateMatch,
        languageButtonsCount: languageButtons.length,
        continueWatchingMarginTop
      };
    })()
  `);
  console.log('Home Canvas Audit:', JSON.stringify(homeCheck, null, 2));

  // 2. Playback of Movie A (Velocity)
  console.log('\n[TEST 2] Testing Playback of Movie A (Velocity)...');
  await evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll('h3, h4'));
      const vel = cards.find(c => c.textContent.includes('Velocity'));
      if (vel) vel.closest('.group\\\\/card, [class*="cursor-pointer"]').click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1200));

  await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const watchBtn = btns.find(b => b.textContent.includes('Watch Now'));
      if (watchBtn) watchBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));

  const movieAState = await evaluate(`
    (() => {
      const v = document.querySelector('video');
      return v ? {
        found: true,
        src: v.currentSrc || v.src,
        paused: v.paused,
        currentTime: v.currentTime,
        duration: v.duration,
        readyState: v.readyState
      } : { found: false };
    })()
  `);
  console.log('Movie A (Velocity) Player State:', JSON.stringify(movieAState, null, 2));

  // Close player modal
  await evaluate(`
    (() => {
      const closeBtn = document.querySelector('button[aria-label*="Close Player"]');
      if (closeBtn) closeBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // 3. Playback of Movie B (The Last Monsoon)
  console.log('\n[TEST 3] Testing Playback Switch to Movie B (The Last Monsoon)...');
  await evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll('h3, h4'));
      const mon = cards.find(c => c.textContent.includes('The Last Monsoon'));
      if (mon) mon.closest('.group\\\\/card, [class*="cursor-pointer"]').click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1200));

  await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const watchBtn = btns.find(b => b.textContent.includes('Watch Now'));
      if (watchBtn) watchBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));

  const movieBState = await evaluate(`
    (() => {
      const v = document.querySelector('video');
      return v ? {
        found: true,
        src: v.currentSrc || v.src,
        paused: v.paused,
        currentTime: v.currentTime,
        duration: v.duration,
        readyState: v.readyState
      } : { found: false };
    })()
  `);
  console.log('Movie B (The Last Monsoon) Player State:', JSON.stringify(movieBState, null, 2));
  console.log('VERIFICATION: Movie A and Movie B play DIFFERENT sources:', movieAState.src !== movieBState.src);

  // Close player modal
  await evaluate(`
    (() => {
      const closeBtn = document.querySelector('button[aria-label*="Close Player"]');
      if (closeBtn) closeBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // 4. Movies Page Atmosphere
  console.log('\n[TEST 4] Auditing Movies Page Atmosphere & Genres (/movies)...');
  await send('Page.navigate', { url: 'http://localhost:5173/movies' });
  await new Promise(r => setTimeout(r, 2000));
  const moviesCheck = await evaluate(`
    (() => {
      const glow = document.querySelector('.from-rose-950\\\\/30');
      const pills = Array.from(document.querySelectorAll('button')).filter(b => ['All', 'Action', 'Comedy', 'Drama', 'Thriller'].includes(b.textContent.trim()));
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).length;
      return {
        hasRosePlumAtmosphereGlow: !!glow,
        genrePillsCount: pills.length,
        brokenImgs
      };
    })()
  `);
  console.log('Movies Page Audit:', JSON.stringify(moviesCheck, null, 2));

  // 5. Series Page Atmosphere
  console.log('\n[TEST 5] Auditing Series Page Atmosphere & Genres (/series)...');
  await send('Page.navigate', { url: 'http://localhost:5173/series' });
  await new Promise(r => setTimeout(r, 2000));
  const seriesCheck = await evaluate(`
    (() => {
      const glow = document.querySelector('.from-fuchsia-950\\\\/30');
      const pills = Array.from(document.querySelectorAll('button')).filter(b => ['All', 'Sci-Fi', 'Crime', 'Thriller', 'Drama'].includes(b.textContent.trim()));
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).length;
      return {
        hasFuchsiaPlumAtmosphereGlow: !!glow,
        genrePillsCount: pills.length,
        brokenImgs
      };
    })()
  `);
  console.log('Series Page Audit:', JSON.stringify(seriesCheck, null, 2));

  // 6. Live Sports Broadcast Center
  console.log('\n[TEST 6] Auditing Live Sports Broadcast Center (/live)...');
  await send('Page.navigate', { url: 'http://localhost:5173/live' });
  await new Promise(r => setTimeout(r, 2000));
  const liveCheck = await evaluate(`
    (() => {
      const notice = document.body.innerText.includes('HotstarX Arena Broadcast Notice');
      const glow = document.querySelector('.from-orange-950\\\\/35');
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).length;
      return {
        hasSunsetArenaAtmosphereGlow: !!glow,
        noticePresent: notice,
        brokenImgs
      };
    })()
  `);
  console.log('Live Sports Broadcast Audit:', JSON.stringify(liveCheck, null, 2));

  // Play featured live sport match
  await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const watchMatch = btns.find(b => b.textContent.includes('Watch Featured Match'));
      if (watchMatch) watchMatch.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));

  const sportState = await evaluate(`
    (() => {
      const v = document.querySelector('video');
      return v ? {
        found: true,
        src: v.currentSrc || v.src,
        paused: v.paused,
        currentTime: v.currentTime,
        readyState: v.readyState
      } : { found: false };
    })()
  `);
  console.log('Live Sport Player State:', JSON.stringify(sportState, null, 2));

  console.log('\n====================================================');
  console.log('FINAL AUDIT SUMMARY:');
  console.log('Console Errors count:', consoleErrors.length, consoleErrors);
  console.log('Failed Network Requests count:', failedRequests.length, failedRequests);
  console.log('====================================================\n');

  ws.close();
} catch (e) {
  console.error('Audit Error:', e);
} finally {
  edgeProcess.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}
