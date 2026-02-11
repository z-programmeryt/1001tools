export const languages = [
  ['en','English'],['bn','বাংলা'],['hi','हिंदी'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano'],['ja','日本語'],['ko','한국어'],['zh-CN','中文简体'],['zh-TW','中文繁體'],['ar','العربية'],['fa','فارسی'],['ur','اردو'],['tr','Türkçe'],['ru','Русский'],['th','ไทย'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['ms','Bahasa Melayu'],['nl','Nederlands'],['pl','Polski'],['uk','Українська'],['sv','Svenska']
];

const base = {
  navHome: 'Home', navTools: 'Tools', navPricing: 'Pricing', navAbout: 'About',
  heroTitle: 'Premium Global Tools Platform',
  heroSubtitle: 'Lightning-fast, beautifully animated, privacy-first tools built with custom code.',
  searchPlaceholder: 'Search tools...',
  todoTitle: 'Execution Roadmap',
  useTool: 'Use Tool',
  runTool: 'Run Tool (10 NP)',
  copied: 'Copied to clipboard',
};

const overrides = {
  bn: { heroTitle: 'প্রিমিয়াম গ্লোবাল টুলস প্ল্যাটফর্ম', searchPlaceholder: 'টুল খুঁজুন...' },
  hi: { heroTitle: 'प्रीमियम ग्लोबल टूल्स प्लेटफ़ॉर्म', searchPlaceholder: 'टूल खोजें...' },
  es: { heroTitle: 'Plataforma Premium de Herramientas Globales', searchPlaceholder: 'Buscar herramientas...' },
  fr: { heroTitle: 'Plateforme Premium d’Outils', searchPlaceholder: 'Rechercher des outils...' },
  ar: { heroTitle: 'منصة أدوات عالمية متميزة', searchPlaceholder: 'ابحث عن الأدوات...' }
};

export function getLocale() {
  const saved = localStorage.getItem('np:lang');
  if (saved) return saved;
  const browser = navigator.language;
  const match = languages.find(([code]) => code.toLowerCase() === browser.toLowerCase() || browser.toLowerCase().startsWith(code.toLowerCase()));
  return match?.[0] || 'en';
}

export function t(lang, key) {
  return overrides[lang]?.[key] || base[key] || key;
}

export function isRtl(lang) { return ['ar','fa','ur'].includes(lang); }
