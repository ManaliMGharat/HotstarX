import React from 'react';
import { Play, MapPin, Trophy } from 'lucide-react';
import type { MediaItem } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { handleImageError } from '../../utils/imageFallback';

interface LiveCardProps {
  item: MediaItem;
}

export const LiveCard: React.FC<LiveCardProps> = ({ item }) => {
  const { openPlayer } = usePlayer();

  const details = item.sportsDetails;

  const isLive = item.isLive || details?.status === 'LIVE';

  return (
    <div
      onClick={() => openPlayer(item)}
      className="group relative shrink-0 w-[290px] sm:w-[350px] md:w-[380px] rounded-2xl overflow-hidden bg-[#0b1120] border border-white/10 hover:border-white/25 shadow-xl shadow-black/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Visual Backdrop Header */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.backdrop}
          alt={item.title}
          loading="lazy"
          onError={(e) => handleImageError(e, false)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-black/60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-rose-600/30">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              <span>SIMULATED LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-600/80 backdrop-blur-md text-white text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-200" />
              <span>UPCOMING</span>
            </div>
          )}

          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
            {details?.sport || 'Sports'}
          </span>
        </div>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-3.5 rounded-full bg-gradient-to-r from-[#FF5E3A] to-[#F59E0B] text-white shadow-xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Match Details Section */}
      <div className="p-4 space-y-3">
        {/* Tournament name & Venue */}
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-semibold text-amber-400 truncate flex items-center gap-1">
            <Trophy className="w-3 h-3 shrink-0" />
            {details?.tournament || item.genre.join(' • ')}
          </span>
          <span className="shrink-0 text-[10px] flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            {details?.venue.split(',')[0]}
          </span>
        </div>

        {/* Teams and Scoreboard */}
        {details?.teamA && details?.teamB ? (
          <div className="bg-[#030712]/90 rounded-xl p-3 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white truncate">{details.teamA.name}</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {details.teamA.score || 'Ready'}
                {details.teamA.overs && <span className="text-xs text-stone-400 ml-1">({details.teamA.overs})</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white truncate">{details.teamB.name}</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {details.teamB.score || 'Upcoming'}
              </span>
            </div>
          </div>
        ) : (
          <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
        )}

        {/* Live Note or Start Time */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-amber-400 font-medium truncate">
            {details?.highlightNote || details?.startTime || 'Ultra HD Broadcast'}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openPlayer(item);
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isLive ? 'Watch Demo Stream' : 'Match Preview'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
