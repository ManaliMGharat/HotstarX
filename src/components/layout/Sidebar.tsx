import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Film, 
  Tv, 
  Trophy, 
  Radio, 
  Sparkles, 
  Bookmark, 
  Crown,
  Settings
} from 'lucide-react';
import { PrimeXLogo } from '../brand/HotstarXLogo';
import { useWatchlist } from '../../context/WatchlistContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  onOpenSearch?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSearch }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { watchlistItems } = useWatchlist();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const primaryNavItems = [
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
      id: 'home',
      label: t('home', 'Home'),
      icon: Home,
      path: '/',
      isActive: location.pathname === '/',
    },
    {
      id: 'movies',
      label: t('movies', 'Movies'),
      icon: Film,
      path: '/movies',
      isActive: location.pathname === '/movies',
    },
    {
      id: 'shows',
      label: t('shows', 'Series'),
      icon: Tv,
      path: '/shows',
      isActive: location.pathname === '/shows' || location.pathname === '/series',
    },
    {
      id: 'sports',
      label: t('sports', 'Sports'),
      icon: Trophy,
      path: '/sports',
      isActive: location.pathname === '/sports',
    },
    {
      id: 'live',
      label: t('live', 'Live'),
      icon: Radio,
      path: '/live',
      isActive: location.pathname === '/live',
      isLive: true,
    },
    {
      id: 'originals',
      label: t('originals', 'Originals'),
      icon: Sparkles,
      path: '/originals',
      isActive: location.pathname === '/originals',
      isOriginal: true,
    },
    {
      id: 'my-list',
      label: t('myList', 'My Space'),
      icon: Bookmark,
      path: '/my-list',
      isActive: location.pathname === '/my-list',
      badge: watchlistItems.length > 0 ? watchlistItems.length : undefined,
    },
  ];

  return (
    <>
      {/* Subtle Backdrop Scrim when Sidebar is expanded on desktop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 hidden lg:block transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 z-50 flex-col justify-between py-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] select-none ${
          isHovered
            ? 'w-[230px] bg-[#030712]/98 backdrop-blur-2xl border-r border-cyan-500/20 shadow-[16px_0_48px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.1)]'
            : 'w-[76px] bg-[#030712]/90 backdrop-blur-xl border-r border-white/5 shadow-2xl'
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Top: PrimeX Emblem + Subscribe Pill */}
        <div className="px-4 flex flex-col gap-3">
          <div className="flex items-center h-12 overflow-hidden px-1">
            <NavLink
              to="/"
              className="flex items-center gap-3.5 focus:outline-none group/logo"
              aria-label="PrimeX Home"
            >
              <div className="shrink-0">
                <PrimeXLogo size="md" hideWordmark={!isHovered} clickable={false} />
              </div>
            </NavLink>
          </div>

          {/* Premium "Subscribe" Pill */}
          <button
            onClick={() => navigate('/plans')}
            className={`flex items-center justify-center gap-2 rounded-full py-2 px-3 text-xs font-black tracking-wide transition-all duration-300 shadow-md ${
              isHovered
                ? 'bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black hover:brightness-110 shadow-cyan-500/25'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25'
            }`}
            title="Subscribe to PrimeX"
          >
            <Crown className="w-3.5 h-3.5 shrink-0 fill-current text-cyan-300" />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isHovered ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0 overflow-hidden'
              }`}
            >
              Subscribe &gt;
            </span>
          </button>
        </div>

        {/* Center: Main Navigation List */}
        <nav className="flex-1 flex flex-col justify-center gap-1.5 px-3 py-4">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            const content = (
              <div
                className={`relative flex items-center h-11 px-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-violet-500/10 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}

                {/* Icon */}
                <div className="shrink-0 w-6 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active
                        ? 'text-cyan-400'
                        : item.isOriginal
                        ? 'text-violet-400 group-hover:text-violet-300'
                        : 'group-hover:text-white'
                    }`}
                  />
                </div>

                {/* Text Label (Expands on Sidebar Hover) */}
                <span
                  className={`ml-3.5 text-sm whitespace-nowrap tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHovered
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 pointer-events-none'
                  }`}
                >
                  {item.label}
                </span>

                {/* Right Badges */}
                {item.isLive && (
                  <span
                    className={`ml-auto shrink-0 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 text-[9px] font-black tracking-wider rounded bg-rose-600 text-white animate-pulse">
                      LIVE
                    </span>
                  </span>
                )}

                {item.badge !== undefined && (
                  <span
                    className={`ml-auto shrink-0 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  </span>
                )}
              </div>
            );

            if (item.isButton) {
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-xl"
                  title={!isHovered ? item.label : undefined}
                >
                  {content}
                </button>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.path!}
                className="w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-xl"
                title={!isHovered ? item.label : undefined}
              >
                {content}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Settings & Upgrade CTA */}
        <div className="px-3 pt-3 border-t border-white/5 space-y-1.5">
          {/* Upgrade Plan Mini Pill (Shows when hovered) */}
          {isHovered && (
            <button
              onClick={() => navigate('/plans')}
              className="w-full mb-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black text-xs font-black flex items-center justify-between shadow-lg shadow-cyan-500/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all animate-in fade-in duration-200"
            >
              <span className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>Upgrade Plan</span>
              </span>
              <span className="text-[10px] opacity-90 font-mono">₹199/m</span>
            </button>
          )}

          {/* Settings Nav Item */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `w-full flex items-center h-11 px-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-violet-500/10 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
            title={!isHovered ? t('settings', 'Settings') : undefined}
          >
            <div className="shrink-0 w-6 flex items-center justify-center">
              <Settings className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span
              className={`ml-3.5 text-sm whitespace-nowrap tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHovered
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2 pointer-events-none'
              }`}
            >
              {t('settings', 'Settings')}
            </span>
          </NavLink>

          {/* Powered by XQORA badge when hovered */}
          {isHovered && (
            <div className="pt-2 text-center text-[10px] text-cyan-400/80 font-mono tracking-wider animate-in fade-in">
              POWERED BY XQORA
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
