import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { Film, Compass, Play, ArrowLeft } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openPlayer, isPlayerOpen } = usePlayer();
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);

    api.getContentDetails(id).then((item) => {
      if (!isMounted) return;
      setMedia(item);
      setLoading(false);
      if (item) {
        openPlayer(item);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id, openPlayer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
        <Film className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Title Not Found</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-sm">
          The title you are looking for may have expired or is unavailable in your region.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030712] flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={media.backdrop}
          alt={media.title}
          onError={(e) => handleImageError(e, false)}
          className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]/60" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-[#071724]/90 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </button>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
            {media.quality}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white">
            {media.title}
          </h1>
          {media.tagline && (
            <p className="text-sm font-medium text-cyan-300/80 italic">"{media.tagline}"</p>
          )}
        </div>

        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          {media.synopsis}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span>{media.year}</span>
          <span>•</span>
          <span>{media.duration}</span>
          <span>•</span>
          <span>{media.genre.join(', ')}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => openPlayer(media)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isPlayerOpen ? 'Return to Player' : 'Watch Now'}</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-colors"
          >
            Explore More Titles
          </button>
        </div>
      </div>
    </div>
  );
};
