import { Amiri, Noto_Naskh_Arabic, Noto_Nastaliq_Urdu, Scheherazade_New, DM_Sans, DM_Serif_Display, Cormorant_Garamond } from 'next/font/google';

// Primary Arabic font for Quran text (Uthmani style)
export const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-arabic',
  preload: true,
});

// Secondary Arabic font (Madina style)
export const notoNaskhArabic = Noto_Naskh_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-quran',
  preload: true,
});

// Indo-Pak / Nastaliq style font
export const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-indopak',
  preload: false, // Only load when selected
});

// Kitab / Modern style font
export const scheherazadeNew = Scheherazade_New({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-kitab',
  preload: false, // Only load when selected
});

// Sans-serif for UI
export const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Display font for headings
export const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Elegant serif for special text
export const cormorantGaramond = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

// Combined font variables for className
export const fontVariables = [
  amiri.variable,
  notoNaskhArabic.variable,
  notoNastaliqUrdu.variable,
  scheherazadeNew.variable,
  dmSans.variable,
  dmSerifDisplay.variable,
  cormorantGaramond.variable,
].join(' ');
