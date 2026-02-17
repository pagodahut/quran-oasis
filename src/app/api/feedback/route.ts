import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/feedback
 * Saves feedback to database (Prisma Feedback model).
 * Accepts both authenticated and guest submissions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, message, pageUrl, userAgent } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const validCategories = ['bug', 'feature', 'general'];
    const safeCategory = validCategories.includes(category) ? category : 'general';

    // Try to get authenticated user
    let userId: string | null = null;
    try {
      const { userId: clerkId } = await auth();
      if (clerkId) {
        const user = await prisma.user.findUnique({ where: { clerkId } });
        userId = user?.id ?? null;
      }
    } catch {
      // Guest feedback is fine
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId,
        category: safeCategory,
        message: message.trim().slice(0, 2000),
        pageUrl: pageUrl?.slice(0, 500) ?? null,
        userAgent: userAgent?.slice(0, 500) ?? null,
      },
    });

    console.log('[Feedback]', feedback.id, safeCategory);

    return NextResponse.json({
      success: true,
      id: feedback.id,
      message: 'JazakAllah Khair for your feedback!',
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
 * Returns recent feedback (admin/review purposes).
 */
export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ feedback, total: feedback.length });
  } catch (error) {
    console.error('[Feedback GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to read feedback' },
      { status: 500 }
    );
  }
}
