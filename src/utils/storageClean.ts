/**
 * HotstarX Storage Reset & Migration Utility
 * 
 * Safely removes legacy seeded demo data (e.g. "Alex Vance", seeded demo history,
 * seeded demo notifications, fake pre-populated watchlists) from the user's browser,
 * while ensuring clean empty initial state for a developer-owned app.
 */

const STORAGE_VERSION_KEY = 'hotstarx_storage_version';
const CURRENT_STORAGE_VERSION = '2.4.0_clean';

export function runInitialStorageCleanup(): void {
  try {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);

    // If version is already current, check if legacy seeded strings unexpectedly remain
    const authProfileRaw = localStorage.getItem('hotstarx_user_profile_v1');
    const authActiveIdRaw = localStorage.getItem('hotstarx_user_profile_v1_active_id');
    const legacyHistoryRaw = localStorage.getItem('hotstarx_playback_history_v1');
    const legacyWatchlistRaw = localStorage.getItem('hotstarx_watchlist_v1');
    const legacyNotifRaw = localStorage.getItem('hotstarx_notifications_v1');

    const hasLegacyDemoData = 
      (authProfileRaw && authProfileRaw.includes('Alex Vance')) ||
      (authActiveIdRaw && authActiveIdRaw.includes('profile-personal') && !localStorage.getItem('hotstarx_auth_user')) ||
      (legacyHistoryRaw && legacyHistoryRaw.includes('hx-velocity')) ||
      (legacyWatchlistRaw && legacyWatchlistRaw.includes('hx-neon-city')) ||
      (legacyNotifRaw && legacyNotifRaw.includes('Match Underway!'));

    if (currentVersion !== CURRENT_STORAGE_VERSION || hasLegacyDemoData) {
      // Clear legacy seeded keys
      localStorage.removeItem('hotstarx_user_profile_v1');
      localStorage.removeItem('hotstarx_user_profile_v1_active_id');
      localStorage.removeItem('hotstarx_playback_history_v1');
      localStorage.removeItem('hotstarx_watchlist_v1');
      localStorage.removeItem('hotstarx_notifications_v1');
      localStorage.removeItem('hotstarx_recent_searches_v1');
      
      // Also clear legacy session keys if any
      localStorage.removeItem('hotstarx_auth_user');
      localStorage.removeItem('hotstarx_user_profiles');
      localStorage.removeItem('hotstarx_active_profile_id');

      // Set clean storage version
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
    }
  } catch (err) {
    console.warn('Storage cleanup non-fatal warning:', err);
  }
}

/**
 * Explicit helper to completely reset app data back to clean developer state
 */
export function resetHotstarXAppData(): void {
  try {
    const keysToRemove = [
      'hotstarx_auth_user',
      'hotstarx_user_profiles',
      'hotstarx_active_profile_id',
      'hotstarx_playback_history_v2',
      'hotstarx_playback_history_v1',
      'hotstarx_watchlist_v2',
      'hotstarx_watchlist_v1',
      'hotstarx_notifications_v2',
      'hotstarx_notifications_v1',
      'hotstarx_user_profile_v1',
      'hotstarx_user_profile_v1_active_id',
      'hotstarx_recent_searches_v1'
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
    window.location.reload();
  } catch (err) {
    console.warn('Reset app data warning:', err);
  }
}
