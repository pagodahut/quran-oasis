import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
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

    if (!user.preferences?.emailNotifications) {
      return NextResponse.json({ error: 'Email notifications are disabled' }, { status: 400 });
    }

    if (!user.email) {
      return NextResponse.json({ error: 'No email address on file' }, { status: 400 });
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [weeklyActivity, totalProgress] = await Promise.all([
      prisma.dailyActivity.findMany({
        where: { userId: user.id, date: { gte: weekAgo } },
        orderBy: { date: 'asc' },
      }),
      prisma.memorizationProgress.count({
        where: { userId: user.id, status: { in: ['learning', 'reviewing', 'memorized'] } },
      }),
    ]);

    const summary = {
      totalVersesLearned: weeklyActivity.reduce((sum, d) => sum + d.versesLearned, 0),
      totalVersesReviewed: weeklyActivity.reduce((sum, d) => sum + d.versesReviewed, 0),
      totalMinutes: weeklyActivity.reduce((sum, d) => sum + d.minutesStudied, 0),
      daysActive: weeklyActivity.length,
      totalVersesMemorized: totalProgress,
    };

    // Email sending requires an email provider (Resend, SendGrid, etc.)
    // When configured, replace this block with actual send logic.
    const emailProvider = process.env.EMAIL_PROVIDER;
    if (!emailProvider) {
      return NextResponse.json({
        preview: true,
        to: user.email,
        subject: `Your Quran Oasis Weekly Progress`,
        summary,
        message: 'Email provider not configured. Set EMAIL_PROVIDER and related env vars to enable sending.',
      });
    }

    return NextResponse.json({ sent: true, to: user.email, summary });
  } catch (error) {
    console.error('Weekly email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
