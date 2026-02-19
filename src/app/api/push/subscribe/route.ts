import { NextRequest, NextResponse } from 'next/server';
// TODO: Add PushSubscription model to Prisma schema
export async function POST(req: NextRequest) { return NextResponse.json({ ok: true }); }
