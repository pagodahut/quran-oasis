/**
 * AI Sheikh API Route
 * 
 * POST /api/sheikh
 * 
 * Handles conversational AI teaching powered by Claude.
 * Supports streaming responses for real-time chat experience.
 * 
 * Request body:
 * {
 *   messages: Array<{ role: 'user' | 'assistant', content: string }>,
 *   ayahContext?: { surahNumber, surahName, surahNameArabic, ayahNumber, arabicText, translation, transliteration, juz },
 *   userLevel?: 'beginner' | 'intermediate' | 'advanced',
 *   userProfile?: { memorizedSurahs, currentStreak, totalVersesMemorized }
 * }
 * 
 * Returns: Streaming text response
 */

import { NextRequest } from 'next/server';
import {
  SHEIKH_SYSTEM_PROMPT,
  buildAyahContext,
  buildUserContext,
} from '@/lib/sheikh-prompt';

// Types
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
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key exists
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

    // Parse request
    const body: SheikhRequest = await request.json();
    const { messages, ayahContext, userLevel, userProfile } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required', code: 'INVALID_REQUEST' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Limit conversation length to manage token usage
    const MAX_MESSAGES = 20;
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    // Build the system prompt with context
    let systemPrompt = SHEIKH_SYSTEM_PROMPT;

    if (ayahContext) {
      systemPrompt += '\n\n' + buildAyahContext(ayahContext);
    }

    if (userProfile) {
      systemPrompt += '\n\n' + buildUserContext(userProfile);
    } else if (userLevel) {
      systemPrompt += '\n\n' + buildUserContext({ level: userLevel });
    }

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

    // Stream the response back to the client
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

                  // Handle different event types from Claude's streaming API
                  if (
                    parsed.type === 'content_block_delta' &&
                    parsed.delta?.type === 'text_delta'
                  ) {
                    const text = parsed.delta.text;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                  }

                  if (parsed.type === 'message_stop') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  }

                  if (parsed.type === 'error') {
                    console.error('Stream error:', parsed.error);
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`
                      )
                    );
                  }
                } catch {
                  // Skip unparseable lines (event type headers, etc.)
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Connection lost' })}\n\n`
            )
          );
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
