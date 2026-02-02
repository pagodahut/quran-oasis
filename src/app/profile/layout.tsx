import { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Your Progress',
  description: 'Track your Quran memorization journey. View your streak, achievements, completed lessons, and daily goals.',
  openGraph: {
    title: 'Your Progress | HIFZ',
    description: 'Track your Quran memorization progress and achievements.',
    url: `${SITE_URL}/profile`,
  },
  twitter: {
    title: 'Your Progress | HIFZ',
    description: 'Track your Quran memorization progress and achievements.',
  },
  alternates: {
    canonical: `${SITE_URL}/profile`,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
