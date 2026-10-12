export type MediaType = 'movie' | 'series' | 'sports' | 'original' | 'documentary' | 'kids';

export type AgeRating = 'U' | 'U/A 7+' | 'U/A 13+' | 'U/A 16+' | 'A 18+';

export type VideoQuality = 'HD' | 'Full HD' | '4K Ultra HD' | 'Dolby Vision • Atmos';

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  synopsis: string;
  videoUrl: string;
}

export interface SportsMatchDetails {
  tournament: string;
  sport: 'Cricket' | 'Football' | 'Motorsport' | 'Tennis' | 'Kabaddi' | 'Extreme Sports';
  venue: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  startTime: string;
  liveBadgeText?: string;
  teamA: {
    name: string;
    code: string;
    score?: string;
    overs?: string;
    logo?: string;
  };
  teamB: {
    name: string;
    code: string;
    score?: string;
    overs?: string;
    logo?: string;
  };
  highlightNote?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  tagline?: string;
  synopsis: string;
  category: MediaType;
  genre: string[];
  year: number;
  ageRating: AgeRating;
  quality: VideoQuality;
  duration: string;
  durationSeconds?: number;
  poster: string;
  backdrop: string;
  trailerUrl?: string;
  videoUrl: string;
  language: string[];
  rating: number; // e.g. 8.7
  matchPercentage?: number; // e.g. 98% Match
  isNew?: boolean;
  isOriginal?: boolean;
  isTrending?: boolean;
  isTop10?: boolean;
  topRank?: number;
  isLive?: boolean;
  cast?: string[];
  director?: string;
  seasonsCount?: number;
  episodes?: Episode[];
  sportsDetails?: SportsMatchDetails;
}

export interface ContentSection {
  id: string;
  title: string;
  subtitle?: string;
  categoryFilter?: string;
  viewAllRoute?: string;
  isPortrait?: boolean; // true for poster portrait, false for wide 16:9 backdrop cards
  isRanked?: boolean;   // e.g. Top 10 badges
  items: MediaItem[];
}

export interface WatchProgress {
  mediaId: string;
  currentTime: number;
  duration: number;
  progressPercent: number;
  lastUpdated: number;
  episodeId?: string;
}

export type GenderPreference = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | 'unspecified';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  customAvatarUrl?: string;
  genderPreference?: GenderPreference;
  selectedAvatarPreset?: string;
  email: string;
  isKids: boolean;
  plan: 'Mobile' | 'Standard' | 'Max' | 'Free';
  planStatus: 'Active' | 'Demo' | 'Expired';
  planBillingCycle: 'monthly' | 'yearly';
  preferences: {
    streamingQuality: 'Auto' | 'High (4K)' | 'Medium (1080p)' | 'Data Saver';
    audioLanguage: string;
    subtitlesEnabled: boolean;
    autoplayNext: boolean;
    notifications: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'live' | 'new_release' | 'watchlist' | 'plan';
  linkUrl?: string;
  thumbnail?: string;
}

export interface SubscriptionPlan {
  id: 'mobile' | 'standard' | 'max';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  videoQuality: string;
  resolution: string;
  supportedDevices: string[];
  simultaneousScreens: number;
  features: string[];
  isPopular?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
