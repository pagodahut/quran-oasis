import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { surahNumber, ayahNumber, accuracy, quality } = body as {
      surahNumber: number;
      ayahNumber: number;
      accuracy: number;
      quality?: number;
    };

    if (!surahNumber || !ayahNumber || accuracy === undefined) {
      return NextResponse.json({ error: 'surahNumber, ayahNumber, and accuracy are required' }, { status: 400 });
    }

    if (accuracy < 0 || accuracy > 1) {
      return NextResponse.json({ error: 'accuracy must be between 0 and 1' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const confidence = Math.round(accuracy * 100);

    const progress = await prisma.memorizationProgress.upsert({
      where: {
        userId_surahNumber_ayahNumber: {
          userId: user.id,
          surahNumber,
          ayahNumber,
        },
      },
      create: {
        userId: user.id,
        surahNumber,
        ayahNumber,
        confidence,
        lastQuality: quality ?? null,
        lastReview: new Date(),
        status: 'learning',
      },
      update: {
        confidence,
        lastQuality: quality ?? undefined,
        lastReview: new Date(),
        repetitions: { increment: 1 },
      },
    });

    return NextResponse.json({
      surahNumber: progress.surahNumber,
      ayahNumber: progress.ayahNumber,
      confidence: progress.confidence,
      status: progress.status,
    });
  } catch (error) {
    console.error('Difficulty update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
