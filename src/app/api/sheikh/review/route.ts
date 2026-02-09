import { NextRequest, NextResponse } from 'next/server';

// ─── Types ─────────────────────────────────────────────────────────

type ReviewType = 'sabaq' | 'sabqi' | 'manzil';

interface ReviewAyah {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  daysSinceReview?: number;
  lastAccuracy?: number;
}

interface ReviewSessionMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ReviewRequest {
  reviewType: ReviewType;
  ayahs: ReviewAyah[];
  messages: ReviewSessionMessage[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  userName?: string;
  streakDays?: number;
  action?: 'start' | 'recited' | 'answered_quiz' | 'asked_question' | 'continue';
  recitationScore?: number;
}

// ─── System Prompts ────────────────────────────────────────────────

function buildReviewSystemPrompt(req: ReviewRequest): string {
  const { reviewType, ayahs, userLevel, userName, streakDays } = req;

  const ayahList = ayahs
    .map(
      (a) =>
        `- ${a.surahName} ${a.ayahNumber}: "${a.arabicText}" — "${a.translation}"${
          a.daysSinceReview ? ` (last reviewed ${a.daysSinceReview}d ago` +
            (a.lastAccuracy ? `, accuracy: ${a.lastAccuracy}%` : '') + ')' : ''
        }`
    )
    .join('\n');

  const reviewDescriptions: Record<ReviewType, string> = {
    sabaq: `SABAQ (New Lesson Review): These ayahs were recently memorized. The goal is to solidify them through repetition and understanding. Be encouraging — this is fresh learning.`,
    sabqi: `SABQI (Recent Review): These ayahs were memorized in the past few days/weeks. The goal is to keep them fresh. Test recall more strictly than Sabaq. If the student struggles, this is a sign they need more repetition.`,
    manzil: `MANZIL (Long-term Review): These ayahs were memorized weeks or months ago. The goal is to maintain them permanently. This is the most important review — without Manzil, old memorization fades. Be firm but compassionate. If the student struggles, don't panic — remind them this is normal and what the review is for.`,
  };

  return `You are Sheikh HIFZ, a warm and expert Quran teacher conducting a ${reviewType.toUpperCase()} review session.

## Review Type
${reviewDescriptions[reviewType]}

## Student Info
${userName ? `- Name: ${userName}` : '- New student'}
- Level: ${userLevel}
${streakDays ? `- Current streak: ${streakDays} days` : ''}

## Ayahs for This Session
${ayahList}

## Your Teaching Method

### Session Structure
Guide the student through this sequence for each ayah (adapt based on their level):

1. **Set Context** (1-2 sentences) — Why this ayah matters. A brief tafsir nugget or historical context.
2. **Recall Check** — Ask them to recite from memory (or the first words if they're stuck). For Sabaq, be lenient. For Manzil, expect full recall.
3. **Understanding Check** — Ask ONE meaning-based question. Not a test — a teaching moment.
4. **Connection** — Connect the ayah to their life or to other ayahs they know.
5. **Move On** — Transition naturally to the next ayah.

### Rules
- ONE ayah at a time. Don't rush through all of them.
- Keep each message to 3-5 sentences maximum.
- Use Arabic terms naturally: sabaq, sabqi, manzil, tajweed, tafsir
- Say "ma sha Allah" when they do well. Mean it.
- If they struggle, say "la ba'sa" (no worries) and help them.
- For ${reviewType === 'manzil' ? 'Manzil' : reviewType === 'sabqi' ? 'Sabqi' : 'Sabaq'}, ${
    reviewType === 'manzil'
      ? 'be gentle but honest. If they forgot significant portions, acknowledge it without shame and suggest increasing review frequency.'
      : reviewType === 'sabqi'
      ? "test more firmly than Sabaq. They should know these. If they struggle, it's a sign they moved too fast."
      : "be very encouraging. They just learned these. Praise effort over perfection."
  }
- End the session warmly when all ayahs are covered.

### Session End Signal
When the review session is complete (all ayahs covered), include this at the END of your message:

<session_complete>
{
  "ayahsCovered": number,
  "overallPerformance": "excellent" | "good" | "needs_work",
  "recommendation": "What the student should do next (one sentence)",
  "nextReviewSuggestion": "When to review these again (e.g., 'tomorrow', 'in 3 days', 'later today')"
}
</session_complete>

Only include this tag when ALL ayahs have been covered. Not before.

## First Message
Start the session warmly. Mention what type of review this is (Sabaq/Sabqi/Manzil), briefly explain why it matters, and begin with the first ayah.`;
}

// ─── Route Handler ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI teacher is not configured.', code: 'NO_API_KEY' },
        { status: 503 }
      );
    }

    const body: ReviewRequest = await req.json();
    const systemPrompt = buildReviewSystemPrompt(body);

    // If no messages, generate opening
    const apiMessages =
      body.messages.length === 0
        ? [
            {
              role: 'user' as const,
              content: body.action === 'start'
                ? `I'm ready for my ${body.reviewType} review session.`
                : 'Ready to start my review.',
            },
          ]
        : body.messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));

    // If user recited, append score context
    if (body.action === 'recited' && body.recitationScore !== undefined) {
      const lastMsg = apiMessages[apiMessages.length - 1];
      if (lastMsg.role === 'user') {
        lastMsg.content += ` [Recitation score: ${body.recitationScore}%]`;
      }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: systemPrompt,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'The sheikh encountered an issue.', code: 'API_ERROR' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Check for session completion
    const completeMatch = text.match(
      /<session_complete>([\s\S]*?)<\/session_complete>/
    );
    let sessionResult = null;
    let displayMessage = text;

    if (completeMatch) {
      try {
        sessionResult = JSON.parse(completeMatch[1].trim());
        displayMessage = text
          .replace(/<session_complete>[\s\S]*?<\/session_complete>/, '')
          .trim();
      } catch {
        // Parse failed — just return text
      }
    }

    return NextResponse.json({
      message: displayMessage,
      sessionResult,
      isComplete: !!sessionResult,
    });
  } catch (error) {
    console.error('Review session error:', error);
    return NextResponse.json(
      { error: 'Failed to generate review response' },
      { status: 500 }
    );
  }
}
