import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { calculateDifficulty } from '@/lib/adaptiveDifficulty';

// POST: Save a completed recitation session
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      surahNumber,
      startAyah,
      endAyah,
      overallAccuracy,
      duration,
      totalWords,
      matchedWords,
      words,
    } = body;

    // Validate required fields
    if (!surahNumber || !startAyah || !endAyah || overallAccuracy === undefined || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await prisma.recitationSession.create({
      data: {
        userId: clerkId,
        surahNumber,
        startAyah,
        endAyah,
        overallAccuracy: Math.round(overallAccuracy),
        duration,
        totalWords: totalWords || 0,
        matchedWords: matchedWords || 0,
        words: words?.length
          ? {
              create: words.map((w: {
                wordIndex: number;
                expectedWord: string;
                transcribedWord?: string;
                confidence?: number;
                isCorrect: boolean;
              }) => ({
                wordIndex: w.wordIndex,
                expectedWord: w.expectedWord,
                transcribedWord: w.transcribedWord || null,
                confidence: w.confidence || 0,
                isCorrect: w.isCorrect,
              })),
            }
          : undefined,
      },
    });

    // Update difficulty for each ayah in the range
    const accuracyNormalized = Math.round(overallAccuracy) / 100;
    const difficultyPromises = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      difficultyPromises.push(
        calculateDifficulty(clerkId, surahNumber, ayah, accuracyNormalized).catch((err) => {
          console.error(`Failed to update difficulty for ${surahNumber}:${ayah}:`, err);
        })
      );
    }
    await Promise.allSettled(difficultyPromises);

    return NextResponse.json({ id: session.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving recitation session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch recitation history
export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const surah = searchParams.get('surah');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  try {
    const where: { userId: string; surahNumber?: number } = { userId: clerkId };
    if (surah) {
      where.surahNumber = parseInt(surah);
    }

    const [sessions, total] = await Promise.all([
      prisma.recitationSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          words: {
            orderBy: { wordIndex: 'asc' },
          },
        },
      }),
      prisma.recitationSession.count({ where }),
    ]);

    // Also get best scores per surah for the user
    const bestScores = await prisma.recitationSession.groupBy({
      by: ['surahNumber'],
      where: { userId: clerkId },
      _max: { overallAccuracy: true },
      _count: { id: true },
    });

    return NextResponse.json({
      sessions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      bestScores: bestScores.map((b) => ({
        surahNumber: b.surahNumber,
        bestAccuracy: b._max.overallAccuracy,
        sessionCount: b._count.id,
      })),
    });
  } catch (error) {
    console.error('Error fetching recitation history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
