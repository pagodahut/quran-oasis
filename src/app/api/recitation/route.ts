import { NextRequest, NextResponse } from 'next/server';

// TODO: Wire up recitation session tracking once model is finalized
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Recitation endpoint not yet configured' });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ sessions: [] });
}
