# 04 — Integration Hardening Architecture

Status: implementation-ready design
Scope: recitation providers, audio delivery, Clerk optionality, BYOK AI, env/health, Prisma, service worker
Depends on: `01-STATE-CONSOLIDATION` (single reciter table in `quranData.ts`), `02-JOURNEY-ENGINE` (word-by-word data bundled at build time)
Target: Next.js App Router · optional Clerk · Prisma + Turso · Vercel free tier · gethifz.com

---

## Executive summary (read this first)

1. **Tarteel health is a lie.** `src/app/api/tarteel/route.ts:131` treats any `status < 500` as alive, so a 403 from Modal reports `configured:true, warm:true`. `TarteelService.processChunk` (`src/lib/tarteelService.ts:207-211`) swallows failed chunks with a bare `console.error` + `return` — user recites, nothing highlights, no error, no fallback. This is the single worst bug.
2. **Audit correction — `/api/transcribe-tarteel` is NOT dead.** It is the batch transcription path for `TajweedPractice` (`tajweedService.ts:410` ← `analyzeRecitation:296` ← `mushaf/page.tsx`). Do **not** delete it. The genuinely dead code is `hybridTranscription.transcribe`, `fetchQuranComAudioUrl`, and `getAyahAudioFallback`.
3. **Keep-warm is daily, not 4-min.** `vercel.json` runs `0 9 * * *`; the route's own doc claims every 4 minutes. Vercel free tier caps crons at ~1/day, so keep-warm can't work as designed. Replace with an on-demand warmup ping when the user opens `/recite`.
4. **Clerk is not optional server-side.** 19 API routes call `auth()`; only `/api/tarteel` wraps it in try/catch. Without Clerk env keys, `clerkMiddleware` never runs and `auth()` **throws → 500 everywhere**. `optionalAuth()` helper + a per-route policy table fixes this.
5. **BYOK works in exactly one place.** Only `/api/sheikh` honors `x-user-api-key`; the other four AI routes gate on env `ANTHROPIC_API_KEY` only → 503 even when the user pasted a key. `callClaudeStream` has no timeout.
6. **Audio has one CDN, no retry.** everyayah.com is the only source; a 404 rejects with no fallback. Two working fallback builders exist but are dead. Reciter id `shuraym`/`shuraim` diverges across three tables.
7. **Prisma is version-mismatched.** `@prisma/adapter-libsql ^7.4.0` against `@prisma/client ^6.19.2`, and the import name (`PrismaLibSql`) is mis-cased vs the actual export (`PrismaLibSQL`). Turso sync is likely broken in prod.
8. **Service worker caches the wrong hosts.** Only everyayah is cached; `api.quran.com`, `audio.qurancdn.com`, and `cdn.islamic.network` are not; the `CACHE_AUDIO` allowlist lists hosts the app never uses; `CACHEABLE_API_ROUTES=['/api/quran']` targets a route that doesn't exist.
9. **`/api/health` doesn't exist** but `useNetworkStatus.ts:32` fetches it (always 404, silently falls back to a Google 204 ping).
10. **Execution:** 9 PRs, ~8–9 days. App-Store blockers: PR-1 (recitation robustness + mic flows), PR-3 (Clerk optionality — guests must not 500), PR-8 (offline robustness).

The rest of this document is the implementation spec for each item.

---

## A. Recitation provider chain v2

### A.1 Current behaviour (verified)

- `GET /api/tarteel` (`route.ts:92-147`): tries a derived `…/health` URL; if that fails, POSTs an empty `audio_base64:''` and returns `configured: response.status < 500` (`route.ts:131`). A **403** (unauthenticated Modal endpoint, wrong URL, cold auth) is `< 500` → reports `configured:true, warm:true`.
- `TarteelService.isConfigured()` (`tarteelService.ts:466-474`): `fetch('/api/tarteel')` → `data.configured === true`.
- `TarteelService.processChunk()` (`tarteelService.ts:188-224`): on `!response.ok` it does `console.error(...)` then `return` (`:207-211`) — **no `onError`, no counter, no fallback**. Every chunk can fail silently for an entire session.
- `WebSpeechService.isSupported()` (`webSpeechService.ts:280-284`): only checks `SpeechRecognition` constructor existence — no probe of whether `ar-SA` recognition actually works (it silently no-ops in Firefox / many WKWebViews).
- Keep-warm: `vercel.json` = `0 9 * * *` (daily 09:00 UTC); `keep-warm/route.ts` comment says "every 4 minutes"; the route also uses `status < 500` as "warm" (`keep-warm/route.ts:70`).
- Modal URL default hardcoded: `route.ts:15`, `keep-warm/route.ts:15` (`pagodahut--hifz-whisper-transcribe-api.modal.run`).

### A.2 `RecitationProvider` interface

New file `src/lib/recitation/provider.ts`. All three providers implement it; `LiveRecitation` talks only to this interface.

```ts
export type ProviderId = 'tarteel' | 'webspeech' | 'manual';

export interface RecitationHealth {
  available: boolean;          // real 2xx + shape check (see A.3)
  warm: boolean;               // model loaded (Tarteel only; always true for others)
  reason?: string;             // 'ok' | 'http_403' | 'bad_shape' | 'timeout' | 'unsupported'
  checkedAt: number;
}

export interface RecitationEvents {
  onPartial(index: number, word: string, confidence: number): void;
  onTranscript(text: string, isFinal: boolean): void;
  onError(err: RecitationError): void;
  onDegraded(from: ProviderId, to: ProviderId, reason: string): void; // circuit-breaker fired
  onStateChange(state: RecitationState): void;
}

export interface RecitationProvider {
  readonly id: ProviderId;
  init(cfg: RecitationConfig, events: RecitationEvents): Promise<void>;
  isAvailable(): Promise<RecitationHealth>;   // cheap, cacheable; never throws
  start(): Promise<void>;
  stop(): Promise<RecitationSessionResult>;
  dispose(): void;
}

export interface RecitationError {
  fatal: boolean;              // true → abort provider; false → transient (chunk)
  code: 'mic_denied' | 'mic_missing' | 'network' | 'provider_down' | 'unsupported' | 'unknown';
  message: string;             // user-facing
}
```

`TarteelService` and `WebSpeechService` are refactored to implement this (their existing `start/stop/getState` map almost 1:1). `ManualProvider` is a no-op provider that just renders the tap-to-advance UI and always reports `available:true`.

**Future hook (do not build now):** `hybridTranscription`/offline-Whisper is removed (see A.6), but the interface makes re-adding it a matter of writing one more `RecitationProvider` and inserting it in the chain — no `LiveRecitation` changes.

### A.3 Real health semantics

Replace `GET /api/tarteel` (`route.ts:92-147`) with a shape-checked probe:

```ts
// GET /api/tarteel  — health only
const r = await fetch(healthUrl, { signal: AbortSignal.timeout(3000) });
const alive =
  r.status === 200 &&
  (r.headers.get('content-type') ?? '').includes('application/json');
let warm = false, reason = `http_${r.status}`;
if (alive) {
  const body = await r.json().catch(() => null);
  // Modal /health must return { status: 'ok', model_loaded: boolean }
  if (body && body.status === 'ok') { warm = body.model_loaded === true; reason = 'ok'; }
  else reason = 'bad_shape';
}
return NextResponse.json({ configured: alive && reason === 'ok', warm, reason, endpoint: 'modal' });
```

Rules:
- Only `200 + JSON + {status:'ok'}` counts as configured. A 403/404/5xx/HTML page ⇒ `configured:false`. This kills the "403 looks alive" bug at the root.
- The empty-`audio_base64` POST ping is **removed** — it costs a GPU invocation and its `< 500` test is the same bug. Health is GET-only against `/health`.
- The Modal `/health` handler must be updated to return `{status:'ok', model_loaded}` without touching the GPU (spec belongs in `MODAL_DEPLOYMENT.md`; note the contract here).
- Client `TarteelProvider.isAvailable()` caches the result for 60s to avoid a probe on every session.

`WebSpeechProvider.isAvailable()` upgrades `isSupported()` (`webSpeechService.ts:280-284`): constructor exists **and** we are in a secure context **and** not a known-broken UA (Firefox has the constructor but no engine). Because there is no synchronous "does ar-SA work" API, treat a `start()` that fires `onerror: 'language-not-supported'` or produces zero results within 6 s as a runtime downgrade to manual (handled by the circuit breaker, A.4).

### A.4 Consecutive-failure circuit breaker + hot-swap

State lives in the active provider wrapper, surfaced through `RecitationEvents`.

```
N_FAIL = 3            // consecutive failed chunks (Tarteel) OR
WEBSPEECH_SILENCE = 6000ms  // no results while recording (WebSpeech)
```

`TarteelProvider.processChunk` (replacing `tarteelService.ts:207-211`):

```ts
if (!response.ok) {
  this.consecutiveFailures++;
  this.events.onError({ fatal: false, code: 'provider_down', message: 'Transcription hiccup…' });
  if (this.consecutiveFailures >= N_FAIL) this.degrade('http_' + response.status);
  return;
}
this.consecutiveFailures = 0;   // reset on any success
```

`degrade(reason)`:
1. `this.stop()` current provider (keep the mic stream if the next provider can reuse it — WebSpeech re-acquires its own; Manual needs none).
2. Emit `onDegraded('tarteel', next, reason)` → `LiveRecitation` shows a **non-blocking toast**: *"Switched to on-device recognition"* (Tarteel→WebSpeech) or *"Tap each word as you recite"* (→Manual).
3. `next.init(sameConfig, sameEvents)` then `next.start()`. Expected words / current index carry over so highlighting resumes where it left off.

The chain is resolved once at session start (A.5) and the breaker walks it forward-only: `tarteel → webspeech → manual`. Manual never degrades (it is the floor).

### A.5 Session bootstrap + provider telemetry

New `useRecitationSession()` hook wraps provider selection:

```
1. On /recite mount → fire warmup ping (A.7) + Promise.all health checks (cached).
2. pick = first provider whose isAvailable().available === true, in [tarteel, webspeech, manual] order.
3. Persist a session-scoped record so the UI can show "checked with: WebSpeech":
     recitationTelemetry = { chosen, health: {tarteel, webspeech}, degradations: [] }
   Stored in the Zustand session slice (01-STATE-CONSOLIDATION), NOT localStorage —
   it is per-session diagnostic, not durable state.
4. Each onDegraded pushes { from, to, reason, at } onto degradations[].
```

`/recite` renders a small provider badge from `recitationTelemetry.chosen` ("Listening with WebSpeech") and, on tap, a debug sheet showing the health reasons + degradation history. This makes silent failures visible to the user and to us in support.

### A.6 Keep-warm within Vercel free-tier limits

Vercel free tier crons are capped (daily is the practical floor). A cron cannot keep a Modal GPU warm at recitation cadence. **Decision: drop the cron dependency; warm on demand.**

- Keep `vercel.json` `0 9 * * *` as a once-daily liveness sanity ping only (optional; it does not need to keep the GPU warm).
- On `/recite` mount, `useRecitationSession()` fires **one** `GET /api/tarteel/warmup` (rename/repurpose `keep-warm`) that hits Modal's real transcribe endpoint with a tiny fixed 0.5 s silent WAV (not `audio_base64:''`, which some Whisper servers reject) to trigger cold-start load while the user is still reading instructions. It runs fire-and-forget; the health check + circuit breaker cover the case where it's still cold when the user starts.
- The warmup route uses the same `200 + {status:'ok'}` contract (A.3), not `status < 500` (`keep-warm/route.ts:70`).
- Result: cold start (15–30 s) overlaps the user's setup time instead of blocking the first chunk. If Modal is truly down, health returns `configured:false` and we never pick Tarteel — WebSpeech is chosen up front.

### A.7 Deletions

| Delete | Evidence | Note |
|---|---|---|
| `src/lib/hybridTranscription.ts` `transcribe()` export | Only `initOfflineWhisper/isOfflineReady/getOfflineModelProgress` are imported (`OfflineModelLoader.tsx:13-17`); `transcribe` has zero callers | Remove `transcribe` + the 74 MB HF Whisper download path |
| `src/components/OfflineModelLoader.tsx` | Rendered at `settings/page.tsx:143` but drives only the now-dead offline model | Remove component + its Settings entry |
| ~~`/api/transcribe-tarteel`~~ | **DO NOT DELETE** | Audit was wrong — live batch path (see §Intro #2). Bring it under `optionalAuth()`/BYOK like the other AI routes |

Keep the `RecitationProvider` interface hook so an on-device tier can return later without touching callers.

---

## B. Audio delivery v2

### B.1 Current behaviour (verified)

- Two live URL builders, everyayah-only: `getAyahAudioUrl` (`audio-service.ts:207-221`) and `getAyahAudio` (`quranAudio.ts:43-63`).
- `playAyah` `onerror` (`audio-service.ts:412-417`) sets an error and `reject()`s — **no retry, no alternate CDN**.
- Dead fallbacks: `fetchQuranComAudioUrl` (`audio-service.ts:603-632`, zero callers) and `getAyahAudioFallback` → `cdn.islamic.network` (`quranAudio.ts:68-74`, zero callers).
- Three divergent reciter tables: `quranData.ts` `RECITERS` (8 reciters, id `shuraym`, `quranData.ts:279`), `audio-service.ts` `RECITERS` (7, id `shuraim`, `:137`), `quranAudio.ts` `AUDIO_RECITERS` (5, different folders e.g. `Minshawy_Murattal_128kbps`, `Abdul_Basit_Murattal_192kbps`). `01-STATE-CONSOLIDATION` collapses these to the single `quranData.ts` table — design on top of that.

### B.2 One `audioUrl()` module

New `src/lib/audio/audioUrl.ts`. It is the **only** place that builds recitation URLs; `audio-service.ts` and `quranAudio.ts` URL builders are deleted and re-exported from here for compat during migration.

```ts
export type CdnId = 'everyayah' | 'islamic_network' | 'qurancdn';

export interface CdnSource {
  id: CdnId;
  build(reciter: Reciter, surah: number, ayah: number, quality: AudioQuality): string | null;
  // returns null when this reciter is not carried by this CDN
}

// Ordered chain — first non-null wins as the primary; the rest are fallbacks.
export const CDN_CHAIN: CdnId[] = ['everyayah', 'islamic_network', 'qurancdn'];

export function audioUrls(reciterId: string, surah: number, ayah: number, quality: AudioQuality = 'high'): string[] {
  const reciter = getReciter(reciterId) ?? getReciter(DEFAULT_RECITER_ID)!; // from quranData.ts
  return CDN_CHAIN
    .map(id => SOURCES[id].build(reciter, surah, ayah, quality))
    .filter((u): u is string => !!u);
}
```

Returns an **ordered array** of candidate URLs (never a single string). The player cascades through it (B.4).

### B.3 Per-source folder/ID mapping

`quranData.ts` `Reciter` gains per-CDN identifiers (added by `01-STATE-CONSOLIDATION`'s single table):

```ts
interface Reciter {
  id: string; name: string; arabicName: string; folder: string;   // everyayah folder
  islamicNetworkId?: string;   // e.g. 'ar.alafasy'  → cdn.islamic.network/quran/audio/128/{id}/{globalAyah}.mp3
  qurancdnId?: number;         // quran.com recitation id → resolved via /api/audio/resolve (see B.6)
  // …existing fields
}
```

everyayah folders — **verified against the reciters in `quranData.ts:227-308`** and flagged for the HEAD-check script:

| id | everyayah folder (in code) | status |
|---|---|---|
| `alafasy` | `Alafasy_128kbps` | known-good |
| `husary` | `Husary_128kbps` | known-good |
| `sudais` | `Abdurrahmaan_As-Sudais_192kbps` | known-good |
| `abdul_basit` | `Abdul_Basit_Mujawwad_128kbps` | known-good |
| `ghamadi` | `Ghamadi_40kbps` | known-good |
| `shuraym` | `Saood_ash-Shuraym_128kbps` | **verify** (id also spelled `shuraim` in `audio-service.ts:137`; folder consistent) |
| `hani_rifai` | `Hani_Rifai_192kbps` | **verify** |
| `yasser_dossari` | `Yasser_Ad-Dussary_128kbps` | **verify** (note `Dussary` spelling) |

Divergences to resolve in the consolidation: `quranData.ts` uses id `shuraym`; `audio-service.ts:137` uses `shuraim`. **Canonical id = `shuraym`** (matches `quranData.ts`, the surviving table). `quranAudio.ts`'s `Minshawy_Murattal_128kbps` / `Abdul_Basit_Murattal_192kbps` are *different recordings* from `audio-service.ts`'s mujawwad folders — pick per reciter's declared `style` and record the choice in the single table; do not silently mix murattal/mujawwad.

### B.4 `verify-reciters.ts` script

New `scripts/verify-reciters.ts` (run in CI + manually before adding a reciter):

```ts
// For each reciter in quranData.ts RECITERS, for each CDN that claims to carry it,
// HEAD 3 sample ayahs (001001, 002255, 114006). Report per (reciter, cdn):
//   ok | 404 | timeout | wrong-content-type.
// Exit non-zero if any reciter has ZERO working CDNs (that reciter must be hidden).
```

Output feeds a committed `reciter-availability.json` the UI uses to hide reciters with no working source, and flags the three "verify" rows above.

### B.5 Player onerror cascade

Replace `playAyah` (`audio-service.ts:351-419`). The player takes `audioUrls(...)` and advances on error:

```ts
async function playWithFallback(urls: string[], opts) {
  for (let i = 0; i < urls.length; i++) {
    try { return await playOne(urls[i], opts); }   // resolves on ended, rejects on error/timeout
    catch (e) {
      if (i === urls.length - 1) throw new AudioUnavailableError(surah, ayah);
      // else fall through to next CDN; log which CDN failed for telemetry
    }
  }
}
```

- `playOne` sets a `loadTimeout` (e.g. 8 s) so a hanging CDN advances the cascade instead of stalling forever (the current `onerror` never fires on a slow-but-not-failed request).
- On total failure, surface a real error ("Audio unavailable for this reciter — try another"), not a silent reject.

### B.6 SW caching interplay (cache key normalization)

The cascade means the *same ayah* may be served from any CDN. To avoid double-caching and to make offline hits work regardless of which CDN succeeded:

- The SW caches under a **normalized key** `audio:{reciterId}:{surah}:{ayah}:{quality}` (a synthetic `Request` URL on our own origin), **not** the raw CDN URL. The app posts `{key, url}` to the SW; the SW fetches `url`, stores the response under `key`.
- On playback, the app first asks the SW (via cache-key) for a cached copy; a cache hit returns bytes with no network, whichever CDN originally provided them. A miss runs the live cascade (B.5) and, on success, tells the SW to cache the winning URL under the normalized key.
- This replaces the raw-URL `cache.put(request, …)` in `sw.js:146`, which would store three different keys for the same ayah if the CDN changed between sessions.

`qurancdnId` needs a lookup (`api.quran.com/.../recitations/{id}/by_ayah`); resolve it in a tiny cached route `GET /api/audio/resolve?reciter=&surah=&ayah=` rather than client-side, so the SW allowlist (G) stays small. This is the only remaining runtime `api.quran.com` dependence for audio and is `stale-while-revalidate` cached.

---

## C. `optionalAuth()` server helper

### C.1 The failure

- 19 routes import `auth` from `@clerk/nextjs/server`. Only `/api/tarteel` (`route.ts:22-27`) wraps it in try/catch. `/api/srs/sync` even calls `auth()` **unconditionally outside** its try (returns 401 before the try begins).
- `middleware.ts:9` only registers `clerkMiddleware` when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set; otherwise `middleware()` passes everything through (`:65`). With no keys, `clerkMiddleware` never runs, so **`auth()` throws** in every route → 500. This is why a keyless deploy is broken for all logged-in-only features and returns 500 (not a clean 401) for guests.

### C.2 The helper

New `src/lib/auth/optionalAuth.ts`:

```ts
import { auth } from '@clerk/nextjs/server';

/** Never throws. Returns { userId: null } when Clerk is not configured or the caller is a guest. */
export async function optionalAuth(): Promise<{ userId: string | null }> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return { userId: null };
  try {
    const { userId } = await auth();
    return { userId: userId ?? null };
  } catch {
    return { userId: null };   // middleware didn't run / token invalid
  }
}

/** For routes that REQUIRE a signed-in user. Returns a 401 Response, or the userId. */
export async function requireAuth(): Promise<{ userId: string } | Response> {
  const { userId } = await optionalAuth();
  if (!userId) return Response.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401 });
  return { userId };
}
```

Every route swaps its raw `const { userId } = await auth()` for one of these. Guests now get a clean 401 (or are served) instead of a 500.

### C.3 Per-route migration table

Policies: **G** = works for guests (rate-limited by IP), **A** = requires auth (401 JSON via `requireAuth`), **A+O** = requires auth + ownership (row keyed on the caller's `user.id`).

| Route | Methods | Current | New policy | Notes |
|---|---|---|---|---|
| `/api/tarteel` | POST, GET | optional (already) | **G** | Keep optional; `optionalAuth()`. Rate-limit by IP for guests. GET health stays public |
| `/api/transcribe-tarteel` | POST, GET | A (unconditional) | **G** | Batch transcription for TajweedPractice — guests must use it. `optionalAuth()`; rate-limit by IP; BYOK-aware (D). GET public |
| `/api/transcribe` | POST | A | **G** | Whisper proxy; same as above |
| `/api/tajweed/analyze` | POST | A | **G (with key)** | AI; allow guests **when a key is available** (D). Rate-limit by key-hash/IP |
| `/api/sheikh` | POST | A | **G (with key)** | AI stream; guests with own key allowed (D) |
| `/api/sheikh/generate` | POST | A | **G (with key)** | AI; same |
| `/api/sheikh/review` | POST | A | **G (with key)** | AI; same |
| `/api/sheikh/calibrate` | POST | A | **G (with key)** | AI; same |
| `/api/user/sync` | GET, POST | A | **A+O** | Reads/writes user rows by `clerkId`. Guests have no server row — return 200 `{synced:false, reason:'guest'}` instead of 401 so client degrades cleanly to localStorage |
| `/api/srs/sync` | GET, POST | A (unconditional) | **A+O** | Same guest handling as user/sync; move `auth()` inside try |
| `/api/progress/weekly` | GET | `currentUser()` | **A+O** | Uses `currentUser` not `auth` — wrap equivalently; guest → empty dataset |
| `/api/goals/daily` | GET, PUT | A | **A+O** | userPreferences upsert keyed on user.id |
| `/api/difficulty/update` | POST | A | **A+O** | memorizationProgress upsert |
| `/api/recitation` | POST, GET | A | **A+O** | recitationAttempt create/find |
| `/api/feedback` | POST | A | **A** | userFeedback.create; guest feedback allowed only if you want it — default A |
| `/api/onboarding` | POST, GET | A | **A+O** | Guests onboard in localStorage; server sync only when signed in |
| `/api/push/subscribe` | POST, DELETE | A | **A+O** | Push needs a user |
| `/api/push/send` | POST | A | **A+O** | Self-notify only |
| `/api/email/weekly-progress` | POST | A | **A+O** | Email needs a user |
| `/api/account` | DELETE | A | **A+O** | Destructive `user.delete` + Clerk delete — must stay strict |

Guest-capable data routes (`user/sync`, `srs/sync`, `progress/weekly`, `onboarding`) return **200 with an empty/`guest` payload** rather than 401 so the client's offline-first store keeps working with no console noise (fixes the "client degrades silently to console-only" behaviour by making the server contract explicit).

### C.4 middleware.ts implications

- `middleware.ts` stays keyless-safe (the `if (clerkPubKey)` guard is correct). No change needed to the matcher.
- The `isProtectedApiRoute` matcher (`middleware.ts:37-48`) becomes **belt-and-suspenders only** — real enforcement moves into `requireAuth()` per route, because the middleware doesn't run at all without keys. Keep the matcher for the keyed deploy (defense in depth) but never rely on it as the sole gate.
- Add the AI routes to the **public** matcher set (they self-gate via BYOK), so a keyed deploy doesn't redirect a guest-with-key to sign-in before the route can honor their key.

---

## D. BYOK everywhere

### D.1 Current gating (verified)

| Route | Auth gate | Key gate | Honors `x-user-api-key`? |
|---|---|---|---|
| `/api/sheikh` | `auth()` 401 (`route.ts:66`) | `!ANTHROPIC_API_KEY && !userApiKey` (`:86`) | **Yes** (`:84`, `:137`) |
| `/api/sheikh/generate` | `auth()` 401 (`generate/route.ts:296`) | `!ANTHROPIC_API_KEY` only (`:301`) | No |
| `/api/sheikh/review` | `auth()` 401 (`review/route.ts:119`) | `!ANTHROPIC_API_KEY` only (`:123`) | No |
| `/api/sheikh/calibrate` | `auth()` 401 (`calibrate/route.ts:63`) | `!ANTHROPIC_API_KEY` only (`:67`) | No |
| `/api/tajweed/analyze` | `auth()` 401 (`analyze/route.ts:37`) | `!ANTHROPIC_API_KEY` only (`:55`) | No |

`callClaude` has a 30 s AbortController (`ai.ts:52-53`); `callClaudeStream` (`ai.ts:102-139`) has **none**. Model is `claude-sonnet-4-6` (`ai.ts:10`) — current and valid, keep as-is.

### D.2 Thread the key through all five routes

Standard preamble for every AI route:

```ts
const userApiKey = request.headers.get('x-user-api-key') ?? undefined;
if (!ANTHROPIC_API_KEY && !userApiKey) {
  return Response.json({ error: 'AI is not configured. Add your Anthropic API key in Settings.', code: 'NO_API_KEY' }, { status: 503 });
}
// …later:
const data = await callClaude({ ...opts, ...(userApiKey ? { apiKey: userApiKey } : {}) });
```

`callClaude`/`callClaudeStream` already accept `apiKey` (`ai.ts:47`, `:103`) and prefer it over env — no change to `ai.ts` beyond the timeout (D.4). Migration is per-route:

| Route | Change |
|---|---|
| `/api/sheikh/generate` | Read `x-user-api-key`; change gate `!ANTHROPIC_API_KEY` → `!ANTHROPIC_API_KEY && !userApiKey`; pass `apiKey` into `callClaude` (`generate/route.ts:342`) |
| `/api/sheikh/review` | Same; pass into `callClaude` (`review/route.ts:159`) |
| `/api/sheikh/calibrate` | Same; pass into `callClaude` (`calibrate/route.ts:93`) |
| `/api/tajweed/analyze` | Same; thread `userApiKey` into `analyzeWithClaude(...)` → `callClaude` (`analyze/route.ts:140`) |
| `/api/sheikh` | Already done — no change |

### D.3 Auth policy for AI: guests-with-key allowed

Rationale: a guest supplying their own key pays for their own tokens; blocking them is user-hostile and gains us nothing. Replace the `auth()` 401 in all five AI routes with:

```ts
const { userId } = await optionalAuth();
const userApiKey = request.headers.get('x-user-api-key') ?? undefined;

// Allowed if: signed-in user (uses our env key) OR anyone with their own key.
if (!userId && !userApiKey) {
  return Response.json({ error: 'Sign in or add your own API key to use the AI teacher.', code: 'AUTH_OR_KEY_REQUIRED' }, { status: 401 });
}

// Rate-limit key: per-user when signed in; per-key-hash when BYOK guest.
const rlKey = userId
  ? clientKey(request, userId)
  : `byok:${sha256(userApiKey!).slice(0, 16)}`;   // never store/log the raw key
const rl = rateLimit(rlKey, 30, 10 * 60_000);
if (!rl.ok) return Response.json({ error: 'Slow down.', code: 'RATE_LIMITED' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } });
```

- BYOK guests are rate-limited **per key-hash**, not per IP — one paying user shouldn't be throttled by others behind the same NAT, and one key can't fan out abuse.
- `sha256` the key for the bucket id; never persist or log the raw key (it already only lives in the `x-user-api-key` header and client Settings `aiSheikh.apiKey`).
- Env-key path (signed-in, no BYOK) keeps the existing 30/10min per-user limit (`sheikh/route.ts:76`).

### D.4 `callClaudeStream` timeout

Add an AbortController that bounds **stream start** (time-to-first-byte), separate from total stream duration:

```ts
export async function callClaudeStream(options: CallClaudeStreamOptions): Promise<Response> {
  const key = options.apiKey || ANTHROPIC_API_KEY;
  if (!key) throw new Error('No API key available');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000); // 60s to first byte
  try {
    const response = await fetch(ANTHROPIC_URL, { /* …headers/body… */, signal: controller.signal });
    if (!response.ok) { const t = await response.text(); throw new Error(`Anthropic API error ${response.status}: ${t}`); }
    return response;   // caller streams the body; response headers already arrived within 60s
  } finally {
    clearTimeout(timeout);   // stop the start-timer once headers are in; body can stream longer
  }
}
```

60 s (vs `callClaude`'s 30 s) because a streamed request tolerates a slower first token; the timer covers the connect + first-byte only, so a legitimately long generation isn't cut off. On abort, the caller's existing try/catch around `callClaudeStream` (`sheikh/route.ts:127-170`) already maps errors to a 502/504 JSON.

### D.5 UI gating + `/api/ai/status`

New public route `GET /api/ai/status`:

```ts
export function GET() {
  return Response.json({
    aiAvailable: !!process.env.ANTHROPIC_API_KEY,   // server has a key → works for signed-in users w/o BYOK
    reason: process.env.ANTHROPIC_API_KEY ? 'server_key' : 'byok_only',
  });
}
```

Client `useAiAvailability()`:

```
available = status.aiAvailable || !!settings.aiSheikh.apiKey   // server key OR user's own key
```

- Hide AI entry points (Sheikh chat launcher, "AI tajweed analysis" CTA, briefings/reflections) when `available === false`. This fixes "UI shows entry points anyway → 503 on tap."
- When `aiAvailable === false` but the user could add a key, the entry point becomes a **"Add your API key"** prompt deep-linking to Settings, rather than a dead button.
- **Settings copy change** (`aiSheikh.apiKey` field): from "optional" to explicit — *"The AI teacher uses Anthropic's Claude. If we don't provide a shared key, paste your own key here to unlock it. Your key is sent only to Anthropic, never stored on our servers."* Add a "Test key" button that calls `/api/sheikh/calibrate` with a trivial payload and reports 200/401.

---

## E. Env validation + health

### E.1 `src/lib/env.ts`

Zod-style validation evaluated once at module load (import it from `instrumentation.ts` so a bad prod config fails the build/boot loudly, not per-request):

```ts
import { z } from 'zod';

const schema = z.object({
  // Database — required in prod for any server persistence
  DATABASE_URL: z.string().url().optional(),           // local sqlite dev
  TURSO_DATABASE_URL: z.string().url().optional(),     // prod (Turso)
  TURSO_AUTH_TOKEN: z.string().optional(),

  // Clerk — feature flag: present as a PAIR or not at all
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),

  // AI — optional (BYOK covers the gap)
  ANTHROPIC_API_KEY: z.string().optional(),

  // Recitation
  MODAL_WHISPER_URL: z.string().url().optional(),      // defaults to hardcoded Modal URL

  // Misc
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});
```

Cross-field rules (refinements), each producing a boot warning or error:

| Var(s) | Semantics | Rule |
|---|---|---|
| `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` | prod DB | both-or-neither; if one set, error |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | auth feature | both-or-neither; if only publishable set, error (middleware runs but routes can't verify) |
| `ANTHROPIC_API_KEY` | AI feature flag | optional; if absent, log "AI available via BYOK only" |
| `MODAL_WHISPER_URL` | recitation | optional; default `pagodahut--…modal.run` (single source of truth — remove the hardcoded default from `route.ts:15` + `keep-warm/route.ts:15`, read from `env.ts`) |
| DB | prod guard | in `NODE_ENV=production`, require Turso pair **or** explicit `ALLOW_NO_DB=1`; otherwise error (prevents the silent 500s on `/api/user/sync`) |

Export a typed `env` object; replace all `process.env.X` reads in server code with `env.X` so the hardcoded Modal default and scattered `process.env` reads have one home.

### E.2 Real `/api/health`

New `src/app/api/health/route.ts` — consumed by `useNetworkStatus.ts:32` (which currently 404s):

```ts
export async function GET() {
  const checks = { db: 'skip', clerk: false, ai: false };
  // DB reachability (only if configured)
  if (env.TURSO_DATABASE_URL || env.DATABASE_URL) {
    try { await prisma.$queryRaw`SELECT 1`; checks.db = 'ok'; }
    catch { checks.db = 'down'; }
  }
  checks.clerk = !!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  checks.ai = !!env.ANTHROPIC_API_KEY;   // BYOK not reflected here (server-side only)
  const healthy = checks.db !== 'down';
  return Response.json(
    { status: healthy ? 'ok' : 'degraded', version: process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev', checks },
    { status: healthy ? 200 : 503 }
  );
}
```

Support `HEAD` (returns 200/503, no body) since `useNetworkStatus.checkConnection()` uses `method: 'HEAD'`. This makes the connectivity check hit our own origin (fast, honest) instead of falling through to the Google 204 ping (`useNetworkStatus.ts:38`).

### E.3 Persistent "sync offline" badge

Today sync failures are console-only (`user/sync` catch → `console.error`, client swallows). Replace with a visible, durable state:

- Add `syncStatus: 'ok' | 'offline' | 'guest' | 'error'` to the Zustand store (`01-STATE-CONSOLIDATION`). Set by the sync client: network fail → `offline`; 200 `{synced:false, reason:'guest'}` → `guest`; 5xx → `error`; success → `ok`.
- Render a small badge in the app header / profile area:
  - `offline` → amber cloud-slash icon + "Saved on this device — will sync when online."
  - `error` → red + "Sync problem — your progress is safe locally. Retry." (button re-fires the queued sync).
  - `guest` → subtle "Sign in to sync across devices" (dismissible).
  - `ok` → no badge (or a brief checkmark on transition).
- The badge reads the same queued-updates mechanism the SW background sync targets (`sw.js:345-368`), so "will sync when online" is truthful.

---

## F. Prisma fix

### F.1 The mismatch (verified)

`package.json:21-22`: `@prisma/adapter-libsql ^7.4.0` vs `@prisma/client ^6.19.2` + `prisma ^6.19.2` (`:30`). Adapter major 7 against client/CLI major 6 — the driver-adapter contract changed between majors, so the v7 adapter is not guaranteed to satisfy the v6 client's `adapter` option. Additionally `prisma.ts:2` imports `PrismaLibSql` (lowercase `sql`) but the package's actual export is **`PrismaLibSQL`** (capital `SQL`) — so `new PrismaLibSql(...)` is `new undefined(...)` at runtime.

### F.2 The fix

**Pin to the v6 line** (the app is on Prisma 6; upgrading client+CLI to 7 is a larger migration with its own breaking changes and is out of scope for a hardening pass):

```jsonc
// package.json
"@prisma/adapter-libsql": "^6.19.2",   // was ^7.4.0 — match the client major
"@prisma/client": "^6.19.2",
"prisma": "^6.19.2",
"@libsql/client": "^0.17.0"            // unchanged; compatible with adapter v6
```

Fix the import + constructor in `src/lib/prisma.ts`:

```ts
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';   // capital SQL

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (url && authToken) {
    const adapter = new PrismaLibSQL({ url, authToken });   // v6 signature: config object
    return new PrismaClient({ adapter });
  }
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_NO_DB) {
    throw new Error('No database configured in production (set TURSO_* or ALLOW_NO_DB).');
  }
  return new PrismaClient();   // local sqlite via schema datasource
}
```

Notes:
- Verify the installed `@prisma/adapter-libsql@6` export name after pinning (`node -e "console.log(Object.keys(require('@prisma/adapter-libsql')))"`); in the 6.x line it is `PrismaLibSQL`. Adjust if the exact 6.19.x patch differs.
- `prisma generate` (already in `build`, `package.json:8`) must be re-run after the version pin so the generated client matches the adapter.
- **Selection-logic hardening**: the current guard keys on Turso vars but the app also reads `DATABASE_URL` elsewhere. Make `env.ts` (E.1) the single arbiter and have `prisma.ts` consume `env`, so "which DB" is decided once and a half-configured Turso (url without token) errors at boot instead of silently falling back to an empty local sqlite in prod.

---

## G. Service worker v2

### G.1 Current problems (verified)

- Audio cache-first only matches `everyayah.com` or paths containing `/audio/` (`sw.js:98-101`). `api.quran.com`, `audio.qurancdn.com`, `cdn.islamic.network` fall into the network-only `/api/`-or-other branches.
- `api.quran.com` word-by-word/tafsir hit the network-only `'/api/'` branch semantics via the generic API/other paths → break offline (`sw.js:221-235`).
- `CACHE_AUDIO` allowlist (`sw.js:276`) lists `cdn.islamic.network`, `verses.quran.com` — but the app plays from `everyayah.com` / (new) `audio.qurancdn.com`. Allowlist is for the wrong hosts.
- Dead rule `CACHEABLE_API_ROUTES = ['/api/quran']` (`sw.js:44`) — no such route exists.

### G.2 Post-bundling assumption

`02-JOURNEY-ENGINE` bundles word-by-word data at build time, removing most runtime `api.quran.com` calls. The SW is designed for that world: bundled JSON is a first-party static asset (precached / SWR), and the only residual `api.quran.com` call is the audio-id resolver (B.6), which is SWR-cached.

### G.3 Caching matrix

| Origin / pattern | Strategy | Cache name | TTL / cap |
|---|---|---|---|
| App shell (`/`, `/recite`, `/mushaf`, `/memorize`, `/review`, `/settings`, icons, manifest) | precache on install; navigation = network-first → `/offline` fallback | `hifz-static-v4` | app-version scoped; cleared on activate |
| `/_next/static/*` | stale-while-revalidate | `hifz-static-v4` | immutable-hashed; LRU 300 |
| Bundled journey JSON (`/data/quran/*.json`, `/_next/static/.../*.json` chunks) | **precache active surah + next segment** on session start; else cache-first | `hifz-quran-v4` | LRU 40 surah-chunks |
| Audio CDNs: `everyayah.com`, `cdn.islamic.network`, `audio.qurancdn.com` | cache-first, normalized key (B.6) | `hifz-audio-v1` (persist across versions) | **LRU 200 files** |
| `GET /api/audio/resolve` (residual qurancdn id lookup) | stale-while-revalidate | `hifz-quran-v4` | 24h |
| Any remaining `api.quran.com` GET (should be ~none post-bundling) | stale-while-revalidate | `hifz-quran-v4` | 1h; LRU 100 |
| **Never cache**: `/api/sheikh*`, `/api/tajweed/*`, `/api/transcribe*`, `/api/tarteel*`, `/api/user/*`, `/api/srs/*`, `/api/*sync*`, `/api/account`, `/api/push/*`, anything with `Authorization`/`x-user-api-key` | network-only; offline → `503 {offline:true}` | — | — |

Implementation changes to `sw.js`:
- `isQuranAudio(url)` → check membership in a real `AUDIO_HOSTS = ['everyayah.com','cdn.islamic.network','audio.qurancdn.com']` set (replaces `sw.js:98-101`), and match the normalized cache key path for our synthetic audio requests.
- LRU eviction helper for `hifz-audio-v1` (trim to 200 by insertion order) — the current audio cache grows unbounded.
- Delete `CACHEABLE_API_ROUTES` / `isCacheableApi` (`sw.js:44,113-116,197-219`); replace with the SWR branch for `/api/audio/resolve` + residual `api.quran.com`.
- Fix `CACHE_AUDIO` message allowlist (`sw.js:276`) to `AUDIO_HOSTS` + our own origin (for normalized keys). Drop `verses.quran.com`.
- Bump `CACHE_VERSION` to `v4`; keep `AUDIO_CACHE = 'hifz-audio-v1'` persistent (existing behaviour `sw.js:75` is correct).
- Never-cache list is enforced by an explicit prefix check **before** any caching branch, and also honored on `message: CACHE_AUDIO` (already host-allowlisted).

### G.4 Offline UX matrix (target state)

| Feature | Offline after this design? | Why |
|---|---|---|
| Memorize (active surah) | ✅ | Journey JSON precached (G.3 row 3); progress writes queue to IndexedDB → SW background sync (`sw.js:345`) |
| Review / SRS | ✅ | Same; scheduling is client-side; sync deferred |
| Mushaf (bundled surahs) | ✅ | Word-by-word bundled at build (`02-JOURNEY-ENGINE`); no runtime `api.quran.com` |
| Audio for cached surahs | ✅ | Normalized-key cache-first; whichever CDN cached the ayah serves it |
| Audio for un-cached surahs | ❌ (expected) | No network → `AudioUnavailableError`; UI shows "download this surah for offline" affordance |
| AI Sheikh / tajweed analysis | ❌ (by design) | Never-cached; requires network + key. UI disables entry points offline |
| Live recitation (Tarteel) | ❌ offline; WebSpeech also needs network | Chain resolves to Manual offline (A.5); user taps words |
| Cross-device sync | deferred | Queued; badge shows "will sync when online" (E.3) |

---

## H. Execution order (PR-by-PR)

Estimates assume one engineer; **[STORE]** = App-Store-submission prerequisite.

| PR | Title | Depends on | Est. | Store? |
|---|---|---|---|---|
| **PR-1** | Recitation provider chain v2: `RecitationProvider` interface, real health (A.3), circuit breaker + hot-swap (A.4), telemetry badge (A.5). Fix `processChunk` silent-swallow. | — | 2.0 d | **[STORE]** mic-permission + no-silent-failure |
| **PR-2** | On-demand warmup (A.6); repurpose `keep-warm`→`warmup`; drop the misleading cron doc; single Modal URL via `env.ts`. Delete dead offline-Whisper (`hybridTranscription.transcribe`, `OfflineModelLoader`). | PR-1, PR-6 (env.ts) | 0.5 d | — |
| **PR-3** | `optionalAuth()`/`requireAuth()` + 19-route migration (C.3); guest-safe sync responses; middleware note. | — | 1.5 d | **[STORE]** keyless/guest must not 500 |
| **PR-4** | BYOK across all 5 AI routes (D.2), guest-with-key policy + key-hash rate limit (D.3), `callClaudeStream` timeout (D.4). | PR-3 | 1.0 d | — |
| **PR-5** | `/api/ai/status` + UI gating + Settings copy/test-key (D.5). | PR-4 | 0.5 d | — |
| **PR-6** | `env.ts` boot validation (E.1) + real `/api/health` (E.2) wired to `useNetworkStatus`; "sync offline" badge (E.3). | — | 1.0 d | — |
| **PR-7** | Prisma version pin + import/casing fix + Turso selection hardening (F). | PR-6 | 0.5 d | — |
| **PR-8** | Service worker v2 (G): caching matrix, normalized audio key, LRU, never-cache list, remove dead rules. | PR-9 (audioUrl), 02-JOURNEY-ENGINE | 1.5 d | **[STORE]** offline robustness |
| **PR-9** | Audio delivery v2 (B): `audioUrl()` module + CDN chain, `verify-reciters.ts`, player onerror cascade, delete dead builders. | 01-STATE-CONSOLIDATION (single reciter table) | 1.5 d | — |

Suggested merge order: **PR-6 → PR-3 → PR-1 → PR-2 → PR-7 → PR-9 → PR-8 → PR-4 → PR-5** (env/health first so everything reads validated config; Clerk optionality before AI so BYOK builds on `optionalAuth`; audio before SW). Total ≈ 10 engineer-days.

**App-Store critical path:** PR-3 (no 500s for guests) → PR-1 (mic flows, graceful degradation, no silent failure) → PR-8 (offline works for memorize/review/mushaf/cached-audio). Ship those three before submission; the rest can follow in a fast-follow release.

---

## Appendix — audit corrections found while verifying

1. **`/api/transcribe-tarteel` is live, not dead.** Caller chain: `mushaf/page.tsx` → `TajweedPractice.tsx` → `tajweedService.analyzeRecitation` (`:296`) → `transcribeViaServer` (`:404`) → `fetch('/api/transcribe-tarteel')` (`:410`). It is a *batch* (FormData, whole-clip) transcription path, distinct from `/api/tarteel` (JSON base64, live chunks). Re-scoped from "delete" to "bring under `optionalAuth()` + BYOK."
2. **`OfflineModelLoader` is rendered** (`settings/page.tsx:143`) even though the model it loads is unused (`hybridTranscription.transcribe` has zero callers). Remove the component *and* its Settings entry, not just the lib function.
3. **`prisma.ts` has a second latent bug** beyond the version mismatch: the import name `PrismaLibSql` is mis-cased vs the actual export `PrismaLibSQL`, so the adapter constructor is `undefined` regardless of versions.
4. **`/api/srs/sync` calls `auth()` unconditionally outside its try block** — it 500s even more eagerly than the others without Clerk keys.
