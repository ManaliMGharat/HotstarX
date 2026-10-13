import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Bookmark, 
  Crown, 
  PlayCircle,
  Settings,
  Sparkles
} from 'lucide-react';
import { PrimeXLogo } from '../brand/HotstarXLogo';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { SearchOverlay } from '../search/SearchOverlay';
import { LanguageDropdown } from '../language/LanguageDropdown';
import { UserAvatar } from '../profile/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const { currentProfile, isAuthenticated, openAuthModal, profiles, switchProfile } = useAuth();
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close popovers and mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
    setIsLanguageOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: t('home', 'Home'), path: '/' },
    { label: t('movies', 'Movies'), path: '/movies' },
    { label: t('shows', 'Shows'), path: '/shows' },
    { label: t('sports', 'Sports'), path: '/sports' },
    { label: t('live', 'Live'), path: '/live', isLive: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 lg:left-[76px] right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#030712]/95 backdrop-blur-xl border-b border-cyan-500/15 shadow-2xl py-2.5'
            : 'bg-gradient-to-b from-[#030712]/95 via-[#030712]/40 to-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left section: Hamburger (Mobile) + Brand Logo on mobile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="lg:hidden">
              <PrimeXLogo size="md" />
            </div>

            {/* Desktop spacer to preserve symmetric center alignment */}
            <div className="hidden lg:block w-4 xl:w-12 shrink-0" aria-hidden="true" />
          </div>

          {/* Center section: In-flow Responsive Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1 min-w-0 max-w-xl mx-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'text-white bg-white/10 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.isLive && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 xl:left-3 xl:right-3 h-0.5 bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right section: Search, Language, Notifications, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 xl:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group shrink-0"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline-block text-xs font-medium text-slate-400 group-hover:text-slate-200">
                Search
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <LanguageDropdown
              isOpen={isLanguageOpen}
              onToggle={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsNotificationsOpen(false);
                setIsProfileOpen(false);
              }}
              onClose={() => setIsLanguageOpen(false)}
            />

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsLanguageOpen(false);
                }}
                className={`p-2.5 rounded-xl border transition-all relative ${
                  isNotificationsOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
                }`}
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black text-[10px] font-black flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* Profile Avatar / Menu / Sign In */}
            <div className="relative">
              {isAuthenticated && currentProfile ? (
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationsOpen(false);
                    setIsLanguageOpen(false);
                  }}
                  className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border transition-all ${
                    isProfileOpen
                      ? 'bg-cyan-500/20 border-cyan-400'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                  aria-label="User Account Menu"
                >
                  <UserAvatar
                    profile={currentProfile}
                    size="sm"
                    ringClass="ring-1 ring-cyan-400/60"
                    showKidsBadge={true}
                  />
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-200 max-w-[80px] truncate">
                    {currentProfile.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black text-xs font-extrabold shadow-md shadow-cyan-500/25 hover:brightness-110 transition-all"
                >
                  Sign In
                </button>
              )}

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#070e1c] h-full border-r border-cyan-500/20 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <PrimeXLogo size="md" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  aria-label="Close Navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Card in Drawer */}
              {isAuthenticated && currentProfile ? (
                <div className="my-6 p-4 rounded-2xl bg-[#030712] border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      profile={currentProfile}
                      size="lg"
                      ringClass="ring-2 ring-cyan-400"
                      showKidsBadge={true}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentProfile.name}</h4>
                      <span className="text-xs text-cyan-400 font-semibold">{currentProfile.plan} Tier</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/plans');
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 text-black shadow-md shadow-cyan-500/20"
                  >
                    Upgrade
                  </button>
                </div>
              ) : (
                <div className="my-6 p-4 rounded-2xl bg-[#030712] border border-cyan-500/20 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">Welcome to PrimeX</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Sign in to save your watchlist and stream across devices.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black text-xs font-extrabold text-center shadow-md shadow-cyan-500/20"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    {link.isLive && (
                      <span className="px-2 py-0.5 text-[10px] font-black rounded bg-rose-600 text-white animate-pulse">
                        LIVE
                      </span>
                    )}
                  </NavLink>
                ))}

                <NavLink
                  to="/originals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span>{t('originals', 'Originals')}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-cyan-400 to-violet-500 text-black">
                    EXCLUSIVE
                  </span>
                </NavLink>

                <NavLink
                  to="/my-list"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  <span>{t('myList', 'My Space')}</span>
                </NavLink>

                <NavLink
                  to="/#continue-watching"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('continue-watching');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <PlayCircle className="w-4 h-4 text-violet-400" />
                  <span>{t('continueWatching', 'Continue Watching')}</span>
                </NavLink>

                <NavLink
                  to="/plans"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>{t('plans', 'Subscription Plans')}</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>{t('settings', 'Settings & Preferences')}</span>
                </NavLink>
              </div>
            </div>

            {/* Profile Switcher & Footer in Mobile Drawer */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              {isAuthenticated && profiles.length > 1 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Switch Profile
                  </span>
                  <div className="flex gap-2">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => switchProfile(p.id)}
                        className={`flex-1 py-2 px-1 text-center rounded-xl border text-xs font-medium transition-all ${
                          p.id === currentProfile?.id
                            ? 'border-cyan-400 bg-cyan-500/20 text-white'
                            : 'border-white/5 bg-white/5 text-slate-400'
                        }`}
                      >
                        {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 text-center font-mono">
                PrimeX • Powered by XQORA
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
