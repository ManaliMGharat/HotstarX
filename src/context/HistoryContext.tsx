import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WatchProgress, MediaItem } from '../types';
import { CATALOG } from '../data/content';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface ContinueWatchingItem {
  media: MediaItem;
  progress: WatchProgress;
}

interface HistoryContextType {
  history: Record<string, WatchProgress>;
  continueWatchingList: ContinueWatchingItem[];
  saveProgress: (mediaId: string, currentTime: number, duration: number, episodeId?: string) => void;
  getProgress: (mediaId: string) => WatchProgress | undefined;
  removeFromHistory: (mediaId: string, title?: string) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = 'hotstarx_playback_history_v2';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { isAuthenticated, currentProfile } = useAuth();

  // Playback history starts completely EMPTY for a fresh user
  const [history, setHistory] = useState<Record<string, WatchProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // When user logs out, clear in-memory history
  useEffect(() => {
    if (!isAuthenticated) {
      setHistory({});
    } else if (currentProfile) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_${currentProfile.id}`);
        if (saved) {
          setHistory(JSON.parse(saved));
        } else {
          const generalSaved = localStorage.getItem(STORAGE_KEY);
          if (generalSaved) setHistory(JSON.parse(generalSaved));
        }
      } catch {
        // ignore
      }
    }
  }, [isAuthenticated, currentProfile]);

  // Persist history when updated
  useEffect(() => {
    try {
      if (isAuthenticated && currentProfile) {
        localStorage.setItem(`${STORAGE_KEY}_${currentProfile.id}`, JSON.stringify(history));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    } catch (e) {
      console.warn('LocalStorage save failed for history', e);
    }
  }, [history, isAuthenticated, currentProfile]);

  const saveProgress = useCallback(
    (mediaId: string, currentTime: number, duration: number, episodeId?: string) => {
      if (duration <= 0) return;
      const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100));

      setHistory((prev) => ({
        ...prev,
        [mediaId]: {
          mediaId,
          currentTime,
          duration,
          progressPercent,
          lastUpdated: Date.now(),
          episodeId,
        },
      }));
    },
    []
  );

  const getProgress = useCallback(
    (mediaId: string) => {
      return history[mediaId];
    },
    [history]
  );

  const removeFromHistory = useCallback(
    (mediaId: string, title?: string) => {
      setHistory((prev) => {
        const copy = { ...prev };
        delete copy[mediaId];
        return copy;
      });
      showToast({
        title: 'Removed from History',
        description: title ? `"${title}" was removed from Continue Watching.` : 'Item removed.',
        type: 'info',
      });
    },
    [showToast]
  );

  const clearHistory = useCallback(() => {
    setHistory({});
    showToast({
      title: 'Watch History Cleared',
      description: 'Your playback progress has been reset.',
      type: 'info',
    });
  }, [showToast]);

  // Derive continue watching items from actual user history (items between 2% and 95% complete)
  const continueWatchingList: ContinueWatchingItem[] = Object.values(history)
    .filter((item) => item.progressPercent > 2 && item.progressPercent < 95)
    .sort((a, b) => b.lastUpdated - a.lastUpdated)
    .map((prog) => {
      const media = CATALOG.find((m) => m.id === prog.mediaId);
      return media ? { media, progress: prog } : null;
    })
    .filter((item): item is ContinueWatchingItem => item !== null);

  return (
    <HistoryContext.Provider
      value={{
        history,
        continueWatchingList,
        saveProgress,
        getProgress,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
