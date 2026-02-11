import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * POST /api/feedback
 * 
 * Collects user feedback and stores it as JSONL for easy analysis.
 * Each line is a JSON object with feedback data.
 */

interface FeedbackPayload {
  rating?: number | null;
  reaction?: 'love' | 'confused' | 'suggestion' | 'bug' | null;
  message?: string;
  page?: string;
  timestamp?: string;
  userAgent?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackPayload = await request.json();

    // Validate
    if (!body.rating && !body.reaction && !body.message?.trim()) {
      return NextResponse.json(
        { error: 'Please provide rating, reaction, or message' },
        { status: 400 }
      );
    }

    // Sanitize and structure
    const feedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      rating: body.rating ?? null,
      reaction: body.reaction ?? null,
      message: body.message?.trim().slice(0, 2000) ?? null, // Limit message length
      page: body.page ?? 'unknown',
      timestamp: body.timestamp ?? new Date().toISOString(),
      userAgent: body.userAgent?.slice(0, 500) ?? null, // Limit UA length
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] ?? 
          request.headers.get('x-real-ip') ?? 
          'unknown',
    };

    // Store in data directory as JSONL
    const dataDir = path.join(process.cwd(), 'data');
    const feedbackFile = path.join(dataDir, 'feedback.jsonl');

    // Ensure data directory exists
    try {
      await mkdir(dataDir, { recursive: true });
    } catch {
      // Directory exists
    }

    // Append feedback as JSONL
    await appendFile(feedbackFile, JSON.stringify(feedbackEntry) + '\n');

    // Also log for immediate visibility during development
    console.log('[Feedback]', feedbackEntry);

    return NextResponse.json({ 
      success: true, 
      id: feedbackEntry.id,
      message: 'JazakAllah Khair for your feedback!' 
    });
  } catch (error) {
    console.error('[Feedback Error]', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * 
 * Returns recent feedback (for admin/review purposes).
 * In production, this should be protected.
 */
export async function GET(request: NextRequest) {
  try {
    const { readFile } = await import('fs/promises');
    const dataDir = path.join(process.cwd(), 'data');
    const feedbackFile = path.join(dataDir, 'feedback.jsonl');

    let content: string;
    try {
      content = await readFile(feedbackFile, 'utf-8');
    } catch {
      return NextResponse.json({ feedback: [], total: 0 });
    }

    const lines = content.trim().split('\n').filter(Boolean);
    const feedback = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Return most recent first
    feedback.reverse();

    // Limit to last 100 entries
    const limit = Math.min(100, feedback.length);

    return NextResponse.json({
      feedback: feedback.slice(0, limit),
      total: feedback.length,
    });
  } catch (error) {
    console.error('[Feedback GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to read feedback' },
      { status: 500 }
    );
  }
}
