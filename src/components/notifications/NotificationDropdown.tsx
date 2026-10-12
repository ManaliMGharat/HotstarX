import React, { useEffect, useRef } from 'react';
import { Bell, CheckCheck, Radio, Sparkles, Film, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (id: string, linkUrl?: string) => {
    markAsRead(id);
    if (linkUrl) {
      navigate(linkUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-2xl bg-[#180b2a]/98 backdrop-blur-2xl border border-orange-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden animate-notif-slide"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-[#0e041a]/80">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FF5E3A]" />
          <h3 className="text-sm font-semibold text-white tracking-wide">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/20 text-[#FF5E3A] border border-orange-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-[#FF5E3A] transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-stone-400" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((item) => {
            const Icon =
              item.type === 'live'
                ? Radio
                : item.type === 'new_release'
                ? Sparkles
                : item.type === 'watchlist'
                ? Film
                : CreditCard;

            const iconColor =
              item.type === 'live'
                ? 'text-rose-400 bg-rose-500/10'
                : item.type === 'new_release'
                ? 'text-[#FF5E3A] bg-[#FF5E3A]/10'
                : item.type === 'watchlist'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-fuchsia-400 bg-fuchsia-500/10';

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id, item.linkUrl)}
                className={`flex items-start gap-3.5 p-3.5 transition-colors cursor-pointer hover:bg-white/[0.04] ${
                  !item.isRead ? 'bg-[#FF5E3A]/5' : ''
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className={`text-xs font-semibold truncate ${!item.isRead ? 'text-white' : 'text-stone-300'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-[#FF5E3A] shrink-0 mt-1 shadow-[0_0_8px_rgba(255,94,58,0.8)]" />
                )}

                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-white/5 bg-[#050B14]/60 text-center">
        <span className="text-[11px] text-slate-400">
          Showing real-time platform updates & match alerts
        </span>
      </div>
    </div>
  );
};
