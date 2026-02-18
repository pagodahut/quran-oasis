import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Tarteel Transcription API Route
 * Proxies audio to Modal-hosted Tarteel Whisper model
 * 
 * The Tarteel model (tarteel-ai/whisper-base-ar-quran) is specifically
 * fine-tuned for Quranic Arabic and returns diacritized text.
 */

const TARTEEL_ENDPOINT = 'https://pagodahut--hifz-whisper-transcribe-api.modal.run';

export async function POST(request: NextRequest) {
  try {
    // Auth is optional — guest users fall back to WebSpeech if Tarteel unavailable
    // but we still check for rate limiting purposes
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch {
      // Auth not available — proceed anyway
    }

    const body = await request.json();
    const { audio_base64 } = body;

    if (!audio_base64) {
      return NextResponse.json(
        { error: 'No audio_base64 provided' },
        { status: 400 }
      );
    }

    // Forward to Modal Tarteel endpoint
    const response = await fetch(TARTEEL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_base64 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tarteel API error:', errorText);
      return NextResponse.json(
        { error: 'Transcription failed', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Tarteel transcription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check - verify endpoint is actually reachable
export async function GET() {
  try {
    // Quick health ping with short timeout — avoids cold-start wait
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(TARTEEL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_base64: '' }), // Empty ping
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    // Even a 400 means the endpoint is alive
    const isAlive = response.status < 500;
    
    return NextResponse.json({
      configured: isAlive,
      endpoint: 'modal',
      model: 'tarteel-ai/whisper-base-ar-quran',
    });
  } catch {
    // Endpoint unreachable — fallback to WebSpeech
    return NextResponse.json({
      configured: false,
      endpoint: 'modal',
      fallback: 'webspeech',
    });
  }
}
