import React, { createContext, useContext, useState, useCallback } from 'react';
import type { MediaItem } from '../types';

interface DetailsModalContextType {
  selectedMedia: MediaItem | null;
  isDetailsOpen: boolean;
  openDetails: (media: MediaItem) => void;
  closeDetails: () => void;
}

const DetailsModalContext = createContext<DetailsModalContextType | undefined>(undefined);

export const DetailsModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = useCallback((media: MediaItem) => {
    setSelectedMedia(media);
    setIsDetailsOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  return (
    <DetailsModalContext.Provider
      value={{
        selectedMedia,
        isDetailsOpen,
        openDetails,
        closeDetails,
      }}
    >
      {children}
    </DetailsModalContext.Provider>
  );
};

export const useDetailsModal = () => {
  const context = useContext(DetailsModalContext);
  if (!context) {
    throw new Error('useDetailsModal must be used within a DetailsModalProvider');
  }
  return context;
};
