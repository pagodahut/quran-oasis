import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getDailyGoal, updateProgress, calculateStreak } from '@/lib/dailyGoals';
import { getNudge } from '@/lib/nudges';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const goal = await getDailyGoal(user.id);
  const streak = await calculateStreak(user.id);

  // Get nudge context
  const lastGoal = await prisma.dailyGoal.findFirst({
    where: { userId: user.id, date: { not: goal.date } },
    orderBy: { date: 'desc' },
  });

  const daysSinceLastVisit = lastGoal
    ? Math.floor(
        (Date.now() - new Date(lastGoal.date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const totalVerses = await prisma.memorizationProgress.count({
    where: { userId: user.id, status: 'memorized' },
  });

  const nudge = await getNudge(user.id, {
    streakDays: streak,
    totalVerses,
    daysSinceLastVisit,
    goalComplete: goal.isComplete,
  });

  return NextResponse.json({ goal, streak, nudge });
}

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const body = await request.json();
  const { minutesAdded = 0, versesAdded = 0 } = body;

  const goal = await updateProgress(user.id, minutesAdded, versesAdded);
  const streak = await calculateStreak(user.id);

  return NextResponse.json({ goal, streak });
}
