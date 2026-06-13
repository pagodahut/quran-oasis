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
    const { surahNumber, ayahNumber, duration, accuracy, tajweedScore, feedback } = body as {
      surahNumber: number;
      ayahNumber: number;
      duration: number;
      accuracy?: number;
      tajweedScore?: number;
      feedback?: string;
    };

    if (!surahNumber || !ayahNumber || !duration) {
      return NextResponse.json({ error: 'surahNumber, ayahNumber, and duration are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const attempt = await prisma.recitationAttempt.create({
      data: {
        userId: user.id,
        surahNumber,
        ayahNumber,
        duration,
        accuracy: accuracy ?? null,
        tajweedScore: tajweedScore ?? null,
        feedback: feedback ?? null,
      },
    });

    return NextResponse.json({ id: attempt.id, createdAt: attempt.createdAt });
  } catch (error) {
    console.error('Recitation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const attempts = await prisma.recitationAttempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error('Recitation GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
