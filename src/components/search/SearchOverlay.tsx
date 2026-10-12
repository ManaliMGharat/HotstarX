import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, Flame, Sparkles, Compass, Play, Plus, Check } from 'lucide-react';
import { CATALOG } from '../../data/content';

import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { usePlayer } from '../../context/PlayerContext';
import { useDetailsModal } from '../../context/DetailsModalContext';
import { handleImageError } from '../../utils/imageFallback';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'hotstarx_recent_searches_v1';
const POPULAR_SEARCHES = ['Neon City', 'Formula Apex', 'Velocity', 'Wild India', 'Denis Villeneuve'];
const CATEGORY_TABS = ['All', 'Movies', 'Shows', 'Sports', 'Originals', 'Kids', 'Documentary', 'Live'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['Neon City', 'Velocity', 'Midnight Diner'];
    } catch {
      return ['Neon City', 'Velocity', 'Midnight Diner'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const { isKidsMode } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();
  const { openDetails } = useDetailsModal();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.warn('Could not save recent searches', e);
    }
  }, [recentSearches]);

  const addRecentSearch = (text: string) => {
    if (!text.trim()) return;
    setRecentSearches((prev) => [text.trim(), ...prev.filter((item) => item.toLowerCase() !== text.trim().toLowerCase())].slice(0, 6));
  };

  const removeRecentSearch = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== text));
  };

  // Filtered Results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Strictly filter out non-U rated content if Kids Mode is active
    let pool = isKidsMode ? CATALOG.filter(m => m.ageRating === 'U' || m.category === 'kids') : CATALOG;

    // Filter by Category Tab
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
      return pool.slice(0, 10);
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


  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (filteredResults.length > 0) {
        addRecentSearch(query || filteredResults[0].title);
        openDetails(filteredResults[0]);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#030712]/98 backdrop-blur-2xl animate-in fade-in zoom-in-[0.98] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
    >
      {/* Top Search Bar */}
      <div className="border-b border-white/10 px-4 sm:px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-[#FF5E3A] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, shows, sports, creators..."
              className="w-full bg-[#0b1120] text-white placeholder-stone-400 text-lg sm:text-xl pl-14 pr-12 py-3.5 rounded-2xl border border-white/15 focus:outline-none focus:border-[#FF5E3A] focus:ring-2 focus:ring-[#FF5E3A]/25 transition-all shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-3.5 text-stone-300 hover:text-white rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold flex items-center gap-2"
          >
            <span>Close</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/10">ESC</kbd>
          </button>
        </div>

        {/* Category Pills */}
        <div className="max-w-5xl mx-auto mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white shadow-lg shadow-orange-500/25 font-bold'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Quick Suggestions & Recents when Query is Empty */}
          {!query && (
            <div className="space-y-6 mb-8">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Recent Searches
                    </span>
                    <button
                      onClick={() => setRecentSearches([])}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          addRecentSearch(term);
                        }}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e2038] hover:bg-[#132c4d] border border-white/5 text-xs text-slate-200 transition-all"
                      >
                        <span>{term}</span>
                        <span
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="opacity-40 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                          aria-label={`Remove ${term}`}
                        >
                          <X className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        addRecentSearch(term);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Grid or Empty States */}
          {filteredResults.length === 0 ? (
            <div className="py-20 text-center">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-2">No matching titles found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                We couldn't find anything matching "{query}". Try checking your spelling or searching for a director, genre like "Sci-Fi", or sport like "Cricket".
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {query ? `Results for "${query}" (${filteredResults.length})` : 'Recommended For You'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {filteredResults.map((item) => {
                  const inList = isInWatchlist(item.id);
                  return (
                    <div
                      key={item.id}
                      className="group relative rounded-xl overflow-hidden bg-[#0c1b2f] border border-white/5 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/50 cursor-pointer flex flex-col"
                      onClick={() => {
                        addRecentSearch(query || item.title);
                        openDetails(item);
                        onClose();
                      }}
                    >
                      <div className="aspect-[2/3] relative overflow-hidden bg-slate-900">
                        <img
                          src={item.poster}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => handleImageError(e, true)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06101c] via-transparent to-transparent opacity-80" />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {item.isOriginal && (
                            <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                              HOTSTARX
                            </span>
                          )}
                          {item.isLive && (
                            <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-rose-600 text-white animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>

                        {/* Hover Quick Actions */}
                        <div className="absolute inset-0 bg-[#06101c]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addRecentSearch(query || item.title);
                              openPlayer(item);
                              onClose();
                            }}
                            className="w-full py-2 rounded-lg bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-colors shadow-lg"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(item);
                            }}
                            className={`w-full py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                              inList
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            }`}
                          >
                            {inList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{inList ? 'In List' : 'Watchlist'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                            <span>{item.year}</span>
                            <span>•</span>
                            <span className="truncate">{item.genre[0]}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-semibold text-emerald-400">{item.rating} ★</span>
                          <span className="px-1 py-0.2 rounded bg-white/5 border border-white/5">{item.quality}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
