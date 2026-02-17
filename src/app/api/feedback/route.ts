import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/admin';

/**
 * POST /api/feedback
 * Saves feedback to database.
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
 * Returns feedback with optional filters and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const { authorized } = await isAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: Record<string, string> = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    return NextResponse.json({
      feedback,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[Feedback GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to read feedback' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/feedback
 * Update feedback status.
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check admin access
    const { authorized } = await isAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }

    const validStatuses = ['new', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error) {
    console.error('[Feedback PATCH Error]', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}
