# W0-6: optionalAuth() — keyless deploys must not 500

**Spec:** `docs/design/04-INTEGRATIONS.md` §C, including the 19-route policy
table. Read it first.
**Branch:** `fix/optional-auth`. One PR.

## Problem

The client treats Clerk as optional (`src/hooks/useAuth.ts` stub pattern,
conditional `src/middleware.ts`), but ~19 API routes call `auth()` from
`@clerk/nextjs/server` unconditionally. When Clerk env keys are absent,
`clerkMiddleware` never runs and `auth()` THROWS → every sync/AI/feedback call
returns 500 instead of a meaningful status. Only `src/app/api/tarteel/route.ts`
(~lines 22–27) wraps it in try/catch.

## Changes

1. Create `src/lib/serverAuth.ts` exporting:
   - `optionalAuth(): Promise<{ userId: string | null }>` — try/catch around
     `auth()`; any throw (Clerk unconfigured) returns `{ userId: null }`.
   - `requireAuth(): Promise<{ userId: string } | Response>` — same, but
     returns a 401 JSON `Response` (`{ error, code: 'AUTH_REQUIRED' }`) when
     there is no user, for routes that need identity.
2. Migrate every route under `src/app/api/` that calls `auth()` to one of the
   two helpers, per the policy table in spec 04 §C:
   - Identity-bound data routes (user/sync, srs/sync, account, onboarding,
     push/*): `requireAuth` → clean 401, never 500.
   - AI routes (sheikh/*, tajweed/analyze, transcribe*): `requireAuth` for
     now (BYOK-for-guests is a Wave 4 brief), but rate-limit key falls back to
     IP when userId is null.
   - Public/utility routes (feedback, tarteel health): `optionalAuth`.
3. Grep check: no remaining bare `await auth()` outside `serverAuth.ts`.

## Acceptance criteria

- With ALL Clerk env vars removed: `npx next build` passes; hitting
  `/api/user/sync` and `/api/sheikh` in dev returns 401 JSON (not 500); the
  feedback route accepts a submission as a guest.
- With Clerk configured, existing signed-in behavior is unchanged.
- `npm run type-check && npm run lint && npm test` pass.
