import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Only use Clerk middleware if configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Public routes — never require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/mushaf(.*)',
  '/surahs(.*)',
  '/techniques(.*)',
  '/onboarding(.*)',
  '/api/sheikh(.*)',
  '/api/deepgram(.*)',
  '/api/transcribe(.*)',
  '/api/tajweed(.*)',
  '/api/og(.*)',
  '/api/onboarding(.*)',
]);

// Guest-accessible routes — work without auth but enhanced with auth
const isGuestRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/practice(.*)',
  '/lessons(.*)',
  '/memorize(.*)',
  '/progress(.*)',
  '/recite(.*)',
]);

// Strictly protected API routes — require auth
const isProtectedApiRoute = createRouteMatcher([
  '/api/user(.*)',
  '/api/progress(.*)',
  '/api/feedback(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // If Clerk is not configured, allow all routes
  if (!clerkPubKey) {
    return NextResponse.next();
  }

  // Public routes — always allow
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Guest-accessible routes — allow without auth (client-side handles auth state)
  if (isGuestRoute(req)) {
    return NextResponse.next();
  }

  // Protected API routes — require authentication
  if (isProtectedApiRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
