import { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Lessons',
  description: 'Master Quran memorization through structured lessons. Learn the Arabic alphabet, reading skills, tajweed rules, and memorization techniques.',
  openGraph: {
    title: 'Quran Lessons | HIFZ',
    description: 'Structured lessons to help you memorize the Quran step by step.',
    url: `${SITE_URL}/lessons`,
  },
  twitter: {
    title: 'Quran Lessons | HIFZ',
    description: 'Structured lessons to help you memorize the Quran step by step.',
  },
  alternates: {
    canonical: `${SITE_URL}/lessons`,
  },
};
