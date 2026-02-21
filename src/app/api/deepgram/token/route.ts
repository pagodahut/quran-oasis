import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Deepgram Token API Route
 * Returns a short-lived scoped token for client-side WebSocket connection
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

    // Authentication check - require signed-in user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Request a short-lived temporary token from Deepgram
    const response = await fetch('https://api.deepgram.com/v1/auth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time_to_live: 600 }),
    });

    if (!response.ok) {
      console.error('Deepgram token request failed:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to generate temporary token' },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      apiKey: data.key,
      configured: true,
      scoped: true,
      expiresIn: 600,
    });
  } catch (error) {
    console.error('Deepgram token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
