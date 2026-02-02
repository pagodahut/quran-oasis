import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Generate sitemap dynamically
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  
  // Static pages
  const staticPages = [
    '',
    '/lessons',
    '/mushaf',
    '/profile',
    '/progress',
    '/settings',
    '/bookmarks',
    '/surahs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Generate lesson pages (1-20 for now)
  const lessonPages = Array.from({ length: 20 }, (_, i) => ({
    url: `${baseUrl}/lessons/lesson-${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Generate surah pages (1-114)
  const surahPages = Array.from({ length: 114 }, (_, i) => ({
    url: `${baseUrl}/mushaf?surah=${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...lessonPages, ...surahPages];
}
