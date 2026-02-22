'use client';

/**
 * Centralized auth hook that safely handles Clerk being unconfigured.
 * When Clerk keys are missing, everything degrades to guest mode without crashes.
 */

export interface AuthState {
  user: {
    id: string;
    emailAddresses?: Array<{ emailAddress: string }>;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    createdAt?: Date;
  } | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  isGuest: boolean;
  isClerkConfigured: boolean;
}

export function useAuth(): AuthState {
  // Check if we're on server
  if (typeof window === 'undefined') {
    return { user: null, isSignedIn: false, isLoaded: true, isGuest: true, isClerkConfigured: false };
  }

  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey) {
    return { user: null, isSignedIn: false, isLoaded: true, isGuest: true, isClerkConfigured: false };
  }

  try {
    // Dynamic import to avoid errors when Clerk isn't configured
    const { useUser } = require('@clerk/nextjs');
    const { user, isSignedIn, isLoaded } = useUser();
    return {
      user: user ?? null,
      isSignedIn: !!isSignedIn,
      isLoaded: !!isLoaded,
      isGuest: !isSignedIn,
      isClerkConfigured: true,
    };
  } catch {
    return { user: null, isSignedIn: false, isLoaded: true, isGuest: true, isClerkConfigured: false };
  }
}
