import { prisma } from '@/lib/prisma';
import { SURAH_METADATA } from '@/lib/surahMetadata';

export interface DashboardData {
  studyPlan: {
    currentSurah: number;
    currentAyah: number;
    dailyNewVerses: number;
    dailyReviewVerses: number;
  } | null;
  reviewQueue: {
    total: number;
    items: Array<{
      surahNumber: number;
      ayahNumber: number;
      surahName: string;
      arabicName: string;
      nextReview: string;
    }>;
  };
  weeklyStats: {
    minutesStudied: number;
    versesReviewed: number;
    averageAccuracy: number;
    currentStreak: number;
  };
  recentSessions: Array<{
    surahNumber: number;
    surahName: string;
    accuracy: number;
    createdAt: string;
    duration: number;
  }>;
  continueLearning: {
    surahNumber: number;
    surahName: string;
    arabicName: string;
    ayahNumber: number;
    totalAyahs: number;
    versesMemorized: number;
  } | null;
  totalVersesMemorized: number;
}

export async function getDashboardData(clerkId: string): Promise<DashboardData> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { studyPlan: true },
  });

  if (!user) {
    return getEmptyDashboard();
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Parallel queries
  const [
    overdueReviews,
    weeklyActivity,
    recentSessionsRaw,
    memorizedCount,
    streak,
  ] = await Promise.all([
    // Overdue reviews
    prisma.memorizationProgress.findMany({
      where: {
        userId: user.id,
        nextReview: { lte: now },
        status: { in: ['learning', 'reviewing', 'memorized'] },
      },
      orderBy: { nextReview: 'asc' },
      take: 20,
    }),
    // Weekly activity
    prisma.dailyActivity.findMany({
      where: {
        userId: user.id,
        date: { gte: weekAgo },
      },
    }),
    // Recent recitation sessions
    prisma.recitationSession.findMany({
      where: { userId: clerkId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    // Total memorized
    prisma.memorizationProgress.count({
      where: {
        userId: user.id,
        status: { in: ['memorized', 'reviewing'] },
      },
    }),
    // Streak: count consecutive days with activity
    prisma.dailyActivity.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 90,
    }),
  ]);

  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDates = new Set(
    streak.map(a => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  for (let i = 0; i < 90; i++) {
    const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (activityDates.has(checkDate.getTime())) {
      currentStreak++;
    } else if (i === 0) {
      // Today might not have activity yet, skip
      continue;
    } else {
      break;
    }
  }

  // Weekly stats
  const minutesStudied = weeklyActivity.reduce((sum, a) => sum + a.minutesStudied, 0);
  const versesReviewed = weeklyActivity.reduce((sum, a) => sum + a.versesReviewed, 0);
  const avgAccuracy = recentSessionsRaw.length > 0
    ? Math.round(recentSessionsRaw.reduce((sum, s) => sum + s.overallAccuracy, 0) / recentSessionsRaw.length)
    : 0;

  // Review queue
  const reviewItems = overdueReviews.slice(0, 10).map(r => {
    const meta = SURAH_METADATA[r.surahNumber] || SURAH_METADATA[0];
    return {
      surahNumber: r.surahNumber,
      ayahNumber: r.ayahNumber,
      surahName: meta?.englishName || `Surah ${r.surahNumber}`,
      arabicName: meta?.name || '',
      nextReview: r.nextReview.toISOString(),
    };
  });

  // Continue learning
  let continueLearning = null;
  if (user.studyPlan) {
    const sp = user.studyPlan;
    const meta = SURAH_METADATA[sp.currentSurah] || SURAH_METADATA[0];
    const memorizedInSurah = await prisma.memorizationProgress.count({
      where: {
        userId: user.id,
        surahNumber: sp.currentSurah,
        status: { in: ['memorized', 'reviewing'] },
      },
    });
    continueLearning = {
      surahNumber: sp.currentSurah,
      surahName: meta?.englishName || `Surah ${sp.currentSurah}`,
      arabicName: meta?.name || '',
      ayahNumber: sp.currentAyah,
      totalAyahs: meta?.numberOfAyahs || 0,
      versesMemorized: memorizedInSurah,
    };
  }

  // Recent sessions
  const recentSessions = recentSessionsRaw.map(s => {
    const meta = SURAH_METADATA[s.surahNumber] || SURAH_METADATA[0];
    return {
      surahNumber: s.surahNumber,
      surahName: meta?.englishName || `Surah ${s.surahNumber}`,
      accuracy: s.overallAccuracy,
      createdAt: s.createdAt.toISOString(),
      duration: s.duration,
    };
  });

  return {
    studyPlan: user.studyPlan
      ? {
          currentSurah: user.studyPlan.currentSurah,
          currentAyah: user.studyPlan.currentAyah,
          dailyNewVerses: user.studyPlan.dailyNewVerses,
          dailyReviewVerses: user.studyPlan.dailyReviewVerses,
        }
      : null,
    reviewQueue: {
      total: overdueReviews.length,
      items: reviewItems,
    },
    weeklyStats: {
      minutesStudied,
      versesReviewed,
      averageAccuracy: avgAccuracy,
      currentStreak,
    },
    recentSessions,
    continueLearning,
    totalVersesMemorized: memorizedCount,
  };
}

function getEmptyDashboard(): DashboardData {
  return {
    studyPlan: null,
    reviewQueue: { total: 0, items: [] },
    weeklyStats: { minutesStudied: 0, versesReviewed: 0, averageAccuracy: 0, currentStreak: 0 },
    recentSessions: [],
    continueLearning: null,
    totalVersesMemorized: 0,
  };
}
