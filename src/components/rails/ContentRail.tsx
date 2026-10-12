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
            <span className="w-1 h-4 sm:h-5 rounded-full bg-gradient-to-b from-[#FF5E3A] via-[#F59E0B] to-[#C026D3]" />
            <h2 className="text-lg sm:text-2xl font-black font-['Outfit'] text-white tracking-tight flex items-center gap-2">
              {title}
              {isRanked && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Top 10 Today
                </span>
              )}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-400 mt-1 pl-3.5 line-clamp-1">{subtitle}</p>
          )}
        </div>

        {viewAllRoute && (
          <Link
            to={viewAllRoute}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#FF5E3A] hover:text-white transition-colors group/link shrink-0"
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
            className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#030712]/90 hover:bg-[#0b1120] text-white border border-white/20 backdrop-blur-md transition-all duration-300 opacity-0 group-hover/rail:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollArrows}
          className="flex items-stretch gap-3.5 sm:gap-4.5 overflow-x-auto no-scrollbar py-3 px-4 sm:px-6 lg:px-8 scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, idx) => {
            if (isLiveRail || item.isLive) {
              return <LiveCard key={item.id} item={item} />;
            }
            return (
              <MediaCard
                key={item.id}
                item={item}
                isPortrait={isPortrait}
                rank={isRanked ? idx + 1 : undefined}
                index={idx}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#030712]/90 hover:bg-[#0b1120] text-white border border-white/20 backdrop-blur-md transition-all duration-300 opacity-0 group-hover/rail:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </AnimatedSection>
  );
};
