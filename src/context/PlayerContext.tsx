import React, { createContext, useContext, useState, useCallback } from 'react';
import type { MediaItem, Episode } from '../types';

interface PlayerContextType {
  activeMedia: MediaItem | null;
  activeEpisode: Episode | null;
  isPlayerOpen: boolean;
  openPlayer: (media: MediaItem, episode?: Episode) => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const openPlayer = useCallback((media: MediaItem, episode?: Episode) => {
    setActiveMedia(media);
    setActiveEpisode(episode || (media.episodes && media.episodes.length > 0 ? media.episodes[0] : null));
    setIsPlayerOpen(true);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlayerOpen(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        activeMedia,
        activeEpisode,
        isPlayerOpen,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
