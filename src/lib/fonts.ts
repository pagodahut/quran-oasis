import { Amiri, Noto_Naskh_Arabic, DM_Sans, DM_Serif_Display, Cormorant_Garamond } from 'next/font/google';

// Primary Arabic font for Quran text
export const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-arabic',
  preload: true,
});

// Secondary Arabic font
export const notoNaskhArabic = Noto_Naskh_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-quran',
  preload: true,
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
  dmSans.variable,
  dmSerifDisplay.variable,
  cormorantGaramond.variable,
].join(' ');
