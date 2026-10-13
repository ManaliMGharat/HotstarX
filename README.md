# PrimeX — Your World of Entertainment

> **Powered by XQORA**  
> A production-grade, cinematic OTT streaming web application built with an original brand identity, high-performance architecture, and zero proprietary copyrighted assets.

---

## 🌟 Core Highlights

* **Brand Identity**: Original **PrimeX** cinematic dual-blade X emblem, glowing typography, signature **Powered by XQORA** branding, deep midnight navy backgrounds (`#030712`, `#070e1c`), electric violet (`#8B5CF6`) and cyan (`#00F2FE`) accent palette.
* **Cinematic Hero Showcase**: Dynamic auto-rotating full-width billboard with backdrop imagery, title, genre, synopsis, timer progress bar, smooth crossfade & scale animations, direct "Play Now" action, "Watchlist" toggling, and deep information preview modal.
* **Horizontal Rails Architecture**: Smooth-scrolling horizontal content carousels with desktop directional controls and touch swipe on mobile. Features ranked Top 10 badges, custom metadata indicators, and hover preview action triggers.
* **Real Playback & Continue Watching**: Embedded HTML5 video stream player with custom scrubbable progress bar, rewind/forward 10s, volume & mute, audio & subtitles picker, playback speed (0.75x–1.5x), resolution switch (4K/1080p/720p/Auto), and fullscreen API support. Synchronizes and persists playback progress directly into `localStorage`. Distinct video mappings across different media items with graceful fallbacks.
* **Smart Search Experience**: Debounced search and full-screen modal overlay with instant live filtering across title, genre, synopsis, category, cast, and director. Includes recent search history, trending search tags, category pills, and keyboard shortcuts (`Esc` to dismiss, `Enter` to play/open first result).
* **Genuine Authentication & Profiles**: Real registration and login with form validation, field-specific error feedback, password visibility toggles, and persistent sessions. Switch between *Personal*, *Kids Space*, and *Guest* profiles. Selecting the Kids profile automatically sanitizes and restricts catalog content to family-friendly (`U` rating) titles.
* **Subscription Management**: Tiers for *Mobile* (₹99/mo), *Standard* (₹199/mo), and *Max Ultra* (₹299/mo) with a Monthly/Yearly toggle showcasing a 20% annual discount. Includes an interactive simulated checkout modal with mock UPI, Card, and NetBanking flows clearly labeled as a safe sandbox.
* **Live Broadcast Center**: Real-time scoreboards for Cricket, Motorsport (Formula Apex), Football, and Kabaddi with pulsing red `LIVE` badges and start schedules.
* **Interactive Notifications**: Live notification popover with unread counters, mark as read, and platform alert feeds.
* **Production-Ready & Responsive**: Optimized bundle split with route-level lazy loading (`React.lazy` + `Suspense`) and vendor chunk separation (`vendor-react`, `vendor-icons`). Fully verified across 360px (mobile) to 1440px+ (desktop) screens with no horizontal overflow, WCAG accessible contrast, keyboard accessibility, and zero build errors.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
Generates an optimized production bundle in `dist/`.

### 4. Tests & Linting
```bash
npm test
npm run lint
```

### 5. Local Production Preview
```bash
npm run preview
```

---

## 📁 Project Architecture

```
PrimeX/
├── public/
│   ├── favicon.svg                  # Original PrimeX glowing cyan/violet X emblem
│   └── videos/                      # Licensed demo video assets for local playback
├── src/
│   ├── assets/                      # Static branding assets
│   ├── components/
│   │   ├── auth/                    # PrimeX Sign In, Sign Up, validation & visibility toggles
│   │   ├── brand/                   # PrimeXLogo with Powered by XQORA tagline
│   │   ├── cards/                   # MediaCard (poster/backdrop) & LiveCard (sports)
│   │   ├── details/                 # ContentDetailsModal (synopsis, cast, episodes)
│   │   ├── hero/                    # HeroBanner full-width billboard carousel
│   │   ├── layout/                  # Header, Sidebar, MobileBottomNav, and Footer (Powered by XQORA)
│   │   ├── notifications/           # NotificationDropdown popover
│   │   ├── plans/                   # PlanCheckoutModal (simulated sandbox gateway)
│   │   ├── player/                  # VideoPlayerModal (custom cinema video controls)
│   │   ├── profile/                 # ProfileDropdown & profile switcher
│   │   ├── rails/                   # ContentRail & ContinueWatchingRail
│   │   ├── search/                  # SearchOverlay with live filter & recents
│   │   └── ui/                      # SkeletonLoader shimmer & ToastContainer
│   ├── context/
│   │   ├── AuthContext.tsx          # Multi-profile state, Kids mode, plan state
│   │   ├── DetailsModalContext.tsx  # Deep info modal management
│   │   ├── HistoryContext.tsx       # Continue Watching localStorage persistence
│   │   ├── PlayerContext.tsx        # Video playback state and active stream
│   │   ├── ToastContext.tsx         # Global animated notifications
│   │   └── WatchlistContext.tsx     # Watchlist localStorage persistence
│   ├── data/
│   │   ├── avatarCatalog.ts         # User avatar SVG catalog & preset system
│   │   ├── content.ts               # Original fictional catalog (30+ titles)
│   │   ├── mediaCatalog.ts          # Media mappings and video source catalog
│   │   ├── plans.ts                 # Mobile, Standard, Max subscription tiers
│   │   └── profiles.ts              # Personal and Kids profiles factory
│   ├── pages/
│   │   ├── HomePage.tsx             # Featured carousel + curated rails
│   │   ├── MoviesPage.tsx           # Genre-filtered movies catalog
│   │   ├── SeriesPage.tsx           # Episodic series catalog
│   │   ├── SportsPage.tsx           # Live matches, upcoming fixtures, docuseries
│   │   ├── LivePage.tsx             # 24/7 on-air feeds & scoreboards
│   │   ├── OriginalsPage.tsx        # PrimeX Originals showcase
│   │   ├── MyListPage.tsx           # Saved titles grid with category filters
│   │   ├── PlansPage.tsx            # Subscription comparison matrix & upgrade flow
│   │   ├── ProfilePage.tsx          # User preferences, audio, subtitles, streaming quality
│   │   ├── SearchPage.tsx           # Debounced search catalog page
│   │   ├── WatchPage.tsx            # Standalone direct share route (/watch/:id)
│   │   ├── HelpPage.tsx             # Help Center & FAQ
│   │   ├── SettingsPage.tsx         # User preferences & privacy settings
│   │   └── NotFoundPage.tsx         # Cinematic 404 handler
│   ├── services/
│   │   └── api.ts                   # Decoupled API service layer
│   ├── types/
│   │   └── index.ts                 # Strict TypeScript schemas
│   ├── utils/
│   │   ├── imageFallback.ts         # PrimeX elegant SVG image fallbacks
│   │   └── storageClean.ts          # Local storage migration & reset utilities
│   ├── App.tsx                      # Root component, route-level Suspense & providers
│   ├── index.css                    # Tailwind CSS v4, dark theme vars & electric palette
│   └── main.tsx                     # React entrypoint
├── tests/
│   ├── avatarSystem.test.mjs        # 10 test specs for avatar resolution & persistence
│   └── mediaCatalog.test.mjs        # 10 test specs for video mappings & catalog integrity
├── vercel.json                      # Vercel SPA rewrite & cache rules
├── vite.config.ts                   # Vite configuration with chunk splitting & manualChunks
├── package.json
└── README.md
```

---

## 🌐 Vercel Deployment

This project is configured for seamless deployment to Vercel.

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. SPA routing is configured in `vercel.json` (`/(.*) -> /index.html`).

---

## 🔒 Environment Variables & Backend Integration

The frontend features a clean API service layer (`src/services/api.ts`) that decouples mock catalog data from UI components.

To integrate with a real backend service:

1. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_ENABLE_MOCK_FALLBACK=false
```

2. Point `src/services/api.ts` to `import.meta.env.VITE_API_BASE_URL`:
```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async getHomeContent() {
    const res = await fetch(`${API_BASE}/content/home`);
    return res.json();
  },
  // ...
};
```

---

## 📜 Legal & Content Attribution

All catalog titles (*Neon City*, *The Last Monsoon*, *Velocity*, *Midnight Diner: Mumbai*, *Wild India: The Living Realm*, *Code Red: Sentinel*, *Skyline FC*, *Orbit 9*, etc.) are fictional creative properties created for the **PrimeX** platform.

Video sample assets are powered by open-source cinematic projects from the Blender Foundation (*Tears of Steel*, *Big Buck Bunny*, *Sintel*, *Elephants Dream*) and public domain samples.
