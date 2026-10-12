import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { LiveCard } from '../components/cards/LiveCard';
import { Radio, Tv, Flame, Trophy, Activity, Info } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const LivePage: React.FC = () => {
  const [liveItems, setLiveItems] = useState<MediaItem[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const { openPlayer } = usePlayer();

  useEffect(() => {
    api.getLiveEvents().then(setLiveItems);
  }, []);

  const sportsCategories = ['All', 'Cricket', 'Motorsport', 'Football', 'Kabaddi', 'Tennis'];

  const filteredItems = selectedSport === 'All'
    ? liveItems
    : liveItems.filter(item => {
        const sport = item.sportsDetails?.sport || '';
        return sport.toLowerCase() === selectedSport.toLowerCase() || item.genre.some(g => g.toLowerCase().includes(selectedSport.toLowerCase()));
      });

  const topLiveEvent = liveItems[0];

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Stadium Atmosphere Ambient Glow in Oceanic Cyan & Midnight Blue */}
      <div className="absolute top-0 inset-x-0 h-[520px] bg-gradient-to-b from-sky-950/30 via-blue-950/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Notice of Authenticity & Demo Stream Clarity */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-orange-950/40 border border-orange-500/25 text-amber-200 text-xs mb-6 backdrop-blur-md">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>HotstarX Arena Broadcast Notice:</strong> Live sport events feature simulated real-time telemetry and licensed high-definition demo footage for evaluation.
          </span>
        </div>

        {/* Live Broadcast Hero Banner with Arena Atmosphere */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b1120] via-[#111827] to-[#030712] border border-white/10 p-6 sm:p-10 mb-8 shadow-2xl">
          {/* Subtle floodlight beam effect in oceanic blue */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="text-rose-400 text-xs font-black uppercase tracking-wider">
                  LIVE ARENA BROADCAST CENTER
                </span>
                <span className="text-amber-400 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 font-bold uppercase">
                  SIMULATED 4K DEMO
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight">
                Watch Live Sports & Tournaments
              </h1>
              <p className="text-sm text-stone-300 leading-relaxed">
                Stadium ambiance with low-latency demo streams, dynamic scoreboard statistics, multi-angle telemetry, and studio commentary.
              </p>
            </div>

            {topLiveEvent && (
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => openPlayer(topLiveEvent)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Watch Featured Demo ({topLiveEvent.sportsDetails?.sport || 'Sports'})</span>
                </button>
              </div>
            )}
          </div>

          {/* Sport Categories Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6 mt-6 border-t border-white/10">
            {sportsCategories.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedSport === sport
                    ? 'bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white shadow-lg shadow-orange-500/25 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                }`}
              >
                {sport === 'All' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {sport === 'Cricket' && <Trophy className="w-3.5 h-3.5 text-orange-400" />}
                {sport === 'Motorsport' && <Activity className="w-3.5 h-3.5 text-rose-400" />}
                {sport === 'Football' && <Tv className="w-3.5 h-3.5 text-amber-400" />}
                <span>{sport}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Events Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Currently On Air ({filteredItems.length} Events)</span>
            </h2>
            <span className="text-xs text-slate-400">
              Showing {selectedSport === 'All' ? 'All Disciplines' : selectedSport}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <LiveCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
