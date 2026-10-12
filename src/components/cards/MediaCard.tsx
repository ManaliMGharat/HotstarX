import React, { useState } from 'react';
import { Play, Plus, Check, Info } from 'lucide-react';
import type { MediaItem, WatchProgress } from '../../types';
import { useWatchlist } from '../../context/WatchlistContext';
import { usePlayer } from '../../context/PlayerContext';
import { useDetailsModal } from '../../context/DetailsModalContext';
import { handleImageError } from '../../utils/imageFallback';

interface MediaCardProps {
  item: MediaItem;
  isPortrait?: boolean;
  rank?: number;
  progress?: WatchProgress;
  index?: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isPortrait = true,
  rank,
  progress,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { openPlayer } = usePlayer();
  const { openDetails } = useDetailsModal();

  const inList = isInWatchlist(item.id);
  const staggerDelay = (index % 8) * 40;

  return (
    <div
      className={`group/card relative shrink-0 select-none cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isPortrait ? 'w-[150px] sm:w-[185px] md:w-[215px] lg:w-[230px]' : 'w-[250px] sm:w-[310px] md:w-[350px] lg:w-[370px]'
      }`}
      style={{ animationDelay: `${staggerDelay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openDetails(item)}
    >
      {/* Top 10 Styled Rank Badge on the Side */}
      {rank && (
        <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none select-none">
          <span
            className="text-6xl sm:text-7xl font-black font-['Outfit'] italic tracking-tighter text-transparent drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]"
            style={{
              WebkitTextStroke: '2px #FF5E3A',
            }}
          >
            {rank}
          </span>
        </div>
      )}

      {/* Main Card Container with Desktop Hover Transform: scale(1.04) translateY(-4px) */}
      <div
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0b1120] border border-white/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:border-white/30 group-hover/card:shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_20px_rgba(255,94,58,0.15)] group-hover/card:scale-[1.04] group-hover/card:-translate-y-1 group-hover/card:brightness-105 will-change-transform ${
          rank ? 'ml-4' : ''
        }`}
      >
        {/* Media Thumbnail with smooth zoom: scale 1 -> 1.06 */}
        <div className={`relative overflow-hidden bg-[#030712] ${isPortrait ? 'aspect-[2/3]' : 'aspect-video'}`}>
          <img
            src={isPortrait ? item.poster : item.backdrop}
            alt={item.title}
            loading="lazy"
            onError={(e) => handleImageError(e, isPortrait)}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.06]"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/20 to-transparent opacity-60 group-hover/card:opacity-85 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            {item.isOriginal && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white shadow-md">
                ORIGINAL
              </span>
            )}
            {item.isNew && !item.isOriginal && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500 text-black shadow-md">
                NEW
              </span>
            )}
            <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/60 backdrop-blur-md text-stone-200 border border-white/10">
              {item.ageRating}
            </span>
          </div>

          {/* Progress Bar for Continue Watching */}
          {progress && (
            <div className="absolute bottom-0 inset-x-0 z-20">
              <div className="h-1 bg-white/20 w-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF5E3A] to-[#C026D3] rounded-r"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Hover Overlay with Action Buttons & Metadata */}
          <div
            className={`absolute inset-0 z-20 p-3 flex flex-col justify-end bg-gradient-to-t from-[#030712] via-[#030712]/92 to-transparent transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPlayer(item);
                }}
                className="p-2.5 rounded-full bg-white text-black hover:bg-[#FF5E3A] hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-white/20"
                aria-label={`Play ${item.title}`}
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>

              {/* Add to Watchlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(item);
                }}
                className={`p-2 rounded-full border backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-200 ${
                  inList
                    ? 'bg-[#FF5E3A]/20 border-[#FF5E3A] text-[#FF5E3A]'
                    : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
                }`}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>

              {/* Details Modal Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDetails(item);
                }}
                className="p-2 rounded-full bg-black/60 border border-white/20 text-stone-300 hover:text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200 ml-auto"
                aria-label="View Details"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Metadata on Hover */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-300">
                <span className="text-amber-400 font-bold">{item.matchPercentage}% Match</span>
                <span>•</span>
                <span>{item.duration}</span>
                <span>•</span>
                <span>{item.year}</span>
              </div>
              <div className="text-[11px] text-stone-400 truncate">
                {item.genre.slice(0, 2).join(' • ')}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer (Visible when not hovering or on mobile) */}
        <div className="p-2 sm:p-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-stone-100 truncate group-hover/card:text-[#FF5E3A] transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
            <span className="truncate">{item.genre[0]}</span>
            {progress ? (
              <span className="text-[#FF5E3A] font-medium">
                {progress.progressPercent}% watched
              </span>
            ) : (
              <span className="text-stone-500 font-medium">{item.year}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
