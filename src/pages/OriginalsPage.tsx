import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { HeroBanner } from '../components/hero/HeroBanner';
import { MediaCard } from '../components/cards/MediaCard';
import { Sparkles, Award } from 'lucide-react';

export const OriginalsPage: React.FC = () => {
  const [featured, setFeatured] = useState<MediaItem | null>(null);
  const [originals, setOriginals] = useState<MediaItem[]>([]);

  useEffect(() => {
    api.getOriginals().then((data) => {
      setFeatured(data.featured);
      setOriginals(data.items);
    });
  }, []);


  return (
    <div className="min-h-screen bg-transparent pb-16">
      {featured && <HeroBanner items={[featured]} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                PrimeX Originals
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Groundbreaking prestige storytelling exclusive to PrimeX
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>Award Winning Roster</span>
          </div>
        </div>

        {/* Originals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {originals.map((item) => (
            <MediaCard key={item.id} item={item} isPortrait={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
