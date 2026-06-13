import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/account
 *
 * In-app account deletion — required by Apple App Store Guideline 5.1.1(v)
 * for any app that supports account creation.
 *
 * Deletes:
 *  1. All server-side data (Prisma User row → cascade deletes preferences,
 *     progress, bookmarks, activity, achievements, push subs, feedback, etc.)
 *  2. The Clerk auth account itself.
 *
 * The client is responsible for clearing local storage and signing out.
 */
export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Delete all application data (cascades to every related table).
    //    Tolerate the case where no DB row exists yet.
    try {
      await prisma.user.delete({ where: { clerkId: userId } });
    } catch (e) {
      // P2025 = record not found; safe to ignore — user may have no data row.
      const code = (e as { code?: string })?.code;
      if (code !== 'P2025') throw e;
    }

    // 2. Delete the Clerk auth account.
    try {
      const client = await clerkClient();
      await client.users.deleteUser(userId);
    } catch (e) {
      // If Clerk deletion fails, the app data is already gone. Surface the
      // error so the client can tell the user to contact support to finish.
      console.error('[account] Clerk user deletion failed:', e);
      return NextResponse.json(
        {
          error: 'Your data was deleted, but the auth account could not be removed. Please contact support@gethifz.com to complete deletion.',
          partial: true,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[account] Deletion failed:', error);
    return NextResponse.json(
      { error: 'Account deletion failed. Please try again or contact support@gethifz.com.' },
      { status: 500 },
    );
  }
}
