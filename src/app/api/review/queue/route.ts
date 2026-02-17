import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getReviewQueue } from '@/lib/reviewQueue';

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const queue = await getReviewQueue(clerkId, Math.min(limit, 50));

    return NextResponse.json({ queue });
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
