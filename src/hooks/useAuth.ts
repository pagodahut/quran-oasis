'use client';

/**
 * Centralized auth hook that safely handles Clerk being unconfigured.
 * When Clerk keys are missing, everything degrades to guest mode without crashes.
 */

import { useUser } from '@clerk/nextjs';

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export interface AuthState {
  user: {
    id: string;
    emailAddresses?: Array<{ emailAddress: string }>;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    createdAt?: Date | null;
  } | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  isGuest: boolean;
  isClerkConfigured: boolean;
}

const GUEST_STATE: AuthState = {
  user: null,
  isSignedIn: false,
  isLoaded: true,
  isGuest: true,
  isClerkConfigured: false,
};

function useAuthWithClerk(): AuthState {
  const { user, isSignedIn, isLoaded } = useUser();
  return {
    user: user ?? null,
    isSignedIn: !!isSignedIn,
    isLoaded: !!isLoaded,
    isGuest: !isSignedIn,
    isClerkConfigured: true,
  };
}

function useAuthWithoutClerk(): AuthState {
  return GUEST_STATE;
}

// Pick the right hook at module level so it's never called conditionally
export const useAuth = isClerkConfigured ? useAuthWithClerk : useAuthWithoutClerk;
