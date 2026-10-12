# HotstarX — Entertainment, reimagined.

> A production-grade, cinematic OTT streaming web application inspired by the interaction quality and information architecture of modern streaming giants, built with an original brand identity, high-performance architecture, and zero proprietary copyrighted assets.

---

## 🌟 Core Highlights

* **Brand Identity**: Original **HotstarX** geometric crystalline star-prism logo mark, glowing typography, dark cinematic color system (`#06101C` midnight slate base, electric cyan, azure, crisp white, and subtle gradients).
* **Cinematic Hero Showcase**: Dynamic auto-rotating full-width billboard with timer progress bar, smooth crossfade & scale animations, direct "Watch Now" action, "My List" toggling, and deep information preview modal.
* **Horizontal Rails Architecture**: Smooth-scrolling horizontal content carousels with desktop directional controls and touch swipe on mobile. Features ranked Top 10 badges, custom metadata indicators, and hover preview action triggers.
* **Real Playback & Continue Watching**: Embedded HTML5 video stream player with custom scrubbable progress bar, rewind/forward 10s, volume & mute, audio & subtitles picker, playback speed (0.75x–1.5x), resolution switch (4K/1080p/720p/Auto), and fullscreen API support. Synchronizes and persists playback progress directly into `localStorage`.
* **Smart Search Experience**: Full-screen modal overlay with instant live filtering across title, genre, synopsis, category, cast, and director. Includes recent search history, trending search tags, category pills, and keyboard shortcuts (`Esc` to dismiss, `Enter` to play/open first result).
* **Personalized Profiles & Kids Mode**: Switch between *Personal*, *Kids Club*, and *Guest* profiles. Selecting the Kids profile automatically sanitizes and restricts catalog content to family-friendly (`U` rating) titles.
* **Subscription Management**: Tiers for *Mobile* (₹99/mo), *Standard* (₹199/mo), and *Max Ultra* (₹299/mo) with a Monthly/Yearly toggle showcasing a 20% annual discount. Includes an interactive simulated checkout modal with mock UPI, Card, and NetBanking flows clearly labeled as a safe sandbox.
* **Live Broadcast Center**: Real-time scoreboards for Cricket, Motorsport (Formula Apex), Football, and Kabaddi with pulsing red `LIVE` badges and start schedules.
* **Interactive Notifications**: Live notification popover with unread counters, mark as read, and platform alert feeds.
* **Production-Ready & Responsive**: Fully verified across 360px (mobile) to 1440px+ (desktop) screens with no horizontal overflow, WCAG accessible contrast, keyboard accessibility, and zero build errors.

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

### 4. Local Production Preview
```bash
npm run preview
```

---

## 📁 Project Architecture

```
HotstarX/
├── public/
│   └── favicon.svg                  # Original HotstarX SVG logo mark
├── src/
│   ├── assets/                      # Static branding assets
│   ├── components/
│   │   ├── auth/                    # Sign In, Sign Up, OTP modals
│   │   ├── brand/                   # HotstarX original logo component
│   │   ├── cards/                   # MediaCard (poster/backdrop) & LiveCard (sports)
│   │   ├── details/                 # ContentDetailsModal (synopsis, cast, episodes)
│   │   ├── hero/                    # HeroBanner full-width billboard carousel
│   │   ├── layout/                  # Sticky Header, Drawer & Footer
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
│   │   └── WatchlistContext.tsx     # My List localStorage persistence
│   ├── data/
│   │   ├── content.ts               # Original fictional catalog (30+ titles)
│   │   ├── plans.ts                 # Mobile, Standard, Max subscription tiers
│   │   └── profiles.ts              # Personal, Kids, and Guest demo profiles
│   ├── pages/
│   │   ├── HomePage.tsx             # Featured carousel + curated rails
│   │   ├── MoviesPage.tsx           # Genre-filtered movies catalog
│   │   ├── SeriesPage.tsx           # Episodic series catalog
│   │   ├── SportsPage.tsx           # Live matches, upcoming fixtures, docuseries
│   │   ├── LivePage.tsx             # 24/7 on-air feeds & scoreboards
│   │   ├── OriginalsPage.tsx        # HotstarX Originals showcase
│   │   ├── MyListPage.tsx           # Saved titles grid with category filters
│   │   ├── PlansPage.tsx            # Subscription comparison matrix & upgrade flow
│   │   ├── ProfilePage.tsx          # User preferences, audio, subtitles, streaming quality
│   │   ├── WatchPage.tsx            # Standalone direct share route (/watch/:id)
│   │   └── NotFoundPage.tsx         # Cinematic 404 handler
│   ├── services/
│   │   └── api.ts                   # Decoupled API service layer
│   ├── types/
│   │   └── index.ts                 # Strict TypeScript schemas
│   ├── App.tsx                      # Root component, routing & providers
│   ├── index.css                    # Tailwind CSS v4, dark theme vars & animations
│   └── main.tsx                     # React entrypoint
├── vercel.json                      # Vercel SPA rewrite & cache rules
├── vite.config.ts                   # Vite configuration with Tailwind CSS v4
├── package.json
└── README.md
```

---

## 🌐 Vercel Deployment

This project is pre-configured for zero-configuration deployment to Vercel.

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. SPA routing is already configured in `vercel.json` (`/(.*) -> /index.html`).

---

## 🔒 Environment Variables & Backend Integration

The frontend is intentionally designed with a clean API service layer (`src/services/api.ts`) that decouples mock catalog data from UI components.

To integrate with a real backend service or headless CMS:

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

3. **Payment Security**:
   - Client applications never store secret payment keys. Keep keys like `STRIPE_SECRET_KEY` or `RAZORPAY_SECRET_KEY` strictly inside your server-side environment.
   - Frontend components only initiate sessions and verify tokens returned by your backend.

---

## 📜 Legal & Content Attribution

All catalog titles (*Neon City*, *The Last Monsoon*, *Velocity*, *Midnight Diner: Mumbai*, *Wild India: The Living Realm*, *Code Red: Sentinel*, *Skyline FC*, *Orbit 9*, etc.) are fictional intellectual properties created for the **HotstarX** platform.

Video sample assets are powered by open-source cinematic projects from the Blender Foundation (*Tears of Steel*, *Big Buck Bunny*, *Sintel*, *Elephants Dream*) and public domain samples.
