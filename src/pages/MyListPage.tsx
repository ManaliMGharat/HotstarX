import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Play, Compass, LogIn } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { usePlayer } from '../context/PlayerContext';
import { useDetailsModal } from '../context/DetailsModalContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

export const MyListPage: React.FC = () => {
  const { watchlistItems, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();
  const { openDetails } = useDetailsModal();
  const { isKidsMode, isAuthenticated, openAuthModal } = useAuth();
  const [filter, setFilter] = useState<'all' | 'movie' | 'series' | 'original'>('all');

  const safeWatchlist = isKidsMode
    ? watchlistItems.filter((item) => item.ageRating === 'U' || item.category === 'kids')
    : watchlistItems;

  const filteredItems = safeWatchlist.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'original') return item.isOriginal;
    return item.category === filter;
  });

  // Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-transparent pt-28 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#071725] border border-cyan-500/20 text-center space-y-6 shadow-2xl animate-modal-enter">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-['Outfit'] text-white">Your Personal Watchlist</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Sign in to save movies and shows, sync your progress, and pick up watching across all your devices.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to View Watchlist</span>
            </button>
            <Link
              to="/"
              className="block w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors text-center"
            >
              Browse Public Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                My Watchlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {watchlistItems.length} Saved {watchlistItems.length === 1 ? 'Title' : 'Titles'}
              </p>
            </div>
          </div>

          {watchlistItems.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Category Filter Chips */}
              <div className="flex bg-[#0B1422] p-1 rounded-xl border border-white/5">
                {(['all', 'movie', 'series', 'original'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                      filter === tab
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'movie' ? 'Movies' : tab === 'series' ? 'Series' : 'Originals'}
                  </button>
                ))}
              </div>

              <button
                onClick={clearWatchlist}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-white/5 transition-colors"
                title="Clear all watchlist items"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Grid or Clean Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#0B1422] border border-white/10 flex items-center justify-center text-slate-500">
              <Compass className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Your Watchlist is empty</h2>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Explore movies, series, and sports to add titles to your personal watchlist.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/movies"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
              >
                Browse Movies
              </Link>
              <Link
                to="/shows"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
              >
                Browse Series
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-[#0B1422] border border-white/5 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col cursor-pointer"
                onClick={() => openDetails(item)}
              >
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => handleImageError(e, true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1422] via-transparent to-transparent opacity-80" />

                  {/* Remove Button on card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(item.id, item.title);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Hover Quick Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPlayer(item);
                      }}
                      className="p-3.5 rounded-full bg-white text-black shadow-xl hover:bg-cyan-400 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span className="truncate">{item.genre[0]}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-emerald-400">{item.rating} ★</span>
                    <span className="px-1 py-0.2 rounded bg-white/5">{item.quality}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
