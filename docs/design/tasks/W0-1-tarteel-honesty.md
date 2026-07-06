# W0-1: Tarteel health honesty + mid-session circuit breaker

**Spec:** `docs/design/04-INTEGRATIONS.md` §A. Read it first.
**Branch:** create `fix/tarteel-circuit-breaker` off the default branch. One PR.

## Problem

The live-recitation feature fails silently. Three compounding bugs:

1. `src/app/api/tarteel/route.ts:131` — the health check treats any HTTP status
   `< 500` as alive (`const isAlive = response.status < 500`). The Modal
   endpoint currently returns 403, so the API reports
   `configured: true, warm: true` for a dead service.
2. `src/components/LiveRecitation.tsx` (~line 416) then selects Tarteel as the
   transcription provider based on that lie.
3. `src/lib/tarteelService.ts` (~lines 207–211) — `processChunk` deliberately
   swallows non-OK responses with only a `console.error` ("Don't emit error
   for transient failures"). Result: the user recites, no words highlight, no
   error is shown, and the session never falls back to WebSpeech.

Also: `vercel.json` runs `api/tarteel/keep-warm` once daily at 09:00 (free-tier
cron limit), which does not keep a Modal container warm.

## Changes

1. **Health check requires proof of life**: in `api/tarteel/route.ts`, alive =
   `response.ok` AND the response parses as the expected JSON shape. A 403/404
   must report `configured: false` (or a distinct `unreachable` status) so the
   client never selects Tarteel.
2. **Circuit breaker in TarteelService**: count consecutive failed chunk POSTs.
   On the 3rd consecutive failure, emit an `onProviderFailed` (or equivalent)
   event and stop sending chunks. Reset the counter on any success.
3. **Mid-session fallback in LiveRecitation**: on `onProviderFailed`, hot-swap
   to the WebSpeech provider without ending the session, and show a
   non-blocking toast: "Switched to on-device recognition". If WebSpeech is
   also unavailable, fall back to manual (tap-to-reveal) mode with its existing
   messaging.
4. **On-demand warmup**: when the `/recite` page mounts, fire one
   fire-and-forget warmup ping (the keep-warm route logic, callable
   client-side). Keep the daily cron as-is for now.

## Acceptance criteria

- With the Modal URL returning 403: recite flow starts directly on WebSpeech;
  no Tarteel session is attempted; no silent dead session possible.
- With Tarteel healthy then failing mid-session (simulate by rejecting fetches
  after N chunks): session continues on WebSpeech within ~3 chunks, toast
  shown.
- `npm run type-check && npm run lint && npm test && npx next build` all pass.
