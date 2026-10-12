import React, { useState } from 'react';
import { X, Mail, Lock, KeyRound, User as UserIcon, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { HotstarXLogo } from '../brand/HotstarXLogo';

import type { GenderPreference } from '../../types';

type AuthTab = 'signin' | 'signup' | 'otp' | 'forgot';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, signup } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState<AuthTab>(authModalTab || 'signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('unspecified');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);

  // Sync tab with context if opened with a specific tab
  React.useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
    }
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast({
        title: 'Email or Phone Required',
        description: 'Please enter your registered email or phone number.',
        type: 'warning',
      });
      return;
    }
    if (!password) {
      showToast({
        title: 'Password Required',
        description: 'Please enter your password.',
        type: 'warning',
      });
      return;
    }

    login(email, fullName);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast({
        title: 'Full Name Required',
        description: 'Please provide your name to set up your profile.',
        type: 'warning',
      });
      return;
    }
    if (!email.trim()) {
      showToast({
        title: 'Email Address Required',
        description: 'Please provide an email address.',
        type: 'warning',
      });
      return;
    }
    if (password.length < 6) {
      showToast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        type: 'warning',
      });
      return;
    }
    if (password !== confirmPassword) {
      showToast({
        title: 'Passwords Do Not Match',
        description: 'Please ensure both passwords match.',
        type: 'error',
      });
      return;
    }

    signup({
      name: fullName.trim(),
      email: email.trim(),
      phone: phoneNumber.trim(),
      genderPreference,
    });
  };

  const handleOtpVerify = () => {
    const code = otpCode.join('');
    if (code.length < 4) {
      showToast({
        title: 'Invalid Code',
        description: 'Please enter all 4 digits of the verification code.',
        type: 'warning',
      });
      return;
    }

    const identifier = email || phoneNumber || 'user@hotstarx.app';
    login(identifier, fullName || 'HotstarX User');
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Account Authentication"
    >
      <div
        className="relative w-full max-w-md bg-[#070e1c] rounded-3xl border border-blue-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 overflow-hidden animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close Authentication Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <HotstarXLogo size="lg" clickable={false} showTagline={true} className="justify-center mb-1" />
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        {tab !== 'otp' && tab !== 'forgot' && (
          <div className="flex p-1 rounded-xl bg-[#030712] border border-white/5 mb-6">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'signin'
                  ? 'bg-gradient-to-r from-orange-500/20 to-purple-600/20 text-[#FF5E3A] border border-orange-500/30 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-orange-500/20 to-purple-600/20 text-[#FF5E3A] border border-orange-500/30 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-300 block mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or phone"
                  className="w-full bg-[#0e0419] text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#FF5E3A] focus:ring-1 focus:ring-[#FF5E3A]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-300">Password</label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-xs text-[#FF5E3A] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#0e0419] text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#FF5E3A] focus:ring-1 focus:ring-[#FF5E3A]/30 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98]"
            >
              Sign In
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('otp')}
                className="text-xs text-stone-400 hover:text-[#FF5E3A] transition-colors"
              >
                Sign in with 4-Digit OTP Code →
              </button>
            </div>
          </form>
        )}

        {/* Create Account / Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#050B14] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#050B14] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#050B14] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#050B14] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-[#050B14] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Default Avatar Persona (Optional)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'female', label: 'Female', icon: '👩' },
                  { id: 'male', label: 'Male', icon: '👨' },
                  { id: 'unspecified', label: 'Neutral', icon: '✨' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGenderPreference(item.id as GenderPreference)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      genderPreference === item.id
                        ? 'border-[#00C2FF] bg-[#00C2FF]/20 text-white shadow'
                        : 'border-white/10 bg-[#050B14] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C2FF] via-[#6366F1] to-[#A855F7] text-white font-bold text-sm transition-all shadow-lg shadow-[#00C2FF]/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] mt-2"
            >
              Create Account
            </button>
          </form>
        )}

        {/* OTP Code Verification */}
        {tab === 'otp' && (
          <div className="space-y-5 text-center">
            <div className="p-3 w-12 h-12 rounded-2xl bg-[#00C2FF]/10 text-[#00C2FF] mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Enter 4-Digit Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your 4-digit verification code to sign in instantly.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otpCode[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold bg-[#050B14] text-white rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] transition-colors"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleOtpVerify}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white font-bold text-sm shadow-lg shadow-[#00C2FF]/20 hover:opacity-90 transition-opacity"
            >
              Verify & Sign In
            </button>

            <button
              type="button"
              onClick={() => setTab('signin')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to password login
            </button>
          </div>
        )}

        {/* Forgot Password */}
        {tab === 'forgot' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Reset Password</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your email address to receive password reset instructions.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Registered Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-[#050B14] text-white text-sm px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                showToast({
                  title: 'Reset Link Sent',
                  description: 'Instructions have been dispatched to your email address.',
                  type: 'info',
                });
                setTab('signin');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white font-bold text-sm transition-opacity hover:opacity-90"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure HotstarX Authentication</span>
        </div>
      </div>
    </div>
  );
};
