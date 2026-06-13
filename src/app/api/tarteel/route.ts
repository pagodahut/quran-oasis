import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Tarteel Transcription API Route
 * Proxies audio to Modal-hosted Tarteel Whisper model
 * 
 * The Tarteel model (tarteel-ai/whisper-base-ar-quran) is specifically
 * fine-tuned for Quranic Arabic and returns diacritized text.
 * 
 * Cold start can take 15-30s on first request. The client should
 * handle this gracefully (show loading state, fall back to WebSpeech).
 */

const TARTEEL_ENDPOINT = process.env.MODAL_WHISPER_URL || 'https://pagodahut--hifz-whisper-transcribe-api.modal.run';
const TARTEEL_TIMEOUT_MS = 45000; // 45s to handle cold starts

export async function POST(request: NextRequest) {
  try {
    // Auth is optional — guest users fall back to WebSpeech if Tarteel unavailable
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

    // Forward to Modal Tarteel endpoint with generous timeout for cold starts
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TARTEEL_TIMEOUT_MS);

    try {
      const startTime = Date.now();
      const response = await fetch(TARTEEL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_base64 }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tarteel API error:', response.status, errorText);
        return NextResponse.json(
          { error: 'Transcription failed' },
          { status: response.status }
        );
      }

      const result = await response.json();

      return NextResponse.json({
        ...result,
        provider: 'tarteel-whisper',
        latencyMs,
      });
    } catch (error) {
      clearTimeout(timeout);
      if ((error as Error).name === 'AbortError') {
        return NextResponse.json(
          { error: 'Tarteel endpoint timeout (cold start?)', timeout: true },
          { status: 504 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Tarteel transcription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check — uses a lightweight GET endpoint if available,
// falls back to POST ping
export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    // Try the dedicated health endpoint (no GPU needed, fast)
    const healthUrl = TARTEEL_ENDPOINT.replace('transcribe-api', 'health').replace(/\/+$/, '');
    
    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        return NextResponse.json({
          configured: true,
          endpoint: 'modal',
          model: 'tarteel-ai/whisper-base-ar-quran',
          warm: true,
        });
      }
    } catch {
      // Health endpoint may not exist yet, fall back to POST ping
    }

    // Fallback: POST ping with short timeout
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 3000);

    const response = await fetch(TARTEEL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_base64: '' }),
      signal: controller2.signal,
    });
    clearTimeout(timeout2);

    const isAlive = response.status < 500;

    return NextResponse.json({
      configured: isAlive,
      endpoint: 'modal',
      model: 'tarteel-ai/whisper-base-ar-quran',
      warm: isAlive,
    });
  } catch {
    return NextResponse.json({
      configured: false,
      endpoint: 'modal',
      fallback: 'webspeech',
      warm: false,
    });
  }
}
