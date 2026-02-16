/**
 * Tarteel Whisper Transcription API
 * 
 * Routes audio to our Modal-deployed Tarteel Whisper model.
 * Falls back to local inference if Modal is unavailable.
 * 
 * @see /docs/TARTEEL_INTEGRATION_PLAN.md
 */

import { NextRequest, NextResponse } from 'next/server';

// Modal endpoint URL (set after deployment)
const MODAL_WHISPER_URL = process.env.MODAL_WHISPER_URL || '';

// Alternative: Hugging Face Inference API
const HF_INFERENCE_URL = 'https://api-inference.huggingface.co/models/tarteel-ai/whisper-base-ar-quran';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

interface TranscriptionResponse {
  text: string;
  provider: 'modal' | 'huggingface' | 'local';
  model: string;
  latencyMs?: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Transcribe using Modal endpoint
 */
async function transcribeWithModal(audioBuffer: ArrayBuffer): Promise<TranscriptionResponse> {
  if (!MODAL_WHISPER_URL) {
    throw new Error('MODAL_WHISPER_URL not configured');
  }
  
  // Convert to base64 for Modal endpoint
  const audioBase64 = arrayBufferToBase64(audioBuffer);
  
  const response = await fetch(MODAL_WHISPER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audio_base64: audioBase64 }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Modal API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Transcription failed');
  }
  
  // Clean up any special tokens that might be in the output
  let text = data.text || '';
  text = text.replace(/<\|[^|]+\|>/g, '').trim();
  
  return {
    text,
    provider: 'modal',
    model: data.model || 'tarteel-ai/whisper-base-ar-quran',
    words: data.words,
  };
}

/**
 * Transcribe using Hugging Face Inference API (fallback)
 */
async function transcribeWithHuggingFace(audioBuffer: ArrayBuffer): Promise<TranscriptionResponse> {
  if (!HF_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY not configured');
  }
  
  const response = await fetch(HF_INFERENCE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'audio/wav',
    },
    body: audioBuffer,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  
  return {
    text: data.text || '',
    provider: 'huggingface',
    model: 'tarteel-ai/whisper-base-ar-quran',
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse audio from request
    const contentType = request.headers.get('content-type') || '';
    let audioBuffer: ArrayBuffer;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;
      
      if (!audioFile) {
        return NextResponse.json(
          { error: 'No audio file provided' },
          { status: 400 }
        );
      }
      
      audioBuffer = await audioFile.arrayBuffer();
    } else {
      // Raw audio bytes
      audioBuffer = await request.arrayBuffer();
    }
    
    if (audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Empty audio data' },
        { status: 400 }
      );
    }
    
    // Try Modal first, then HuggingFace
    let result: TranscriptionResponse;
    
    try {
      result = await transcribeWithModal(audioBuffer);
    } catch (modalError) {
      console.warn('Modal transcription failed, trying HuggingFace:', modalError);
      
      try {
        result = await transcribeWithHuggingFace(audioBuffer);
      } catch (hfError) {
        console.error('All transcription methods failed:', { modalError, hfError });
        throw new Error('Transcription service unavailable');
      }
    }
    
    const latencyMs = Date.now() - startTime;
    
    return NextResponse.json({
      ...result,
      latencyMs,
    });
    
  } catch (error) {
    console.error('Transcription error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Transcription failed',
        provider: 'error',
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: 'tarteel-transcription',
    model: 'tarteel-ai/whisper-base-ar-quran',
    modalConfigured: !!MODAL_WHISPER_URL,
    hfConfigured: !!HF_API_KEY,
    status: 'ok',
  });
}
