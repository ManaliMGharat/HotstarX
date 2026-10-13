import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBSCRIPTION_PLANS } from '../src/data/plans.ts';
import { FALLBACK_POSTER, FALLBACK_BACKDROP } from '../src/utils/imageFallback.ts';
import { createPersonalProfile, createKidsProfile } from '../src/data/profiles.ts';
import { CATALOG } from '../src/data/content.ts';
import { api } from '../src/services/api.ts';

// 1. Subscription Plans Audit
test('1. Subscription tiers Mobile, Standard, Max Ultra are valid and properly priced', () => {
  assert.strictEqual(SUBSCRIPTION_PLANS.length, 3, 'Should have exactly 3 subscription tiers');
  
  const [mobile, standard, max] = SUBSCRIPTION_PLANS;
  
  assert.strictEqual(mobile.id, 'mobile');
  assert.strictEqual(mobile.name, 'Mobile');
  assert.strictEqual(mobile.priceMonthly, 99);
  assert.strictEqual(mobile.simultaneousScreens, 1);
  
  assert.strictEqual(standard.id, 'standard');
  assert.strictEqual(standard.name, 'Standard');
  assert.strictEqual(standard.priceMonthly, 199);
  assert.strictEqual(standard.simultaneousScreens, 2);
  
  assert.strictEqual(max.id, 'max');
  assert.strictEqual(max.name, 'Max Ultra');
  assert.strictEqual(max.priceMonthly, 299);
  assert.strictEqual(max.simultaneousScreens, 4);
  
  for (const plan of SUBSCRIPTION_PLANS) {
    assert.ok(plan.features.length >= 5, `Plan ${plan.name} must have at least 5 features`);
    assert.ok(plan.supportedDevices.length >= 2, `Plan ${plan.name} must specify supported devices`);
  }
});

// 2. Fallback SVG Data URIs Audit
test('2. Fallback SVG images are valid Data URIs branded with PrimeX', () => {
  assert.ok(FALLBACK_POSTER.startsWith('data:image/svg+xml'), 'Poster fallback must be SVG Data URI');
  assert.ok(FALLBACK_BACKDROP.startsWith('data:image/svg+xml'), 'Backdrop fallback must be SVG Data URI');
  assert.ok(FALLBACK_POSTER.includes('PrimeX'), 'Poster fallback must be branded with PrimeX');
  assert.ok(FALLBACK_BACKDROP.includes('PrimeX'), 'Backdrop fallback must be branded with PrimeX');
});

// 3. User Profile Creation & Isolation
test('3. User profile creation generates isolated profiles with PrimeX default fallback', () => {
  const profile = createPersonalProfile('', 'tester@example.com');
  assert.strictEqual(profile.name, 'PrimeX User', 'Empty name falls back to PrimeX User');
  assert.strictEqual(profile.email, 'tester@example.com');
  assert.strictEqual(profile.isKids, false);
  assert.ok(profile.id.startsWith('profile-'));

  const kids = createKidsProfile('Junior');
  assert.strictEqual(kids.name, 'Junior');
  assert.strictEqual(kids.isKids, true);
});

// 4. Content Catalog Integrity
test('4. Catalog contains rich content across movies, series, and sports', () => {
  assert.ok(CATALOG.length >= 25, 'Catalog must contain at least 25 titles');

  const movies = CATALOG.filter((c) => c.category === 'movie');
  const series = CATALOG.filter((c) => c.category === 'series');
  const sports = CATALOG.filter((c) => c.category === 'sports');
  const originals = CATALOG.filter((c) => c.isOriginal);

  assert.ok(movies.length >= 8, 'Must have at least 8 movies');
  assert.ok(series.length >= 4, 'Must have at least 4 series');
  assert.ok(sports.length >= 4, 'Must have at least 4 sports events');
  assert.ok(originals.length >= 4, 'Must have at least 4 originals');

  for (const item of CATALOG) {
    assert.ok(item.id, 'Item must have id');
    assert.ok(item.title, 'Item must have title');
    assert.ok(item.poster, `Item ${item.title} must have poster`);
    assert.ok(item.backdrop, `Item ${item.title} must have backdrop`);
    assert.ok(item.synopsis, `Item ${item.title} must have synopsis`);
    assert.ok(item.rating >= 0 && item.rating <= 10, `Item ${item.title} rating must be between 0 and 10`);
  }
});

// 5. API Service Layer Validation
test('5. API service layer successfully serves home content, movies, series, and sports', async () => {
  const home = await api.getHomeContent();
  assert.ok(home.hero.length > 0, 'Home must have featured hero items');
  assert.ok(home.sections.length >= 5, 'Home must have at least 5 content rails');

  const movies = await api.getMovies('All');
  assert.ok(movies.items.length > 0, 'Movies query must return items');
  assert.ok(movies.genres.includes('Action'), 'Movies genres must include Action');

  const series = await api.getSeries('All');
  assert.ok(series.items.length > 0, 'Series query must return items');

  const sports = await api.getSports();
  assert.ok(sports.live.length > 0, 'Sports query must return live matches');
  assert.ok(sports.sportsList.length > 0, 'Sports query must return sports list');

  const originals = await api.getOriginals();
  assert.ok(originals.items.length > 0, 'Originals query must return items');
});

// 6. Search Functionality Audit
test('6. Search filters correctly by title, genre, and cast', async () => {
  const titleSearch = await api.searchContent('Velocity');
  assert.ok(titleSearch.some((item) => item.title === 'Velocity'), 'Search for "Velocity" must find Velocity');

  const genreSearch = await api.searchContent('Sci-Fi');
  assert.ok(genreSearch.length > 0, 'Search for genre "Sci-Fi" must return results');

  const castSearch = await api.searchContent('Pankaj');
  assert.ok(castSearch.length > 0, 'Search for cast "Pankaj" must return results');

  const emptySearch = await api.searchContent('nonexistent_title_xyz_123');
  assert.strictEqual(emptySearch.length, 0, 'Search for nonexistent query returns empty array');
});

// 7. Kids Mode Content Sanitization
test('7. Kids Mode strictly restricts catalog to family-safe titles', async () => {
  const kidsHome = await api.getHomeContent(true);
  for (const section of kidsHome.sections) {
    for (const item of section.items) {
      assert.ok(
        item.ageRating === 'U' || item.category === 'kids',
        `Item "${item.title}" in Kids Mode has unsafe rating: ${item.ageRating}`
      );
    }
  }

  const kidsSearch = await api.searchContent('Neon City', 'All', true);
  // Neon City is rated U/A 16+ so it must NOT appear in Kids Mode
  assert.ok(
    !kidsSearch.some((item) => item.id === 'hx-neon-city'),
    'U/A 16+ titles must not appear in Kids Mode search results'
  );
});
