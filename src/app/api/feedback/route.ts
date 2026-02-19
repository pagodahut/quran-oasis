import { NextRequest, NextResponse } from 'next/server';

// TODO: Add Feedback model to Prisma schema when ready
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Feedback endpoint not yet configured' });
}
