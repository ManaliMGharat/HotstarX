import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { MediaItem } from '../types';
import { HeroBanner } from '../components/hero/HeroBanner';
import { MediaCard } from '../components/cards/MediaCard';
import { CardSkeleton } from '../components/ui/SkeletonLoader';
import { Tv } from 'lucide-react';

export const SeriesPage: React.FC = () => {
  const { isKidsMode } = useAuth();
  const [featured, setFeatured] = useState<MediaItem | null>(null);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.getSeries(selectedGenre, isKidsMode).then((data) => {
      if (isMounted) {
        setFeatured(data.featured);
        setSeries(data.items);
        setGenres(data.genres);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedGenre, isKidsMode]);

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Series Ambient Atmosphere Glow in Deep Midnight Blue & Cobalt */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-blue-950/25 via-indigo-950/15 to-transparent pointer-events-none" />

      {featured && <HeroBanner items={[featured]} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Tv className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Series & Shows
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
              {series.length} Series
            </span>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-500/25 font-bold'
                    : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} isPortrait={true} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {series.map((item) => (
              <MediaCard key={item.id} item={item} isPortrait={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
