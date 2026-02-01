import { NextRequest, NextResponse } from 'next/server';

/**
 * Tajweed Analysis API Route
 * Uses Claude to analyze Quran recitation transcription against expected text
 * This is a PREMIUM feature
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface AnalyzeRequest {
  transcription: string;
  expectedText: string;
  surah: number;
  ayah: number;
}

interface TajweedAnalysis {
  accuracy: number;
  overall: 'excellent' | 'good' | 'needs_practice';
  pronunciationFeedback: {
    word: string;
    issue?: string;
    correction?: string;
    rule?: string;
  }[];
  generalFeedback: string;
  encouragement: string;
  specificTips: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Tajweed AI analysis is not configured', premium: true },
        { status: 503 }
      );
    }

    const body: AnalyzeRequest = await request.json();
    const { transcription, expectedText, surah, ayah } = body;

    if (!transcription || !expectedText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Claude API for analysis
    const analysis = await analyzeWithClaude(transcription, expectedText, surah, ayah);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Tajweed analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze recitation' },
      { status: 500 }
    );
  }
}

async function analyzeWithClaude(
  transcription: string,
  expectedText: string,
  surah: number,
  ayah: number
): Promise<TajweedAnalysis> {
  const systemPrompt = `You are an expert Quran recitation teacher specializing in Tajweed (proper Quranic recitation). 
You are kind, encouraging, and patient - like a beloved teacher.

Your task is to compare a student's recitation transcription against the correct Quranic text and provide helpful feedback.

Key Tajweed rules to look for:
- Noon Sakinah/Tanween rules (Ikhfa, Idgham, Iqlab, Izhar)
- Madd (elongation) - natural, connected, and necessary
- Qalqalah (echo on ق ط ب ج د)
- Ghunnah (nasalization on noon and meem with shaddah)
- Tafkheem (heavy letters: خ ص ض غ ط ق ظ)
- Stopping rules and proper pronunciation

Be specific about any pronunciation differences you detect, but always be encouraging.
If the transcription is close but not exact, acknowledge the effort while providing gentle corrections.

Respond in JSON format only.`;

  const userPrompt = `Analyze this Quran recitation:

**Surah ${surah}, Ayah ${ayah}**

**Expected text (correct):**
${expectedText}

**Student's recitation (transcribed):**
${transcription}

Provide your analysis in this exact JSON format:
{
  "accuracy": <number 0-100>,
  "overall": "<excellent|good|needs_practice>",
  "pronunciationFeedback": [
    {
      "word": "<Arabic word>",
      "issue": "<what was different>",
      "correction": "<how to say it correctly>",
      "rule": "<tajweed rule if applicable>"
    }
  ],
  "generalFeedback": "<1-2 sentences about overall recitation quality>",
  "encouragement": "<encouraging message with emoji>",
  "specificTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

If the recitation is very close to correct, give a high accuracy score and positive feedback.
Focus on the most important improvements, not every tiny detail.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('No response from Claude');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Claude response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as TajweedAnalysis;

    // Ensure all required fields
    return {
      accuracy: analysis.accuracy || 80,
      overall: analysis.overall || 'good',
      pronunciationFeedback: analysis.pronunciationFeedback || [],
      generalFeedback: analysis.generalFeedback || 'Good effort on your recitation.',
      encouragement: analysis.encouragement || 'Keep practicing! Every recitation brings you closer to perfection. 🌟',
      specificTips: analysis.specificTips || [
        'Listen to the verse multiple times before recording',
        'Practice slowly and clearly',
        'Focus on one tajweed rule at a time',
      ],
    };
  } catch (error) {
    console.error('Claude analysis failed:', error);
    
    // Return fallback analysis
    return {
      accuracy: 75,
      overall: 'good',
      pronunciationFeedback: [],
      generalFeedback: 'Your recitation shows good effort. Keep practicing to improve your tajweed.',
      encouragement: 'Mashallah! Keep up the great work. The Prophet ﷺ said the one who struggles with the Quran gets double the reward. 🌟',
      specificTips: [
        'Listen to the verse being recited by a professional reciter',
        'Practice at a slower pace to perfect your pronunciation',
        'Record yourself and compare to the original',
      ],
    };
  }
}
