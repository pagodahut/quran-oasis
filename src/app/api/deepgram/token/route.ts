import { NextRequest, NextResponse } from 'next/server';

/**
 * Deepgram Token API Route
 *
 * Returns a short-lived scoped token for the client-side Deepgram WebSocket
 * connection. This is the legacy/fallback path — the primary speech recognition
 * provider is now Tarteel Whisper (TarteelService), with Web Speech API as the
 * secondary fallback. Deepgram is only used when both of those are unavailable.
 *
 * Auth note: authentication is intentionally not required here because:
 * 1. This is a personal HIFZ app — all users are trusted
 * 2. The primary provider (Tarteel) doesn't require auth either
 * 3. Rate limiting is handled at the Deepgram account level
 *
 * API keys checked (in priority order):
 *   DEEPGRAM_API_KEY — server-side only (preferred, set this in .env.local)
 *   NEXT_PUBLIC_DEEPGRAM_API_KEY — also accessible server-side (fallback)
 */

// Only use server-side API key — never use NEXT_PUBLIC_ for secrets
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function GET(_request: NextRequest) {
  try {
    if (!DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: 'Deepgram not configured. Set DEEPGRAM_API_KEY in .env.local', configured: false },
        { status: 503 }
      );
    }

    // Request a short-lived temporary token from Deepgram
    // (avoids exposing the raw API key to the browser)
    const response = await fetch('https://api.deepgram.com/v1/auth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time_to_live: 600 }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Deepgram token] Request failed:', response.status, errText);
      return NextResponse.json(
        { error: 'Failed to generate Deepgram token', configured: true },
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
    console.error('[Deepgram token] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', configured: false },
      { status: 500 }
    );
  }
}
