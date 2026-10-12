import { CATALOG, HERO_TITLES } from '../data/content';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import type { ContentSection, MediaItem, SubscriptionPlan, UserProfile } from '../types';

// Simulated latency helper
const simulateDelay = <T>(data: T, ms = 30): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export const api = {
  /**
   * Fetch home page curated content sections
   */
  async getHomeContent(isKids = false): Promise<{ hero: MediaItem[]; sections: ContentSection[] }> {
    const pool = isKids 
      ? CATALOG.filter(item => item.ageRating === 'U' || item.category === 'kids')
      : CATALOG;

    const hero = isKids
      ? pool.filter(item => item.category === 'kids').slice(0, 4)
      : HERO_TITLES;

    const sections: ContentSection[] = [];

    if (!isKids) {
      // 1. Trending Now (Ranked 1-10 with giant rank numbers)
      sections.push({
        id: 'sec-trending',
        title: 'Trending Now',
        subtitle: 'The 10 most-watched titles across HotstarX today',
        isRanked: true,
        isPortrait: true,
        items: pool.filter(item => item.topRank !== undefined).sort((a, b) => (a.topRank || 99) - (b.topRank || 99)).slice(0, 10),
      });

      // 2. Popular Movies
      sections.push({
        id: 'sec-popular-movies',
        title: 'Popular Movies',
        subtitle: 'Blockbuster hits, adrenaline spectacles, and critically acclaimed films',
        isPortrait: true,
        viewAllRoute: '/movies',
        items: pool.filter(item => item.category === 'movie'),
      });

      // 3. Indian Cinema
      sections.push({
        id: 'sec-indian-cinema',
        title: 'Indian Cinema',
        subtitle: 'Celebrated storytelling across Hindi, Tamil, Malayalam, and regional languages',
        isPortrait: true,
        items: pool.filter(item => 
          item.category === 'movie' && 
          ['hx-last-monsoon', 'hx-kavach', 'hx-mumbai-monsoon', 'hx-chai-chaos', 'hx-kitchen-stories'].includes(item.id)
        ),
      });

      // 4. International Movies
      sections.push({
        id: 'sec-intl-movies',
        title: 'International Movies',
        subtitle: 'Acclaimed world cinema, deep-space sagas, and Hollywood blockbusters',
        isPortrait: true,
        items: pool.filter(item => 
          item.category === 'movie' && 
          ['hx-velocity', 'hx-orbit-9', 'hx-chrono-rift', 'hx-afterglow', 'hx-silent-harbor', 'hx-paper-planes'].includes(item.id)
        ),
      });

      // 5. HotstarX Originals (Widescreen 16:9 Landscape Presentation)
      sections.push({
        id: 'sec-originals',
        title: 'HotstarX Originals',
        subtitle: 'Award-winning prestige narratives produced exclusively by HotstarX',
        isPortrait: false,
        viewAllRoute: '/originals',
        items: pool.filter(item => item.isOriginal),
      });

      // 6. Popular Series
      sections.push({
        id: 'sec-popular-series',
        title: 'Popular Series',
        subtitle: 'Multi-season sagas, mind-bending thrillers, and edge-of-seat mysteries',
        isPortrait: true,
        viewAllRoute: '/shows',
        items: pool.filter(item => item.category === 'series'),
      });

      // 7. Live Sports & Action (Dedicated Sports Arena Rail)
      sections.push({
        id: 'sec-sports-live',
        title: 'Sports & Live Action',
        subtitle: 'Real-time 4K HDR coverage of Cricket, Motorsport, Football, and Tennis',
        isPortrait: false,
        viewAllRoute: '/sports',
        items: pool.filter(item => item.category === 'sports' || item.isLive),
      });

      // 8. Kids and Family
      sections.push({
        id: 'sec-kids-family',
        title: 'Kids and Family',
        subtitle: 'Heartwarming animated adventures and wildlife expeditions for all ages',
        isPortrait: true,
        items: pool.filter(item => item.category === 'kids' || (item.ageRating === 'U' && item.category !== 'sports')),
      });

      // 9. Recommended for You
      sections.push({
        id: 'sec-recommended',
        title: 'Recommended for You',
        subtitle: 'Hand-picked selections tailored to your streaming taste',
        isPortrait: true,
        items: pool.filter(item => item.rating >= 9.2).slice(0, 8),
      });
    } else {
      // Kids Mode Sections
      sections.push({
        id: 'sec-kids-trending',
        title: 'Trending in Kids & Family',
        subtitle: 'Fun favorites loved by kids everywhere',
        isPortrait: true,
        items: pool.filter(item => item.category === 'kids'),
      });

      sections.push({
        id: 'sec-kids-adventures',
        title: 'Animal & Nature Adventures',
        subtitle: 'Explore our amazing planet and its wild creatures',
        isPortrait: false,
        items: pool.filter(item => item.category === 'documentary' && item.ageRating === 'U'),
      });

      sections.push({
        id: 'sec-kids-family',
        title: 'Family Movie Time',
        subtitle: 'Great stories to enjoy together',
        isPortrait: true,
        items: pool.filter(item => item.ageRating === 'U'),
      });
    }

    return simulateDelay({ hero, sections });
  },

  /**
   * Fetch movies with genre breakdown
   */
  async getMovies(genre?: string, isKids = false): Promise<{ featured: MediaItem; items: MediaItem[]; genres: string[] }> {
    let movies = CATALOG.filter(item => item.category === 'movie');
    if (isKids) {
      movies = movies.filter(item => item.ageRating === 'U');
    }

    const availableGenres = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi'];

    if (genre && genre !== 'All') {
      const gLower = genre.toLowerCase();
      movies = movies.filter(m => m.genre.some(g => g.toLowerCase().includes(gLower)));
    }

    const featured = movies.find(m => m.id === 'hx-velocity') || movies[0] || CATALOG[0];
    return simulateDelay({ featured, items: movies, genres: availableGenres });
  },

  /**
   * Fetch series catalog
   */
  async getSeries(genre?: string, isKids = false): Promise<{ featured: MediaItem; items: MediaItem[]; genres: string[] }> {
    let series = CATALOG.filter(item => item.category === 'series');
    if (isKids) {
      series = series.filter(item => item.ageRating === 'U');
    }

    const availableGenres = ['All', 'Sci-Fi', 'Crime', 'Thriller', 'Drama', 'Food & Culture'];

    if (genre && genre !== 'All') {
      const gLower = genre.toLowerCase();
      series = series.filter(s => s.genre.some(g => g.toLowerCase().includes(gLower)));
    }

    const featured = series.find(s => s.id === 'hx-neon-city') || series[0] || CATALOG[0];
    return simulateDelay({ featured, items: series, genres: availableGenres });
  },

  /**
   * Fetch sports content
   */
  async getSports(): Promise<{ live: MediaItem[]; upcoming: MediaItem[]; highlights: MediaItem[]; sportsList: MediaItem[] }> {
    const sportsList = CATALOG.filter(item => item.category === 'sports');
    const live = sportsList.filter(s => s.isLive || s.sportsDetails?.status === 'LIVE');
    const upcoming = sportsList.filter(s => s.sportsDetails?.status === 'UPCOMING');
    const highlights = sportsList.filter(s => s.sportsDetails?.status === 'COMPLETED' || (!s.isLive && s.sportsDetails?.status !== 'UPCOMING'));

    return simulateDelay({ live, upcoming, highlights, sportsList });
  },

  /**
   * Fetch live events
   */
  async getLiveEvents(): Promise<MediaItem[]> {
    const liveItems = CATALOG.filter(item => item.isLive || item.sportsDetails?.status === 'LIVE');
    return simulateDelay(liveItems);
  },

  /**
   * Fetch HotstarX Originals
   */
  async getOriginals(): Promise<{ featured: MediaItem; items: MediaItem[] }> {
    const originals = CATALOG.filter(item => item.isOriginal);
    return simulateDelay({ featured: originals[0], items: originals });
  },

  /**
   * Search catalog across titles, genres, categories, cast, director
   */
  async searchContent(query: string, categoryFilter = 'All', isKids = false): Promise<MediaItem[]> {
    const q = query.trim().toLowerCase();
    let pool = isKids ? CATALOG.filter(item => item.ageRating === 'U' || item.category === 'kids') : CATALOG;

    if (categoryFilter !== 'All') {
      const catKey = categoryFilter.toLowerCase();
      pool = pool.filter(item => {
        if (catKey === 'originals') return item.isOriginal;
        if (catKey === 'movies') return item.category === 'movie';
        if (catKey === 'shows' || catKey === 'series') return item.category === 'series' || item.id === 'hx-neon-city';
        if (catKey === 'sports') return item.category === 'sports' || item.isLive;
        if (catKey === 'kids') return item.category === 'kids' || item.ageRating === 'U';
        if (catKey === 'documentary') return item.category === 'documentary';
        return item.category === catKey;
      });
    }

    if (!q) {
      return simulateDelay(pool.slice(0, 12));
    }

    const results = pool.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSynopsis = item.synopsis.toLowerCase().includes(q);
      const matchTagline = item.tagline?.toLowerCase().includes(q) || false;
      const matchGenre = item.genre.some(g => g.toLowerCase().includes(q));
      const matchCast = item.cast?.some(c => c.toLowerCase().includes(q)) || false;
      const matchDirector = item.director?.toLowerCase().includes(q) || false;

      return matchTitle || matchSynopsis || matchTagline || matchGenre || matchCast || matchDirector;
    });

    return simulateDelay(results);
  },

  /**
   * Get single content details by ID
   */
  async getContentDetails(id: string): Promise<MediaItem | null> {
    const item = CATALOG.find(item => item.id === id) || null;
    return simulateDelay(item);
  },

  /**
   * Get recommendations based on content ID
   */
  async getRecommendations(id: string): Promise<MediaItem[]> {
    const target = CATALOG.find(item => item.id === id);
    if (!target) return simulateDelay(CATALOG.slice(0, 6));

    const recommendations = CATALOG.filter(item => 
      item.id !== id && (
        item.category === target.category ||
        item.genre.some(g => target.genre.includes(g))
      )
    ).slice(0, 8);

    return simulateDelay(recommendations);
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const stored = localStorage.getItem('hotstarx_user_profiles_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return simulateDelay(parsed[0]);
        }
      }
    } catch {
      // ignore
    }
    return simulateDelay(null);
  },

  /**
   * Get watchlist items for given array of IDs
   */
  async getWatchlist(watchlistIds: string[]): Promise<MediaItem[]> {
    const items = CATALOG.filter(item => watchlistIds.includes(item.id));
    return simulateDelay(items);
  },

  /**
   * Get subscription plans
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    return simulateDelay(SUBSCRIPTION_PLANS);
  }
};
