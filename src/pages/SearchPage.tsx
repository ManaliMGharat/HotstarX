import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  X, 
  Flame, 
  Play, 
  Plus, 
  Check, 
  Info,
  SlidersHorizontal,
  Film
} from 'lucide-react';
import { CATALOG } from '../data/content';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { usePlayer } from '../context/PlayerContext';
import { useDetailsModal } from '../context/DetailsModalContext';
import { useLanguage } from '../context/LanguageContext';
import { handleImageError } from '../utils/imageFallback';

const CATEGORY_TABS = ['All', 'Movies', 'Shows', 'Sports', 'Originals', 'Kids', 'Documentary', 'Live'];
const TRENDING_TOPICS = ['Neon City', 'Formula Apex', 'Velocity', 'Wild India', 'Shadows of Varanasi', 'Denis Villeneuve'];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('All');
  const debounceTimerRef = useRef<number | null>(null);
  
  const { isKidsMode } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();
  const { openDetails } = useDetailsModal();
  const { t } = useLanguage();

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      if (val.trim()) {
        setSearchParams({ q: val.trim() }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    setQuery('');
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    setSearchParams({}, { replace: true });
  };

  // Filter content catalog
  const filteredContent = useMemo(() => {
    const q = query.trim().toLowerCase();
    let pool = isKidsMode ? CATALOG.filter(m => m.ageRating === 'U' || m.category === 'kids') : CATALOG;

    if (activeCategory !== 'All') {
      const cat = activeCategory.toLowerCase();
      pool = pool.filter((item) => {
        if (cat === 'originals') return item.isOriginal;
        if (cat === 'movies') return item.category === 'movie';
        if (cat === 'shows' || cat === 'series') return item.category === 'series' || item.id === 'hx-neon-city';
        if (cat === 'sports') return item.category === 'sports' || item.isLive;
        if (cat === 'kids') return item.category === 'kids' || item.ageRating === 'U';
        if (cat === 'documentary') return item.category === 'documentary';
        if (cat === 'live') return item.isLive;
        return item.category === cat;
      });
    }

    if (!q) {
      return pool;
    }

    return pool.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSynopsis = item.synopsis.toLowerCase().includes(q);
      const matchTagline = item.tagline?.toLowerCase().includes(q) || false;
      const matchGenre = item.genre.some((g) => g.toLowerCase().includes(q));
      const matchCast = item.cast?.some((c) => c.toLowerCase().includes(q)) || false;
      const matchDirector = item.director?.toLowerCase().includes(q) || false;

      return matchTitle || matchSynopsis || matchTagline || matchGenre || matchCast || matchDirector;
    });
  }, [query, activeCategory, isKidsMode]);

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Subtitle */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <SearchIcon className="w-8 h-8 text-cyan-400" />
            <span>{t('search', 'Search PrimeX Catalog')}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover thousands of movies, exclusive series, live sporting tournaments, and 4K documentaries. Powered by XQORA.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative flex items-center max-w-4xl">
          <SearchIcon className="absolute left-5 w-6 h-6 text-cyan-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search by title, genre, actor, or director (e.g. Neon City, Sci-Fi, Cricket)..."
            className="w-full bg-[#070e1c] text-white placeholder-slate-500 text-base sm:text-lg pl-14 pr-12 py-4 rounded-2xl border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-xl transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filters:</span>
          </div>
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-black shadow-lg shadow-cyan-500/25 font-extrabold'
                  : 'bg-[#070e1c] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending Suggestions */}
        {!query && (
          <div className="p-4 rounded-2xl bg-[#070e1c]/80 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleQueryChange(topic)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white border border-white/5 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count & Section Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="text-sm font-semibold text-slate-300">
            {query ? (
              <span>
                Found <span className="text-cyan-400 font-bold">{filteredContent.length}</span> results for &ldquo;{query}&rdquo;
              </span>
            ) : (
              <span>Showing all available titles ({filteredContent.length})</span>
            )}
          </div>
          {isKidsMode && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Kids Mode: Family-friendly (U) only
            </span>
          )}
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredContent.map((item) => {
              const inWatchlist = isInWatchlist(item.id);

              return (
                <div
                  key={item.id}
                  className="group relative bg-[#070e1c] rounded-xl overflow-hidden border border-white/5 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col cursor-pointer"
                  onClick={() => openDetails(item)}
                >
                  {/* Poster Image */}
                  <div className="aspect-[2/3] w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={item.poster}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => handleImageError(e, true)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Live / Original / 4K Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      {item.isLive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse shadow-md">
                          LIVE
                        </span>
                      )}
                      {item.isOriginal && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-gradient-to-r from-cyan-400 to-violet-500 text-black shadow-md">
                          ORIGINAL
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                        {item.ageRating}
                      </span>
                    </div>

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlayer(item);
                        }}
                        className="p-3 rounded-full bg-cyan-400 text-black shadow-xl hover:scale-110 active:scale-95 transition-transform font-bold"
                        aria-label={`Play ${item.title}`}
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(item);
                        }}
                        className={`p-3 rounded-full border transition-transform hover:scale-110 active:scale-95 ${
                          inWatchlist
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                            : 'bg-black/60 text-white border-white/20 hover:border-white'
                        }`}
                        aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                      >
                        {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(item);
                        }}
                        className="p-3 rounded-full bg-black/60 text-white border border-white/20 hover:border-cyan-400 hover:scale-110 active:scale-95 transition-transform"
                        aria-label="More Information"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
                        <span>{item.year}</span>
                        <span>•</span>
                        <span>{item.genre[0]}</span>
                        {item.duration && (
                          <>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No results found for &ldquo;{query}&rdquo;</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Try searching for something else, checking for spelling errors, or browsing popular categories like Movies, Series, or Sports.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleClear}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-extrabold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
              >
                Clear Search
              </button>
              <button
                onClick={() => setActiveCategory('All')}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
