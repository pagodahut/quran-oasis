import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

/**
 * Weekly Progress Summary
 * 
 * GET /api/progress/weekly
 * Returns a sheikh-voice weekly progress summary with:
 * - Ayahs reviewed this week
 * - Accuracy trends
 * - Streak info
 * - Sheikh encouragement message
 * - Ready-to-send email HTML
 * 
 * Can be called by:
 * 1. User manually from dashboard ("View my weekly summary")
 * 2. Cron job (Vercel cron) for email delivery
 */

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = user.unsafeMetadata?.quranProfile as Record<string, unknown> | undefined;
    const srsData = user.unsafeMetadata?.srsStats as Record<string, unknown> | undefined;

    // Build summary from available data
    const userName = user.firstName || 'Student';
    const level = (profile?.level as string) || 'beginner';

    // Stats (would come from SRS sync in production)
    const totalAyahs = (srsData?.totalAyahs as number) || 0;
    const manzilCount = (srsData?.manzilCount as number) || 0;
    const averageAccuracy = (srsData?.averageAccuracy as number) || 0;
    const streak = (srsData?.longestStreak as number) || 0;
    const weeklyReviews = (srsData?.weeklyReviews as number) || 0;

    // Generate sheikh encouragement based on performance
    const encouragement = generateEncouragement({
      totalAyahs,
      manzilCount,
      averageAccuracy,
      streak,
      weeklyReviews,
      userName,
    });

    const summary = {
      userName,
      level,
      weekOf: getWeekRange(),
      stats: {
        totalAyahs,
        manzilCount,
        averageAccuracy: Math.round(averageAccuracy * 100),
        streak,
        weeklyReviews,
      },
      sheikhMessage: encouragement,
      emailHtml: generateEmailHtml({
        userName,
        level,
        totalAyahs,
        manzilCount,
        accuracyPercent: Math.round(averageAccuracy * 100),
        streak,
        weeklyReviews,
        sheikhMessage: encouragement,
      }),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Weekly summary error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}

// ─── Helpers ───────────────────────────────────────────────────────

function getWeekRange(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 7);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(now)}`;
}

interface EncouragementInput {
  totalAyahs: number;
  manzilCount: number;
  averageAccuracy: number;
  streak: number;
  weeklyReviews: number;
  userName: string;
}

function generateEncouragement(input: EncouragementInput): string {
  const { totalAyahs, manzilCount, averageAccuracy, streak, weeklyReviews, userName } = input;

  if (totalAyahs === 0) {
    return `Assalamu alaikum ${userName}! You haven't started adding ayahs yet. Remember, even one ayah a day builds a strong foundation. The Prophet ﷺ said the best deeds are those done consistently, even if small. Let's begin your memorization journey this week, insha'Allah!`;
  }

  if (weeklyReviews === 0) {
    return `Assalamu alaikum ${userName}, I noticed you didn't review this week. That's okay — life gets busy. But your ${totalAyahs} ayahs are waiting for you! Even 5 minutes of review today will help maintain what you've learned. I'm here whenever you're ready.`;
  }

  if (streak >= 7) {
    return `Masha'Allah ${userName}! A ${streak}-day streak — that's the consistency the scholars talk about! You reviewed ${weeklyReviews} times this week with ${Math.round(averageAccuracy * 100)}% accuracy. ${manzilCount > 0 ? `${manzilCount} ayahs are now in your long-term manzil — they're becoming part of you.` : ''} Keep this blessed momentum going!`;
  }

  if (averageAccuracy > 0.85) {
    return `Assalamu alaikum ${userName}! Your accuracy of ${Math.round(averageAccuracy * 100)}% is excellent — the ayahs are settling deep in your heart, Alhamdulillah. You reviewed ${weeklyReviews} times this week across ${totalAyahs} ayahs. Consider adding a few more ayahs — you're ready for it!`;
  }

  if (averageAccuracy < 0.5) {
    return `Assalamu alaikum ${userName}, don't worry about the accuracy numbers right now. The fact that you showed up ${weeklyReviews} times this week is what matters most. Repetition is the mother of memorization. I recommend focusing on fewer ayahs with more repetition — quality over quantity. You've got this, insha'Allah!`;
  }

  return `Assalamu alaikum ${userName}! Good week of practice — ${weeklyReviews} review sessions with ${Math.round(averageAccuracy * 100)}% accuracy across ${totalAyahs} ayahs. ${manzilCount > 0 ? `${manzilCount} of those are now in your long-term manzil.` : 'Keep reviewing consistently and your first ayahs will graduate to manzil soon.'} May Allah make it easy for you!`;
}

interface EmailInput {
  userName: string;
  level: string;
  totalAyahs: number;
  manzilCount: number;
  accuracyPercent: number;
  streak: number;
  weeklyReviews: number;
  sheikhMessage: string;
}

function generateEmailHtml(input: EmailInput): string {
  const { userName, totalAyahs, manzilCount, accuracyPercent, streak, weeklyReviews, sheikhMessage } = input;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#080f0c; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:480px; margin:0 auto; padding:32px 20px;">
    <!-- Header -->
    <div style="text-align:center; margin-bottom:24px;">
      <div style="font-size:40px; margin-bottom:8px;">🕌</div>
      <h1 style="color:#e8f5f0; font-size:20px; margin:0 0 4px;">Weekly Progress</h1>
      <p style="color:#6bb89a; font-size:13px; margin:0;">Your Quran Oasis Summary</p>
    </div>

    <!-- Sheikh Message -->
    <div style="background:linear-gradient(135deg, #0c1f1a, #132e25); border:1px solid rgba(45,212,150,0.12); border-radius:16px; padding:16px; margin-bottom:20px;">
      <p style="color:#c8e6dc; font-size:14px; line-height:1.6; margin:0;">${sheikhMessage}</p>
    </div>

    <!-- Stats Grid -->
    <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;">
      <div style="flex:1; min-width:45%; background:rgba(255,255,255,0.02); border:1px solid rgba(45,212,150,0.06); border-radius:12px; padding:14px; text-align:center;">
        <div style="font-size:24px; font-weight:700; color:#2dd496;">${totalAyahs}</div>
        <div style="font-size:10px; color:#4a7a66; text-transform:uppercase; letter-spacing:0.5px;">Total Ayahs</div>
      </div>
      <div style="flex:1; min-width:45%; background:rgba(255,255,255,0.02); border:1px solid rgba(45,212,150,0.06); border-radius:12px; padding:14px; text-align:center;">
        <div style="font-size:24px; font-weight:700; color:#2dd496;">${weeklyReviews}</div>
        <div style="font-size:10px; color:#4a7a66; text-transform:uppercase; letter-spacing:0.5px;">Reviews This Week</div>
      </div>
      <div style="flex:1; min-width:45%; background:rgba(255,255,255,0.02); border:1px solid rgba(45,212,150,0.06); border-radius:12px; padding:14px; text-align:center;">
        <div style="font-size:24px; font-weight:700; color:#2dd496;">${accuracyPercent}%</div>
        <div style="font-size:10px; color:#4a7a66; text-transform:uppercase; letter-spacing:0.5px;">Accuracy</div>
      </div>
      <div style="flex:1; min-width:45%; background:rgba(255,255,255,0.02); border:1px solid rgba(45,212,150,0.06); border-radius:12px; padding:14px; text-align:center;">
        <div style="font-size:24px; font-weight:700; color:#2dd496;">${streak}</div>
        <div style="font-size:10px; color:#4a7a66; text-transform:uppercase; letter-spacing:0.5px;">Day Streak</div>
      </div>
    </div>

    <!-- CTA -->
    <a href="https://quranoasis.app/practice" style="display:block; text-align:center; background:linear-gradient(135deg, #2dd496, #1a7a54); color:#fff; text-decoration:none; padding:14px; border-radius:14px; font-weight:600; font-size:15px;">
      Continue Practicing →
    </a>

    <!-- Footer -->
    <p style="color:#3a5a4c; font-size:11px; text-align:center; margin-top:24px;">
      Quran Oasis · Your AI-Powered Memorization Companion
    </p>
  </div>
</body>
</html>`;
}
