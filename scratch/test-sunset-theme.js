const http = require('http');

function sendCdpCommand(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 100000);
    
    ws.on('open', () => {
      ws.send(JSON.stringify({ id, method, params }));
    });
    
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.close();
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });
    
    ws.on('error', (err) => reject(err));
  });
}

async function run() {
  console.log("====================================================");
  console.log("STARTING HOTSTARX WARM SUNSET & PLUM AUDIT");
  console.log("====================================================");

  // 1. Get browser targets from Chrome/Edge debug port 9222
  let targets;
  try {
    targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json', (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(JSON.parse(raw)));
      }).on('error', reject);
    });
  } catch (e) {
    // If not on 9222, launch a temporary puppeteer or chromium instance with CDP
    console.log("No existing CDP target on 9222, launching Chromium test runner...");
    const { chromium } = require('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const consoleErrors = [];
    const failedRequests = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    });

    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
    });

    // TEST 1: Home Page & Warm Sunset Theme
    console.log('\n[TEST 1] Auditing Home Page & Sunset Canvas...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    const themeStyles = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const bodyBgImg = window.getComputedStyle(document.body).backgroundImage;
      const driftElements = document.querySelectorAll('.animate-ambient-drift-1, .animate-ambient-drift-2, .animate-arc-pulse');
      return {
        bodyBg,
        hasSunsetGradients: bodyBgImg.includes('rgba(88, 22, 108') || bodyBgImg.includes('rgba(249, 115, 22') || bodyBgImg.includes('radial-gradient'),
        ambientElementsCount: driftElements.length
      };
    });
    console.log('Home Theme Canvas:', JSON.stringify(themeStyles, null, 2));

    // TEST 2: Movie A Playback (Velocity)
    console.log('\n[TEST 2] Testing Playback of Movie A (Velocity)...');
    const velocityCard = await page.locator('text=Velocity').first();
    await velocityCard.scrollIntoViewIfNeeded();
    await velocityCard.click();
    await page.waitForTimeout(1000);

    const watchBtn = await page.locator('button:has-text("Watch Now")').first();
    await watchBtn.click();
    await page.waitForTimeout(2500);

    const movieAState = await page.evaluate(() => {
      const v = document.querySelector('video');
      return v ? {
        found: true,
        src: v.currentSrc || v.src,
        paused: v.paused,
        currentTime: v.currentTime,
        readyState: v.readyState
      } : { found: false };
    });
    console.log('Movie A (Velocity) Player State:', JSON.stringify(movieAState, null, 2));

    // Close Player
    const closeBtn = await page.locator('button[aria-label="Close Player (Esc)"]').first();
    await closeBtn.click();
    await page.waitForTimeout(800);

    // TEST 3: Movie B Playback (The Last Monsoon)
    console.log('\n[TEST 3] Testing Immediate Playback Switch to Movie B (The Last Monsoon)...');
    const monsoonCard = await page.locator('text=The Last Monsoon').first();
    await monsoonCard.scrollIntoViewIfNeeded();
    await monsoonCard.click();
    await page.waitForTimeout(800);

    const watchMonsoon = await page.locator('button:has-text("Watch Now")').first();
    await watchMonsoon.click();
    await page.waitForTimeout(2500);

    const movieBState = await page.evaluate(() => {
      const v = document.querySelector('video');
      return v ? {
        found: true,
        src: v.currentSrc || v.src,
        paused: v.paused,
        currentTime: v.currentTime,
        readyState: v.readyState
      } : { found: false };
    });
    console.log('Movie B (The Last Monsoon) Player State:', JSON.stringify(movieBState, null, 2));
    console.log('VERIFICATION: Movie A and Movie B play DIFFERENT sources:', movieAState.src !== movieBState.src);

    const closeBtn2 = await page.locator('button[aria-label="Close Player (Esc)"]').first();
    await closeBtn2.click();
    await page.waitForTimeout(800);

    // TEST 4: Movies Page Atmosphere
    console.log('\n[TEST 4] Auditing Movies Page & Atmosphere...');
    await page.goto('http://localhost:5173/movies', { waitUntil: 'networkidle' });
    const moviesAtmosphere = await page.evaluate(() => {
      const glow = document.querySelector('.bg-gradient-to-b.from-rose-950\\/30');
      return { hasRosePlumGlow: !!glow };
    });
    console.log('Movies Atmosphere:', JSON.stringify(moviesAtmosphere));

    // TEST 5: Series Page Atmosphere
    console.log('\n[TEST 5] Auditing Series Page & Atmosphere...');
    await page.goto('http://localhost:5173/series', { waitUntil: 'networkidle' });
    const seriesAtmosphere = await page.evaluate(() => {
      const glow = document.querySelector('.bg-gradient-to-b.from-fuchsia-950\\/30');
      return { hasFuchsiaPlumGlow: !!glow };
    });
    console.log('Series Atmosphere:', JSON.stringify(seriesAtmosphere));

    // TEST 6: Live Sports Broadcast Center
    console.log('\n[TEST 6] Auditing Live Sports Broadcast Center (/live)...');
    await page.goto('http://localhost:5173/live', { waitUntil: 'networkidle' });
    const liveNotice = await page.evaluate(() => {
      const notice = document.body.innerText.includes('HotstarX Arena Broadcast Notice');
      const watchMatchBtn = document.querySelector('button:has-text("Watch Featured Match")');
      return { noticeFound: notice, hasFeaturedButton: !!watchMatchBtn };
    });
    console.log('Live Sports Broadcast Check:', JSON.stringify(liveNotice));

    // Play Featured Live Sport Match
    const watchMatch = await page.locator('button:has-text("Watch Featured Match")').first();
    if (await watchMatch.isVisible()) {
      await watchMatch.click();
      await page.waitForTimeout(2000);
      const liveSportState = await page.evaluate(() => {
        const v = document.querySelector('video');
        return v ? {
          found: true,
          src: v.currentSrc || v.src,
          paused: v.paused,
          readyState: v.readyState
        } : { found: false };
      });
      console.log('Live Sports Player State:', JSON.stringify(liveSportState, null, 2));
    }

    console.log('\n====================================================');
    console.log('FINAL AUDIT SUMMARY:');
    console.log('Console Errors count:', consoleErrors.length, consoleErrors);
    console.log('Failed Network Requests count:', failedRequests.length, failedRequests);
    console.log('====================================================\n');

    await browser.close();
    return;
  }
}

run().catch(console.error);
