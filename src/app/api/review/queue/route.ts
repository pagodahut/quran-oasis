import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Not implemented', message: 'This feature is coming soon' },
    { status: 501 }
  );
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Not implemented', message: 'This feature is coming soon' },
    { status: 501 }
  );
}
