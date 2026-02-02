import { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Detailed Progress',
  description: 'View detailed statistics about your Quran memorization journey including verses memorized, time spent, and learning patterns.',
  openGraph: {
    title: 'Detailed Progress | HIFZ',
    description: 'Comprehensive view of your Quran memorization statistics.',
    url: `${SITE_URL}/progress`,
  },
  twitter: {
    title: 'Detailed Progress | HIFZ',
    description: 'Comprehensive view of your Quran memorization statistics.',
  },
  alternates: {
    canonical: `${SITE_URL}/progress`,
  },
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
