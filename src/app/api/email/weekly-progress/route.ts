import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';
import { WeeklyProgressEmail, type WeeklyProgressData } from '@/lib/email/weekly-progress';
import { SURAH_NAMES } from '@/lib/quran';

const prisma = new PrismaClient();

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://quran-oasis.vercel.app';

// Cron secret to protect the endpoint
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Auth: either cron secret header or specific userId in body
    const authHeader = request.headers.get('authorization');
    const isCron = CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`;

    const body = await request.json().catch(() => ({}));
    const { userId, secret } = body as { userId?: string; secret?: string };

    // Verify authorization
    if (!isCron && secret !== CRON_SECRET) {
      // If a specific userId is provided without cron auth, require the secret
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // If userId provided, send to one user; otherwise send to all opted-in users
    const users = userId
      ? await prisma.user.findMany({
          where: { id: userId, email: { not: null } },
          include: { preferences: true },
        })
      : await prisma.user.findMany({
          where: {
            email: { not: null },
            preferences: { emailNotifications: true },
          },
          include: { preferences: true },
        });

    if (users.length === 0) {
      return NextResponse.json({ message: 'No eligible users', sent: 0 });
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let sent = 0;
    const errors: string[] = [];

    for (const user of users) {
      // Skip users who opted out
      if (user.preferences && !user.preferences.emailNotifications) continue;
      if (!user.email) continue;

      try {
        // Fetch weekly progress data
        const [dailyActivities, recitationSessions, progressEntries] = await Promise.all([
          prisma.dailyActivity.findMany({
            where: { userId: user.id, date: { gte: oneWeekAgo } },
          }),
          prisma.recitationSession.findMany({
            where: { userId: user.id, createdAt: { gte: oneWeekAgo } },
          }),
          prisma.memorizationProgress.findMany({
            where: { userId: user.id, lastReview: { gte: oneWeekAgo } },
          }),
        ]);

        // Calculate stats
        const versesReviewed = dailyActivities.reduce((sum, d) => sum + d.versesReviewed + d.versesLearned, 0);
        const totalMinutes = dailyActivities.reduce((sum, d) => sum + d.minutesStudied, 0);

        // Calculate streak (consecutive days with activity, counting back from today)
        const activityDates = new Set(
          dailyActivities.map((d) => d.date.toISOString().split('T')[0])
        );
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
          if (activityDates.has(checkDate)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }

        // Average accuracy from recitation sessions
        const avgAccuracy =
          recitationSessions.length > 0
            ? Math.round(
                recitationSessions.reduce((sum, s) => sum + s.overallAccuracy, 0) /
                  recitationSessions.length
              )
            : 0;

        // Accuracy trend: compare this week vs previous week
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const prevSessions = await prisma.recitationSession.findMany({
          where: {
            userId: user.id,
            createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
          },
        });
        const prevAvg =
          prevSessions.length > 0
            ? prevSessions.reduce((sum, s) => sum + s.overallAccuracy, 0) / prevSessions.length
            : avgAccuracy;
        const accuracyTrend: 'up' | 'down' | 'stable' =
          avgAccuracy > prevAvg + 2 ? 'up' : avgAccuracy < prevAvg - 2 ? 'down' : 'stable';

        // Unique surahs practiced
        const surahNumbers = [...new Set(progressEntries.map((p) => p.surahNumber))];
        const surahsPracticed = surahNumbers
          .map((n) => SURAH_NAMES[n]?.english || `Surah ${n}`)
          .slice(0, 8); // Limit display

        const unsubscribeUrl = `${APP_URL}/api/email/weekly-progress?unsubscribe=${user.id}&token=${encodeURIComponent(Buffer.from(user.id + ':' + user.email).toString('base64'))}`;

        const progressData: WeeklyProgressData = {
          userName: user.name || '',
          versesReviewed,
          currentStreak: streak,
          averageAccuracy: avgAccuracy,
          accuracyTrend,
          surahsPracticed,
          totalMinutes,
          unsubscribeUrl,
          appUrl: APP_URL,
        };

        await getResend().emails.send({
          from: 'HIFZ <noreply@gethifz.com>',
          to: user.email,
          subject: `Your Weekly Hifz Progress — ${versesReviewed} verses reviewed${streak > 0 ? ` 🔥${streak}` : ''}`,
          react: WeeklyProgressEmail(progressData),
        });

        sent++;
      } catch (err) {
        errors.push(`Failed for ${user.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({ sent, total: users.length, errors: errors.length > 0 ? errors : undefined });
  } catch (error) {
    console.error('Weekly progress email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Handle unsubscribe
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unsubscribeUserId = searchParams.get('unsubscribe');
  const token = searchParams.get('token');

  if (!unsubscribeUserId || !token) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    // Verify token (simple base64 check)
    const decoded = Buffer.from(token, 'base64').toString();
    const [id] = decoded.split(':');
    if (id !== unsubscribeUserId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    await prisma.userPreferences.update({
      where: { userId: unsubscribeUserId },
      data: { emailNotifications: false },
    });

    return new NextResponse(
      `<!DOCTYPE html>
      <html><body style="background:#0a0a0f;color:#e5e7eb;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <div style="text-align:center">
          <h1 style="color:#d4a647">✅ Unsubscribed</h1>
          <p>You won't receive weekly progress emails anymore.</p>
          <p style="color:#6b7280">You can re-enable them in Settings.</p>
        </div>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
