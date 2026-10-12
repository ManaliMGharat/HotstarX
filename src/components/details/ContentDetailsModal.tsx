import React, { useEffect } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Share2, 
  Volume2
} from 'lucide-react';
import { useDetailsModal } from '../../context/DetailsModalContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { CATALOG } from '../../data/content';
import type { Episode } from '../../types';
import { handleImageError } from '../../utils/imageFallback';

export const ContentDetailsModal: React.FC = () => {
  const { selectedMedia, isDetailsOpen, closeDetails, openDetails } = useDetailsModal();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();
  const { showToast } = useToast();


  // Recommendations for "More Like This"
  const recommendations = selectedMedia
    ? CATALOG.filter(
        (item) =>
          item.id !== selectedMedia.id &&
          (item.category === selectedMedia.category ||
            item.genre.some((g) => selectedMedia.genre.includes(g)))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetails();
    };

    if (isDetailsOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDetailsOpen, closeDetails]);

  if (!isDetailsOpen || !selectedMedia) return null;

  const inList = isInWatchlist(selectedMedia.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/watch/${selectedMedia.id}`);
      showToast({
        title: 'Link Copied',
        description: `Link to ${selectedMedia.title} copied to clipboard!`,
        type: 'success',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedMedia.title} Details`}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-[#070e1c] rounded-none sm:rounded-3xl border-0 sm:border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-screen sm:max-h-[90vh] overflow-y-auto no-scrollbar animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeDetails}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-[#030712]/80 hover:bg-[#030712] text-white border border-white/15 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          aria-label="Close Details Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header with Cinematic Backdrop */}
        <div className="relative aspect-video max-h-[420px] w-full overflow-hidden bg-[#030712]">
          <img
            src={selectedMedia.backdrop}
            alt={selectedMedia.title}
            onError={(e) => handleImageError(e, false)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120]/80 via-transparent to-transparent" />

          {/* Quick Overlay Actions on Bottom of Image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                openPlayer(selectedMedia);
                closeDetails();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white font-black text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => toggleWatchlist(selectedMedia)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
                inList
                  ? 'bg-[#FF5E3A]/20 border-[#FF5E3A] text-[#FF5E3A]'
                  : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
              }`}
              aria-label={inList ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              aria-label="Share Title"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Title & Metadata Bar */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {selectedMedia.isOriginal && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white">
                  HOTSTARX ORIGINAL
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {selectedMedia.matchPercentage}% Match
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-stone-300">
                {selectedMedia.ageRating}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-stone-300">
                {selectedMedia.quality}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white tracking-tight">
              {selectedMedia.title}
            </h2>

            {selectedMedia.tagline && (
              <p className="text-sm font-medium text-amber-400 italic mt-1">
                "{selectedMedia.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-400 mt-2">
              <span>{selectedMedia.year}</span>
              <span>•</span>
              <span>{selectedMedia.duration}</span>
              <span>•</span>
              <span className="text-stone-300">{selectedMedia.genre.join(', ')}</span>
            </div>
          </div>

          {/* Synopsis & Cast Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-white/5">
            <div className="md:col-span-2 space-y-4">
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                {selectedMedia.synopsis}
              </p>

              {/* Audio & Subtitles Info */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0e041a] border border-orange-500/15 text-xs text-stone-300">
                <Volume2 className="w-4 h-4 text-[#FF5E3A] shrink-0" />
                <div>
                  <span className="font-semibold text-white">Audio & Subtitles: </span>
                  <span>{selectedMedia.language.join(', ')} • English Audio Description</span>
                </div>
              </div>
            </div>

            {/* Cast & Crew Info */}
            <div className="space-y-3 bg-[#0e041a]/60 p-4 rounded-2xl border border-orange-500/15 text-xs">
              {selectedMedia.cast && selectedMedia.cast.length > 0 && (
                <div>
                  <span className="font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Starring
                  </span>
                  <p className="text-stone-200 leading-relaxed">
                    {selectedMedia.cast.join(', ')}
                  </p>
                </div>
              )}

              {selectedMedia.director && (
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Director
                  </span>
                  <p className="text-slate-200">{selectedMedia.director}</p>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Genres
                </span>
                <p className="text-cyan-400">{selectedMedia.genre.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Episodes Section (If Series) */}
          {selectedMedia.episodes && selectedMedia.episodes.length > 0 && (
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-['Outfit']">Episodes</h3>
                <span className="text-xs text-slate-400">Season {selectedMedia.seasonsCount || 1}</span>

              </div>

              <div className="space-y-3">
                {selectedMedia.episodes.map((ep: Episode) => (
                  <div
                    key={ep.id}
                    onClick={() => {
                      openPlayer(selectedMedia, ep);
                      closeDetails();
                    }}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-2xl bg-[#06101c]/60 hover:bg-[#06101c] border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full sm:w-44 shrink-0 rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        onError={(e) => handleImageError(e, false)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-cyan-400 fill-current" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                        {ep.duration}
                      </span>
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {ep.episodeNumber}. {ep.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This Grid */}
          {recommendations.length > 0 && (
            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white font-['Outfit']">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => openDetails(rec)}
                    className="group relative rounded-xl overflow-hidden bg-[#0a1829] border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={rec.backdrop}
                        alt={rec.title}
                        onError={(e) => handleImageError(e, false)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1829] to-transparent opacity-80" />
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400">
                        {rec.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{rec.year}</span>
                        <span className="text-emerald-400 font-semibold">{rec.rating} ★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
