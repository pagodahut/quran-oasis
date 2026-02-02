'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Loading placeholder component
function LoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
    </div>
  );
}

// Loading placeholder for cards
function CardLoadingPlaceholder() {
  return (
    <div className="liquid-card p-6 animate-pulse">
      <div className="h-4 bg-night-800 rounded w-3/4 mb-3" />
      <div className="h-4 bg-night-800 rounded w-1/2" />
    </div>
  );
}

// Dynamically import heavy components
export const DynamicJourneyMap = dynamic(
  () => import('@/components/JourneyMap').then(mod => mod.JourneyOverview),
  { 
    loading: () => <LoadingPlaceholder />,
    ssr: false 
  }
);

export const DynamicCelebrationOverlay = dynamic(
  () => import('@/components/Celebrations').then(mod => mod.CelebrationOverlay),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicStreakDisplay = dynamic(
  () => import('@/components/Celebrations').then(mod => mod.StreakDisplay),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicGoalProgressRing = dynamic(
  () => import('@/components/Celebrations').then(mod => mod.GoalProgressRing),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicAudioPlayer = dynamic(
  () => import('@/components/AudioPlayer').then(mod => mod.AudioPlayer),
  { 
    loading: () => <LoadingPlaceholder />,
    ssr: false 
  }
);

export const DynamicTafsirDrawer = dynamic(
  () => import('@/components/TafsirDrawer').then(mod => mod.default),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicQuranSearch = dynamic(
  () => import('@/components/QuranSearch').then(mod => mod.default),
  { 
    loading: () => <CardLoadingPlaceholder />,
    ssr: false 
  }
);

export const DynamicWordByWord = dynamic(
  () => import('@/components/WordByWord').then(mod => mod.default),
  { 
    loading: () => <LoadingPlaceholder />,
    ssr: false 
  }
);

export const DynamicMemorizationPractice = dynamic(
  () => import('@/components/MemorizationPractice').then(mod => mod.default),
  { 
    loading: () => <CardLoadingPlaceholder />,
    ssr: false 
  }
);

export const DynamicPageTransition = dynamic(
  () => import('@/components/PageTransition').then(mod => mod.default),
  { 
    loading: () => null,
    ssr: false 
  }
);
