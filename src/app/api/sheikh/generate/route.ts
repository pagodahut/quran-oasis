/**
 * AI Sheikh Generate API — Non-Streaming Content Generation
 * 
 * POST /api/sheikh/generate
 * 
 * Unlike the main /api/sheikh endpoint (which streams chat responses),
 * this endpoint returns complete JSON responses for:
 *   - Pre-lesson briefings
 *   - Post-lesson reflections
 *   - Dashboard greetings
 *   - Tajweed feedback (routed through sheikh personality)
 * 
 * These are short, focused messages — not full conversations.
 * 
 * Request body:
 * {
 *   type: 'briefing' | 'reflection' | 'greeting' | 'tajweed',
 *   context: { ... type-specific context }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Types ───────────────────────────────────────────────────────────

interface AyahInfo {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumberStart: number;
  ayahNumberEnd: number;
  arabicText: string;
  translation: string;
}

interface BriefingRequest {
  type: 'briefing';
  context: {
    lessonTitle: string;
    ayahs: AyahInfo[];
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    isReview?: boolean;
  };
}

interface ReflectionRequest {
  type: 'reflection';
  context: {
    lessonTitle: string;
    ayahs: AyahInfo[];
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    /** How the lesson went */
    performance: {
      ayahsMemorized: number;
      totalAttempts: number;
      perfectRecitations: number;
      timeSpentMinutes: number;
      /** Any particular ayahs they struggled with */
      struggles?: string[];
    };
    xpEarned?: number;
    streakDays?: number;
  };
}

interface GreetingRequest {
  type: 'greeting';
  context: {
    userName?: string;
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    /** Time of day: fajr, morning, afternoon, evening, night */
    timeOfDay: 'fajr' | 'morning' | 'afternoon' | 'evening' | 'night';
    streakDays?: number;
    totalVersesMemorized?: number;
    totalSurahsCompleted?: number;
    /** What surah/juz they're currently in */
    currentProgress?: string;
    /** Last studied ayah info */
    lastStudied?: {
      surahName: string;
      ayahNumber: number;
      daysAgo: number;
    };
    /** Upcoming milestone */
    nextMilestone?: string;
  };
}

interface TajweedFeedbackRequest {
  type: 'tajweed';
  context: {
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    /** The ayah they recited */
    ayah: AyahInfo;
    /** Raw tajweed analysis results */
    tajweedResults: {
      rule: string;
      location: string;
      feedback: string;
      severity: 'correct' | 'minor' | 'major';
    }[];
    /** Overall accuracy score 0-100 */
    overallScore: number;
    /** Attempt number (1st try, 2nd try, etc.) */
    attemptNumber: number;
  };
}

type GenerateRequest =
  | BriefingRequest
  | ReflectionRequest
  | GreetingRequest
  | TajweedFeedbackRequest;

// ─── Prompt Builders ────────────────────────────────────────────────

const SHEIKH_PERSONA = `You are Sheikh HIFZ — a wise, warm Quran teacher. You speak with warmth and encouragement. You say ﷺ after the Prophet Muhammad, عليه السلام after other Prophets, and سبحانه وتعالى after Allah. Be concise and impactful — these are brief teaching moments, not lectures.`;

function buildBriefingPrompt(ctx: BriefingRequest['context']): string {
  const ayahRange = ctx.ayahs.length > 0
    ? `${ctx.ayahs[0].surahName} ${ctx.ayahs[0].ayahNumberStart}-${ctx.ayahs[ctx.ayahs.length - 1].ayahNumberEnd}`
    : ctx.lessonTitle;

  const ayahTexts = ctx.ayahs
    .map((a) => `${a.arabicText}\n"${a.translation}"`)
    .join('\n\n');

  return `${SHEIKH_PERSONA}

## Task: Pre-Lesson Briefing

The student is about to ${ctx.isReview ? 'REVIEW' : 'memorize'} ${ayahRange}.

Student level: ${ctx.userLevel}

Ayahs they will study:
${ayahTexts}

Generate a brief, inspiring pre-lesson message (3-5 sentences max). Include:
1. A warm opening (Bismillah or similar)
2. What these ayahs are about (theme/context — make it meaningful, not academic)
3. ONE practical tip (a tajweed point to listen for, a meaning-based memory anchor, or a connection between the ayahs)

${ctx.isReview ? 'Since this is review, focus on strengthening their connection to the meaning and celebrating that they already know this.' : ''}

Respond in JSON format:
{
  "message": "your message here",
  "tip": "the practical tip extracted as a standalone line",
  "theme": "2-3 word theme label (e.g., 'Patience & Trust', 'Divine Mercy')"
}`;
}

function buildReflectionPrompt(ctx: ReflectionRequest['context']): string {
  const ayahRange = ctx.ayahs.length > 0
    ? `${ctx.ayahs[0].surahName} ${ctx.ayahs[0].ayahNumberStart}-${ctx.ayahs[ctx.ayahs.length - 1].ayahNumberEnd}`
    : ctx.lessonTitle;

  const perf = ctx.performance;
  const accuracy = perf.totalAttempts > 0
    ? Math.round((perf.perfectRecitations / perf.totalAttempts) * 100)
    : 0;

  return `${SHEIKH_PERSONA}

## Task: Post-Lesson Reflection

The student just completed a lesson on ${ayahRange}.

Student level: ${ctx.userLevel}

Performance:
- Ayahs memorized: ${perf.ayahsMemorized}
- Total attempts: ${perf.totalAttempts}
- Perfect recitations: ${perf.perfectRecitations} (${accuracy}% accuracy)
- Time spent: ${perf.timeSpentMinutes} minutes
${perf.struggles?.length ? `- Struggled with: ${perf.struggles.join(', ')}` : ''}
${ctx.xpEarned ? `- XP earned: ${ctx.xpEarned}` : ''}
${ctx.streakDays ? `- Current streak: ${ctx.streakDays} days` : ''}

Ayahs studied:
${ctx.ayahs.map((a) => `"${a.translation}"`).join('\n')}

Generate a warm post-lesson reflection (3-5 sentences). Include:
1. Celebration of their effort (use "Ma sha Allah", "Alhamdulillah", etc. naturally)
2. A beautiful insight about what they just memorized (brief tafsir nugget or spiritual reflection)
3. ${perf.struggles?.length ? 'Gentle encouragement about the parts they struggled with' : 'An inspiring hadith or saying about learning Quran'}
4. A forward-looking statement that builds anticipation for tomorrow

${accuracy >= 90 ? 'They did EXCELLENT. Celebrate strongly!' : accuracy >= 70 ? 'They did well but have room to grow. Balance praise with encouragement.' : 'They struggled. Be extra gentle and focus on effort, not results.'}

Respond in JSON format:
{
  "message": "your reflection message",
  "insight": "the tafsir/spiritual insight as a standalone quote",
  "hadith": "relevant hadith or saying (with attribution), or null if none fits naturally"
}`;
}

function buildGreetingPrompt(ctx: GreetingRequest['context']): string {
  const timeGreetings: Record<string, string> = {
    fajr: "It's Fajr time — the blessed early morning.",
    morning: "It's morning — a fresh start.",
    afternoon: "It's afternoon.",
    evening: "It's evening.",
    night: "It's nighttime.",
  };

  return `${SHEIKH_PERSONA}

## Task: Dashboard Greeting

${timeGreetings[ctx.timeOfDay]}
${ctx.userName ? `Student's name: ${ctx.userName}` : ''}
Student level: ${ctx.userLevel}
${ctx.streakDays ? `Current streak: ${ctx.streakDays} days` : 'No active streak'}
${ctx.totalVersesMemorized ? `Total verses memorized: ${ctx.totalVersesMemorized}` : ''}
${ctx.totalSurahsCompleted ? `Surahs completed: ${ctx.totalSurahsCompleted}` : ''}
${ctx.currentProgress ? `Currently in: ${ctx.currentProgress}` : ''}
${ctx.lastStudied ? `Last studied: ${ctx.lastStudied.surahName} ayah ${ctx.lastStudied.ayahNumber} (${ctx.lastStudied.daysAgo} days ago)` : ''}
${ctx.nextMilestone ? `Next milestone: ${ctx.nextMilestone}` : ''}

Generate a personalized greeting (1-2 sentences MAX — this is a dashboard header, not a conversation).

Make it:
- Time-appropriate (reference Fajr, evening, etc. naturally — tie to Sunnah if relevant)
- Progress-aware (reference their streak, progress, or what they should study next)
- Warm but brief — think teacher greeting you as you walk in

${ctx.lastStudied && ctx.lastStudied.daysAgo > 3 ? 'They haven\'t studied in a few days — be welcoming without guilt-tripping.' : ''}
${ctx.streakDays && ctx.streakDays >= 7 ? 'Celebrate their consistency!' : ''}

Also generate 2-3 contextual question chips (short phrases the student can tap to start a conversation with the sheikh).

Respond in JSON format:
{
  "greeting": "your greeting (1-2 sentences)",
  "suggestedQuestions": ["question 1", "question 2", "question 3"]
}`;
}

function buildTajweedFeedbackPrompt(ctx: TajweedFeedbackRequest['context']): string {
  const results = ctx.tajweedResults;
  const correct = results.filter((r) => r.severity === 'correct');
  const minor = results.filter((r) => r.severity === 'minor');
  const major = results.filter((r) => r.severity === 'major');

  return `${SHEIKH_PERSONA}

## Task: Tajweed Feedback (as a teacher, not a robot)

The student just recited ${ctx.ayah.surahName} ${ctx.ayah.ayahNumberStart}${ctx.ayah.ayahNumberEnd !== ctx.ayah.ayahNumberStart ? `-${ctx.ayah.ayahNumberEnd}` : ''}.

Student level: ${ctx.userLevel}
Overall score: ${ctx.overallScore}/100
Attempt #${ctx.attemptNumber}

Arabic text: ${ctx.ayah.arabicText}

Tajweed analysis:
${correct.length > 0 ? `✅ Correct: ${correct.map((r) => `${r.rule} at "${r.location}"`).join(', ')}` : ''}
${minor.length > 0 ? `⚠️ Minor issues: ${minor.map((r) => `${r.rule} at "${r.location}" — ${r.feedback}`).join('; ')}` : ''}
${major.length > 0 ? `❌ Needs work: ${major.map((r) => `${r.rule} at "${r.location}" — ${r.feedback}`).join('; ')}` : ''}

Transform this technical analysis into warm, teacher-like feedback. Rules:
- Start with what they did RIGHT (always find something positive)
- Pick the 1-2 MOST important corrections (don't overwhelm with all errors)
- Explain the rule simply with a pronunciation tip
- If this is attempt 2+, acknowledge their persistence
- Keep it under 4 sentences for the main feedback

${ctx.overallScore >= 90 ? 'Excellent recitation! Be celebratory. Minor polishing only.' : ctx.overallScore >= 70 ? 'Good effort with room to improve. Balance praise and correction.' : 'They are struggling. Be very encouraging. Focus on one thing at a time.'}

Respond in JSON format:
{
  "feedback": "your warm feedback message",
  "corrections": [
    {
      "rule": "rule name",
      "location": "where in the ayah",
      "explanation": "simple, friendly explanation of what to do differently",
      "priority": "high" | "medium" | "low"
    }
  ],
  "overallTone": "excellent" | "good" | "encouraging",
  "shouldRetry": true/false (suggest retry if score < 80)
}`;
}

// ─── Route Handler ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI teacher is not configured.', code: 'NO_API_KEY' },
        { status: 503 }
      );
    }

    const body: GenerateRequest = await request.json();

    if (!body.type || !body.context) {
      return NextResponse.json(
        { error: 'Missing type or context', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // Build the appropriate prompt
    let prompt: string;
    switch (body.type) {
      case 'briefing':
        prompt = buildBriefingPrompt(body.context);
        break;
      case 'reflection':
        prompt = buildReflectionPrompt(body.context);
        break;
      case 'greeting':
        prompt = buildGreetingPrompt(body.context);
        break;
      case 'tajweed':
        prompt = buildTajweedFeedbackPrompt(body.context);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type', code: 'INVALID_TYPE' },
          { status: 400 }
        );
    }

    // Call Claude API (non-streaming for short content)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
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
    const rawText = data.content?.[0]?.text || '';

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, return raw text wrapped
      parsed = { message: rawText, _parseError: true };
    }

    return NextResponse.json({
      type: body.type,
      data: parsed,
    });
  } catch (error) {
    console.error('Sheikh Generate API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
