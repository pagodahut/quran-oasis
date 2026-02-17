import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { calculateDifficulty } from '@/lib/adaptiveDifficulty';

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { surahNumber, ayahNumber, accuracy } = await req.json();

    if (!surahNumber || !ayahNumber || accuracy === undefined) {
      return NextResponse.json({ error: 'Missing required fields: surahNumber, ayahNumber, accuracy' }, { status: 400 });
    }

    const normalizedAccuracy = Math.max(0, Math.min(1, accuracy / (accuracy > 1 ? 100 : 1)));

    const result = await calculateDifficulty(clerkId, surahNumber, ayahNumber, normalizedAccuracy);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating difficulty:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
