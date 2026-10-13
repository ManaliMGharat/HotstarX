import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PrimeXLogo } from '../brand/HotstarXLogo';

import type { GenderPreference } from '../../types';

type AuthTab = 'signin' | 'signup' | 'forgot';

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

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-specific validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync tab with context if opened with a specific tab
  React.useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
      setErrors({});
    }
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return 'Email or username is required.';
    if (trimmed.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    if (!password) {
      newErrors.password = 'Password is required to sign in.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    login(email, fullName);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      newErrors.email = emailErr;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    signup({
      name: fullName.trim(),
      email: email.trim(),
      phone: phoneNumber.trim(),
      genderPreference,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="PrimeX Account Authentication"
    >
      <div
        className="relative w-full max-w-md bg-[#070e1c] rounded-3xl border border-cyan-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.15)] p-6 sm:p-8 overflow-hidden animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows in Electric Cyan & Violet */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-cyan-500/18 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-violet-600/18 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close Authentication Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <PrimeXLogo size="lg" clickable={false} showTagline={true} className="justify-center mb-1" />
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        {tab !== 'forgot' && (
          <div className="flex p-1 rounded-xl bg-[#030712] border border-white/5 mb-6">
            <button
              onClick={() => {
                setTab('signin');
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'signin'
                  ? 'bg-gradient-to-r from-cyan-500/25 to-violet-600/25 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500/25 to-violet-600/25 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
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
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="Enter your email"
                  className={`w-full bg-[#030712] text-white text-sm pl-10 pr-4 py-3 rounded-xl border transition-colors focus:outline-none ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1 pl-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setTab('forgot');
                    setErrors({});
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-[#030712] text-white text-sm pl-10 pr-11 py-3 rounded-xl border transition-colors focus:outline-none ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400 mt-1 pl-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:brightness-110 hover:scale-[1.01] active:scale-[0.98]"
            >
              Sign In to PrimeX
            </button>
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
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Enter your full name"
                  className={`w-full bg-[#030712] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    errors.fullName
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 mt-0.5 pl-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@example.com"
                  className={`w-full bg-[#030712] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-0.5 pl-1">{errors.email}</p>
              )}
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
                  className="w-full bg-[#030712] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="At least 6 characters"
                  className={`w-full bg-[#030712] text-white text-sm pl-10 pr-11 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400 mt-0.5 pl-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Re-enter password"
                  className={`w-full bg-[#030712] text-white text-sm pl-10 pr-11 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-400 mt-0.5 pl-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Default Avatar Persona
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
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow'
                        : 'border-white/10 bg-[#030712] text-slate-400 hover:text-white'
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#8B5CF6] text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:brightness-110 hover:scale-[1.01] active:scale-[0.98] mt-2"
            >
              Create Account
            </button>
          </form>
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
                className="w-full bg-[#030712] text-white text-sm px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                showToast({
                  title: 'Reset Link Sent',
                  description: 'Password reset instructions have been dispatched to your email address.',
                  type: 'info',
                });
                setTab('signin');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] text-black font-extrabold text-sm transition-opacity hover:opacity-95"
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

        {/* Powered by XQORA & Security Badge */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secure Authentication</span>
          </div>
          <span className="font-mono text-cyan-400 font-semibold tracking-wider text-[10px]">
            Powered by XQORA
          </span>
        </div>
      </div>
    </div>
  );
};
