/**
 * Centralized Anthropic AI configuration and helpers.
 *
 * All API routes that call Claude should import from here
 * so model, version, key, and timeout live in one place.
 */

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

export const ANTHROPIC_VERSION = '2023-06-01';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

const TIMEOUT_MS = 30_000;

// ─── Types ──────────────────────────────────────────────────────────

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CallClaudeOptions {
  system?: string;
  messages: ClaudeMessage[];
  max_tokens: number;
  temperature?: number;
  apiKey?: string;
}

interface ClaudeResponse {
  content: { type: string; text: string }[];
  model: string;
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

// ─── Non-streaming helper ───────────────────────────────────────────

/**
 * Call Claude and return the parsed JSON response.
 * Includes a 30 s timeout via AbortController.
 */
export async function callClaude(options: CallClaudeOptions): Promise<ClaudeResponse> {
  const key = options.apiKey || ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('No API key available');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body: Record<string, unknown> = {
      model: ANTHROPIC_MODEL,
      max_tokens: options.max_tokens,
      messages: options.messages,
    };

    if (options.system) {
      body.system = options.system;
    }

    if (options.temperature !== undefined) {
      body.temperature = options.temperature;
    }

    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
    }

    return (await response.json()) as ClaudeResponse;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Streaming helper ───────────────────────────────────────────────

interface CallClaudeStreamOptions extends CallClaudeOptions {
  stream: true;
}

/**
 * Call Claude with streaming enabled.
 * Returns the raw Response so the caller can process the SSE stream.
 */
export async function callClaudeStream(options: CallClaudeStreamOptions): Promise<Response> {
  const key = options.apiKey || ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('No API key available');
  }

  const body: Record<string, unknown> = {
    model: ANTHROPIC_MODEL,
    max_tokens: options.max_tokens,
    messages: options.messages,
    stream: true,
  };

  if (options.system) {
    body.system = options.system;
  }

  if (options.temperature !== undefined) {
    body.temperature = options.temperature;
  }

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  return response;
}
