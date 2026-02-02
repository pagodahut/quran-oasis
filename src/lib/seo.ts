/**
 * SEO Constants and Utilities for HIFZ
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hifz.app';
export const SITE_NAME = 'HIFZ';

export const defaultMeta = {
  title: 'HIFZ — Memorize the Quran | Free AI-Powered Learning',
  description: 'Master Quran memorization with AI-powered lessons, spaced repetition, beautiful recitations & tajweed training. Start your journey to becoming a Hafiz today — completely free.',
  keywords: [
    'hifz',
    'quran memorization',
    'quran hifz',
    'memorize quran',
    'tajweed',
    'islamic learning',
    'quran app',
    'arabic learning',
    'hafiz',
    'quran recitation',
    'spaced repetition quran',
    'learn quran online',
    'quran for beginners',
    'free quran app',
    'muslim app',
  ],
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: defaultMeta.description,
  sameAs: [],
};

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: defaultMeta.description,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'AI-powered personalized lessons',
    'Spaced repetition memorization',
    'Tajweed training with feedback',
    'Beautiful Quran recitations',
    'Progress tracking',
    'Offline support',
  ],
};

export const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Quran Memorization Course',
  description: 'Complete Quran memorization curriculum from beginner to hafiz',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  isAccessibleForFree: true,
  educationalLevel: 'Beginner to Advanced',
  inLanguage: ['en', 'ar'],
  teaches: [
    'Arabic alphabet',
    'Quran reading',
    'Tajweed rules',
    'Quran memorization',
    'Proper recitation',
  ],
};

// Surah names for dynamic meta
export const SURAH_NAMES: Record<number, { english: string; arabic: string; meaning: string }> = {
  1: { english: 'Al-Fatihah', arabic: 'الفاتحة', meaning: 'The Opening' },
  2: { english: 'Al-Baqarah', arabic: 'البقرة', meaning: 'The Cow' },
  3: { english: "Al-'Imran", arabic: 'آل عمران', meaning: 'The Family of Imran' },
  4: { english: "An-Nisa'", arabic: 'النساء', meaning: 'The Women' },
  5: { english: "Al-Ma'idah", arabic: 'المائدة', meaning: 'The Table Spread' },
  // Add more as needed - abbreviated for brevity
  36: { english: 'Ya-Sin', arabic: 'يس', meaning: 'Ya-Sin' },
  55: { english: 'Ar-Rahman', arabic: 'الرحمن', meaning: 'The Most Merciful' },
  67: { english: 'Al-Mulk', arabic: 'الملك', meaning: 'The Sovereignty' },
  112: { english: 'Al-Ikhlas', arabic: 'الإخلاص', meaning: 'Sincerity' },
  113: { english: 'Al-Falaq', arabic: 'الفلق', meaning: 'The Daybreak' },
  114: { english: 'An-Nas', arabic: 'الناس', meaning: 'Mankind' },
};

export function getSurahMeta(surahNumber: number) {
  const surah = SURAH_NAMES[surahNumber];
  if (!surah) {
    return {
      title: `Surah ${surahNumber} | HIFZ`,
      description: `Read and memorize Surah ${surahNumber} with HIFZ's AI-powered learning tools.`,
    };
  }
  return {
    title: `${surah.english} (${surah.arabic}) | HIFZ`,
    description: `Read, listen, and memorize ${surah.english} - "${surah.meaning}" with beautiful recitations and tajweed guidance.`,
  };
}
