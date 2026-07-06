# W0-7: Real /api/health route

**Spec:** `docs/design/04-INTEGRATIONS.md` §E. Read it first.
**Branch:** `feat/health-route`. One PR.

## Problem

`src/hooks/useNetworkStatus.ts` (~line 32) polls `/api/health`, which does not
exist — connectivity checks have always 404'd (which happens to be truthy-ish
for "online" but is wrong and blocks real health signals).

## Changes

1. Create `src/app/api/health/route.ts` (GET, no auth, no rate-limit side
   effects) returning:
   ```json
   {
     "status": "ok",
     "version": "<package.json version>",
     "db": "ok" | "unavailable" | "unconfigured",
     "clerk": true | false,
     "ai": true | false
   }
   ```
   - `db`: attempt a `SELECT 1` via the shared prisma client inside try/catch
     with a ~2s timeout; never let a DB failure make the route non-200.
   - `clerk` / `ai`: presence booleans of the relevant env vars (do NOT leak
     values).
   - Set `Cache-Control: no-store`.
2. Ensure the route is publicly reachable in `src/middleware.ts`'s matcher
   (follow the pattern used for other public routes at ~line 25).
3. Update `useNetworkStatus.ts` to treat only `response.ok` as online, keep its
   existing offline handling otherwise.

## Acceptance criteria

- `curl localhost:3000/api/health` → 200 JSON with the shape above; still 200
  (with `"db": "unavailable"`) when the DB is unreachable.
- No auth prompt/redirect on the route with Clerk enabled.
- `npm run type-check && npm run lint && npm test && npx next build` pass.
