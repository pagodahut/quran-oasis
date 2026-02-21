import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Dynamically import Clerk only when keys are present
let clerkMiddlewareHandler: ((req: NextRequest) => Promise<NextResponse>) | null = null;

if (clerkPubKey) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server');

  const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/mushaf(.*)',
    '/surahs(.*)',
    '/techniques(.*)',
    '/onboarding(.*)',
    '/api/deepgram(.*)',
    '/api/transcribe(.*)',
    '/api/tajweed(.*)',
    '/api/og(.*)',
    '/api/onboarding(.*)',
    '/identify(.*)',
  ]);

  const isGuestRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/practice(.*)',
    '/lessons(.*)',
    '/memorize(.*)',
    '/progress(.*)',
    '/recite(.*)',
  ]);

  const isProtectedApiRoute = createRouteMatcher([
    '/api/user(.*)',
    '/api/progress(.*)',
    '/api/feedback(.*)',
  ]);

  clerkMiddlewareHandler = clerkMiddleware(async (auth: any, req: NextRequest) => {
    if (isPublicRoute(req)) return NextResponse.next();
    if (isGuestRoute(req)) return NextResponse.next();

    if (isProtectedApiRoute(req)) {
      const { userId, redirectToSignIn } = await auth();
      if (!userId) return redirectToSignIn();
    }

    return NextResponse.next();
  });
}

export default function middleware(req: NextRequest) {
  // No Clerk keys → pass everything through
  if (!clerkMiddlewareHandler) {
    return NextResponse.next();
  }
  return clerkMiddlewareHandler(req);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
