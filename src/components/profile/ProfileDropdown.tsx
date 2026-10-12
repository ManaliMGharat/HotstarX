import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  CreditCard, 
  Bookmark, 
  Settings, 
  LogOut, 
  LogIn, 
  Baby, 
  Check,
  PlusCircle,
  HelpCircle,
  UserPlus
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { 
    currentProfile, 
    profiles, 
    switchProfile, 
    isAuthenticated, 
    openAuthModal, 
    addKidsProfile,
    logout 
  } = useAuth();
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

  if (!isOpen) return null;

  // Unauthenticated Visitor State (Clean First-Launch Experience)
  if (!isAuthenticated || !currentProfile) {
    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-[#0B1422]/98 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="p-4 border-b border-white/5 bg-[#050B14]/80 text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-[#00C2FF]/10 text-[#00C2FF] flex items-center justify-center mx-auto mb-2">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Welcome to HotstarX</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sign in to access your personal watchlist, resume playback, and unlock plans.
          </p>
        </div>

        <div className="p-3 space-y-2">
          <button
            onClick={() => {
              openAuthModal('signin');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00C2FF]/20 hover:opacity-95 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              openAuthModal('signup');
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-[#00C2FF]" />
            <span>Create Account</span>
          </button>
        </div>

        <div className="p-2 border-t border-white/5 bg-[#050B14]/40 space-y-0.5 text-xs">
          <button
            onClick={() => {
              navigate('/plans');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explore Subscription Plans</span>
          </button>

          <button
            onClick={() => {
              navigate('/help');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
    );
  }

  // Authenticated Real User State
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-[#0B1422]/98 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      {/* Current Real Profile Summary Header */}
      <div className="p-4 border-b border-white/5 bg-[#050B14]/70">
        <div className="flex items-center gap-3">
          <UserAvatar
            profile={currentProfile}
            size="lg"
            ringClass="ring-2 ring-[#00C2FF]/50 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white truncate">{currentProfile.name}</h4>
              {currentProfile.isKids && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  KIDS
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-[#00C2FF] font-medium">{currentProfile.plan} Plan</span>
              <span className="text-[10px] text-slate-500">• {currentProfile.planStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Section (Personal + optional Kids profile) */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Profiles
          </span>
          {!profiles.some((p) => p.isKids) && (
            <button
              onClick={() => addKidsProfile('Kids Space')}
              className="text-[11px] text-[#00C2FF] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Add Kids</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {profiles.map((p) => {
            const isSelected = p.id === currentProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  switchProfile(p.id);
                  onClose();
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-[#00C2FF]/20 ring-1 ring-[#00C2FF] text-white'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <div className="relative">
                  <UserAvatar
                    profile={p}
                    size="md"
                  />
                  {isSelected && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00C2FF] text-black flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                  {p.isKids && (
                    <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-500 text-black">
                      <Baby className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium truncate w-full">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-1.5 space-y-0.5">
        <button
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <User className="w-4 h-4 text-[#00C2FF]" />
          <span>My Profile & Preferences</span>
        </button>

        <button
          onClick={() => {
            navigate('/plans');
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Manage Plan</span>
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#00C2FF]/20 text-[#00C2FF]">
            {currentProfile.plan}
          </span>
        </button>

        <button
          onClick={() => {
            navigate('/my-list');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>Watchlist</span>
        </button>

        <button
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>

      {/* Logout Action */}
      <div className="p-2 border-t border-white/5 bg-[#050B14]/40">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
