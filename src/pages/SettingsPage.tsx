import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { resetHotstarXAppData } from '../utils/storageClean';
import { 
  Sliders, 
  Crown, 
  Trash2, 
  Eye, 
  LogOut,
  Play,
  Languages,
  Subtitles,
  BellRing,
  RotateCcw,
  LogIn
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentProfile, updateProfile, logout, isAuthenticated, openAuthModal } = useAuth();
  const { clearHistory } = useHistory();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [quality, setQuality] = useState(currentProfile?.preferences?.streamingQuality || 'Auto');
  const [audioLang, setAudioLang] = useState(currentProfile?.preferences?.audioLanguage || 'English');
  const [subtitles, setSubtitles] = useState(currentProfile?.preferences?.subtitlesEnabled ?? true);
  const [notifications, setNotifications] = useState(currentProfile?.preferences?.notifications ?? true);
  const [autoplay, setAutoplay] = useState(currentProfile?.preferences?.autoplayNext ?? true);
  const [profileName, setProfileName] = useState(currentProfile?.name || '');

  useEffect(() => {
    if (currentProfile) {
      setQuality(currentProfile.preferences.streamingQuality);
      setAudioLang(currentProfile.preferences.audioLanguage);
      setSubtitles(currentProfile.preferences.subtitlesEnabled);
      setNotifications(currentProfile.preferences.notifications);
      setAutoplay(currentProfile.preferences.autoplayNext);
      setProfileName(currentProfile.name);
    }
  }, [currentProfile]);

  const handleSave = () => {
    if (!currentProfile) {
      showToast({
        title: 'Sign In Required',
        description: 'Please sign in to save your personal preferences across sessions.',
        type: 'warning',
      });
      openAuthModal('signin');
      return;
    }

    updateProfile({
      name: profileName,
      preferences: {
        ...currentProfile.preferences,
        streamingQuality: quality as any,
        audioLanguage: audioLang,
        subtitlesEnabled: subtitles,
        notifications,
        autoplayNext: autoplay,
      },
    });
    showToast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
      type: 'success',
    });
  };

  const handleClearData = () => {
    clearHistory();
    try {
      localStorage.removeItem('hotstarx_recent_searches_v1');
    } catch {
      // ignore
    }
    showToast({
      title: 'Privacy Cache Cleared',
      description: 'Your recent searches and playback history have been wiped.',
      type: 'info',
    });
  };

  const handleAppReset = () => {
    if (window.confirm('Reset PrimeX App Data? This clears all local browsing state and returns the app to a fresh developer state.')) {
      resetHotstarXAppData();
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2FF]/10 text-[#00C2FF] text-xs font-bold border border-[#00C2FF]/20 mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white">
            Settings & Playback Controls
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your streaming quality, audio defaults, account privacy, and notifications.
          </p>
        </div>

        {/* Section 1: Playback & Streaming Quality */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1422] border border-white/10 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Play className="w-5 h-5 text-[#00C2FF]" />
            <h2 className="text-lg font-bold font-['Outfit'] text-white">Playback Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Default Video Quality
              </label>
              <div className="space-y-2">
                {[
                  { id: 'Auto', desc: 'Adjusts based on your connection speed (Recommended)' },
                  { id: 'High (4K)', desc: 'Best video experience, uses ~7 GB/hr' },
                  { id: 'Medium (1080p)', desc: 'Good balance, uses ~3 GB/hr' },
                  { id: 'Data Saver', desc: 'Lowest data usage, uses ~0.7 GB/hr' },
                ].map((item) => (
                  <label
                    key={item.id}
                    onClick={() => setQuality(item.id as any)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      quality === item.id
                        ? 'border-[#00C2FF] bg-[#00C2FF]/10 text-white'
                        : 'border-white/5 bg-[#050B14] text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quality"
                      checked={quality === item.id}
                      onChange={() => setQuality(item.id as any)}
                      className="mt-1 accent-[#00C2FF]"
                    />
                    <div>
                      <span className="text-sm font-bold block text-white">{item.id}</span>
                      <span className="text-xs text-slate-400">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Autoplay Next */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Continuous Watching
                </label>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050B14] border border-white/5">
                  <div>
                    <span className="text-sm font-semibold text-white block">Autoplay Next Episode</span>
                    <span className="text-xs text-slate-400">Play the next episode automatically</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    className="w-5 h-5 accent-[#00C2FF] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Subtitles */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Subtitles className="w-4 h-4 text-[#00C2FF]" />
                  <span>Closed Captions & Subtitles</span>
                </label>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050B14] border border-white/5">
                  <div>
                    <span className="text-sm font-semibold text-white block">Always Show Subtitles</span>
                    <span className="text-xs text-slate-400">Enable subtitles by default for all titles</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={subtitles}
                    onChange={(e) => setSubtitles(e.target.checked)}
                    className="w-5 h-5 accent-[#00C2FF] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Audio Language */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-[#00C2FF]" />
                  <span>Preferred Audio Stream</span>
                </label>
                <select
                  value={audioLang}
                  onChange={(e) => setAudioLang(e.target.value)}
                  className="w-full bg-[#050B14] text-white text-sm p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-[#00C2FF]"
                >
                  <option value="English">English (Original Audio)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1422] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <BellRing className="w-5 h-5 text-[#00C2FF]" />
            <h2 className="text-lg font-bold font-['Outfit'] text-white">Notifications & Alerts</h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050B14] border border-white/5">
            <div>
              <span className="text-sm font-semibold text-white block">Platform & Sports Notifications</span>
              <span className="text-xs text-slate-400">Receive in-app alerts for live matches and new original episodes</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-[#00C2FF] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Section 3: Subscription & Membership */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1422] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#00C2FF]" />
              <h2 className="text-lg font-bold font-['Outfit'] text-white">
                Subscription Status: {currentProfile ? `${currentProfile.plan} Tier` : 'Guest / Free'}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {currentProfile 
                ? `Billing Status: ${currentProfile.planStatus} • Cycle: ${currentProfile.planBillingCycle}`
                : 'Browse available subscription plans to unlock 4K Ultra HD and multi-screen access.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/plans')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white text-xs font-bold shadow-lg shadow-[#00C2FF]/20 hover:scale-105 transition-all shrink-0"
          >
            {currentProfile ? 'Manage / Change Plan' : 'Explore Plans'}
          </button>
        </div>

        {/* Section 4: Privacy & Device Data */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1422] border border-white/10 space-y-4">
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <span>Privacy & Device Data</span>
          </h2>
          <p className="text-xs text-slate-400">
            Clear your local browsing session, personalized search autocomplete, and continue watching history.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Playback & Search History</span>
            </button>

            {/* Developer Reset Utility */}
            <button
              onClick={handleAppReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-colors"
              title="Reset application to clean developer state"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Reset PrimeX App Data</span>
            </button>
          </div>
        </div>

        {/* Bottom Save & Sign Out / In */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00C2FF] via-[#6366F1] to-[#A855F7] text-white font-bold text-sm shadow-xl shadow-[#00C2FF]/25 hover:scale-105 active:scale-95 transition-all"
          >
            Save All Preferences
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-cyan-400 hover:underline transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to PrimeX</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
