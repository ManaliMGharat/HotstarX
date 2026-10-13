import type { UserProfile } from '../types';

/**
 * High-quality, self-contained SVG avatar data URI generator.
 * Zero network dependencies, zero 404 risk, instant local rendering.
 */
function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

// 1. NEUTRAL AVATARS
const SVG_NEUTRAL_1 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradN1" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="starGradN1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <filter id="glowN1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradN1)" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.4"/>
  <!-- Outer glowing ring -->
  <circle cx="60" cy="60" r="48" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="4 4" stroke-opacity="0.6"/>
  <!-- HotstarX CineStar Emblem -->
  <path d="M60 22 L68 48 L94 52 L74 70 L80 96 L60 82 L40 96 L46 70 L26 52 L52 48 Z" fill="url(#starGradN1)" filter="url(#glowN1)"/>
  <circle cx="60" cy="60" r="9" fill="#ffffff" opacity="0.95"/>
  <circle cx="60" cy="60" r="5" fill="#0284c7"/>
</svg>
`;

const SVG_NEUTRAL_2 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradN2" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="70%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="reelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#fb923c"/>
      <stop offset="100%" stop-color="#facc15"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradN2)" stroke="#f43f5e" stroke-width="2" stroke-opacity="0.5"/>
  <!-- Cinema Reel Icon -->
  <circle cx="60" cy="60" r="32" fill="none" stroke="url(#reelGrad)" stroke-width="5"/>
  <circle cx="60" cy="60" r="10" fill="url(#reelGrad)"/>
  <circle cx="60" cy="40" r="5" fill="#ffffff" opacity="0.9"/>
  <circle cx="60" cy="80" r="5" fill="#ffffff" opacity="0.9"/>
  <circle cx="40" cy="60" r="5" fill="#ffffff" opacity="0.9"/>
  <circle cx="80" cy="60" r="5" fill="#ffffff" opacity="0.9"/>
</svg>
`;

const SVG_NEUTRAL_3 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradN3" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#0c4a6e"/>
      <stop offset="65%" stop-color="#082f49"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="personaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradN3)" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.4"/>
  <!-- Minimalist Persona Silhouette with Headset -->
  <circle cx="60" cy="46" r="18" fill="url(#personaGrad)"/>
  <path d="M30 96 C30 76 44 68 60 68 C76 68 90 76 90 96 Z" fill="url(#personaGrad)"/>
  <!-- Headset band & earcups -->
  <path d="M42 46 A18 18 0 0 1 78 46" fill="none" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/>
  <rect x="38" y="42" width="6" height="10" rx="3" fill="#e0f2fe"/>
  <rect x="76" y="42" width="6" height="10" rx="3" fill="#e0f2fe"/>
</svg>
`;

// 2. FEMALE AVATARS
const SVG_FEMALE_1 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradF1" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#4c1d95"/>
      <stop offset="65%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="hairGradF1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#c026d3"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="skinGradF1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradF1)" stroke="#c026d3" stroke-width="2.5" stroke-opacity="0.5"/>
  <!-- Long flowing hair background -->
  <path d="M34 42 C34 24 86 24 86 42 C86 64 92 84 90 98 C78 100 42 100 30 98 C28 84 34 64 34 42 Z" fill="url(#hairGradF1)"/>
  <!-- Shoulders -->
  <path d="M34 98 C34 82 46 76 60 76 C74 76 86 82 86 98 Z" fill="#4338ca"/>
  <!-- Neck -->
  <rect x="54" y="64" width="12" height="15" fill="#fbcfe8"/>
  <!-- Face -->
  <ellipse cx="60" cy="52" rx="16" ry="19" fill="url(#skinGradF1)"/>
  <!-- Hair front style -->
  <path d="M44 42 C48 30 72 30 76 42 C72 37 48 37 44 42 Z" fill="url(#hairGradF1)"/>
  <path d="M44 42 C44 54 48 60 48 64 C45 60 42 50 44 42 Z" fill="#9333ea"/>
  <!-- Eyes -->
  <circle cx="53" cy="50" r="2.2" fill="#312e81"/>
  <circle cx="67" cy="50" r="2.2" fill="#312e81"/>
  <!-- Smile -->
  <path d="M55 58 Q60 62 65 58" fill="none" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Earring gems -->
  <circle cx="43" cy="54" r="2" fill="#f43f5e"/>
  <circle cx="77" cy="54" r="2" fill="#f43f5e"/>
  <!-- Cinephile Headset -->
  <path d="M44 46 A16 16 0 0 1 76 46" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="41" y="42" width="5" height="9" rx="2.5" fill="#38bdf8"/>
  <rect x="74" y="42" width="5" height="9" rx="2.5" fill="#38bdf8"/>
</svg>
`;

const SVG_FEMALE_2 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradF2" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="65%" stop-color="#134e4a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="hairGradF2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradF2)" stroke="#2dd4bf" stroke-width="2" stroke-opacity="0.5"/>
  <!-- Stylish Bob Hair -->
  <path d="M36 44 C36 26 84 26 84 44 C84 68 78 74 76 74 C72 60 76 50 76 44 C76 34 44 34 44 44 C44 50 48 60 44 74 C42 74 36 68 36 44 Z" fill="url(#hairGradF2)"/>
  <!-- Shoulders -->
  <path d="M35 96 C35 80 48 76 60 76 C72 76 85 80 85 96 Z" fill="#0f766e"/>
  <!-- Face -->
  <ellipse cx="60" cy="54" rx="15" ry="17" fill="#fed7aa"/>
  <!-- Eyes with cat-eye liner -->
  <ellipse cx="53" cy="52" rx="2.5" ry="1.5" fill="#0f172a"/>
  <ellipse cx="67" cy="52" rx="2.5" ry="1.5" fill="#0f172a"/>
  <!-- Smile -->
  <path d="M56 61 Q60 64 64 61" fill="none" stroke="#f43f5e" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Sci-Fi Visor Rim / Brow Gem -->
  <circle cx="60" cy="44" r="2" fill="#2dd4bf"/>
</svg>
`;

const SVG_FEMALE_3 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradF3" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#831843"/>
      <stop offset="65%" stop-color="#4a044e"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="hairGradF3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradF3)" stroke="#fbbf24" stroke-width="2" stroke-opacity="0.5"/>
  <!-- Top Bun Hair Style -->
  <circle cx="60" cy="28" r="14" fill="url(#hairGradF3)"/>
  <path d="M38 48 C38 34 82 34 82 48 C82 66 78 72 78 72 C74 58 74 48 74 44 C74 38 46 38 46 44 C46 48 46 58 42 72 C42 72 38 66 38 48 Z" fill="url(#hairGradF3)"/>
  <!-- Shoulders -->
  <path d="M35 96 C35 80 48 76 60 76 C72 76 85 80 85 96 Z" fill="#9d174d"/>
  <!-- Face -->
  <ellipse cx="60" cy="53" rx="15" ry="18" fill="#fde68a"/>
  <!-- Glasses -->
  <rect x="47" y="47" width="10" height="8" rx="2" fill="none" stroke="#fbbf24" stroke-width="1.8"/>
  <rect x="63" y="47" width="10" height="8" rx="2" fill="none" stroke="#fbbf24" stroke-width="1.8"/>
  <line x1="57" y1="51" x2="63" y2="51" stroke="#fbbf24" stroke-width="1.8"/>
  <!-- Eyes behind glasses -->
  <circle cx="52" cy="51" r="1.5" fill="#1e1b4b"/>
  <circle cx="68" cy="51" r="1.5" fill="#1e1b4b"/>
  <!-- Smile -->
  <path d="M55 60 Q60 63 65 60" fill="none" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round"/>
</svg>
`;

// 3. MALE AVATARS
const SVG_MALE_1 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradM1" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="65%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="hairGradM1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradM1)" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.5"/>
  <!-- Shoulders / Hoodie -->
  <path d="M32 98 C32 80 46 74 60 74 C74 74 88 80 88 98 Z" fill="#1e40af"/>
  <!-- Neck -->
  <rect x="54" y="62" width="12" height="15" fill="#fed7aa"/>
  <!-- Face -->
  <polygon points="46,42 74,42 72,66 60,74 48,66" fill="#fed7aa"/>
  <!-- Stylish Cropped Hair -->
  <path d="M43 42 C43 28 77 28 77 42 C77 42 72 34 60 34 C48 34 43 42 43 42 Z" fill="url(#hairGradM1)"/>
  <!-- Eyes -->
  <circle cx="52" cy="49" r="2" fill="#0f172a"/>
  <circle cx="68" cy="49" r="2" fill="#0f172a"/>
  <!-- Eyebrows -->
  <path d="M48 45 L56 46" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round"/>
  <path d="M64 46 L72 45" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round"/>
  <!-- Smile -->
  <path d="M54 60 Q60 64 66 60" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Cinephile Headphones -->
  <path d="M42 45 A18 18 0 0 1 78 45" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="39" y="42" width="5" height="10" rx="2.5" fill="#60a5fa"/>
  <rect x="76" y="42" width="5" height="10" rx="2.5" fill="#60a5fa"/>
</svg>
`;

const SVG_MALE_2 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradM2" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="65%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="hairGradM2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradM2)" stroke="#10b981" stroke-width="2" stroke-opacity="0.5"/>
  <!-- Sports Jersey Shoulders -->
  <path d="M32 98 C32 80 46 74 60 74 C74 74 88 80 88 98 Z" fill="#065f46"/>
  <!-- Face -->
  <ellipse cx="60" cy="54" rx="16" ry="19" fill="#fde68a"/>
  <!-- Athletic Headband -->
  <rect x="43" y="40" width="34" height="6" rx="3" fill="#10b981"/>
  <!-- Short hair above headband -->
  <path d="M44 40 C44 30 76 30 76 40 Z" fill="url(#hairGradM2)"/>
  <!-- Eyes -->
  <circle cx="53" cy="52" r="2" fill="#064e3b"/>
  <circle cx="67" cy="52" r="2" fill="#064e3b"/>
  <!-- Smile -->
  <path d="M55 62 Q60 65 65 62" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

const SVG_MALE_3 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradM3" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#7c2d12"/>
      <stop offset="65%" stop-color="#431407"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="hairGradM3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradM3)" stroke="#fb923c" stroke-width="2" stroke-opacity="0.5"/>
  <!-- Shoulders with jacket -->
  <path d="M32 98 C32 80 46 74 60 74 C74 74 88 80 88 98 Z" fill="#7c2d12"/>
  <!-- Face -->
  <polygon points="45,44 75,44 73,68 60,76 47,68" fill="#ffedd5"/>
  <!-- Spiky Hair -->
  <path d="M42 44 L48 30 L54 38 L60 28 L66 38 L72 30 L78 44 Z" fill="url(#hairGradM3)"/>
  <!-- Aviator Glasses -->
  <rect x="47" y="48" width="11" height="8" rx="2" fill="rgba(15,23,42,0.85)" stroke="#fb923c" stroke-width="1.5"/>
  <rect x="62" y="48" width="11" height="8" rx="2" fill="rgba(15,23,42,0.85)" stroke="#fb923c" stroke-width="1.5"/>
  <line x1="58" y1="51" x2="62" y2="51" stroke="#fb923c" stroke-width="1.5"/>
  <!-- Confident Grin -->
  <path d="M54 62 Q60 66 66 62" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

// 4. KIDS AVATARS
const SVG_KIDS_1 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bgGradK1" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="65%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="maneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bgGradK1)" stroke="#f59e0b" stroke-width="2.5" stroke-opacity="0.6"/>
  <!-- Leo Cartoon Lion Mane -->
  <circle cx="60" cy="58" r="32" fill="url(#maneGrad)"/>
  <!-- Lion Face -->
  <circle cx="60" cy="60" r="22" fill="#fef3c7"/>
  <!-- Ears -->
  <circle cx="42" cy="40" r="8" fill="#f59e0b"/>
  <circle cx="42" cy="40" r="5" fill="#fef3c7"/>
  <circle cx="78" cy="40" r="8" fill="#f59e0b"/>
  <circle cx="78" cy="40" r="5" fill="#fef3c7"/>
  <!-- Eyes -->
  <circle cx="53" cy="56" r="3.5" fill="#1e1b4b"/>
  <circle cx="54" cy="55" r="1" fill="#ffffff"/>
  <circle cx="67" cy="56" r="3.5" fill="#1e1b4b"/>
  <circle cx="68" cy="55" r="1" fill="#ffffff"/>
  <!-- Cute Nose & Smile -->
  <polygon points="60,63 56,60 64,60" fill="#78350f"/>
  <path d="M54 66 Q60 72 66 66" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'female' | 'male' | 'neutral' | 'kids';
  dataUri: string;
  description: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  // Neutral Presets
  {
    id: 'neutral-1',
    name: 'PrimeX Luminary',
    category: 'neutral',
    dataUri: createSvgDataUri(SVG_NEUTRAL_1),
    description: 'Cinematic cyan & cobalt signature emblem',
  },
  {
    id: 'neutral-2',
    name: 'CineMaster Reel',
    category: 'neutral',
    dataUri: createSvgDataUri(SVG_NEUTRAL_2),
    description: 'Golden popcorn & projector neon emblem',
  },
  {
    id: 'neutral-3',
    name: 'Sonic Persona',
    category: 'neutral',
    dataUri: createSvgDataUri(SVG_NEUTRAL_3),
    description: 'Clean minimalist audio & viewer persona',
  },

  // Female Presets
  {
    id: 'female-1',
    name: 'Aria (Cinephile)',
    category: 'female',
    dataUri: createSvgDataUri(SVG_FEMALE_1),
    description: 'Violet-rose streaming cinephile with headset',
  },
  {
    id: 'female-2',
    name: 'Maya (Sci-Fi)',
    category: 'female',
    dataUri: createSvgDataUri(SVG_FEMALE_2),
    description: 'Cyber-teal bob persona with futuristic accents',
  },
  {
    id: 'female-3',
    name: 'Tara (Golden)',
    category: 'female',
    dataUri: createSvgDataUri(SVG_FEMALE_3),
    description: 'Warm amber creative persona with stylish glasses',
  },

  // Male Presets
  {
    id: 'male-1',
    name: 'Rohan (Midnight)',
    category: 'male',
    dataUri: createSvgDataUri(SVG_MALE_1),
    description: 'Deep cobalt audiophile with studio headphones',
  },
  {
    id: 'male-2',
    name: 'Kabir (Arena)',
    category: 'male',
    dataUri: createSvgDataUri(SVG_MALE_2),
    description: 'Stadium emerald sports enthusiast persona',
  },
  {
    id: 'male-3',
    name: 'Vikram (Action)',
    category: 'male',
    dataUri: createSvgDataUri(SVG_MALE_3),
    description: 'Crimson-sunset adventure persona with aviator shades',
  },

  // Kids Preset
  {
    id: 'kids-1',
    name: 'Leo the Lion',
    category: 'kids',
    dataUri: createSvgDataUri(SVG_KIDS_1),
    description: 'Playful cartoon friend for Kids Mode',
  },
];

// Quick index maps
export const DEFAULT_NEUTRAL_AVATAR = AVATAR_PRESETS.find((p) => p.id === 'neutral-1')!.dataUri;
export const DEFAULT_FEMALE_AVATAR = AVATAR_PRESETS.find((p) => p.id === 'female-1')!.dataUri;
export const DEFAULT_MALE_AVATAR = AVATAR_PRESETS.find((p) => p.id === 'male-1')!.dataUri;
export const DEFAULT_KIDS_AVATAR = AVATAR_PRESETS.find((p) => p.id === 'kids-1')!.dataUri;

/**
 * Legacy hardcoded young male demo photo from Unsplash.
 * Must be identified and cleanly migrated/fallen back.
 */
export const LEGACY_BOY_AVATAR_SUBSTRINGS = [
  'photo-1535713875002-d1d0cf377fde',
];

export function isLegacyBoyAvatar(url: string | null | undefined): boolean {
  if (!url) return false;
  return LEGACY_BOY_AVATAR_SUBSTRINGS.some((sub) => url.includes(sub));
}

/**
 * Dynamic Avatar Resolution Algorithm:
 * 1. Custom uploaded/configured photo URL takes highest priority (if valid & not legacy boy photo).
 * 2. Explicitly selected preset avatar (`selectedAvatarPreset`).
 * 3. Explicit gender preference:
 *    - 'female' => DEFAULT_FEMALE_AVATAR
 *    - 'male'   => DEFAULT_MALE_AVATAR
 * 4. Kids Mode => DEFAULT_KIDS_AVATAR
 * 5. Existing avatar URL on profile (if NOT the legacy boy demo photo).
 * 6. Neutral Fallback => DEFAULT_NEUTRAL_AVATAR (Never guess from name/email/username).
 */
export function resolveUserAvatar(profile: Partial<UserProfile> | null | undefined): string {
  if (!profile) {
    return DEFAULT_NEUTRAL_AVATAR;
  }

  // 1. Custom user upload takes absolute highest priority
  if (profile.customAvatarUrl && profile.customAvatarUrl.trim()) {
    return profile.customAvatarUrl.trim();
  }

  // 2. Explicitly chosen preset
  if (profile.selectedAvatarPreset) {
    const found = AVATAR_PRESETS.find((p) => p.id === profile.selectedAvatarPreset);
    if (found) {
      return found.dataUri;
    }
  }

  // 3. Explicit gender preference (Strict: NEVER infer from name or email)
  if (profile.genderPreference === 'female') {
    return DEFAULT_FEMALE_AVATAR;
  }
  if (profile.genderPreference === 'male') {
    return DEFAULT_MALE_AVATAR;
  }

  // 4. Kids Profile
  if (profile.isKids) {
    return DEFAULT_KIDS_AVATAR;
  }

  // 5. Existing avatar (provided it is NOT the legacy boy photo)
  if (profile.avatar && !isLegacyBoyAvatar(profile.avatar)) {
    return profile.avatar;
  }

  // 6. Neutral default fallback for unspecified or non-binary accounts
  return DEFAULT_NEUTRAL_AVATAR;
}

/**
 * Generates an isolated storage key for each user account.
 * Ensures one user's avatar or profiles never bleed into another user's session.
 */
export function getAccountProfilesKey(email: string): string {
  return `hotstarx_user_profiles_v2_${email.trim().toLowerCase()}`;
}

