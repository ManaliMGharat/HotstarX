import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { UserProfile, GenderPreference } from '../types';
import { createPersonalProfile, createKidsProfile } from '../data/profiles';
import { resolveUserAvatar } from '../data/avatarCatalog';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentProfile: UserProfile | null;
  profiles: UserProfile[];
  isAuthenticated: boolean;
  isKidsMode: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  switchProfile: (profileId: string) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  updatePlan: (planName: 'Mobile' | 'Standard' | 'Max' | 'Free', billingCycle: 'monthly' | 'yearly') => void;
  openAuthModal: (tab?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  login: (emailOrPhone: string, name?: string) => void;
  signup: (details: { name: string; email: string; phone?: string; genderPreference?: GenderPreference; customAvatarUrl?: string }) => void;
  addKidsProfile: (name?: string) => void;
  logout: () => void;
}

const STORAGE_AUTH_KEY = 'hotstarx_auth_user_v2';
const STORAGE_PROFILES_KEY = 'hotstarx_user_profiles_v2';
const STORAGE_ACTIVE_ID_KEY = 'hotstarx_active_profile_id_v2';

export const getAccountProfilesKey = (email: string) =>
  `hotstarx_user_profiles_v2_${email.trim().toLowerCase()}`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // 1. Authenticated state: Default is FALSE for a fresh browser
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_AUTH_KEY);
      return Boolean(storedAuth);
    } catch {
      return false;
    }
  });

  // 2. Profiles list: Auto-sanitizes legacy avatars and resolves correct dynamic avatars
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const storedProfiles = localStorage.getItem(STORAGE_PROFILES_KEY);
      if (storedProfiles) {
        const parsed = JSON.parse(storedProfiles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: UserProfile) => ({
            ...p,
            avatar: resolveUserAvatar(p),
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // 3. Active Profile ID
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_ID_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  // Derive current profile
  const currentProfile: UserProfile | null = isAuthenticated && profiles.length > 0
    ? profiles.find((p) => p.id === currentProfileId) || profiles[0]
    : null;

  const isKidsMode = Boolean(currentProfile?.isKids);

  // Synchronize profiles to localStorage when authenticated
  useEffect(() => {
    try {
      if (isAuthenticated && profiles.length > 0) {
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
        if (currentProfile?.id) {
          localStorage.setItem(STORAGE_ACTIVE_ID_KEY, currentProfile.id);
        }
        if (currentProfile?.email) {
          localStorage.setItem(getAccountProfilesKey(currentProfile.email), JSON.stringify(profiles));
        }
      }
    } catch (e) {
      console.warn('LocalStorage save failed for profiles', e);
    }
  }, [profiles, isAuthenticated, currentProfile]);

  const switchProfile = useCallback((profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    setCurrentProfileId(profileId);
    try {
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, profileId);
    } catch {
      // ignore
    }
    showToast({
      title: `Switched to ${target.name}`,
      description: target.isKids 
        ? 'Kids Mode enabled (family-friendly content only).' 
        : 'Welcome back to your personalized space.',
      type: 'info',
    });
  }, [profiles, showToast]);

  const updateProfile = useCallback((updatedData: Partial<UserProfile>) => {
    if (!currentProfile) return;
    setProfiles((prev) => {
      const updated = prev.map((p) => {
        if (p.id === currentProfile.id) {
          const merged = { ...p, ...updatedData };
          merged.avatar = resolveUserAvatar(merged);
          return merged;
        }
        return p;
      });

      try {
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(updated));
        if (currentProfile.email) {
          localStorage.setItem(getAccountProfilesKey(currentProfile.email), JSON.stringify(updated));
        }
      } catch (e) {
        console.warn('LocalStorage save failed for profile update', e);
      }

      return updated;
    });

    showToast({
      title: 'Profile Updated',
      description: 'Your preferences and avatar have been saved successfully.',
      type: 'success',
    });
  }, [currentProfile, showToast]);

  const updatePlan = useCallback((planName: 'Mobile' | 'Standard' | 'Max' | 'Free', billingCycle: 'monthly' | 'yearly') => {
    if (!currentProfile) {
      showToast({
        title: 'Sign In Required',
        description: 'Please sign in or create an account to activate a subscription.',
        type: 'warning',
      });
      setIsAuthModalOpen(true);
      return;
    }

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === currentProfile.id
          ? {
              ...p,
              plan: planName,
              planStatus: 'Active',
              planBillingCycle: billingCycle,
            }
          : p
      )
    );
    showToast({
      title: 'Plan Updated!',
      description: `You are now subscribed to the HotstarX ${planName} Plan (${billingCycle}).`,
      type: 'success',
    });
  }, [currentProfile, showToast]);

  const openAuthModal = useCallback((tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Real User Login with Account-Specific Avatar Persistence
  const login = useCallback((emailOrPhone: string, userName?: string) => {
    const cleanIdentifier = emailOrPhone.trim();
    if (!cleanIdentifier) return;

    // Derive display name: use provided name, or derive from email prefix, fallback to 'HotstarX User'
    let derivedName = userName?.trim();
    if (!derivedName) {
      if (cleanIdentifier.includes('@')) {
        const prefix = cleanIdentifier.split('@')[0];
        derivedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      } else {
        derivedName = 'HotstarX User';
      }
    }

    const email = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@user.hotstarx`;
    const accountKey = getAccountProfilesKey(email);

    // Look up saved profiles for this specific user account
    let userProfiles: UserProfile[] = [];
    try {
      const storedAccount = localStorage.getItem(accountKey);
      if (storedAccount) {
        const parsed = JSON.parse(storedAccount);
        if (Array.isArray(parsed) && parsed.length > 0) {
          userProfiles = parsed.map((p: UserProfile) => ({
            ...p,
            avatar: resolveUserAvatar(p),
          }));
        }
      } else {
        // Fallback: check if the global session currently belongs to this user
        const storedAuth = localStorage.getItem(STORAGE_AUTH_KEY);
        if (storedAuth) {
          const authObj = JSON.parse(storedAuth);
          if (authObj?.email === email) {
            const stored = localStorage.getItem(STORAGE_PROFILES_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                userProfiles = parsed.map((p: UserProfile) => ({
                  ...p,
                  avatar: resolveUserAvatar(p),
                }));
              }
            }
          }
        }
      }
    } catch {
      userProfiles = [];
    }

    if (!userProfiles.length) {
      const newProfile = createPersonalProfile(derivedName, email);
      userProfiles = [newProfile];
    } else {
      userProfiles[0] = {
        ...userProfiles[0],
        name: derivedName || userProfiles[0].name,
        email: email || userProfiles[0].email,
        avatar: resolveUserAvatar(userProfiles[0]),
      };
    }

    setProfiles(userProfiles);
    setCurrentProfileId(userProfiles[0].id);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify({ email, name: derivedName }));
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(userProfiles));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, userProfiles[0].id);
      localStorage.setItem(accountKey, JSON.stringify(userProfiles));
    } catch (e) {
      console.warn('Failed to save session', e);
    }

    showToast({
      title: 'Signed In Successfully',
      description: `Welcome back, ${derivedName}! Enjoy streaming on HotstarX.`,
      type: 'success',
    });
  }, [showToast]);

  // Real User Signup with Optional Gender / Avatar Preference
  const signup = useCallback((details: {
    name: string;
    email: string;
    phone?: string;
    genderPreference?: GenderPreference;
    customAvatarUrl?: string;
  }) => {
    const cleanName = details.name.trim() || 'HotstarX User';
    const cleanEmail = details.email.trim();

    const newProfile = createPersonalProfile(
      cleanName,
      cleanEmail,
      details.genderPreference || 'unspecified',
      details.customAvatarUrl
    );
    const userProfiles = [newProfile];

    setProfiles(userProfiles);
    setCurrentProfileId(newProfile.id);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify({ email: cleanEmail, name: cleanName }));
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(userProfiles));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, newProfile.id);
      localStorage.setItem(getAccountProfilesKey(cleanEmail), JSON.stringify(userProfiles));
    } catch (e) {
      console.warn('Failed to save session', e);
    }

    showToast({
      title: 'Account Created!',
      description: `Welcome to HotstarX, ${cleanName}! Start browsing and streaming.`,
      type: 'success',
    });
  }, [showToast]);

  // Feature to add a Kids profile
  const addKidsProfile = useCallback((name = 'Kids') => {
    if (!isAuthenticated) return;
    const newKids = createKidsProfile(name);
    setProfiles((prev) => [...prev, newKids]);
    setCurrentProfileId(newKids.id);
    showToast({
      title: 'Kids Profile Created',
      description: `Switched to ${newKids.name} profile with family-friendly content only.`,
      type: 'success',
    });
  }, [isAuthenticated, showToast]);

  // Logout: wipes active session and resets state
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentProfileId(null);
    setProfiles([]);

    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
      localStorage.removeItem(STORAGE_PROFILES_KEY);
      localStorage.removeItem(STORAGE_ACTIVE_ID_KEY);
    } catch (e) {
      console.warn('Failed to clear session on logout', e);
    }

    showToast({
      title: 'Signed Out',
      description: 'You have been signed out. You can continue browsing the public catalog.',
      type: 'info',
    });
  }, [showToast]);

  return (
    <AuthContext.Provider
      value={{
        currentProfile,
        profiles,
        isAuthenticated,
        isKidsMode,
        isAuthModalOpen,
        authModalTab,
        switchProfile,
        updateProfile,
        updatePlan,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        addKidsProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
