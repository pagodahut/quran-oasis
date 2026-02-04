import { NextRequest, NextResponse } from 'next/server';

/**
 * Deepgram Token API Route
 * Returns API key for client-side WebSocket connection
 * 
 * NOTE: In production, this should:
 * 1. Generate temporary/scoped tokens via Deepgram's API
 * 2. Implement rate limiting per user
 * 3. Log usage for monitoring
 * 
 * For now, returns the key directly (still better than NEXT_PUBLIC_)
 */

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: 'Real-time transcription not configured', configured: false },
        { status: 503 }
      );
    }

    // TODO: Add authentication check here
    // const session = await getSession(request);
    // if (!session) return unauthorized();

    // TODO: Add rate limiting
    // const canProceed = await checkRateLimit(session.userId);
    // if (!canProceed) return tooManyRequests();

    return NextResponse.json({ 
      apiKey: DEEPGRAM_API_KEY,
      configured: true,
      // Indicate this is a full key (not scoped) - for monitoring
      scoped: false,
    });
  } catch (error) {
    console.error('Deepgram token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
