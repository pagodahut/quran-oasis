import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, message, page } = body as {
      category?: string;
      message?: string;
      page?: string;
    };

    if (!category || !message) {
      return NextResponse.json({ error: 'Category and message are required' }, { status: 400 });
    }

    if (!['bug', 'feature', 'general'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const feedback = await prisma.userFeedback.create({
      data: {
        userId: user.id,
        category,
        message,
        page: page || null,
      },
    });

    return NextResponse.json({ id: feedback.id, createdAt: feedback.createdAt });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
