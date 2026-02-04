import { NextRequest, NextResponse } from 'next/server';

/**
 * Audio Transcription API Route
 * Uses OpenAI Whisper to transcribe Arabic recitation
 * Server-side to protect API key
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Transcription service not configured' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Forward to OpenAI Whisper
    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, 'recitation.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', 'ar');
    whisperForm.append('response_format', 'text');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: whisperForm,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Whisper API error:', error);
      return NextResponse.json(
        { error: 'Transcription failed' },
        { status: response.status }
      );
    }

    const transcription = await response.text();
    
    return NextResponse.json({ transcription });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
