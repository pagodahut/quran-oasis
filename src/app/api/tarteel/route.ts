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
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
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

// Health check - verify endpoint is available
export async function GET() {
  try {
    // Just return configured status (don't ping Modal to avoid cold starts)
    return NextResponse.json({
      configured: true,
      endpoint: 'modal',
      model: 'tarteel-ai/whisper-base-ar-quran',
    });
  } catch {
    return NextResponse.json(
      { configured: false },
      { status: 503 }
    );
  }
}
