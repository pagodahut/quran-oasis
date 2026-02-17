import { NextRequest, NextResponse } from 'next/server';

// ─── System Prompt for Calibration ─────────────────────────────────

const CALIBRATION_SYSTEM_PROMPT = `You are Sheikh HIFZ, a warm Quran teacher assessing a new student. Be friendly but concise — 1-2 sentences per message max.

## Flow (exactly 3 questions, one at a time)
1. **Arabic level** — Can they read Arabic? How well?
2. **Goal** — What do they want to achieve? (full hifz, juz amma, selected surahs, or daily recitation)
3. **Time** — How many minutes per day can they commit?

After each answer, acknowledge briefly (half a sentence) then ask the next question. No filler, no lectures.

## Rules
- Max 1-2 sentences per message. Warm but brief.
- Use "ma sha Allah" or "Alhamdulillah" sparingly — once or twice total, not every message.
- After the 3rd answer, give a short encouraging wrap-up (1 sentence) and output your assessment.

## Assessment Output
After question 3, include this at the end of your message:

<assessment>
{
  "level": "beginner" | "intermediate" | "advanced",
  "arabicReading": "none" | "basic" | "fluent",
  "tajweedKnowledge": "none" | "basic" | "intermediate" | "advanced",
  "memorizationCount": number,
  "understanding": "none" | "basic" | "deep",
  "summary": "One sentence summary",
  "recommendation": "One sentence recommendation"
}
</assessment>

Infer tajweed knowledge and understanding from the Arabic level (beginners likely have none; fluent readers likely have some). Set memorizationCount to 0 for beginners unless they mention otherwise.

## Level Criteria
- **Beginner**: Can't read Arabic fluently, memorized 0-3 short surahs
- **Intermediate**: Can read Arabic, memorized several surahs or parts of a juz
- **Advanced**: Fluent reader, memorized 1+ juz

## First Message
Greet them warmly (1 sentence) and ask about their Arabic reading level.`;

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
