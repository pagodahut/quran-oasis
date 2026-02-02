import { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Read Quran',
  description: 'Read the Holy Quran with beautiful typography, translations, and audio recitations from renowned reciters. Navigate all 114 surahs with tajweed support.',
  openGraph: {
    title: 'Read Quran | HIFZ',
    description: 'Beautiful Quran reading experience with translations and audio recitations.',
    url: `${SITE_URL}/mushaf`,
  },
  twitter: {
    title: 'Read Quran | HIFZ',
    description: 'Beautiful Quran reading experience with translations and audio recitations.',
  },
  alternates: {
    canonical: `${SITE_URL}/mushaf`,
  },
};

export default function MushafLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
