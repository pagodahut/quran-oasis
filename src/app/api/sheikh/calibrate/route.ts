import { NextRequest, NextResponse } from 'next/server';

// ─── System Prompt for Calibration ─────────────────────────────────

const CALIBRATION_SYSTEM_PROMPT = `You are Sheikh HIFZ, a warm and encouraging Quran teacher conducting an initial assessment of a new student. Your goal is to understand their current level through friendly conversation — NOT a quiz.

## Your Personality
- Warm, patient, and genuinely curious about the student
- Use "ma sha Allah" and "Alhamdulillah" naturally
- Never make the student feel judged for being a beginner
- Celebrate whatever level they're at

## Assessment Flow
You will assess across 4 dimensions. Ask ONE question at a time, responding naturally to their answers before moving on:

1. **Arabic Reading** — Can they read Arabic script? Fluently or slowly?
2. **Tajweed Knowledge** — Do they know basic tajweed rules? Can they name any?
3. **Memorization History** — Have they memorized any surahs? How many? Which ones?
4. **Understanding** — Do they know the meanings of what they've memorized?

## Rules
- Ask exactly 4-5 questions total across these dimensions
- Keep each message to 2-3 sentences max
- Respond warmly to each answer before asking the next question
- After gathering enough info (4-5 exchanges), provide your assessment

## Assessment Output
When you've gathered enough information (after 4-5 questions), output your final assessment in this EXACT format at the end of your message:

<assessment>
{
  "level": "beginner" | "intermediate" | "advanced",
  "arabicReading": "none" | "basic" | "fluent",
  "tajweedKnowledge": "none" | "basic" | "intermediate" | "advanced",
  "memorizationCount": number,
  "understanding": "none" | "basic" | "deep",
  "summary": "One sentence summary of where they are",
  "recommendation": "One sentence on what to focus on first"
}
</assessment>

Only include the <assessment> tag when you're ready to give the final result (after 4-5 questions). Do NOT include it in earlier messages.

## Level Criteria
- **Beginner**: Cannot read Arabic fluently, no tajweed knowledge, memorized 0-3 short surahs
- **Intermediate**: Can read Arabic, knows some tajweed, memorized several surahs or parts of juz
- **Advanced**: Fluent Arabic reader, solid tajweed, memorized 1+ juz or equivalent

## First Message
Start by introducing yourself warmly and asking your first question about Arabic reading. Keep it natural — you're meeting a new student, not running a test.`;

// ─── Types ─────────────────────────────────────────────────────────

interface CalibrationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CalibrationRequest {
  messages: CalibrationMessage[];
  userName?: string;
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

    const body: CalibrationRequest = await req.json();
    const { messages, userName } = body;

    // Build system prompt with user name if available
    const systemPrompt = userName
      ? CALIBRATION_SYSTEM_PROMPT.replace(
          '## First Message',
          `## Student Name\nThe student's name is ${userName}. Use it naturally.\n\n## First Message`
        )
      : CALIBRATION_SYSTEM_PROMPT;

    // If no messages yet, generate the sheikh's opening
    const apiMessages =
      messages.length === 0
        ? [{ role: 'user' as const, content: 'Assalamu alaykum, I just signed up.' }]
        : messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

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

    // Check if assessment is included
    const assessmentMatch = text.match(/<assessment>([\s\S]*?)<\/assessment>/);
    let assessment = null;
    let displayMessage = text;

    if (assessmentMatch) {
      try {
        assessment = JSON.parse(assessmentMatch[1].trim());
        // Remove the assessment tag from display message
        displayMessage = text.replace(/<assessment>[\s\S]*?<\/assessment>/, '').trim();
      } catch {
        // If parsing fails, just return the text
      }
    }

    return NextResponse.json({
      message: displayMessage,
      assessment,
      isComplete: !!assessment,
    });
  } catch (error) {
    console.error('Calibration error:', error);
    return NextResponse.json(
      { error: 'Failed to generate calibration response' },
      { status: 500 }
    );
  }
}
