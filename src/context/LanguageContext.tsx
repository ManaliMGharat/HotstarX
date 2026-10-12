import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'bn' | 'mr' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    home: 'Home',
    movies: 'Movies',
    shows: 'Shows',
    sports: 'Sports',
    live: 'Live',
    originals: 'Originals',
    myList: 'My List',
    continueWatching: 'Continue Watching',
    plans: 'Plans',
    settings: 'Settings',
    search: 'Search',
    language: 'Language',
    notifications: 'Notifications',
    profile: 'Profile',
    watchNow: 'Watch Now',
    addToList: 'Add to List',
    inList: 'In Watchlist',
    moreInfo: 'More Info',
    trendingNow: 'Trending Now',
    hotstarxOriginals: 'HotstarX Originals',
    liveSports: 'Live Sports',
    topPicks: 'Top Picks For You',
    popularShows: 'Popular Shows',
    popularMovies: 'Popular Movies',
    newReleases: 'New Releases',
    upcomingSports: 'Upcoming Sports',
    indianCinema: 'Indian Cinema & Prestige Dramas',
    actionThrillers: 'Action & High Octane Thrillers',
    documentaries: 'Documentaries & Real Stories',
    kidsFamily: 'Kids & Family Fun',
    exploreAll: 'Explore All',
    upgrade: 'Upgrade',
    switchProfile: 'Switch Profile',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    episodes: 'Episodes',
    moreLikeThis: 'More Like This',
  },
  hi: {
    home: 'होम',
    movies: 'फ़िल्में',
    shows: 'शोज़',
    sports: 'स्पोर्ट्स',
    live: 'लाइव',
    originals: 'ओरिजिनल्स',
    myList: 'मेरी लिस्ट',
    continueWatching: 'देखना जारी रखें',
    plans: 'प्लान्स',
    settings: 'सेटिंग्स',
    search: 'खोजें',
    language: 'भाषा',
    notifications: 'नोटिफिकेशन',
    profile: 'प्रोफ़ाइल',
    watchNow: 'अभी देखें',
    addToList: 'लिस्ट में जोड़ें',
    inList: 'लिस्ट में शामिल',
    moreInfo: 'और जानें',
    trendingNow: 'ट्रेंडिंग में',
    hotstarxOriginals: 'HotstarX ओरिजिनल्स',
    liveSports: 'लाइव स्पोर्ट्स',
    topPicks: 'आपके लिए टॉप पिक्स',
    popularShows: 'लोकप्रिय शोज़',
    popularMovies: 'लोकप्रिय फ़िल्में',
    newReleases: 'नई रिलीज़',
    upcomingSports: 'आगामी मैच',
    indianCinema: 'भारतीय सिनेमा एवं ड्रामा',
    actionThrillers: 'एक्शन और रोमांचक थ्रिलर',
    documentaries: 'डॉक्यूमेंट्री और सच्ची कहानियाँ',
    kidsFamily: 'किड्स और फैमिली मनोरंजन',
    exploreAll: 'सभी देखें',
    upgrade: 'अपग्रेड करें',
    switchProfile: 'प्रोफ़ाइल बदलें',
    signOut: 'लॉग आउट',
    signIn: 'लॉग इन करें',
    episodes: 'एपिसोड्स',
    moreLikeThis: 'इस तरह के और',
  },
  ta: {
    home: 'முகப்பு',
    movies: 'திரைப்படங்கள்',
    shows: 'நிகழ்ச்சிகள்',
    sports: 'விளையாட்டு',
    live: 'நேரலை',
    originals: 'ஒரிஜினல்ஸ்',
    myList: 'என் பட்டியல்',
    continueWatching: 'தொடர்ந்து பார்க்கவும்',
    plans: 'திட்டங்கள்',
    settings: 'அமைப்புகள்',
    search: 'தேடுக',
    language: 'மொழி',
    notifications: 'அறிவிப்புகள்',
    profile: 'சுயவிவரம்',
    watchNow: 'இப்போதே பார்க்க',
    addToList: 'பட்டியலில் சேர்க்க',
    inList: 'பட்டியலில் உள்ளது',
    moreInfo: 'மேலும் தகவல்',
    trendingNow: 'தற்போது பிரபலமானது',
    hotstarxOriginals: 'HotstarX ஒரிஜினல்ஸ்',
    liveSports: 'நேரலை விளையாட்டு',
    topPicks: 'சிறந்த தேர்வுகள்',
    popularShows: 'பிரபல தொடர்கள்',
    popularMovies: 'பிரபல திரைப்படங்கள்',
    newReleases: 'புதிய வெளியீடுகள்',
    upcomingSports: 'வரவிருக்கும் போட்டிகள்',
    indianCinema: 'இந்திய சினிமா',
    actionThrillers: 'அதிரடி திரைப்படங்கள்',
    documentaries: 'ஆவணப்படங்கள்',
    kidsFamily: 'குழந்தைகள் & குடும்பம்',
    exploreAll: 'அனைத்தையும் பார்க்க',
    upgrade: 'மேம்படுத்து',
    switchProfile: 'சுயவிவரம் மாற்று',
    signOut: 'வெளியேறு',
    signIn: 'உள்நுழைக',
    episodes: 'அத்தியாயங்கள்',
    moreLikeThis: 'இதுபோன்றவை',
  },
  te: {
    home: 'హోమ్',
    movies: 'సినిమాలు',
    shows: 'షోలు',
    sports: 'క్రీడలు',
    live: 'లైవ్',
    originals: 'ఒరిజినల్స్',
    myList: 'నా లిస్ట్',
    continueWatching: 'చూడటం కొనసాగించండి',
    plans: 'ప్లాన్‌లు',
    settings: 'సెట్టింగ్‌లు',
    search: 'వెతకండి',
    language: 'భాష',
    notifications: 'నోటిఫికేషన్లు',
    profile: 'ప్రొఫైల్',
    watchNow: 'ఇప్పుడే చూడండి',
    addToList: 'లిస్ట్‌లో చేర్చండి',
    inList: 'లిస్ట్‌లో ఉంది',
    moreInfo: 'మరింత సమాచారం',
    trendingNow: 'ట్రెండింగ్‌లో ఉన్నవి',
    hotstarxOriginals: 'HotstarX ఒరిజినల్స్',
    liveSports: 'లైవ్ స్పోర్ట్స్',
    topPicks: 'మీ కోసం టాప్ ఎంపికలు',
    popularShows: 'పాపులర్ షోలు',
    popularMovies: 'పాపులర్ సినిమాలు',
    newReleases: 'కొత్త విడుదలలు',
    upcomingSports: 'రాబోయే మ్యాచ్‌లు',
    indianCinema: 'భారతీయ సినిమా',
    actionThrillers: 'యాక్షన్ & థ్రిల్లర్స్',
    documentaries: 'డాక్యుమెంటరీలు',
    kidsFamily: 'కిడ్స్ & ఫ్యామిలీ',
    exploreAll: 'అన్నీ చూడండి',
    upgrade: 'అప్‌గ్రేడ్',
    switchProfile: 'ప్రొఫైల్ మార్చండి',
    signOut: 'లాగ్ అవుట్',
    signIn: 'సైన్ ఇన్',
    episodes: 'ఎపిసోడ్‌లు',
    moreLikeThis: 'ఇలాంటి మరిన్ని',
  },
  ml: {
    home: 'ഹോം',
    movies: 'സിനിമകൾ',
    shows: 'ഷോകൾ',
    sports: 'കായികം',
    live: 'തത്സമയം',
    originals: 'ഒറിജിനൽസ്',
    myList: 'എന്റെ ലിസ്റ്റ്',
    continueWatching: 'തുടർന്നു കാണുക',
    plans: 'പ്ലാനുകൾ',
    settings: 'ക്രമീകരണങ്ങൾ',
    search: 'തിരയുക',
    language: 'ഭാഷ',
    notifications: 'അറിയിപ്പുകൾ',
    profile: 'പ്രൊഫൈൽ',
    watchNow: 'ഇപ്പോൾ കാണുക',
    addToList: 'ലിസ്റ്റിലേക്ക് ചേർക്കുക',
    inList: 'ലിസ്റ്റിൽ ഉണ്ട്',
    moreInfo: 'കൂടുതൽ വിവരങ്ങൾ',
    trendingNow: 'ട്രെൻഡിംഗ്',
    hotstarxOriginals: 'HotstarX ഒറിജിനൽസ്',
    liveSports: 'തത്സമയ കായികം',
    topPicks: 'പ്രത്യേക തിരഞ്ഞെടുപ്പുകൾ',
    popularShows: 'ജനപ്രിയ ഷോകൾ',
    popularMovies: 'ജനപ്രിയ സിനിമകൾ',
    newReleases: 'പുതിയ റിലീസുകൾ',
    upcomingSports: 'വരാനിരിക്കുന്ന മത്സരങ്ങൾ',
    indianCinema: 'ഇന്ത്യൻ സിനിമ',
    actionThrillers: 'ആക്ഷൻ ത്രില്ലറുകൾ',
    documentaries: 'ഡോക്യുമെന്ററികൾ',
    kidsFamily: 'കുട്ടികളും കുടുംബവും',
    exploreAll: 'എല്ലാം കാണുക',
    upgrade: 'അപ്ഗ്രേഡ് ചെയ്യുക',
    switchProfile: 'പ്രൊഫൈൽ മാറ്റുക',
    signOut: 'പുറത്തുകടക്കുക',
    signIn: 'സൈൻ ഇൻ',
    episodes: 'എപ്പിസോഡുകൾ',
    moreLikeThis: 'സമാനമായവ',
  },
  bn: {
    home: 'হোম',
    movies: 'সিনেমা',
    shows: 'শো',
    sports: 'খেলাধুলা',
    live: 'সরাসরি লাইভ',
    originals: 'অরিজিনালস',
    myList: 'আমার তালিকা',
    continueWatching: 'দেখা চালিয়ে যান',
    plans: 'প্ল্যান',
    settings: 'সেটিংস',
    search: 'অনুসন্ধান',
    language: 'ভাষা',
    notifications: 'বিজ্ঞপ্তি',
    profile: 'প্রোফাইল',
    watchNow: 'এখন দেখুন',
    addToList: 'তালিকায় যোগ করুন',
    inList: 'তালিকায় রয়েছে',
    moreInfo: 'আরও তথ্য',
    trendingNow: 'জনপ্রিয় ট্রেন্ডিং',
    hotstarxOriginals: 'HotstarX অরিজিনালস',
    liveSports: 'সরাসরি খেলা',
    topPicks: 'সেরা বাছাই',
    popularShows: 'জনপ্রিয় শো',
    popularMovies: 'জনপ্রিয় সিনেমা',
    newReleases: 'নতুন রিলিজ',
    upcomingSports: 'আসন্ন ম্যাচ',
    indianCinema: 'ভারতীয় সিনেমা',
    actionThrillers: 'অ্যাকশন ও থ্রিলার',
    documentaries: 'ডকুমেন্টারি',
    kidsFamily: 'শিশু ও পরিবার',
    exploreAll: 'সব দেখুন',
    upgrade: 'আপগ্রেড করুন',
    switchProfile: 'প্রোফাইল বদলান',
    signOut: 'সাইন আউট',
    signIn: 'সাইন ইন',
    episodes: 'পর্বসমূহ',
    moreLikeThis: 'এরকম আরও',
  },
  mr: {
    home: 'होम',
    movies: 'चित्रपट',
    shows: 'शो',
    sports: 'क्रीडा',
    live: 'लाइव्ह',
    originals: 'ओरिजिनल्स',
    myList: 'माझी यादी',
    continueWatching: 'पाहणे चालू ठेवा',
    plans: 'प्लॅन्स',
    settings: 'सेटिंग्ज',
    search: 'शोधा',
    language: 'भाषा',
    notifications: 'सूचना',
    profile: 'प्रोफाइल',
    watchNow: 'आता पहा',
    addToList: 'यादीत जोडा',
    inList: 'यादीत आहे',
    moreInfo: 'अधिक माहिती',
    trendingNow: 'ट्रेंडिंग मध्ये',
    hotstarxOriginals: 'HotstarX ओरिजिनल्स',
    liveSports: 'लाइव्ह क्रीडा',
    topPicks: 'तुमच्यासाठी खास',
    popularShows: 'लोकप्रिय शो',
    popularMovies: 'लोकप्रिय चित्रपट',
    newReleases: 'नवीन प्रदर्शित',
    upcomingSports: 'आगामी सामने',
    indianCinema: 'भारतीय सिनेमा',
    actionThrillers: 'अ‍ॅक्शन व थ्रिलर',
    documentaries: 'माहितीपट',
    kidsFamily: 'मुले आणि कुटुंब',
    exploreAll: 'सर्व पहा',
    upgrade: 'अपग्रेड करा',
    switchProfile: 'प्रोफाइल बदला',
    signOut: 'साइन आउट',
    signIn: 'साइन इन',
    episodes: 'भाग',
    moreLikeThis: 'यासारखे इतर',
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    movies: 'ಸಿನಿಮಾಗಳು',
    shows: 'ಶೋಗಳು',
    sports: 'ಕ್ರೀಡೆಗಳು',
    live: 'ಲೈವ್',
    originals: 'ಒರಿಜಿನಲ್ಸ್',
    myList: 'ನನ್ನ ಪಟ್ಟಿ',
    continueWatching: 'ವೀಕ್ಷಣೆ ಮುಂದುವರಿಸಿ',
    plans: 'ಪ್ಲಾನ್‌ಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    search: 'ಹುಡುಕಿ',
    language: 'ಭಾಷೆ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    watchNow: 'ಈಗ ವೀಕ್ಷಿಸಿ',
    addToList: 'ಪಟ್ಟಿಗೆ ಸೇರಿಸಿ',
    inList: 'ಪಟ್ಟಿಯಲ್ಲಿದೆ',
    moreInfo: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ',
    trendingNow: 'ಟ್ರೆಂಡಿಂಗ್‌ನಲ್ಲಿರುವವು',
    hotstarxOriginals: 'HotstarX ಒರಿಜಿನಲ್ಸ್',
    liveSports: 'ಲೈವ್ ಕ್ರೀಡೆ',
    topPicks: 'ನಿಮಗಾಗಿ ಉನ್ನತ ಆಯ್ಕೆಗಳು',
    popularShows: 'ಜನಪ್ರಿಯ ಶೋಗಳು',
    popularMovies: 'ಜನಪ್ರಿಯ ಸಿನಿಮಾಗಳು',
    newReleases: 'ಹೊಸ ಬಿಡುಗಡೆಗಳು',
    upcomingSports: 'ಮುಂಬರುವ ಪಂದ್ಯಗಳು',
    indianCinema: 'ಭಾರತೀಯ ಚಿತ್ರರಂಗ',
    actionThrillers: 'ಆಕ್ಷನ್ & ಥ್ರಿಲ್ಲರ್ಸ್',
    documentaries: 'ಸಾಕ್ಷ್ಯಚಿತ್ರಗಳು',
    kidsFamily: 'ಮಕ್ಕಳು ಮತ್ತು ಕುಟುಂಬ',
    exploreAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
    upgrade: 'ಅಪ್‌ಗ್ರೇಡ್',
    switchProfile: 'ಪ್ರೊಫೈಲ್ ಬದಲಾಯಿಸಿ',
    signOut: 'ಸೈನ್ ಔಟ್',
    signIn: 'ಸೈನ್ ಇನ್',
    episodes: 'ಸಂಚಿಕೆಗಳು',
    moreLikeThis: 'ಇಂತಹ ಇನ್ನಷ್ಟು',
  },
};

interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguageByCode: (code: LanguageCode) => void;
  setLanguageByName: (name: string) => void;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'hotstarx_ui_language_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCode, setCurrentCode] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      return SUPPORTED_LANGUAGES.some((l) => l.code === saved) ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentCode);
    } catch (e) {
      console.warn('Could not save language preference', e);
    }
  }, [currentCode]);

  const setLanguageByCode = useCallback((code: LanguageCode) => {
    setCurrentCode(code);
  }, []);

  const setLanguageByName = useCallback((name: string) => {
    const found = SUPPORTED_LANGUAGES.find(
      (l) => l.name.toLowerCase() === name.toLowerCase() || l.native === name
    );
    if (found) {
      setCurrentCode(found.code);
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langMap = TRANSLATIONS[currentCode] || TRANSLATIONS.en;
      return langMap[key] || TRANSLATIONS.en[key] || fallback || key;
    },
    [currentCode]
  );

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguageByCode,
        setLanguageByName,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
