import { NextRequest, NextResponse } from 'next/server';
// TODO: Wire up once Prisma models (verseDifficulty, nudgeHistory) are added
export async function POST(req: NextRequest) { return NextResponse.json({ ok: true }); }
export async function GET(req: NextRequest) { return NextResponse.json({ data: [] }); }
