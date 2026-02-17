import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { pushSrsToClerk, pullSrsFromClerk, decodeCard } from '@/lib/srsMetadataSync';

/**
 * GET /api/srs/sync — Pull SRS state from Clerk metadata, merge with local DB (newer wins).
 * Called on sign-in to hydrate the local DB with cross-device SRS progress.
 */
export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clerkData = await pullSrsFromClerk(clerkId);
    if (!clerkData) {
      return NextResponse.json({ merged: 0, source: 'none' });
    }

    // Get user's internal ID
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ merged: 0, source: 'no_user' });
    }

    // Get all local progress
    const localCards = await prisma.memorizationProgress.findMany({
      where: { userId: user.id },
    });
    const localMap = new Map(
      localCards.map((c) => [`${c.surahNumber}:${c.ayahNumber}`, c])
    );

    let mergedCount = 0;

    for (const [key, clerkCard] of Object.entries(clerkData.cards)) {
      const [surah, ayah] = key.split(':').map(Number);
      const local = localMap.get(key);

      // Merge strategy: newer lastReview wins; if no local record, use Clerk's
      const clerkLastReview = clerkCard.lastReview?.getTime() ?? 0;
      const localLastReview = local?.lastReview?.getTime() ?? 0;

      if (!local || clerkLastReview > localLastReview) {
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
            easeFactor: clerkCard.easeFactor,
            interval: clerkCard.interval,
            repetitions: clerkCard.repetitions,
            nextReview: clerkCard.nextReview,
            lastReview: clerkCard.lastReview,
            status: clerkCard.status,
          },
          update: {
            easeFactor: clerkCard.easeFactor,
            interval: clerkCard.interval,
            repetitions: clerkCard.repetitions,
            nextReview: clerkCard.nextReview,
            lastReview: clerkCard.lastReview,
            status: clerkCard.status,
          },
        });
        mergedCount++;
      }
    }

    return NextResponse.json({ merged: mergedCount, source: 'clerk' });
  } catch (error) {
    console.error('SRS sync GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/srs/sync — Push local SRS state to Clerk metadata.
 * Called after review sessions complete.
 */
export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all progress cards that have been started
    const cards = await prisma.memorizationProgress.findMany({
      where: {
        userId: user.id,
        status: { not: 'not_started' },
      },
    });

    await pushSrsToClerk(clerkId, cards);

    return NextResponse.json({ synced: cards.length, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error('SRS sync POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
