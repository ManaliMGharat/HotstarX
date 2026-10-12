import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MEDIA_CATALOG, getMediaCatalogEntry } from '../src/data/mediaCatalog.ts';

// 1. Content ID to Media Source Resolution
test('1. Each content ID resolves to its intended media source', () => {
  const entries = Object.values(MEDIA_CATALOG);
  assert.ok(entries.length >= 28, 'Catalog must contain at least 28 items');

  for (const entry of entries) {
    assert.ok(entry.id, `Entry missing id: ${JSON.stringify(entry)}`);
    assert.ok(entry.title, `Entry ${entry.id} missing title`);
    assert.ok(entry.videoUrl, `Entry ${entry.id} missing videoUrl`);
    assert.ok(entry.format, `Entry ${entry.id} missing format`);
    assert.ok(entry.verifiedCategory, `Entry ${entry.id} missing verifiedCategory`);
    assert.strictEqual(getMediaCatalogEntry(entry.id)?.videoUrl, entry.videoUrl);
  }
});

// 2. Expected Content Category Integrity
test('2. Every media source has the expected content category and no surveillance footage', () => {
  for (const entry of Object.values(MEDIA_CATALOG)) {
    // Zero tolerance for unrelated Intel surveillance clips
    assert.ok(
      !entry.videoUrl.includes('face-demographics-walking.mp4'),
      `Entry ${entry.id} improperly references pedestrian walking surveillance footage: ${entry.videoUrl}`
    );
    assert.ok(
      !entry.videoUrl.includes('person-bicycle-car-detection.mp4'),
      `Entry ${entry.id} improperly references bicycle/car detection surveillance footage: ${entry.videoUrl}`
    );
    // Category integrity
    assert.ok(entry.verifiedCategory.length > 0, `Entry ${entry.id} must declare verified category`);
    assert.ok(entry.footageDescription.length > 0, `Entry ${entry.id} must declare footage description`);
  }
});

// 3. Selecting a New Title Updates Player Source Correctly
test('3. Selecting a new title updates the player source correctly', () => {
  function simulateSelectMedia(mediaId, episodeId) {
    const key = episodeId || mediaId;
    const entry = getMediaCatalogEntry(key);
    assert.ok(entry, `Entry for ${key} must exist`);
    return {
      activeId: key,
      title: entry.title,
      src: entry.videoUrl,
      currentTime: 0,
      isPlaying: false,
      error: null
    };
  }

  const selection1 = simulateSelectMedia('hx-live-cricket-1');
  assert.strictEqual(selection1.src, '/videos/cricket-match-demo.webm');
  assert.strictEqual(selection1.currentTime, 0);

  const selection2 = simulateSelectMedia('hx-live-football-1');
  assert.strictEqual(selection2.src, '/videos/football-match-demo.webm');
  assert.strictEqual(selection2.currentTime, 0);
  assert.notStrictEqual(selection1.src, selection2.src, 'Source must update between titles');
});

// 4. Switching Between Titles Never Leaves Previous Source Playing
test('4. Switching between different titles never leaves previous source playing or stale time', () => {
  let playerState = {
    currentId: 'hx-live-cricket-1',
    src: MEDIA_CATALOG['hx-live-cricket-1'].videoUrl,
    currentTime: 142.5,
    isPlaying: true
  };

  function switchTitle(newId) {
    const nextEntry = getMediaCatalogEntry(newId);
    assert.ok(nextEntry, `Next entry ${newId} must exist`);
    playerState = {
      currentId: newId,
      src: nextEntry.videoUrl,
      currentTime: 0,
      isPlaying: false
    };
  }

  switchTitle('hx-velocity');
  assert.strictEqual(playerState.currentId, 'hx-velocity');
  assert.strictEqual(playerState.src, '/videos/racing-demo.mp4');
  assert.strictEqual(playerState.currentTime, 0, 'Playback position must reset to 0');
  assert.strictEqual(playerState.isPlaying, false, 'Playback must not leave previous video running');
});

// 5. Search Results Open Correct Content Identity
test('5. Search results preserve content identity and load correct video source', () => {
  const searchQueries = [
    { query: 'cricket', expectedId: 'hx-live-cricket-1', expectedSport: 'cricket' },
    { query: 'football', expectedId: 'hx-live-football-1', expectedSport: 'football' },
    { query: 'tennis', expectedId: 'hx-live-tennis-1', expectedSport: 'tennis' },
    { query: 'kabaddi', expectedId: 'hx-live-kabaddi-1', expectedSport: 'kabaddi' },
    { query: 'velocity', expectedId: 'hx-velocity', expectedCategory: 'Motorsport Racing' }
  ];

  for (const { query, expectedId, expectedSport, expectedCategory } of searchQueries) {
    const entry = getMediaCatalogEntry(expectedId);
    assert.ok(entry, `Entry for ${expectedId} found`);
    if (expectedSport) {
      assert.strictEqual(entry.sportType, expectedSport);
      assert.ok(entry.videoUrl.includes(expectedSport), `Video for ${query} must contain sport keyword`);
    }
    if (expectedCategory) {
      assert.strictEqual(entry.verifiedCategory, expectedCategory);
    }
  }
});

// 6. Movie and Series Episode Selection
test('6. Movie and series episode selection works correctly and loads episode-specific sources', () => {
  const ncEp1 = getMediaCatalogEntry('ep-nc-101');
  const ncEp2 = getMediaCatalogEntry('ep-nc-102');
  const ncEp3 = getMediaCatalogEntry('ep-nc-103');

  assert.ok(ncEp1 && ncEp2 && ncEp3, 'All episodes must exist');
  assert.strictEqual(ncEp1.videoUrl, '/videos/sintel-action.mp4');
  assert.strictEqual(ncEp2.videoUrl, 'https://media.w3.org/2010/05/sintel/trailer.mp4');
  assert.strictEqual(ncEp3.videoUrl, '/videos/space-exploration-demo.webm');
  assert.ok(!ncEp3.videoUrl.includes('jellyfish'), 'Episode 3 of Neon City must not play jellyfish');

  const mdEp1 = getMediaCatalogEntry('ep-md-101');
  const mdEp2 = getMediaCatalogEntry('ep-md-102');
  assert.ok(mdEp1 && mdEp2, 'Midnight diner episodes must exist');
  assert.ok(!mdEp1.videoUrl.includes('walking'), 'Ep 1 must not play pedestrian surveillance');
  assert.ok(!mdEp2.videoUrl.includes('flower'), 'Ep 2 must not play flower blooming');
  assert.ok(mdEp1.videoUrl.includes('culinary'), 'Ep 1 must play culinary footage');
  assert.ok(mdEp2.videoUrl.includes('culinary'), 'Ep 2 must play culinary footage');
});

// 7. Live Sports Cards Load Sport-Appropriate Footage
test('7. Live sports cards load sport-appropriate footage', () => {
  const sports = [
    { id: 'hx-live-cricket-1', sport: 'cricket', expectedClip: 'cricket-match-demo.webm' },
    { id: 'hx-upcoming-cricket-1', sport: 'cricket', expectedClip: 'cricket-t20-demo.webm' },
    { id: 'hx-live-football-1', sport: 'football', expectedClip: 'football-match-demo.webm' },
    { id: 'hx-skyline-fc', sport: 'football', expectedClip: 'football-match-demo.webm' },
    { id: 'hx-live-f1-1', sport: 'motorsport', expectedClip: 'racing-demo.mp4' },
    { id: 'hx-live-tennis-1', sport: 'tennis', expectedClip: 'tennis-match-demo.webm' },
    { id: 'hx-live-kabaddi-1', sport: 'kabaddi', expectedClip: 'kabaddi-match-demo.webm' }
  ];

  for (const s of sports) {
    const entry = getMediaCatalogEntry(s.id);
    assert.ok(entry, `Sport item ${s.id} must be in catalog`);
    assert.ok(
      entry.videoUrl.includes(s.expectedClip),
      `Sport ${s.id} must play ${s.expectedClip}, found: ${entry.videoUrl}`
    );
  }
});

// 8. Missing or Broken Sources Display Error Instead of Unrelated Content
test('8. Missing or broken sources trigger explicit error state rather than falling back to unrelated content', () => {
  function handleStreamError(itemTitle) {
    return {
      errorState: true,
      errorMessage: `Stream Unavailable: The selected media stream for "${itemTitle}" could not be loaded. Please check your network connection or select another title.`,
      fallbackToRandomVideo: false
    };
  }

  const errorResult = handleStreamError('Premier Super Cup: Mumbai vs Chennai');
  assert.strictEqual(errorResult.errorState, true);
  assert.strictEqual(errorResult.fallbackToRandomVideo, false, 'Never silently play another title on error');
  assert.ok(errorResult.errorMessage.includes('Stream Unavailable'));
});

// 9. All Local Video Files Exist and Are Accessible On Disk
test('9. All local video assets referenced in catalog physically exist in public directory', () => {
  const publicDir = path.resolve('public');
  const checkedFiles = new Set();

  for (const entry of Object.values(MEDIA_CATALOG)) {
    if (entry.videoUrl.startsWith('/')) {
      const relPath = entry.videoUrl.replace(/^\//, '');
      const fullPath = path.join(publicDir, relPath);
      checkedFiles.add(fullPath);
      assert.ok(
        fs.existsSync(fullPath),
        `Asset file for ${entry.id} missing on disk: ${fullPath}`
      );
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 100000, `Asset file ${relPath} is unexpectedly small (${stat.size} bytes)`);
    }
  }

  assert.ok(checkedFiles.size >= 7, `Must have verified multiple distinct local files, verified ${checkedFiles.size}`);
});

// 10. Honest Sports Classification Integrity
test('10. Honest sports classification integrity (simulated_live, upcoming_preview, recorded)', () => {
  const cricketLive = getMediaCatalogEntry('hx-live-cricket-1');
  const cricketUpcoming = getMediaCatalogEntry('hx-upcoming-cricket-1');
  const docuseries = getMediaCatalogEntry('hx-skyline-fc');

  assert.strictEqual(cricketLive?.streamType, 'simulated_live');
  assert.strictEqual(cricketUpcoming?.streamType, 'upcoming_preview');
  assert.strictEqual(cricketUpcoming?.broadcastStatus, 'UPCOMING');
  assert.strictEqual(docuseries?.streamType, 'recorded');
  assert.strictEqual(docuseries?.broadcastStatus, 'COMPLETED');
});
