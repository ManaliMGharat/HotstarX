import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MediaItem } from '../../types';
import { MediaCard } from '../cards/MediaCard';
import { LiveCard } from '../cards/LiveCard';
import { AnimatedSection } from '../common/AnimatedSection';

interface ContentRailProps {
  id?: string;
  title: string;
  subtitle?: string;
  items: MediaItem[];
  isPortrait?: boolean;
  isRanked?: boolean;
  isLiveRail?: boolean;
  viewAllRoute?: string;
}

export const ContentRail: React.FC<ContentRailProps> = ({
  title,
  subtitle,
  items,
  isPortrait = true,
  isRanked = false,
  isLiveRail = false,
  viewAllRoute,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollArrows = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <AnimatedSection className="relative my-7 sm:my-9 group/rail">
      {/* Subtle Navy Gradient Backdrop for Row Depth */}
      <div className="absolute inset-0 -mx-2 sm:-mx-4 rounded-3xl bg-gradient-to-r from-blue-950/25 via-sky-950/10 to-transparent pointer-events-none opacity-60" />

      {/* Rail Header with Subtle Accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3.5 flex items-end justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-4 sm:h-5 rounded-full bg-gradient-to-b from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <h2 className="text-lg sm:text-2xl font-black font-['Outfit'] text-white tracking-tight flex items-center gap-2">
              {title}
              {isRanked && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Top 10 Today
                </span>
              )}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-3.5 line-clamp-1">{subtitle}</p>
          )}
        </div>

        {viewAllRoute && (
          <Link
            to={viewAllRoute}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-white transition-colors group/link shrink-0"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Horizontal Carousel with Arrows appearing on hover */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#030712]/90 hover:bg-[#070e1c] text-white border border-cyan-500/30 backdrop-blur-md transition-all duration-300 opacity-0 group-hover/rail:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Container with Smooth Scroll Snap */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollArrows}
          className="flex items-center gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 py-2 relative z-10"
        >
          {items.map((item, index) => {
            if (isLiveRail && item.sportsDetails) {
              return (
                <LiveCard
                  key={item.id}
                  item={item}
                />
              );
            }

            return (
              <MediaCard
                key={item.id}
                item={item}
                isPortrait={isPortrait}
                rank={isRanked ? index + 1 : undefined}
                index={index}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#030712]/90 hover:bg-[#070e1c] text-white border border-cyan-500/30 backdrop-blur-md transition-all duration-300 opacity-0 group-hover/rail:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </AnimatedSection>
  );
};
