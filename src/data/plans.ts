import type { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    tagline: 'Ideal for solo streaming on smartphones and tablets.',
    priceMonthly: 99,
    priceYearly: 999,
    videoQuality: 'Good',
    resolution: '720p HD',
    supportedDevices: ['Mobile phones', 'Tablets'],
    simultaneousScreens: 1,
    features: [
      'Access to all Movies, Series & Live Sports',
      '720p HD Video Resolution',
      'Stereo 2.0 Audio',
      'Download up to 10 titles for offline viewing',
      'Standard ad-supported live sports breaks'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Superb quality for couples and everyday entertainment on TV & PC.',
    priceMonthly: 199,
    priceYearly: 1799,
    videoQuality: 'Great',
    resolution: '1080p Full HD',
    supportedDevices: ['TV', 'Laptop', 'Tablet', 'Mobile phone'],
    simultaneousScreens: 2,
    isPopular: true,
    features: [
      'Full catalog access across all screens',
      '1080p Full HD streaming',
      'Dolby 5.1 Surround Sound',
      'Stream on 2 screens concurrently',
      'Download up to 30 titles across devices',
      'Ad-free entertainment (movies & series)'
    ]
  },
  {
    id: 'max',
    name: 'Max Ultra',
    tagline: 'The ultimate cinematic experience with 4K UHD and Dolby Vision.',
    priceMonthly: 299,
    priceYearly: 2799,
    videoQuality: 'Best',
    resolution: '4K Ultra HD + HDR10',
    supportedDevices: ['TV', 'Laptop', 'Tablet', 'Mobile phone'],
    simultaneousScreens: 4,
    features: [
      'Unrestricted 4K Ultra HD & HDR10 / Dolby Vision',
      'Dolby Atmos spatial audio',
      'Stream on 4 screens at the same time',
      'Unlimited offline downloads',
      '100% ad-free experience (including sports)',
      'Early access to PrimeX Original premiere cuts',
      'VIP Priority live sports multi-cam angles'
    ]
  }
];
