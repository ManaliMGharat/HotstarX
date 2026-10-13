import type { NotificationItem, UserProfile, GenderPreference } from '../types/index.ts';
import { resolveUserAvatar, DEFAULT_KIDS_AVATAR } from './avatarCatalog.ts';

/**
 * Initial empty notifications for fresh users.
 * Notifications will be created only from real application events.
 */
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

/**
 * Empty profiles array for fresh unauthenticated initial state.
 */
export const DEMO_PROFILES: UserProfile[] = [];

/**
 * Factory to create a clean, genuine user profile upon registration/login
 */
export const createPersonalProfile = (
  name: string,
  email: string,
  genderPreference: GenderPreference = 'unspecified',
  customAvatarUrl?: string
): UserProfile => {
  const cleanName = name.trim() || 'PrimeX User';
  const resolvedAvatar = resolveUserAvatar({
    genderPreference,
    customAvatarUrl,
    isKids: false,
  });

  return {
    id: `profile-${Date.now()}`,
    name: cleanName,
    avatar: resolvedAvatar,
    customAvatarUrl: customAvatarUrl || undefined,
    genderPreference: genderPreference,
    email: email.trim().toLowerCase(),
    isKids: false,
    plan: 'Free',
    planStatus: 'Active',
    planBillingCycle: 'monthly',
    preferences: {
      streamingQuality: 'Auto',
      audioLanguage: 'English',
      subtitlesEnabled: true,
      autoplayNext: true,
      notifications: true,
    },
  };
};

/**
 * Factory to create a genuine sub-profile for Kids mode when requested by the user
 */
export const createKidsProfile = (name = 'Kids'): UserProfile => {
  return {
    id: `profile-kids-${Date.now()}`,
    name: name.trim() || 'Kids',
    avatar: DEFAULT_KIDS_AVATAR,
    email: '',
    isKids: true,
    plan: 'Free',
    planStatus: 'Active',
    planBillingCycle: 'monthly',
    preferences: {
      streamingQuality: 'Medium (1080p)',
      audioLanguage: 'English',
      subtitlesEnabled: true,
      autoplayNext: true,
      notifications: false,
    },
  };
};
