import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { HistoryProvider } from './context/HistoryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { DetailsModalProvider } from './context/DetailsModalContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { SearchOverlay } from './components/search/SearchOverlay';
import { VideoPlayerModal } from './components/player/VideoPlayerModal';
import { ContentDetailsModal } from './components/details/ContentDetailsModal';
import { AuthModal } from './components/auth/AuthModal';
import { PrimeXLogo } from './components/brand/HotstarXLogo';
import { HeroSkeleton, RailSkeleton } from './components/ui/SkeletonLoader';

// Lazy-loaded pages for optimized route-level code splitting and fast initial bundle load
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const MoviesPage = lazy(() => import('./pages/MoviesPage').then(m => ({ default: m.MoviesPage })));
const SeriesPage = lazy(() => import('./pages/SeriesPage').then(m => ({ default: m.SeriesPage })));
const SportsPage = lazy(() => import('./pages/SportsPage').then(m => ({ default: m.SportsPage })));
const LivePage = lazy(() => import('./pages/LivePage').then(m => ({ default: m.LivePage })));
const OriginalsPage = lazy(() => import('./pages/OriginalsPage').then(m => ({ default: m.OriginalsPage })));
const MyListPage = lazy(() => import('./pages/MyListPage').then(m => ({ default: m.MyListPage })));
const PlansPage = lazy(() => import('./pages/PlansPage').then(m => ({ default: m.PlansPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const WatchPage = lazy(() => import('./pages/WatchPage').then(m => ({ default: m.WatchPage })));
const HelpPage = lazy(() => import('./pages/HelpPage').then(m => ({ default: m.HelpPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Abstract Animated Light Canvas with Deep Midnight Navy & Electric Cyan/Violet Glares
const AmbientLightBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Slow-moving Deep Oceanic Cyan Ambient Glare */}
      <div 
        className="absolute -top-[15%] right-[5%] w-[720px] h-[720px] rounded-full blur-[140px] opacity-65 bg-gradient-to-br from-cyan-600/20 via-sky-600/12 to-transparent animate-ambient-drift-1" 
      />

      {/* Slow-moving Midnight Navy & Electric Violet Ambient Glare */}
      <div 
        className="absolute top-[35%] -left-[10%] w-[780px] h-[780px] rounded-full blur-[150px] opacity-60 bg-gradient-to-tr from-violet-700/22 via-indigo-900/18 to-transparent animate-ambient-drift-2" 
      />

      {/* Soft Luminous Cyan Arc near top-center */}
      <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[1100px] h-[340px] rounded-[100%] border-b-[2px] border-cyan-500/25 blur-[2px] opacity-50 animate-arc-pulse">
        <div className="w-full h-full rounded-[100%] glowing-arc-cyan opacity-60" />
      </div>

      {/* Gentle Cinematic Scrim ensuring crisp edge contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/25 to-[#030712]/80 pointer-events-none" />
    </div>
  );
};

// Initial Splash Screen Component for PrimeX
const SplashScreen: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-700 animate-in fade-in">
      <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
        <PrimeXLogo size="xl" showTagline={true} clickable={false} />
        <div className="w-52 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] w-full animate-shimmer" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-wider">
          <span className="text-cyan-400 font-semibold">POWERED BY XQORA</span>
          <span>•</span>
          <span>INITIALIZING PRIMEX ENGINE...</span>
        </div>
      </div>
    </div>
  );
};

// Route Suspense Fallback
const PageFallback: React.FC = () => (
  <div className="min-h-screen pt-20 px-4 sm:px-8 space-y-6">
    <HeroSkeleton />
    <RailSkeleton isPortrait={true} />
  </div>
);

export const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Handle direct navigation to /login or /signup
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/signup') {
      openAuthModal();
    }
  }, [location.pathname, openAuthModal]);

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      <AmbientLightBackground />
      <ScrollToTop />
      
      {/* Fixed Desktop Vertical Navigation Sidebar */}
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main App Layout Container */}
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col lg:pl-[76px] pb-16 lg:pb-0 relative">
        <Header />

        <main key={location.pathname} className="flex-1 animate-page-enter">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/series" element={<SeriesPage />} />
              <Route path="/shows" element={<SeriesPage />} />
              <Route path="/sports" element={<SportsPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/live-sports" element={<LivePage />} />
              <Route path="/originals" element={<OriginalsPage />} />
              <Route path="/my-list" element={<MyListPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/login" element={<HomePage />} />
              <Route path="/signup" element={<HomePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Global Search Overlay */}
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Global Modals */}
        <VideoPlayerModal />
        <ContentDetailsModal />
        <AuthModal />
      </div>
    </>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <WatchlistProvider>
                <HistoryProvider>
                  <PlayerProvider>
                    <DetailsModalProvider>
                      <AppContent />
                    </DetailsModalProvider>
                  </PlayerProvider>
                </HistoryProvider>
              </WatchlistProvider>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
