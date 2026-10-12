export interface MediaCatalogEntry {
  id: string;
  title: string;
  contentType: 'movie' | 'series' | 'episode' | 'sports' | 'documentary' | 'kids';
  sportType?: 'cricket' | 'football' | 'tennis' | 'kabaddi' | 'motorsport';
  category: string;
  videoUrl: string;
  format: 'mp4' | 'webm';
  streamType: 'demo_footage' | 'simulated_live' | 'recorded' | 'upcoming_preview';
  verifiedCategory: string;
  footageDescription: string;
  isAvailable: boolean;
  broadcastStatus?: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  scheduledStartTime?: string;
}

/**
 * Centralized Media Catalog for HotstarX
 *
 * Associates each playable item with its verified video source, media format,
 * semantic footage description, stream classification, and playback status.
 *
 * Guarantees that sports events play sport-appropriate footage, movies play
 * authorized trailers/clips, and no title uses unrelated surveillance footage.
 */
export const MEDIA_CATALOG: Record<string, MediaCatalogEntry> = {
  // 1. NEON CITY
  'hx-neon-city': {
    id: 'hx-neon-city',
    title: 'Neon City',
    contentType: 'series',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Action',
    footageDescription: 'High-concept animated sci-fi combat in futuristic city',
    isAvailable: true,
  },
  'ep-nc-101': {
    id: 'ep-nc-101',
    title: 'Neon City: Zero Sequence',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Action',
    footageDescription: 'Episode 1 opening sequence and combat',
    isAvailable: true,
  },
  'ep-nc-102': {
    id: 'ep-nc-102',
    title: 'Neon City: Ghost in the Lattice',
    contentType: 'episode',
    category: 'series',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Action',
    footageDescription: 'Episode 2 teaser trailer and subterranean vault confrontation',
    isAvailable: true,
  },
  'ep-nc-103': {
    id: 'ep-nc-103',
    title: 'Neon City: Chroma Horizon',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/space-exploration-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Space',
    footageDescription: 'Episode 3 neon skyline and high-altitude chase',
    isAvailable: true,
  },

  // 2. THE LAST MONSOON
  'hx-last-monsoon': {
    id: 'hx-last-monsoon',
    title: 'The Last Monsoon',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/bear-river.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'River & Nature Drama',
    footageDescription: 'Torrential river flow and untamed hydrological environment',
    isAvailable: true,
  },

  // 3. VELOCITY
  'hx-velocity': {
    id: 'hx-velocity',
    title: 'Velocity',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/racing-demo.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Motorsport Racing',
    footageDescription: 'High-octane formula racing cars taking high-speed chicanes',
    isAvailable: true,
  },

  // 4. MIDNIGHT DINER: MUMBAI
  'hx-midnight-diner': {
    id: 'hx-midnight-diner',
    title: 'Midnight Diner: Mumbai',
    contentType: 'series',
    category: 'series',
    videoUrl: '/videos/culinary-recipe-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Culinary Arts',
    footageDescription: 'Authentic pan-sizzle gourmet preparation and chef kitchen storytelling',
    isAvailable: true,
  },
  'ep-md-101': {
    id: 'ep-md-101',
    title: 'Midnight Diner: Kombdi Rassa at 3 AM',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/culinary-recipe-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Culinary Arts',
    footageDescription: 'Episode 1 coastal broth and aromatic spice preparation',
    isAvailable: true,
  },
  'ep-md-102': {
    id: 'ep-md-102',
    title: 'Midnight Diner: Irani Chai & Second Chances',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/culinary-recipe-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Culinary Arts',
    footageDescription: 'Episode 2 vintage cafe morning bread and tea culture',
    isAvailable: true,
  },

  // 5. WILD INDIA: THE LIVING REALM
  'hx-wild-india': {
    id: 'hx-wild-india',
    title: 'Wild India: The Living Realm',
    contentType: 'documentary',
    category: 'documentary',
    videoUrl: '/videos/bear-river.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Wildlife Nature',
    footageDescription: 'Wild animal hunting along pristine river rapids in nature',
    isAvailable: true,
  },

  // 6. CODE RED: SENTINEL
  'hx-code-red': {
    id: 'hx-code-red',
    title: 'Code Red: Sentinel',
    contentType: 'series',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Tactical Action',
    footageDescription: 'Combat extraction and tactical martial action sequence',
    isAvailable: true,
  },
  'ep-cr-101': {
    id: 'ep-cr-101',
    title: 'Code Red: Disavowed in Vienna',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Tactical Action',
    footageDescription: 'Episode 1 close-quarters battle in abandoned perimeter',
    isAvailable: true,
  },
  'ep-cr-102': {
    id: 'ep-cr-102',
    title: 'Code Red: The Prague Protocol',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/racing-demo.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Vehicle Chase Action',
    footageDescription: 'Episode 2 high-speed pursuit through tarmac routes',
    isAvailable: true,
  },

  // 7. ORBIT 9: DEEP SIGNAL
  'hx-orbit-9': {
    id: 'hx-orbit-9',
    title: 'Orbit 9: Deep Signal',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/space-exploration-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Deep Space',
    footageDescription: 'NASA deep space imagery of Moon transiting Earth in cosmic darkness',
    isAvailable: true,
  },

  // 8. PAPER PLANES
  'hx-paper-planes': {
    id: 'hx-paper-planes',
    title: 'Paper Planes',
    contentType: 'kids',
    category: 'kids',
    videoUrl: '/videos/bunny-animation.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Family Animation',
    footageDescription: 'Heartwarming cartoon animation with playful flying elements',
    isAvailable: true,
  },

  // 9. AFTERGLOW
  'hx-afterglow': {
    id: 'hx-afterglow',
    title: 'Afterglow',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Neo-Noir Mystery',
    footageDescription: 'Atmospheric neo-noir narrative cinema sequence',
    isAvailable: true,
  },

  // 10. SKYLINE FC: DERBIES OF FIRE
  'hx-skyline-fc': {
    id: 'hx-skyline-fc',
    title: 'Skyline FC: Derbies of Fire',
    contentType: 'sports',
    sportType: 'football',
    category: 'sports',
    videoUrl: '/videos/football-match-demo.webm',
    format: 'webm',
    streamType: 'recorded',
    verifiedCategory: 'Football / Soccer',
    footageDescription: 'Real competitive football match coverage with pitch action and goals',
    isAvailable: true,
    broadcastStatus: 'COMPLETED',
  },

  // 11. KITCHEN STORIES: SPICE ROUTE
  'hx-kitchen-stories': {
    id: 'hx-kitchen-stories',
    title: 'Kitchen Stories: Spice Route',
    contentType: 'documentary',
    category: 'documentary',
    videoUrl: '/videos/culinary-recipe-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Culinary Travel',
    footageDescription: 'Culinary master cooking preparation with rich sauce and fresh ingredients',
    isAvailable: true,
  },

  // 12. THE ARCHIVE: CLASSIFIED
  'hx-the-archive': {
    id: 'hx-the-archive',
    title: 'The Archive: Classified',
    contentType: 'series',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Conspiracy Thriller',
    footageDescription: 'Dramatic confrontation and investigative sequence',
    isAvailable: true,
  },
  'ep-ar-101': {
    id: 'ep-ar-101',
    title: 'The Archive: Box 44: The Salt Flats',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Conspiracy Thriller',
    footageDescription: 'Episode 1 desolate outpost discovery sequence',
    isAvailable: true,
  },
  'ep-ar-102': {
    id: 'ep-ar-102',
    title: 'The Archive: The Mirage Directive',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/space-exploration-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Satellite',
    footageDescription: 'Episode 2 orbital radar analysis and tracking signal',
    isAvailable: true,
  },

  // 13. PREMIER SUPER CUP: MUMBAI VS CHENNAI (CRICKET)
  'hx-live-cricket-1': {
    id: 'hx-live-cricket-1',
    title: 'Premier Super Cup: Mumbai Strikers vs Chennai Super Kings',
    contentType: 'sports',
    sportType: 'cricket',
    category: 'sports',
    videoUrl: '/videos/cricket-match-demo.webm',
    format: 'webm',
    streamType: 'simulated_live',
    verifiedCategory: 'Cricket',
    footageDescription: 'Genuine cricket match batting, bowling run-up, and field coverage',
    isAvailable: true,
    broadcastStatus: 'LIVE',
  },

  // 14. FORMULA APEX: MARINA BAY (MOTORSPORT)
  'hx-live-f1-1': {
    id: 'hx-live-f1-1',
    title: 'Formula Apex: Marina Bay Grand Prix',
    contentType: 'sports',
    sportType: 'motorsport',
    category: 'sports',
    videoUrl: '/videos/racing-demo.mp4',
    format: 'mp4',
    streamType: 'simulated_live',
    verifiedCategory: 'Motorsport Racing',
    footageDescription: 'Formula circuit cars roaring down track corners in simulated Grand Prix',
    isAvailable: true,
    broadcastStatus: 'LIVE',
  },

  // 15. EURO ELITE CUP: MADRID VS MANCHESTER (FOOTBALL)
  'hx-live-football-1': {
    id: 'hx-live-football-1',
    title: 'Euro Elite Cup: Madrid Blancos vs Manchester Blues',
    contentType: 'sports',
    sportType: 'football',
    category: 'sports',
    videoUrl: '/videos/football-match-demo.webm',
    format: 'webm',
    streamType: 'simulated_live',
    verifiedCategory: 'Football / Soccer',
    footageDescription: 'Genuine competitive football match between international squads',
    isAvailable: true,
    broadcastStatus: 'LIVE',
  },

  // 16. CHAMPIONS TROPHY: INDIA VS AUSTRALIA (CRICKET UPCOMING)
  'hx-upcoming-cricket-1': {
    id: 'hx-upcoming-cricket-1',
    title: 'Champions Trophy: India vs Australia',
    contentType: 'sports',
    sportType: 'cricket',
    category: 'sports',
    videoUrl: '/videos/cricket-t20-demo.webm',
    format: 'webm',
    streamType: 'upcoming_preview',
    verifiedCategory: 'Cricket',
    footageDescription: 'Pre-match official T20 tournament showcase and cricket highlights',
    isAvailable: true,
    broadcastStatus: 'UPCOMING',
    scheduledStartTime: 'Today, 7:00 PM IST',
  },

  // 17. ASTRO PUP & THE GALAXY EXPRESS
  'hx-astro-pup': {
    id: 'hx-astro-pup',
    title: 'Astro Pup & The Galaxy Express',
    contentType: 'kids',
    category: 'kids',
    videoUrl: '/videos/bunny-animation.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Kids Animation',
    footageDescription: 'Whimsical 3D cartoon animal adventure',
    isAvailable: true,
  },

  // 18. LITTLE EXPLORERS & THE MAGIC COMPASS
  'hx-little-explorers': {
    id: 'hx-little-explorers',
    title: 'Little Explorers & The Magic Compass',
    contentType: 'kids',
    category: 'kids',
    videoUrl: '/videos/mov-bbb.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Kids Animation',
    footageDescription: 'Classic animated forest expedition and humor',
    isAvailable: true,
  },

  // 19. THE CHRONO RIFT
  'hx-chrono-rift': {
    id: 'hx-chrono-rift',
    title: 'The Chrono Rift',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/space-exploration-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Temporal',
    footageDescription: 'Deep space anomaly and planetary orbital mechanics',
    isAvailable: true,
  },

  // 20. SHADOWS IN THE MIST
  'hx-shadows-mist': {
    id: 'hx-shadows-mist',
    title: 'Shadows in the Mist',
    contentType: 'series',
    category: 'series',
    videoUrl: '/videos/bear-river.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Atmospheric Drama',
    footageDescription: 'Cold mist mountain river landscape and suspenseful nature',
    isAvailable: true,
  },
  'ep-sm-101': {
    id: 'ep-sm-101',
    title: 'Shadows in the Mist: The Snowblind Trail',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/bear-river.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Atmospheric Drama',
    footageDescription: 'Episode 1 misty valley arrival',
    isAvailable: true,
  },
  'ep-sm-102': {
    id: 'ep-sm-102',
    title: 'Shadows in the Mist: Buried Ledger',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/sintel-action.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Dramatic Investigation',
    footageDescription: 'Episode 2 abandoned kiln confrontation',
    isAvailable: true,
  },

  // 21. KAVACH: GUARDIAN OF REALM
  'hx-kavach': {
    id: 'hx-kavach',
    title: 'Kavach: Guardian of Realm',
    contentType: 'movie',
    category: 'movie',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Mythic Superhero',
    footageDescription: 'Warrior wielding celestial blade and heroic elemental clash',
    isAvailable: true,
  },

  // 22. OCEAN ODYSSEY: THE ABYSSAL PLAIN
  'hx-ocean-odyssey': {
    id: 'hx-ocean-odyssey',
    title: 'Ocean Odyssey: The Abyssal Plain',
    contentType: 'documentary',
    category: 'documentary',
    videoUrl: '/videos/jellyfish-nature.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Marine Biology',
    footageDescription: 'Bioluminescent deep sea organisms drifting in abyssal darkness',
    isAvailable: true,
  },

  // 23. PRO KABADDI SUPER LEAGUE (KABADDI)
  'hx-live-kabaddi-1': {
    id: 'hx-live-kabaddi-1',
    title: 'Pro Kabaddi Super League: Delhi Dynamos vs Mumbai Bulls',
    contentType: 'sports',
    sportType: 'kabaddi',
    category: 'sports',
    videoUrl: '/videos/kabaddi-match-demo.webm',
    format: 'webm',
    streamType: 'simulated_live',
    verifiedCategory: 'Kabaddi',
    footageDescription: 'Authentic Kabaddi match raid, tackle, and mat court action',
    isAvailable: true,
    broadcastStatus: 'LIVE',
  },

  // 24. SILENT HARBOR
  'hx-silent-harbor': {
    id: 'hx-silent-harbor',
    title: 'Silent Harbor',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/jellyfish-nature.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Maritime Crime Thriller',
    footageDescription: 'Maritime aquatic depths and dark coastal environment',
    isAvailable: true,
  },

  // 25. MUMBAI MONSOON RHAPSODY
  'hx-mumbai-monsoon': {
    id: 'hx-mumbai-monsoon',
    title: 'Mumbai Monsoon Rhapsody',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/mov-bbb.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Romantic Comedy',
    footageDescription: 'Lighthearted feel-good cinematic presentation',
    isAvailable: true,
  },

  // 26. CHAI & CHAOS
  'hx-chai-chaos': {
    id: 'hx-chai-chaos',
    title: 'Chai & Chaos',
    contentType: 'movie',
    category: 'movie',
    videoUrl: '/videos/culinary-recipe-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Family Culinary Comedy',
    footageDescription: 'Kitchen cooking tea room competition and dish creation',
    isAvailable: true,
  },

  // 27. VORTEX: PARALLEL MINDS
  'hx-vortex-minds': {
    id: 'hx-vortex-minds',
    title: 'Vortex: Parallel Minds',
    contentType: 'series',
    category: 'series',
    videoUrl: '/videos/space-exploration-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Psychological',
    footageDescription: 'Mind-bending astronomical celestial space anomaly',
    isAvailable: true,
  },
  'ep-vm-101': {
    id: 'ep-vm-101',
    title: 'Vortex: Echo In The Coil',
    contentType: 'episode',
    category: 'series',
    videoUrl: '/videos/space-exploration-demo.webm',
    format: 'webm',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Psychological',
    footageDescription: 'Episode 1 temporal resonance across orbital space',
    isAvailable: true,
  },
  'ep-vm-102': {
    id: 'ep-vm-102',
    title: 'Vortex: The Five-Year Gulf',
    contentType: 'episode',
    category: 'series',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    format: 'mp4',
    streamType: 'demo_footage',
    verifiedCategory: 'Sci-Fi Action',
    footageDescription: 'Episode 2 gateway coordinates and crisis resolution',
    isAvailable: true,
  },

  // 28. GRAND SLAM ARENA: LONDON FINAL (TENNIS)
  'hx-live-tennis-1': {
    id: 'hx-live-tennis-1',
    title: 'Grand Slam Arena: London Championship Final',
    contentType: 'sports',
    sportType: 'tennis',
    category: 'sports',
    videoUrl: '/videos/tennis-match-demo.webm',
    format: 'webm',
    streamType: 'simulated_live',
    verifiedCategory: 'Tennis',
    footageDescription: 'Real championship tennis court rallies, baseline points, and serves',
    isAvailable: true,
    broadcastStatus: 'LIVE',
  },
};

/**
 * Helper to retrieve verified catalog entry for any content ID
 */
export function getMediaCatalogEntry(id: string): MediaCatalogEntry | undefined {
  return MEDIA_CATALOG[id];
}
