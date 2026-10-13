import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { LiveCard } from '../components/cards/LiveCard';
import { MediaCard } from '../components/cards/MediaCard';
import { Trophy, Calendar, History } from 'lucide-react';

export const SportsPage: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<MediaItem[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MediaItem[]>([]);
  const [highlights, setHighlights] = useState<MediaItem[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;

    api.getSports().then((data) => {
      if (isMounted) {
        setLiveMatches(data.live);
        setUpcomingMatches(data.upcoming);
        setHighlights(data.highlights);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const sportCategories = ['All', 'Cricket', 'Football', 'Motorsport', 'Tennis', 'Kabaddi'];

  const filterBySport = (items: MediaItem[]) => {
    if (selectedSport === 'All') return items;
    return items.filter(item => {
      const sport = item.sportsDetails?.sport || '';
      return sport.toLowerCase() === selectedSport.toLowerCase() || 
             item.genre.some(g => g.toLowerCase().includes(selectedSport.toLowerCase()));
    });
  };

  const filteredLive = filterBySport(liveMatches);
  const filteredUpcoming = filterBySport(upcomingMatches);
  const filteredHighlights = filterBySport(highlights);

  return (
    <div className="min-h-screen pb-16 pt-24 relative bg-transparent">
      {/* Stadium Atmosphere Ambient Glow in Deep Navy & Sky */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-blue-950/25 via-sky-950/15 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b1120] via-[#111827] to-[#030712] border border-white/10 p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>PrimeX Sports Arena</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight">
              Live Sports & Tournaments
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed">
              Experience the roar of the stadium with multi-camera angles, real-time ball-tracking telemetry, and ultra-low latency broadcast in 4K HDR.
            </p>
          </div>

          {/* Sport Categories Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {sportCategories.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSport === sport
                    ? 'bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white shadow-lg shadow-orange-500/25'
                    : 'bg-[#1e293b]/60 hover:bg-white/10 text-stone-300 border border-white/10'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: LIVE MATCHES */}
        {filteredLive.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                LIVE & SIMULATED MATCHES
              </h2>
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                • Simulated telemetry & demo streams
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLive.map((match) => (
                <LiveCard key={match.id} item={match} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: UPCOMING */}
        {filteredUpcoming.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Upcoming Clashes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUpcoming.map((match) => (
                <LiveCard key={match.id} item={match} />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: SPORTS SERIES & HIGHLIGHTS */}
        {filteredHighlights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Sports Docuseries & Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHighlights.map((item) => (
                <MediaCard key={item.id} item={item} isPortrait={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
