import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Film, Trophy, Bookmark, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../profile/UserAvatar';

interface MobileBottomNavProps {
  onOpenSearch?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { watchlistItems } = useWatchlist();
  const { currentProfile } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: t('home', 'Home'),
      icon: Home,
      path: '/',
      isActive: location.pathname === '/',
    },
    {
      id: 'search',
      label: t('search', 'Search'),
      icon: Search,
      action: () => {
        if (onOpenSearch) onOpenSearch();
        else navigate('/search');
      },
      isButton: true,
      isActive: location.pathname === '/search',
    },
    {
      id: 'movies',
      label: t('movies', 'Movies'),
      icon: Film,
      path: '/movies',
      isActive: location.pathname === '/movies',
    },
    {
      id: 'sports',
      label: t('sports', 'Sports'),
      icon: Trophy,
      path: '/sports',
      isActive: location.pathname === '/sports',
    },
    {
      id: 'my-list',
      label: t('myList', 'My Space'),
      icon: Bookmark,
      path: '/my-list',
      isActive: location.pathname === '/my-list',
      badge: watchlistItems.length > 0 ? watchlistItems.length : undefined,
    },
    {
      id: 'profile',
      label: 'Account',
      icon: User,
      path: '/profile',
      isActive: location.pathname === '/profile' || location.pathname === '/settings',
      avatar: currentProfile?.avatar,
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/96 backdrop-blur-2xl border-t border-cyan-500/15 px-2 py-1.5 safe-area-pb"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          const content = (
            <div className="flex flex-col items-center justify-center py-1 px-2 relative min-w-[50px]">
              {/* Active Glow Indicator */}
              {active && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}

              <div className="relative">
                {item.id === 'profile' && currentProfile && active ? (
                  <UserAvatar
                    profile={currentProfile}
                    size="xs"
                    ringClass="ring-2 ring-cyan-400"
                  />
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      active ? 'text-cyan-400 scale-110' : 'text-slate-400'
                    }`}
                  />
                )}

                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-black rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight transition-colors ${
                  active ? 'text-white font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.isButton) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="focus:outline-none"
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path!}
              className="focus:outline-none"
              aria-label={item.label}
            >
              {content}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
