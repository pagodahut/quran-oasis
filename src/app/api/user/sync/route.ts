import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SyncBookmark {
  surah: number;
  ayah: number;
  note?: string;
}

interface SyncVerse {
  easeFactor?: number;
  interval?: number;
  totalReviews?: number;
  nextReview?: string | number;
  lastReview?: string | number | null;
  status?: string;
  confidence?: number;
}

// GET - Load user data from server
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        preferences: true,
        progress: true,
        bookmarks: true,
        dailyActivity: {
          orderBy: { date: 'desc' },
          take: 90, // Last 90 days
        },
        studyPlan: true,
        onboarding: true,
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: { clerkId: userId },
        include: {
          preferences: true,
          progress: true,
          bookmarks: true,
          dailyActivity: true,
          studyPlan: true,
          onboarding: true,
        },
      });
    }

    // Transform to match localStorage format
    const verses: Record<string, any> = {};
    for (const p of user.progress) {
      const key = `${p.surahNumber}:${p.ayahNumber}`;
      verses[key] = {
        surah: p.surahNumber,
        ayah: p.ayahNumber,
        easeFactor: p.easeFactor,
        interval: p.interval,
        repetitions: p.repetitions,
        nextReview: p.nextReview,
        lastReview: p.lastReview,
        status: p.status,
        confidence: Math.round(p.easeFactor * 20), // Convert ease to confidence
        totalReviews: p.repetitions,
      };
    }

    const bookmarks = user.bookmarks.map((b: typeof user.bookmarks[number]) => ({
      id: b.id,
      surah: b.surahNumber,
      ayah: b.ayahNumber,
      note: b.note,
      createdAt: b.createdAt.getTime(),
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      progress: {
        verses,
        dailyActivity: user.dailyActivity.map((d: typeof user.dailyActivity[number]) => ({
          date: d.date.toISOString().split('T')[0],
          versesMemorized: d.versesLearned,
          versesReviewed: d.versesReviewed,
          minutesPracticed: d.minutesStudied,
          sessionsCompleted: d.lessonsCompleted,
        })),
        settings: user.preferences ? {
          preferredReciter: user.preferences.reciter,
          dailyGoalMinutes: 15,
          showTranslation: user.preferences.showTranslation,
          showTransliteration: false,
        } : null,
      },
      bookmarks,
      studyPlan: user.studyPlan,
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error('Sync GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save user data to server
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { progress, bookmarks, settings } = body as {
      progress?: { verses?: Record<string, SyncVerse> };
      bookmarks?: SyncBookmark[];
      settings?: { preferredReciter?: string; showTranslation?: boolean };
    };

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId: userId },
      });
    }

    // Sync progress (verses)
    if (progress?.verses) {
      for (const [key, verse] of Object.entries(progress.verses) as [string, SyncVerse][]) {
        const [surah, ayah] = key.split(':').map(Number);
        
        await prisma.memorizationProgress.upsert({
          where: {
            userId_surahNumber_ayahNumber: {
              userId: user.id,
              surahNumber: surah,
              ayahNumber: ayah,
            },
          },
          create: {
            userId: user.id,
            surahNumber: surah,
            ayahNumber: ayah,
            easeFactor: verse.easeFactor || 2.5,
            interval: verse.interval || 1,
            repetitions: verse.totalReviews || 0,
            nextReview: verse.nextReview ? new Date(verse.nextReview) : new Date(),
            lastReview: verse.lastReview ? new Date(verse.lastReview) : null,
            status: verse.status || 'learning',
          },
          update: {
            easeFactor: verse.easeFactor || 2.5,
            interval: verse.interval || 1,
            repetitions: verse.totalReviews || 0,
            nextReview: verse.nextReview ? new Date(verse.nextReview) : new Date(),
            lastReview: verse.lastReview ? new Date(verse.lastReview) : null,
            status: verse.status || 'learning',
          },
        });
      }
    }

    // Sync bookmarks
    if (bookmarks) {
      // Get existing bookmarks
      const existingBookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
      });
      const existingKeys = new Set(existingBookmarks.map((b: typeof existingBookmarks[number]) => `${b.surahNumber}:${b.ayahNumber}`));
      const newKeys = new Set(bookmarks.map((b: SyncBookmark) => `${b.surah}:${b.ayah}`));

      // Delete removed bookmarks
      for (const eb of existingBookmarks) {
        if (!newKeys.has(`${eb.surahNumber}:${eb.ayahNumber}`)) {
          await prisma.bookmark.delete({ where: { id: eb.id } });
        }
      }

      // Add/update bookmarks
      for (const bookmark of bookmarks) {
        await prisma.bookmark.upsert({
          where: {
            userId_surahNumber_ayahNumber: {
              userId: user.id,
              surahNumber: bookmark.surah,
              ayahNumber: bookmark.ayah,
            },
          },
          create: {
            userId: user.id,
            surahNumber: bookmark.surah,
            ayahNumber: bookmark.ayah,
            note: bookmark.note,
          },
          update: {
            note: bookmark.note,
          },
        });
      }
    }

    // Sync settings/preferences
    if (settings) {
      await prisma.userPreferences.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          reciter: settings.preferredReciter || 'alafasy',
          showTranslation: settings.showTranslation ?? true,
        },
        update: {
          reciter: settings.preferredReciter,
          showTranslation: settings.showTranslation,
        },
      });
    }

    return NextResponse.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Sync POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
