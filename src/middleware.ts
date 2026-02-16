import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Only use Clerk middleware if configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/practice(.*)',
  '/lessons(.*)',
  '/memorize(.*)',
  '/progress(.*)',
  '/recite(.*)',
  '/api/user(.*)',
  '/api/progress(.*)',
  '/api/feedback(.*)',
]);

// Public routes that don't need auth (even if user is logged in)
const isPublicRoute = createRouteMatcher([
  '/',
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

export default clerkMiddleware(async (auth, req) => {
  // If Clerk is not configured, allow all routes
  if (!clerkPubKey) {
    return NextResponse.next();
  }

  // Allow public routes without auth
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For protected routes, require authentication
  if (isProtectedRoute(req)) {
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
