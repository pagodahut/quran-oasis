# HIFZ App Codebase Export
Generated: 2026-02-07

## File Tree

```
src/middleware.ts
src/app/robots.ts
src/app/settings/loading.tsx
src/app/settings/page.tsx
src/app/progress/layout.tsx
src/app/progress/error.tsx
src/app/progress/loading.tsx
src/app/progress/page.tsx
src/app/memorize/[surah]/[ayah]/page.tsx
src/app/recite/page.tsx
src/app/opengraph-image.tsx
src/app/brand/page.tsx
src/app/dashboard/page.tsx
src/app/bookmarks/loading.tsx
src/app/bookmarks/page.tsx
src/app/profile/layout.tsx
src/app/profile/error.tsx
src/app/profile/loading.tsx
src/app/profile/page.tsx
src/app/sitemap.ts
src/app/layout.tsx
src/app/error.tsx
src/app/lessons/layout.tsx
src/app/lessons/error.tsx
src/app/lessons/loading.tsx
src/app/lessons/metadata.ts
src/app/lessons/[id]/layout.tsx
src/app/lessons/[id]/error.tsx
src/app/lessons/[id]/loading.tsx
src/app/lessons/[id]/page.tsx
src/app/lessons/[id]/not-found.tsx
src/app/lessons/page.tsx
src/app/api/deepgram/token/route.ts
src/app/api/user/sync/route.ts
src/app/api/sheikh/route.ts
src/app/api/transcribe/route.ts
src/app/api/onboarding/route.ts
src/app/api/tajweed/analyze/route.ts
src/app/twitter-image.tsx
src/app/loading.tsx
src/app/surahs/loading.tsx
src/app/surahs/page.tsx
src/app/mushaf/layout.tsx
src/app/mushaf/error.tsx
src/app/mushaf/loading.tsx
src/app/mushaf/page.tsx
src/app/practice/flashcards/page.tsx
src/app/practice/error.tsx
src/app/practice/loading.tsx
src/app/practice/page.tsx
src/app/page.tsx
src/app/sheikh/page.tsx
src/app/globals.css
src/app/onboarding/welcome/page.tsx
src/app/onboarding/page.tsx
src/app/global-error.tsx
src/app/offline/page.tsx
src/app/not-found.tsx
src/app/techniques/loading.tsx
src/app/techniques/page.tsx
src/components/MarkdownContent.tsx
src/components/JsonLd.tsx
src/components/FlashcardSession.tsx
src/components/QuranSearch.tsx
src/components/AudioPlayer.tsx
src/components/TafsirDrawer.tsx
src/components/JourneyMap.tsx
src/components/PageTransition.tsx
src/components/LessonContentRenderer.tsx
src/components/Celebrations.tsx
src/components/MemorizationPractice.tsx
src/components/SkipToContent.tsx
src/components/ServiceWorkerRegistration.tsx
src/components/BottomNav.tsx
src/components/WordByWord.tsx
src/components/brand/README.md
src/components/brand/concepts/LogoConcept6-MinimalQuran.tsx
src/components/brand/concepts/LogoConcept5-HifzShield.tsx
src/components/brand/concepts/LogoConcept3-CrescentBook.tsx
src/components/brand/concepts/LogoConcept2-BoldHa.tsx
src/components/brand/concepts/index.ts
src/components/brand/concepts/LogoConcept4-RadiantQuran.tsx
src/components/brand/concepts/LogoConcept1-OpenQuran.tsx
src/components/brand/index.ts
src/components/brand/HifzLogo.tsx
src/components/InstallPrompt.tsx
src/components/ErrorFallback.tsx
src/components/WordByWordInline.tsx
src/components/LiveRecitation.tsx
src/components/LessonCompletionOverlay.tsx
src/components/TajweedPractice.tsx
src/components/dynamic.tsx
src/components/TajweedText.tsx
src/components/SheikhChat.tsx
src/components/SyncProvider.tsx
src/components/ShareButton.tsx
src/components/ArabicText.tsx
src/components/OfflineIndicator.tsx
src/components/AskSheikhButton.tsx
src/components/WordTracker.tsx
src/components/Toast.tsx
src/components/EmptyState.tsx
src/components/Skeleton.tsx
src/components/LazyMotion.tsx
src/components/tajweed/TajweedHighlight.tsx
src/components/tajweed/RuleFlowchart.tsx
src/components/tajweed/index.ts
src/components/tajweed/MakhrajDiagram.tsx
src/hooks/useSheikhChat.ts
src/hooks/useRealtimeTajweed.ts
src/hooks/useLearningMode.ts
src/hooks/useTheme.ts
src/hooks/index.ts
src/hooks/useAppliedPreferences.ts
src/hooks/useNetworkStatus.ts
src/lib/vocabularyAudioService.ts
src/lib/prisma.ts
src/lib/tajweedService.ts
src/lib/advanced-lessons.ts
src/lib/fonts.ts
src/lib/audioService.ts
src/lib/offlineSync.ts
src/lib/intermediate-lessons.ts
src/lib/apiErrors.ts
src/lib/bookmarks.ts
src/lib/lessonPlanner.ts
src/lib/motivationStore.ts
src/lib/preferencesStore.ts
src/lib/settings.ts
src/lib/spacedRepetition-manus.ts
src/lib/wordTimingService.ts
src/lib/realtimeTajweedService.ts
src/lib/arabicAudio.ts
src/lib/quran.ts
src/lib/quranData.ts
src/lib/audio-service.ts
src/lib/audioPreload.ts
src/lib/flashcardSystem.ts
src/lib/progressStore.ts
src/lib/useSync.ts
src/lib/logger.ts
src/lib/tafsirService.ts
src/lib/quranAudioService.ts
src/lib/memorizationSystem.ts
src/lib/tajweed-rules.ts
src/lib/practice-drills.ts
src/lib/quranTajweedApi.ts
src/lib/seo.ts
src/lib/tajweedColorMap.ts
src/lib/lesson-content.ts
src/lib/learningMode.ts
src/lib/sheikh-prompt.ts
src/lib/surahMetadata.ts
src/lib/spacedRepetition.ts
src/lib/memorization-flow.ts
src/data/complete_quran.json
src/data/surahs.ts
```

---

## src/app/layout.tsx

```tsx
// Force dynamic rendering for all pages - Clerk needs runtime context
export const dynamic = 'force-dynamic';

import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { SyncProvider, SyncIndicator } from '@/components/SyncProvider';
import { ToastProvider } from '@/components/Toast';
import InstallPrompt from '@/components/InstallPrompt';
import OfflineIndicator from '@/components/OfflineIndicator';
import SkipToContent from '@/components/SkipToContent';
import { fontVariables } from '@/lib/fonts';
import JsonLd from '@/components/JsonLd';
import { 
  SITE_URL, 
  SITE_NAME, 
  defaultMeta, 
  organizationSchema, 
  webApplicationSchema, 
  courseSchema 
} from '@/lib/seo';
import './globals.css';

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultMeta.title,
    template: '%s | HIFZ',
  },
  description: defaultMeta.description,
  manifest: '/manifest.json',
  keywords: defaultMeta.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'HIFZ - Memorize the Quran with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: ['/twitter-image'],
    creator: '@hifzapp',
  },
  alternates: {
    canonical: SITE_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  category: 'education',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f1419' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#c9a227',
    colorBackground: '#0f1419',
    colorText: '#e5e5e5',
    colorTextSecondary: '#a3a3a3',
    colorInputBackground: '#1a1f25',
    colorInputText: '#e5e5e5',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'text-night-100',
    card: 'bg-night-900/95 backdrop-blur-xl border border-night-800',
    headerTitle: 'text-night-100',
    headerSubtitle: 'text-night-400',
    formButtonPrimary: 'bg-gold-500 hover:bg-gold-400 text-night-950',
    formFieldLabel: 'text-night-300',
    formFieldInput: 'bg-night-800 border-night-700 text-night-100',
    socialButtonsBlockButton: 'bg-night-800 border-night-700 hover:bg-night-700 text-night-100',
    socialButtonsBlockButtonText: 'text-night-100',
    userButtonPopoverCard: 'bg-night-900/95 backdrop-blur-xl border border-night-800',
    userButtonPopoverMain: 'text-night-100',
    userButtonPopoverActions: 'text-night-100',
    userButtonPopoverActionButton: 'text-night-100 hover:bg-night-800',
    footer: 'text-night-400',
    footerActionLink: 'text-gold-400 hover:text-gold-300',
    badge: 'text-gold-400 bg-night-800/50',
  },
};

const structuredData = [organizationSchema, webApplicationSchema, courseSchema];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <html lang="en" dir="ltr" className={`dark ${fontVariables}`} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://everyayah.com" />
        <JsonLd data={structuredData} />
      </head>
      <body className="bg-night-950 text-night-100 antialiased standalone-tweaks">
        <SkipToContent />
        <ToastProvider>
          <SyncProvider>
            <ServiceWorkerRegistration />
            <OfflineIndicator />
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <InstallPrompt />
            <SyncIndicator />
          </SyncProvider>
        </ToastProvider>
      </body>
    </html>
  );

  if (clerkPubKey) {
    return (
      <ClerkProvider appearance={clerkAppearance}>
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
```

---

## src/app/dashboard/page.tsx

```tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
  Flame,
  BookOpen,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  Calendar,
  RefreshCw,
  Play,
  ArrowRight,
  Star,
  Zap,
  Award,
  MessageCircle,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { StreakDisplay } from '@/components/Celebrations';
import { 
  getStreakInfo, 
  getDailyGoalStatus, 
  getQuranProgress,
  getAchievements,
  getSurahProgressList,
  getJuzProgress,
  type SurahProgressItem,
} from '@/lib/motivationStore';
import { getProgress } from '@/lib/progressStore';
import { useLearningPreferences } from '@/lib/preferencesStore';
import { SURAH_METADATA } from '@/lib/surahMetadata';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getIslamicDate(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date().toLocaleDateString('en-US', options);
}

function formatLastActive(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DailyFocusCard({ 
  variant,
  icon: Icon,
  title,
  subtitle,
  meta,
  href,
  onClick,
}: { 
  variant: 'memorize' | 'review';
  icon: React.ElementType;
  title: string;
  subtitle: string;
  meta: string;
  href?: string;
  onClick?: () => void;
}) {
  const bgClass = variant === 'memorize' 
    ? 'bg-gradient-to-br from-gold-500/20 via-gold-500/10 to-gold-600/5'
    : 'bg-gradient-to-br from-sage-500/20 via-sage-500/10 to-sage-600/5';
  
  const borderClass = variant === 'memorize'
    ? 'border-gold-500/20 hover:border-gold-500/40'
    : 'border-sage-500/20 hover:border-sage-500/40';
  
  const iconBgClass = variant === 'memorize'
    ? 'bg-gold-500/20 text-gold-400'
    : 'bg-sage-500/20 text-sage-400';

  const content = (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 cursor-pointer
        ${bgClass}
        border ${borderClass}
        transition-all duration-300
      `}
      style={{
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      }}
    >
      <div className="absolute inset-0 opacity-30 pattern-arabesque" />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-night-100 mb-1">{title}</h3>
        <p className="text-night-300 text-base mb-3">{subtitle}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-night-500">{meta}</span>
          <ChevronRight className="w-4 h-4 text-night-500" />
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <div onClick={onClick}>{content}</div>;
}

function ContinueCard({
  surahNumber,
  surahName,
  ayahNumber,
  progress,
  href,
}: {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  progress: number;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        variants={fadeInUp}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="liquid-card rounded-2xl p-5 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold">
              {surahNumber}
            </div>
            <div>
              <h4 className="text-night-100 font-medium">{surahName}</h4>
              <p className="text-night-500 text-sm">Ayah {ayahNumber}</p>
            </div>
          </div>
          <motion.div 
            className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-night-950 group-hover:scale-110 transition-transform"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-night-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <span className="text-night-400 text-sm font-medium">{progress}%</span>
        </div>
      </motion.div>
    </Link>
  );
}

function UpNextItem({
  number,
  name,
  meta,
  arabicName,
  status,
  href,
}: {
  number: number;
  name: string;
  meta: string;
  arabicName: string;
  status: 'due' | 'tomorrow' | 'weak' | 'new';
  href: string;
}) {
  const statusStyles = {
    due: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Due today' },
    tomorrow: { bg: 'bg-night-800', text: 'text-night-400', label: 'Tomorrow' },
    weak: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Needs review' },
    new: { bg: 'bg-teal-500/20', text: 'text-teal-400', label: 'New' },
  };
  const style = statusStyles[status];
  
  return (
    <Link href={href}>
      <motion.div
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        className="flex items-center justify-between py-4 border-b border-night-800/50 last:border-0 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-night-800 flex items-center justify-center text-night-300 font-medium">
            {number}
          </div>
          <div>
            <h4 className="text-night-200 font-medium group-hover:text-night-100 transition-colors">{name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                {style.label}
              </span>
              <span className="text-night-600 text-xs">{meta}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-night-600 text-lg font-arabic opacity-50">{arabicName}</span>
          <ChevronRight className="w-4 h-4 text-night-600 group-hover:text-night-400 transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}

function QuickStat({ 
  icon: Icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ElementType; 
  value: string | number; 
  label: string; 
  color: string;
}) {
  return (
    <motion.div variants={scaleIn} className="liquid-card rounded-xl p-4 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
      <p className="text-xl font-bold text-night-100">{value}</p>
      <p className="text-xs text-night-500">{label}</p>
    </motion.div>
  );
}

function RecentActivity({
  activities,
}: {
  activities: Array<{
    action: string;
    detail: string;
    time: string;
    icon: 'complete' | 'review' | 'streak' | 'achievement';
  }>;
}) {
  const iconMap = {
    complete: { icon: BookOpen, color: 'text-sage-400', bg: 'bg-sage-500/20' },
    review: { icon: RefreshCw, color: 'text-gold-400', bg: 'bg-gold-500/20' },
    streak: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    achievement: { icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  };
  
  if (activities.length === 0) {
    return (
      <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-6 text-center">
        <Sparkles className="w-8 h-8 text-night-600 mx-auto mb-3" />
        <p className="text-night-400">Start your first lesson to see your activity!</p>
        <Link 
          href="/lessons" 
          className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:text-gold-300 transition-colors"
        >
          Begin learning <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-4">
      <div className="space-y-3">
        {activities.map((activity, i) => {
          const { icon: Icon, color, bg } = iconMap[activity.icon];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-night-200 text-sm truncate">{activity.action}</p>
                <p className="text-night-500 text-xs">{activity.detail}</p>
              </div>
              <span className="text-night-600 text-xs flex-shrink-0">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { learning: learningPrefs } = useLearningPreferences();
  
  const [streakInfo, setStreakInfo] = useState(getStreakInfo());
  const [goalStatus, setGoalStatus] = useState(getDailyGoalStatus());
  const [quranProgress, setQuranProgress] = useState(getQuranProgress());
  const [achievements, setAchievements] = useState(getAchievements());
  const [surahProgress, setSurahProgress] = useState<SurahProgressItem[]>([]);
  const [userProgress, setUserProgress] = useState(getProgress());
  
  useEffect(() => {
    const loadData = () => {
      setStreakInfo(getStreakInfo());
      setGoalStatus(getDailyGoalStatus());
      setQuranProgress(getQuranProgress());
      setAchievements(getAchievements());
      setSurahProgress(getSurahProgressList());
      setUserProgress(getProgress());
    };
    
    loadData();
    window.addEventListener('motivation-updated', loadData);
    window.addEventListener('progress-updated', loadData);
    
    return () => {
      window.removeEventListener('motivation-updated', loadData);
      window.removeEventListener('progress-updated', loadData);
    };
  }, []);
  
  const displayName = useMemo(() => {
    if (isSignedIn && user) {
      return user.firstName || user.username || 'Learner';
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quranOasis_userName');
      if (stored) return stored;
    }
    return 'Learner';
  }, [isSignedIn, user]);
  
  const lastActiveVerse = useMemo(() => {
    const verses = userProgress.verses;
    const verseEntries = Object.entries(verses);
    
    if (verseEntries.length === 0) {
      return { surah: 1, ayah: 1, surahName: 'Al-Fatihah', progress: 0 };
    }
    
    let mostRecent = verseEntries[0];
    for (const entry of verseEntries) {
      if ((entry[1].lastReview || '') > (mostRecent[1].lastReview || '')) {
        mostRecent = entry;
      }
    }
    
    const [key] = mostRecent;
    const [surah, ayah] = key.split(':').map(Number);
    const surahMeta = SURAH_METADATA[surah];
    const surahData = surahProgress.find(s => s.surahNumber === surah);
    
    return { 
      surah, 
      ayah, 
      surahName: surahMeta?.name || `Surah ${surah}`,
      progress: surahData?.percentage || 0,
    };
  }, [userProgress, surahProgress]);
  
  const reviewQueue = useMemo(() => {
    return surahProgress
      .filter(s => s.status === 'in_progress' || s.versesMemorized > 0)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 4)
      .map(s => {
        const status: 'due' | 'tomorrow' | 'weak' | 'new' = 
          s.percentage < 30 ? 'weak' : s.percentage === 100 ? 'due' : 'new';
        return {
          number: s.surahNumber,
          name: s.englishName,
          meta: `${s.versesMemorized}/${s.totalVerses} verses`,
          arabicName: s.name,
          status,
        };
      });
  }, [surahProgress]);
  
  const recentActivity = useMemo(() => {
    const activities: Array<{
      action: string;
      detail: string;
      time: string;
      icon: 'complete' | 'review' | 'streak' | 'achievement';
    }> = [];
    
    if (streakInfo.isActiveToday) {
      activities.push({
        action: 'Daily streak maintained',
        detail: `${streakInfo.current} day${streakInfo.current !== 1 ? 's' : ''} and counting`,
        time: 'Today',
        icon: 'streak',
      });
    }
    
    const recentAchievement = achievements.unlocked[achievements.unlocked.length - 1];
    if (recentAchievement) {
      activities.push({
        action: `Earned: ${recentAchievement.name}`,
        detail: recentAchievement.description,
        time: recentAchievement.unlockedAt ? formatLastActive(recentAchievement.unlockedAt) : 'Recently',
        icon: 'achievement',
      });
    }
    
    const recentSurah = surahProgress.find(s => s.status === 'in_progress');
    if (recentSurah) {
      activities.push({
        action: `Working on ${recentSurah.englishName}`,
        detail: `${recentSurah.versesMemorized} verses memorized`,
        time: 'In progress',
        icon: 'review',
      });
    }
    
    return activities.slice(0, 3);
  }, [streakInfo, achievements, surahProgress]);
  
  const goalProgress = useMemo(() => {
    const target = learningPrefs.dailyGoalVerses || goalStatus.target;
    return Math.min(100, Math.round((goalStatus.progress / target) * 100));
  }, [goalStatus, learningPrefs]);

  return (
    <div className="min-h-screen bg-night-950">
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Header */}
          <motion.header variants={fadeInUp} className="pt-4 pb-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-night-500 text-sm uppercase tracking-wider mb-1">
                  {getIslamicDate()}
                </p>
                <h1 className="text-3xl font-semibold text-night-100">
                  <span className="text-gold-400">Salam, </span>
                  {displayName}
                </h1>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-night-900 border border-night-800"
              >
                <Flame className={`w-5 h-5 ${streakInfo.current > 0 ? 'text-orange-400' : 'text-night-600'}`} />
                <span className="font-bold text-night-100">{streakInfo.current}</span>
                <span className="text-night-500 text-sm">day{streakInfo.current !== 1 ? 's' : ''}</span>
              </motion.div>
            </div>
          </motion.header>
          
          {/* Daily Goal */}
          <motion.div variants={fadeInUp} className="liquid-glass-gold rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gold-400" />
                <span className="text-night-300 text-sm">Today's Goal</span>
              </div>
              <span className="text-gold-400 font-medium">
                {goalStatus.progress}/{learningPrefs.dailyGoalVerses || goalStatus.target} verses
              </span>
            </div>
            <div className="h-2 rounded-full bg-night-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {goalProgress >= 100 && (
              <p className="text-sage-400 text-xs mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Goal completed! Keep going to earn bonus XP.
              </p>
            )}
          </motion.div>
          
          {/* Daily Focus Cards */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Daily Focus</h2>
            <div className="grid grid-cols-2 gap-3">
              <DailyFocusCard
                variant="memorize"
                icon={BookOpen}
                title="New Hifz"
                subtitle={lastActiveVerse.surahName}
                meta={`Ayah ${lastActiveVerse.ayah}`}
                href={`/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`}
              />
              <DailyFocusCard
                variant="review"
                icon={RefreshCw}
                title="Review"
                subtitle={surahProgress.length > 0 ? `${surahProgress.filter(s => s.status === 'in_progress').length} surahs` : 'Start learning'}
                meta={`${quranProgress.versesMemorized} verses`}
                href="/practice"
              />
            </div>
          </motion.section>
          
          {/* AI Sheikh Card */}
          <motion.section variants={fadeInUp}>
            <Link href="/sheikh">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center text-2xl">
                    📖
                  </div>
                  <div className="flex-1">
                    <h3 className="text-night-100 font-semibold flex items-center gap-2">
                      Ask Sheikh
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400">
                        AI
                      </span>
                    </h3>
                    <p className="text-night-400 text-sm mt-0.5">
                      Your personal Quran teacher — ask about tafsir, tajweed, or memorization
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-night-600 group-hover:text-gold-400 transition-colors" />
                </div>
              </motion.div>
            </Link>
          </motion.section>
          
          {/* Continue Learning */}
          {quranProgress.versesMemorized > 0 && (
            <motion.section variants={fadeInUp}>
              <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Continue Learning</h2>
              <ContinueCard
                surahNumber={lastActiveVerse.surah}
                surahName={lastActiveVerse.surahName}
                ayahNumber={lastActiveVerse.ayah}
                progress={lastActiveVerse.progress}
                href={`/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`}
              />
            </motion.section>
          )}
          
          {/* Up Next */}
          {reviewQueue.length > 0 && (
            <motion.section variants={fadeInUp}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-night-500 text-xs uppercase tracking-wider">Up Next</h2>
                <Link href="/surahs" className="text-gold-400 text-xs hover:text-gold-300 transition-colors">
                  See all
                </Link>
              </div>
              <div className="liquid-card rounded-2xl px-4">
                {reviewQueue.map((item) => (
                  <UpNextItem
                    key={item.number}
                    number={item.number}
                    name={item.name}
                    meta={item.meta}
                    arabicName={item.arabicName}
                    status={item.status}
                    href={`/memorize/${item.number}/1`}
                  />
                ))}
              </div>
            </motion.section>
          )}
          
          {/* Quick Stats */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Your Progress</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickStat icon={BookOpen} value={quranProgress.versesMemorized} label="Verses" color="text-gold-400" />
              <QuickStat icon={Zap} value={streakInfo.longest} label="Best Streak" color="text-orange-400" />
              <QuickStat icon={Award} value={achievements.unlocked.length} label="Achievements" color="text-purple-400" />
            </div>
            <Link 
              href="/progress" 
              className="flex items-center justify-center gap-2 mt-3 text-night-400 hover:text-night-200 transition-colors text-sm"
            >
              View detailed progress <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.section>
          
          {/* Recent Activity */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Recent Activity</h2>
            <RecentActivity activities={recentActivity} />
          </motion.section>
          
          {/* New User CTA */}
          {quranProgress.versesMemorized === 0 && (
            <motion.section variants={fadeInUp} className="mt-6">
              <div className="liquid-glass-gold-premium rounded-2xl p-6 text-center">
                <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-night-100 mb-2">Begin Your Journey</h3>
                <p className="text-night-400 mb-5 max-w-sm mx-auto">
                  Start with Al-Fatihah or pick any surah to begin your memorization journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/lessons" className="liquid-btn inline-flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Start Learning
                  </Link>
                  <Link 
                    href="/surahs"
                    className="liquid-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-night-600 text-night-200 hover:bg-night-800/50 transition-colors"
                  >
                    Browse Surahs
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
```

---

*File truncated for size. Full mushaf/page.tsx, lessons pages, recite, and practice files available in the repository.*

## Key AI Sheikh Integration Points

### 1. Dashboard Card (src/app/dashboard/page.tsx)
- Gold-accented card with 📖 icon
- "Ask Sheikh" title with "AI" badge
- Links to /sheikh

### 2. Mushaf Floating Button (src/app/mushaf/page.tsx)
- Import: `import AskSheikhButton from '@/components/AskSheikhButton';`
- Placement: Before closing `</div>` of main component
- Passes current ayah context automatically

### 3. AI Sheikh Components
- `src/components/AskSheikhButton.tsx` - Floating action button
- `src/components/SheikhChat.tsx` - Chat UI with streaming
- `src/hooks/useSheikhChat.ts` - Chat state management
- `src/lib/sheikh-prompt.ts` - System prompt (the soul)
- `src/app/api/sheikh/route.ts` - Claude API endpoint
- `src/app/sheikh/page.tsx` - Demo/showcase page

### Environment Variables Required
```
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DEEPGRAM_API_KEY=...
```
