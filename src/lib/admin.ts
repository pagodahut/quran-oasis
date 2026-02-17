import { auth, clerkClient } from '@clerk/nextjs/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'dr.naimul@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());

/**
 * Check if the current authenticated user is an admin.
 * Uses email-based check (ADMIN_EMAILS env var) with fallback to ADMIN_USER_IDS.
 */
export async function isAdmin(): Promise<{ authorized: boolean; userId: string | null }> {
  const { userId } = await auth();
  if (!userId) return { authorized: false, userId: null };

  // Check by Clerk user ID (legacy)
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(s => s.trim()) || [];
  if (adminIds.length > 0 && adminIds.includes(userId)) {
    return { authorized: true, userId };
  }

  // Check by email
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
    const match = userEmails.some(email => ADMIN_EMAILS.includes(email));
    return { authorized: match, userId };
  } catch {
    return { authorized: false, userId };
  }
}
