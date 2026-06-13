import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { preferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivity = await prisma.dailyActivity.findFirst({
      where: { userId: user.id, date: today },
    });

    return NextResponse.json({
      goals: {
        dailyGoalVerses: user.preferences?.dailyGoalVerses ?? 3,
        dailyGoalMinutes: user.preferences?.dailyGoalMinutes ?? 15,
      },
      today: {
        versesLearned: todayActivity?.versesLearned ?? 0,
        versesReviewed: todayActivity?.versesReviewed ?? 0,
        minutesStudied: todayActivity?.minutesStudied ?? 0,
        lessonsCompleted: todayActivity?.lessonsCompleted ?? 0,
      },
    });
  } catch (error) {
    console.error('Goals GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dailyGoalVerses, dailyGoalMinutes } = body as {
      dailyGoalVerses?: number;
      dailyGoalMinutes?: number;
    };

    if (dailyGoalVerses !== undefined && (dailyGoalVerses < 1 || dailyGoalVerses > 50)) {
      return NextResponse.json({ error: 'dailyGoalVerses must be between 1 and 50' }, { status: 400 });
    }
    if (dailyGoalMinutes !== undefined && (dailyGoalMinutes < 5 || dailyGoalMinutes > 180)) {
      return NextResponse.json({ error: 'dailyGoalMinutes must be between 5 and 180' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: Record<string, number> = {};
    if (dailyGoalVerses !== undefined) updateData.dailyGoalVerses = dailyGoalVerses;
    if (dailyGoalMinutes !== undefined) updateData.dailyGoalMinutes = dailyGoalMinutes;

    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...updateData },
      update: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Goals PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
