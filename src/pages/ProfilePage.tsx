import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { GenderPreference } from '../types';
import { 
  AVATAR_PRESETS, 
  resolveUserAvatar 
} from '../data/avatarCatalog';
import { UserAvatar } from '../components/profile/UserAvatar';
import { useToast } from '../context/ToastContext';
import { 
  Crown, 
  Sliders, 
  LogOut,
  User as UserIcon,
  PlusCircle,
  LogIn,
  UserPlus,
  Camera,
  Upload,
  Check,
  Trash2,
  Sparkles,
  Palette,
  ShieldCheck,
  Link as LinkIcon
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentProfile, profiles, switchProfile, updateProfile, logout, isAuthenticated, openAuthModal, addKidsProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(currentProfile?.name || '');
  const [quality, setQuality] = useState(currentProfile?.preferences?.streamingQuality || 'Auto');
  const [audioLang, setAudioLang] = useState(currentProfile?.preferences?.audioLanguage || 'English');
  const [subtitles, setSubtitles] = useState(currentProfile?.preferences?.subtitlesEnabled ?? true);
  const [notifications, setNotifications] = useState(currentProfile?.preferences?.notifications ?? true);

  // Avatar & Gender preference states
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(
    currentProfile?.genderPreference || 'unspecified'
  );
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    currentProfile?.selectedAvatarPreset || null
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>(
    currentProfile?.customAvatarUrl || ''
  );
  const [urlInput, setUrlInput] = useState('');
  const [presetCategory, setPresetCategory] = useState<'all' | 'female' | 'male' | 'neutral' | 'kids'>('all');

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name);
      setQuality(currentProfile.preferences.streamingQuality);
      setAudioLang(currentProfile.preferences.audioLanguage);
      setSubtitles(currentProfile.preferences.subtitlesEnabled);
      setNotifications(currentProfile.preferences.notifications);
      setGenderPreference(currentProfile.genderPreference || 'unspecified');
      setSelectedPreset(currentProfile.selectedAvatarPreset || null);
      setCustomAvatarUrl(currentProfile.customAvatarUrl || '');
    }
  }, [currentProfile]);

  // Compute live preview avatar
  const previewAvatar = resolveUserAvatar({
    ...currentProfile,
    customAvatarUrl: customAvatarUrl || undefined,
    selectedAvatarPreset: selectedPreset || undefined,
    genderPreference,
    isKids: currentProfile?.isKids ?? false,
  });

  // Handle custom image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Invalid File',
        description: 'Please select an image file (PNG, JPG, WebP).',
        type: 'warning',
      });
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast({
        title: 'File Too Large',
        description: 'Image file size must be less than 4 MB.',
        type: 'warning',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomAvatarUrl(dataUrl);
        setSelectedPreset(null);
        showToast({
          title: 'Custom Photo Loaded',
          description: 'Click "Save Profile & Avatar" to apply your custom photo.',
          type: 'info',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setCustomAvatarUrl(urlInput.trim());
    setSelectedPreset(null);
    setUrlInput('');
    showToast({
      title: 'Image URL Applied',
      description: 'Click "Save Profile & Avatar" to apply your photo.',
      type: 'info',
    });
  };

  const handleClearCustomAvatar = () => {
    setCustomAvatarUrl('');
    showToast({
      title: 'Custom Photo Removed',
      description: 'Reverted to default avatar based on your preference.',
      type: 'info',
    });
  };

  // Unauthenticated Visitor View
  if (!isAuthenticated || !currentProfile) {
    return (
      <div className="min-h-screen bg-transparent pt-28 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0B1422] border border-white/10 text-center space-y-6 shadow-2xl animate-modal-enter">
          <div className="w-16 h-16 rounded-2xl bg-[#00C2FF]/10 text-[#00C2FF] flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-['Outfit'] text-white">Sign In to PrimeX</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Sign in or create an account to view and customize your personal space, manage subscription plans, and configure streaming preferences. Powered by XQORA.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C2FF] via-[#6366F1] to-[#A855F7] text-white font-bold text-sm shadow-lg shadow-[#00C2FF]/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#00C2FF]" />
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile({
      name,
      genderPreference,
      selectedAvatarPreset: selectedPreset || undefined,
      customAvatarUrl: customAvatarUrl || undefined,
      preferences: {
        ...currentProfile.preferences,
        streamingQuality: quality as any,
        audioLanguage: audioLang,
        subtitlesEnabled: subtitles,
        notifications: notifications,
      },
    });
  };

  const filteredPresets = AVATAR_PRESETS.filter((p) => {
    if (presetCategory === 'all') return true;
    return p.category === presetCategory;
  });

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070e1c] via-[#0b1422] to-[#111e33] border border-white/10 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative group">
            <UserAvatar
              profile={currentProfile}
              src={previewAvatar}
              size="2xl"
              ringClass="ring-4 ring-[#00C2FF]/40 shadow-2xl"
            />
            {customAvatarUrl && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider shadow">
                Custom
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                {currentProfile.name}
              </h1>
              {currentProfile.isKids ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  Kids Mode Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] text-xs font-bold border border-[#00C2FF]/30">
                  Primary Profile
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">{currentProfile.email}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>{currentProfile.plan} Tier ({currentProfile.planStatus})</span>
              </span>

              <button
                onClick={() => navigate('/plans')}
                className="text-xs font-bold text-[#00C2FF] hover:underline transition-colors"
              >
                Change Plan →
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Dynamic Avatar & Persona Selection */}
        <div id="avatar-section" className="rounded-3xl bg-[#070e1c] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#00C2FF]" />
                <span>Profile Avatar & Persona</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose your favorite streaming avatar, configure your persona, or upload a custom photo.
              </p>
            </div>
            {customAvatarUrl && (
              <button
                onClick={handleClearCustomAvatar}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revert to Default Avatar</span>
              </button>
            )}
          </div>

          {/* Gender Preference Setting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Avatar Persona & Gender Preference
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-400" title="PrimeX respects your privacy. Gender preference is used only to select your default avatar persona and is never inferred from your username or email.">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explicit choice (never guessed)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'female', label: 'Female Persona', icon: '👩', desc: 'Default female avatar' },
                { id: 'male', label: 'Male Persona', icon: '👨', desc: 'Default male avatar' },
                { id: 'non-binary', label: 'Neutral Persona', icon: '✨', desc: 'Default neutral star' },
                { id: 'prefer-not-to-say', label: 'Unspecified', icon: '🔒', desc: 'Neutral signature avatar' },
              ].map((opt) => {
                const active = genderPreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setGenderPreference(opt.id as GenderPreference);
                      setSelectedPreset(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      active
                        ? 'bg-[#00C2FF]/15 border-[#00C2FF] text-white shadow-md shadow-[#00C2FF]/10'
                        : 'bg-[#050B14] border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{opt.icon}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#00C2FF]" />}
                    </div>
                    <div className="text-xs font-bold text-white">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Gallery Tabs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Choose From Streaming Avatars</span>
              </label>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'female', label: 'Female' },
                  { id: 'male', label: 'Male' },
                  { id: 'neutral', label: 'Neutral' },
                  { id: 'kids', label: 'Kids' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPresetCategory(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      presetCategory === tab.id
                        ? 'bg-white/15 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPreset === preset.id && !customAvatarUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      setCustomAvatarUrl('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                      isSelected
                        ? 'bg-[#00C2FF]/15 border-[#00C2FF] ring-2 ring-[#00C2FF]/40 shadow-lg shadow-[#00C2FF]/15 scale-102'
                        : 'bg-[#050B14] border-white/5 hover:bg-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={preset.dataUri}
                        alt={preset.name}
                        className="w-14 h-14 rounded-full object-cover shadow-md"
                      />
                      {isSelected && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00C2FF] text-black flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[120px]">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{preset.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Picture Upload or URL */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Custom Picture</span>
              </label>
              <span className="text-[11px] text-slate-400">Takes priority over default avatars</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* File upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-colors"
              >
                <Upload className="w-4 h-4 text-[#00C2FF]" />
                <span>Choose Image from Device...</span>
              </button>

              <span className="hidden sm:inline text-xs text-slate-500 font-medium">or</span>

              {/* Paste URL */}
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste direct image URL..."
                    className="w-full bg-[#050B14] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 disabled:opacity-40 text-[#00C2FF] font-bold text-xs border border-[#00C2FF]/30 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Profiles Under This Account */}
        <div className="rounded-3xl bg-[#070e1c] border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Profiles Under This Account
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch profiles or activate family-safe Kids Mode.
              </p>
            </div>
            {!profiles.some((p) => p.isKids) && (
              <button
                onClick={() => addKidsProfile('Kids Space')}
                className="text-xs text-[#00C2FF] hover:underline flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Kids Profile</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profiles.map((p) => {
              const active = p.id === currentProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => switchProfile(p.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    active
                      ? 'bg-[#00C2FF]/10 border-[#00C2FF] text-white shadow-lg shadow-[#00C2FF]/10'
                      : 'bg-[#050B14] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <UserAvatar
                    profile={p}
                    size="lg"
                    showKidsBadge={true}
                  />
                  <span className="text-xs font-bold truncate max-w-[120px]">{p.name}</span>
                  {active && (
                    <span className="text-[10px] text-[#00C2FF] font-medium">Active</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Playback & Streaming Preferences */}
        <div id="settings" className="rounded-3xl bg-[#070e1c] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#00C2FF]" />
              <span>Streaming & Playback Preferences</span>
            </h2>
          </div>

          <div className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Profile Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-md bg-[#050B14] text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quality Preference */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Default Video Quality
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg">
                {['Auto', 'High (4K)', 'Medium (1080p)', 'Data Saver'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      quality === q
                        ? 'border-cyan-400 bg-cyan-500/20 text-white'
                        : 'border-white/5 bg-[#050B14] text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Language */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Preferred Audio Language
              </label>
              <select
                value={audioLang}
                onChange={(e) => setAudioLang(e.target.value)}
                className="w-full max-w-md bg-[#050B14] text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
              </select>
            </div>

            {/* Subtitles Toggle */}
            <div className="flex items-center justify-between max-w-md py-2">
              <div>
                <span className="text-sm font-semibold text-white block">Subtitles</span>
                <span className="text-xs text-slate-400">Display closed captions by default</span>
              </div>
              <input
                type="checkbox"
                checked={subtitles}
                onChange={(e) => setSubtitles(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between max-w-md py-2">
              <div>
                <span className="text-sm font-semibold text-white block">Match & Release Alerts</span>
                <span className="text-xs text-slate-400">Receive in-app notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Profile & Avatar
              </button>
              <span className="text-xs text-slate-400">Changes apply immediately across the entire app</span>
            </div>
          </div>
        </div>

        {/* Sign Out Row */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of PrimeX</span>
          </button>
        </div>
      </div>
    </div>
  );
};
