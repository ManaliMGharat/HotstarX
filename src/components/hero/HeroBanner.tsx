import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Plus, Check, Info, ChevronLeft, ChevronRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import type { MediaItem } from '../../types';
import { useWatchlist } from '../../context/WatchlistContext';
import { usePlayer } from '../../context/PlayerContext';
import { useDetailsModal } from '../../context/DetailsModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { handleImageError } from '../../utils/imageFallback';

interface HeroBannerProps {
  items: MediaItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [slideKey, setSlideKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();
  const { openDetails } = useDetailsModal();
  const { t } = useLanguage();

  const activeItem = items[currentIndex] || items[0];
  const inList = activeItem ? isInWatchlist(activeItem.id) : false;

  // Slide duration: 7.2 seconds
  const ROTATION_INTERVAL = 7200;
  const UPDATE_TICK = 50;

  const goToNext = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setSlideKey((k) => k + 1);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setSlideKey((k) => k + 1);
  }, [items.length]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setProgress(0);
    setCurrentIndex(idx);
    setSlideKey((k) => k + 1);
  };

  // Auto rotation timer
  useEffect(() => {
    if (!items.length || isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + (UPDATE_TICK / ROTATION_INTERVAL) * 100;
      });
    }, UPDATE_TICK);

    return () => clearInterval(timer);
  }, [items.length, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if no modal or search overlay is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  if (!activeItem) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[68vh] min-h-[490px] max-h-[700px] lg:h-[72vh] overflow-hidden select-none bg-[#030712] group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Featured Billboard"
      tabIndex={0}
    >
      {/* Rich Underlying CSS Deep Navy & Midnight-Blue Ambient Canvas (Always Active) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#030712]">
        {/* Deep Oceanic Navy & Midnight-Blue Radial Foundations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-10%,rgba(14,42,85,0.48)_0%,rgba(7,18,38,0.70)_50%,#030712_100%)]" />
        
        {/* Soft, Animated Abstract Light Waves & Glowing Gradient Orbs */}
        <div className="absolute -top-24 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-blue-600/25 via-sky-500/18 to-indigo-900/20 blur-[120px] animate-ambient-drift-1" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-indigo-600/20 via-blue-700/15 to-cyan-700/15 blur-[130px] animate-ambient-drift-2" />
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-blue-700/15 via-sky-600/15 to-indigo-800/20 blur-[110px] animate-arc-pulse" />

        {/* Soft Glowing Ambient Arcs for Cinematic Depth */}
        <div className="absolute top-12 left-1/4 w-[700px] h-[300px] rounded-[100%] border-t-[1.5px] border-sky-500/20 blur-[2px] opacity-40 animate-arc-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[850px] h-[350px] rounded-[100%] border-b-[1.5px] border-blue-600/15 blur-[2px] opacity-35 animate-ambient-drift-1" />

        {/* Fine Cinematic Mesh Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/30 to-[#030712]/80" />
      </div>

      {/* Background Image Carousel with Ken Burns Zoom & Smooth Crossfade */}
      {items.map((item, idx) => {
        const isCurrent = idx === currentIndex;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <img
              src={item.backdrop}
              alt={item.title}
              onError={(e) => handleImageError(e, false)}
              className={`w-full h-full object-cover object-center brightness-90 contrast-110 ${
                isCurrent ? 'animate-kenburns' : ''
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}

      {/* Cinematic Overlays: Strong left-to-right dark gradient ensuring crystal-clear text readability */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-[#030712] via-[#030712]/98 via-[#030712]/90 md:via-[#030712]/80 to-transparent w-full md:w-[72%] lg:w-[62%]" />
      <div className="absolute left-0 bottom-0 top-0 w-full md:w-3/5 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_12%_65%,rgba(10,28,58,0.50)_0%,rgba(7,18,38,0.40)_50%,transparent_100%)]" />
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#030712] via-[#030712]/75 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-36 z-20 pointer-events-none bg-gradient-to-b from-[#030712]/90 via-[#030712]/30 to-transparent" />
      <div className="absolute inset-0 z-20 pointer-events-none hero-vignette opacity-70" />

      {/* Brighter Blue Cinematic Glow around featured content area */}
      <div className="absolute -left-12 bottom-12 w-[520px] h-[520px] bg-blue-500/22 rounded-full blur-[120px] pointer-events-none z-20" />
      <div className="absolute left-1/4 bottom-24 w-[460px] h-[460px] bg-sky-400/18 rounded-full blur-[110px] pointer-events-none z-20" />
      <div className="absolute left-8 top-1/3 w-[400px] h-[400px] bg-blue-600/16 rounded-full blur-[100px] pointer-events-none z-20" />

      {/* Hero Content Section: Spacious, Unclipped Container with Safe Left Margins */}
      <div className="relative z-30 h-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 lg:px-16 flex flex-col justify-end pb-12 sm:pb-14 lg:pb-16">
        <div key={slideKey} className="max-w-2xl lg:max-w-3xl space-y-3.5 sm:space-y-4 overflow-visible">
          
          {/* Row 1: Badges & Content Certifications */}
          <div className="animate-hero-meta flex flex-wrap items-center gap-2 overflow-visible">
            {activeItem.isOriginal && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black shadow-lg shadow-cyan-500/30 shrink-0">
                <Sparkles className="w-3 h-3 text-black" />
                PRIMEX ORIGINAL
              </span>
            )}
            {activeItem.topRank && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                #{activeItem.topRank} IN INDIA TODAY
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-white/10 text-stone-200 backdrop-blur-md shrink-0">
              {activeItem.ageRating}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-white/10 text-stone-200 backdrop-blur-md shrink-0">
              {activeItem.quality}
            </span>
          </div>

          {/* Row 2: Hero Title */}
          <h1 className="animate-hero-title text-3xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-white tracking-tight leading-[1.06] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            {activeItem.title}
          </h1>

          {/* Row 3: Primary Metrics (Match %, Year, Duration/Seasons) */}
          <div className="animate-hero-meta flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium text-stone-300">
            <span className="text-emerald-400 font-bold">{activeItem.matchPercentage}% Match</span>
            <span className="text-stone-500">•</span>
            <span>{activeItem.year}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-200 font-semibold">{activeItem.duration}</span>
            <span className="text-stone-500">•</span>
            <span className="text-cyan-300 font-medium">Dolby Vision • Atmos</span>
          </div>

          {/* Row 4: Clean Classification Row (Languages & Genres Separated) */}
          <div className="animate-hero-meta flex flex-wrap items-center gap-2 text-xs text-stone-300">
            <span className="text-cyan-400 font-semibold">Languages:</span>
            <span className="text-stone-200">{activeItem.language.join(', ')}</span>
            <span className="text-stone-500 mx-1">•</span>
            <span className="text-stone-400 font-medium">{activeItem.genre.join(', ')}</span>
          </div>

          {/* Row 5: Synopsis / Description */}
          <p className="animate-hero-desc text-xs sm:text-sm md:text-base text-stone-300/90 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow max-w-xl font-normal pt-0.5">
            {activeItem.synopsis}
          </p>

          {/* Row 6: Action Buttons with Ample Breathing Room */}
          <div className="animate-hero-buttons flex flex-wrap items-center gap-3 pt-3 sm:pt-4">
            {/* Watch Now CTA Button */}
            <button
              onClick={() => openPlayer(activeItem)}
              className="group/cta px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(6,182,212,0.65)] hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current transition-transform duration-300 group-hover/cta:translate-x-[3px]" />
              <span className="tracking-wide">{t('watchNow', 'PLAY NOW')}</span>
            </button>

            {/* Add to My List */}
            <button
              onClick={() => toggleWatchlist(activeItem)}
              className={`px-5 py-3 rounded-xl border backdrop-blur-md text-sm sm:text-base font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
                inList
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {inList ? <Check className="w-5 h-5 text-cyan-300" /> : <Plus className="w-5 h-5" />}
              <span>{inList ? t('inList', 'IN WATCHLIST') : t('addToList', 'ADD TO WATCHLIST')}</span>
            </button>

            {/* More Information */}
            <button
              onClick={() => openDetails(activeItem)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 text-stone-200 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
              aria-label={t('moreInfo', 'More Information')}
              title={t('moreInfo', 'More Info')}
            >
              <Info className="w-5 h-5 shrink-0 text-cyan-400" />
              <span className="font-semibold text-sm">{t('moreInfo', 'More Info')}</span>
            </button>

            {/* Audio Ambient Mute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hidden xl:flex p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-stone-400 hover:text-white backdrop-blur-md transition-all duration-300"
              aria-label={isMuted ? "Unmute preview" : "Mute preview"}
              title={isMuted ? "Audio Muted" : "Audio Active"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#FF5E3A]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Carousel & Slide Controls (Bottom Right - Completely Away from Hero Text & Buttons) */}
      <div className="absolute right-6 sm:right-10 lg:right-14 bottom-8 sm:bottom-10 z-30 flex flex-col items-end gap-2.5 max-w-[85vw] xl:max-w-md pointer-events-auto">
        
        {/* Desktop (xl: >= 1280px): Slide Counter & Integrated Carousel Arrows */}
        <div className="hidden xl:flex items-center justify-between w-full px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-400">
            <span className="text-[#FF5E3A]">0{currentIndex + 1}</span>
            <span>/</span>
            <span>0{Math.min(items.length, 5)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrev}
              className="p-1.5 rounded-lg bg-[#120520]/80 hover:bg-[#FF5E3A] text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-md"
              aria-label="Previous Featured Slide"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 rounded-lg bg-[#120520]/80 hover:bg-[#FF5E3A] text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-md"
              aria-label="Next Featured Slide"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop (xl: >= 1280px): Thumbnail Preview Cards */}
        <div className="hidden xl:flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {items.slice(0, 4).map((item, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                className={`group/thumb relative w-24 2xl:w-28 aspect-video rounded-lg overflow-hidden border transition-all duration-300 focus:outline-none ${
                  isCurrent
                    ? 'border-[#FF5E3A] scale-105 shadow-[0_0_15px_rgba(255,94,58,0.45)]'
                    : 'border-white/15 opacity-60 hover:opacity-100 hover:scale-102 hover:border-white/30'
                }`}
                aria-label={`Switch to ${item.title}`}
              >
                <img
                  src={item.backdrop}
                  alt={item.title}
                  onError={(e) => handleImageError(e, false)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white truncate text-left">
                  {item.title}
                </span>

                {/* Mini Active Progress Line */}
                {isCurrent && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Tablet & Mid-Size Screens (sm: to lg: 640px - 1279px): Compact Glass Capsule Controls */}
        <div className="hidden sm:flex xl:hidden items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-stone-300 shrink-0">
            <span className="text-cyan-400">0{currentIndex + 1}</span>
            <span className="text-stone-500">/</span>
            <span>0{Math.min(items.length, 5)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {items.slice(0, 5).map((item, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => goToSlide(idx)}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: isCurrent ? '24px' : '7px' }}
                  aria-label={`Slide ${idx + 1}`}
                >
                  <div className="absolute inset-0 bg-white/30" />
                  {isCurrent && (
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 pl-1 border-l border-white/15">
            <button
              onClick={goToPrev}
              className="p-1 rounded-full hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goToNext}
              className="p-1 rounded-full hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile / Small Screens (< 640px): Minimal Dots Indicator */}
        <div className="flex items-center gap-1.5 sm:hidden">
          {items.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: isCurrent ? '26px' : '7px' }}
                aria-label={`Slide ${idx + 1}`}
              >
                <div className="absolute inset-0 bg-white/30" />
                {isCurrent && (
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
