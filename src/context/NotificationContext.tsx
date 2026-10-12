import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { NotificationItem } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string, linkUrl?: string) => void;
  markAllAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  clearNotifications: () => void;
}

const STORAGE_KEY = 'hotstarx_notifications_v2';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { isAuthenticated, currentProfile } = useAuth();

  // Notifications start completely EMPTY for a fresh user
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When user logs out, clear in-memory notifications
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
    } else if (currentProfile) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_${currentProfile.id}`);
        if (saved) {
          setNotifications(JSON.parse(saved));
        } else {
          const generalSaved = localStorage.getItem(STORAGE_KEY);
          if (generalSaved) setNotifications(JSON.parse(generalSaved));
        }
      } catch {
        // ignore
      }
    }
  }, [isAuthenticated, currentProfile]);

  useEffect(() => {
    try {
      if (isAuthenticated && currentProfile) {
        localStorage.setItem(`${STORAGE_KEY}_${currentProfile.id}`, JSON.stringify(notifications));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      }
    } catch (e) {
      console.warn('LocalStorage save failed for notifications', e);
    }
  }, [notifications, isAuthenticated, currentProfile]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast({
      title: 'Notifications Updated',
      description: 'All alerts marked as read.',
      type: 'info',
    });
  }, [showToast]);

  const addNotification = useCallback((item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
