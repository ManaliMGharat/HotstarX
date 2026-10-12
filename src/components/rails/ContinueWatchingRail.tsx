import React, { useRef, useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHistory } from '../../context/HistoryContext';
import { usePlayer } from '../../context/PlayerContext';
import { AnimatedSection } from '../common/AnimatedSection';
import { handleImageError } from '../../utils/imageFallback';

export const ContinueWatchingRail: React.FC = () => {
  const { continueWatchingList, removeFromHistory, clearHistory } = useHistory();
  const { openPlayer } = usePlayer();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (continueWatchingList.length === 0) return null;

  const checkScrollArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  const formatRemainingTime = (current: number, total: number) => {
    const remainingSeconds = Math.max(0, total - current);
    const mins = Math.round(remainingSeconds / 60);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hours}h ${remMins}m left`;
    }
    return `${mins}m left`;
  };

  return (
    <AnimatedSection className="relative my-7 sm:my-9 group/cw">
      {/* Subtle Navy Gradient Backdrop for Row Depth */}
      <div className="absolute inset-0 -mx-2 sm:-mx-4 rounded-3xl bg-gradient-to-r from-blue-950/25 via-sky-950/10 to-transparent pointer-events-none opacity-60" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-4 sm:h-5 rounded-full bg-gradient-to-b from-[#FF5E3A] via-[#F59E0B] to-[#C026D3]" />
          <div>
            <h2 className="text-lg sm:text-2xl font-black font-['Outfit'] text-white tracking-tight flex items-center gap-2">
              Continue Watching
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {continueWatchingList.length} Active
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Pick up right where you left off
            </p>
          </div>
        </div>

        <button
          onClick={clearHistory}
          className="text-xs text-stone-400 hover:text-rose-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      {/* Rail Container */}
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#0e041a]/85 hover:bg-[#0e041a] text-white border border-white/15 backdrop-blur-md transition-all duration-300 opacity-0 group-hover/cw:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScrollArrows}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar py-3 px-4 sm:px-6 lg:px-8 scroll-smooth"
        >
          {continueWatchingList.map(({ media, progress }) => {
            return (
              <div
                key={media.id}
                onClick={() => openPlayer(media)}
                className="group/card relative shrink-0 w-[240px] sm:w-[290px] md:w-[320px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0b1120] border border-white/10 hover:border-white/30 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer select-none"
              >
                {/* Backdrop with Play Overlay */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={media.backdrop}
                    alt={media.title}
                    onError={(e) => handleImageError(e, false)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180b2a] via-black/40 to-transparent" />

                  {/* Center "Resume" Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-orange-500/30 transform scale-95 group-hover/card:scale-100 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(media.id, media.title);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-500/80 text-white backdrop-blur-md transition-all opacity-0 group-hover/card:opacity-100 z-10"
                    aria-label={`Remove ${media.title} from continue watching`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Progress Bar Track (Always Visible) */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3]"
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover/card:text-[#FF5E3A] transition-colors">
                      {media.title}
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      {formatRemainingTime(progress.currentTime, progress.duration)}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#FF5E3A] font-mono ml-2">
                    {progress.progressPercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#050B14]/85 hover:bg-[#050B14] text-white border border-white/15 backdrop-blur-md transition-all duration-300 opacity-0 group-hover/cw:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </AnimatedSection>
  );
};
