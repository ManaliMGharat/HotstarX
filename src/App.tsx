import React, { useState, useEffect } from 'react';
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
import { HotstarXLogo } from './components/brand/HotstarXLogo';

import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { SportsPage } from './pages/SportsPage';
import { LivePage } from './pages/LivePage';
import { OriginalsPage } from './pages/OriginalsPage';
import { MyListPage } from './pages/MyListPage';
import { PlansPage } from './pages/PlansPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SearchPage } from './pages/SearchPage';
import { WatchPage } from './pages/WatchPage';
import { HelpPage } from './pages/HelpPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Abstract Animated Light Canvas with Deep Navy, Midnight Blue & Soft Oceanic Glares
const AmbientLightBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Slow-moving Deep Oceanic Blue & Cyan Ambient Glare */}
      <div 
        className="absolute -top-[15%] right-[5%] w-[720px] h-[720px] rounded-full blur-[140px] opacity-65 bg-gradient-to-br from-blue-600/22 via-sky-600/14 to-transparent animate-ambient-drift-1" 
      />

      {/* Slow-moving Midnight Navy & Royal Blue Ambient Glare */}
      <div 
        className="absolute top-[35%] -left-[10%] w-[780px] h-[780px] rounded-full blur-[150px] opacity-60 bg-gradient-to-tr from-indigo-700/20 via-blue-900/18 to-transparent animate-ambient-drift-2" 
      />

      {/* Soft Luminous Cyan Arc near top-center */}
      <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[1100px] h-[340px] rounded-[100%] border-b-[2px] border-sky-500/20 blur-[2px] opacity-45 animate-arc-pulse">
        <div className="w-full h-full rounded-[100%] glowing-arc-cyan opacity-60" />
      </div>

      {/* Subtle Deep Cobalt Lower Depth Arc */}
      <div className="absolute bottom-[5%] left-[20%] w-[900px] h-[400px] rounded-[100%] border-t-[1.5px] border-blue-600/15 blur-[3px] opacity-35 animate-ambient-drift-1">
        <div className="w-full h-full rounded-[100%] glowing-arc-cobalt opacity-50" />
      </div>

      {/* Gentle Cinematic Scrim ensuring crisp edge contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/25 to-[#030712]/75 pointer-events-none" />
    </div>
  );
};

// Initial Splash Screen Component
const SplashScreen: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-700 animate-in fade-in">
      <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
        <HotstarXLogo size="xl" showTagline={true} clickable={false} />
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] w-full animate-shimmer" />
        </div>
        <span className="text-xs text-stone-400 tracking-wider font-mono">
          INITIALIZING HOTSTARX CINEMA ENGINE...
        </span>
      </div>
    </div>
  );
};

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

      {/* Main App Layout Container (Offset by lg:pl-[76px] on desktop and pb-16 on mobile) */}
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col lg:pl-[76px] pb-16 lg:pb-0 relative">
        <Header />

        <main key={location.pathname} className="flex-1 animate-page-enter">
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
        </main>

        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Global Search Overlay (Accessible from Sidebar, Header, or Mobile Nav) */}
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
