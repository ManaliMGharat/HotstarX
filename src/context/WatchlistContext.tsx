import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import type { MediaItem } from '../types';
import { CATALOG } from '../data/content';

interface WatchlistContextType {
  watchlistIds: string[];
  watchlistItems: MediaItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (itemId: string, title?: string) => void;
  toggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (itemId: string) => boolean;
  clearWatchlist: () => void;
}

const STORAGE_KEY = 'hotstarx_watchlist_v2';

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { isAuthenticated, openAuthModal, currentProfile } = useAuth();

  // Watchlist is strictly user-scoped and starts completely empty for a new user
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When user logs out, clear in-memory watchlist
  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlistIds([]);
    } else if (currentProfile) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_${currentProfile.id}`);
        if (saved) {
          setWatchlistIds(JSON.parse(saved));
        } else {
          const generalSaved = localStorage.getItem(STORAGE_KEY);
          if (generalSaved) setWatchlistIds(JSON.parse(generalSaved));
        }
      } catch {
        // ignore
      }
    }
  }, [isAuthenticated, currentProfile]);

  useEffect(() => {
    try {
      if (isAuthenticated && currentProfile) {
        localStorage.setItem(`${STORAGE_KEY}_${currentProfile.id}`, JSON.stringify(watchlistIds));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistIds));
      }
    } catch (e) {
      console.warn('LocalStorage save failed for watchlist', e);
    }
  }, [watchlistIds, isAuthenticated, currentProfile]);

  const isInWatchlist = useCallback((itemId: string) => {
    return watchlistIds.includes(itemId);
  }, [watchlistIds]);

  const addToWatchlist = useCallback((item: MediaItem) => {
    if (!isAuthenticated) {
      showToast({
        title: 'Sign In Required',
        description: 'Please sign in or create an account to save titles to your list.',
        type: 'warning',
      });
      openAuthModal();
      return;
    }

    setWatchlistIds((prev) => {
      if (prev.includes(item.id)) return prev;
      return [item.id, ...prev];
    });
    showToast({
      title: 'Added to My List',
      description: `"${item.title}" saved to your personal list.`,
      type: 'success',
    });
  }, [isAuthenticated, showToast, openAuthModal]);

  const removeFromWatchlist = useCallback((itemId: string, title?: string) => {
    setWatchlistIds((prev) => prev.filter((id) => id !== itemId));
    showToast({
      title: 'Removed from My List',
      description: title ? `"${title}" was removed.` : 'Title removed from your list.',
      type: 'info',
    });
  }, [showToast]);

  const toggleWatchlist = useCallback((item: MediaItem) => {
    if (!isAuthenticated) {
      showToast({
        title: 'Sign In Required',
        description: 'Please sign in or create an account to save titles to your list.',
        type: 'warning',
      });
      openAuthModal();
      return;
    }

    if (watchlistIds.includes(item.id)) {
      removeFromWatchlist(item.id, item.title);
    } else {
      addToWatchlist(item);
    }
  }, [isAuthenticated, watchlistIds, addToWatchlist, removeFromWatchlist, openAuthModal, showToast]);

  const clearWatchlist = useCallback(() => {
    setWatchlistIds([]);
    showToast({
      title: 'Watchlist Cleared',
      description: 'All saved titles have been removed.',
      type: 'info',
    });
  }, [showToast]);

  const watchlistItems = CATALOG.filter((item) => watchlistIds.includes(item.id));

  return (
    <WatchlistContext.Provider
      value={{
        watchlistIds,
        watchlistItems,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
