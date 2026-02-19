import { NextRequest, NextResponse } from 'next/server';

// TODO: Wire up weekly progress emails once email infrastructure is ready
// Requires: resend API key, react-email templates, proper Prisma models

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Weekly progress emails not yet configured', sent: 0 });
}
