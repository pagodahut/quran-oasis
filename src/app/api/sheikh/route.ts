/**
 * AI Sheikh API Route V2 — Context-Aware
 * 
 * POST /api/sheikh
 * 
 * Now accepts pageContext and tajweedResults for full situational awareness.
 * Uses buildFullSystemPrompt() to combine all context into one system prompt.
 * 
 * Request body:
 * {
 *   messages: Array<{ role: 'user' | 'assistant', content: string }>,
 *   ayahContext?: AyahContext,
 *   userLevel?: 'beginner' | 'intermediate' | 'advanced',
 *   userProfile?: UserProfile,
 *   pageContext?: PageContext,        // NEW: which page + metadata
 *   tajweedResults?: TajweedResult[], // NEW: recent tajweed analysis
 * }
 */

import { NextRequest } from 'next/server';
import { buildFullSystemPrompt, type PageContext, type TajweedResult } from '@/lib/sheikh-prompt';

// ─── Types ───────────────────────────────────────────────────────────

interface AyahContext {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
  juz?: number;
  hizb?: number;
  page?: number;
}

interface UserProfile {
  level: 'beginner' | 'intermediate' | 'advanced';
  memorizedSurahs?: string[];
  currentStreak?: number;
  totalVersesMemorized?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SheikhRequest {
  messages: ChatMessage[];
  ayahContext?: AyahContext;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  userProfile?: UserProfile;
  pageContext?: PageContext;
  tajweedResults?: TajweedResult[];
}

// ─── Route Handler ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'AI teacher is not configured. Please add your Anthropic API key.',
          code: 'NO_API_KEY',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: SheikhRequest = await request.json();
    const { messages, ayahContext, userLevel, userProfile, pageContext, tajweedResults } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required', code: 'INVALID_REQUEST' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const MAX_MESSAGES = 20;
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    // Build the full context-aware system prompt
    const systemPrompt = buildFullSystemPrompt({
      ayahContext,
      userProfile,
      userLevel,
      pageContext,
      tajweedResults,
    });

    // Call Claude API with streaming
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: trimmedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'The sheikh is resting. Please try again in a moment.',
            code: 'RATE_LIMITED',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (response.status === 401) {
        return new Response(
          JSON.stringify({
            error: 'AI teacher authentication failed. Please check your API key.',
            code: 'AUTH_FAILED',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          error: 'The sheikh encountered an issue. Please try again.',
          code: 'API_ERROR',
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);

                  if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
                  }

                  if (parsed.type === 'message_stop') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  }

                  if (parsed.type === 'error') {
                    console.error('Stream error:', parsed.error);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Connection lost' })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Sheikh API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Something went wrong. Please try again.',
        code: 'INTERNAL_ERROR',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
