# Critical Bugs — Sprint Priority

## P0: Core Features Completely Broken

### #21 — Recite & Reveal modes crash
**Root cause:** `src/app/recite/page.tsx` uses `useSearchParams()` without a `<Suspense>` boundary. Next.js 14 throws during static generation.
**Fix:** Wrap the page component in Suspense, or split into a client wrapper + inner component.
**Files:** `src/app/recite/page.tsx`, `src/app/recite/layout.tsx`

### #26 — Tajweed Practice blank screen  
**Root cause:** `src/components/TajweedPractice.tsx` (1158 lines) — the component renders but content is empty. Likely the tajweed data loading fails silently.
**Files:** `src/components/TajweedPractice.tsx`, `src/hooks/useRealtimeTajweed.ts`

### #22 — Onboarding flow broken
**Root cause:** "Begin Your Journey" → Clerk `<SignUpButton>` → dashboard directly. No check for `quranOasis_onboardingComplete` in localStorage before rendering dashboard. The onboarding at `/onboarding` exists but is never triggered for new sign-ups.
**Fix:** After Clerk sign-up/sign-in, check `localStorage.getItem('quranOasis_onboardingComplete')`. If not 'true', redirect to `/onboarding`. The flashcards/memorize triggering onboarding is because those components individually check onboarding status.
**Files:** `src/app/HomeClient.tsx`, `src/app/dashboard/` or main layout, `src/app/onboarding/page.tsx`

### #23 — Sabaq review page broken/unstyled
**Root cause:** `src/app/practice/review/page.tsx` renders but the UI is raw/unstyled. The page exists but the review flow component is incomplete.
**Files:** `src/app/practice/review/page.tsx`

## P1: Navigation & UX Broken

### #25 — Back button & modal drag handle
- Sheikh HIFZ modal drag handle doesn't work (gesture not wired)
- Back button (`<`) in Sheikh modal and Quran fullscreen view doesn't fire `router.back()`
**Files:** `src/components/AskSheikhButton.tsx` (modal), `src/app/mushaf/page.tsx` (back btn)

### #24 — No personalization
- Practice tab shows "Student" not user's name
- Recommendations are sample/generic data
**Files:** `src/app/practice/page.tsx`, onboarding data in localStorage

## Architecture Notes

### Tarteel Integration
- API route: `src/app/api/tarteel/route.ts`
- Endpoint: `MODAL_WHISPER_URL` → `pagodahut--hifz-whisper-transcribe-api.modal.run`
- Health check: GET `/api/tarteel` → checks Modal endpoint
- Service: `src/lib/tarteelService.ts` — chunked audio, polling
- Fallback chain: Tarteel → WebSpeech → Deepgram
- The recite flow: LiveRecitation.tsx checks Tarteel health, falls back to WebSpeech

### Design System
- See `DESIGN_SYSTEM.md` — liquid glass aesthetic
- Key classes: `liquid-glass`, `liquid-glass-gold`, `liquid-glass-strong`
- Defined in `src/app/globals.css`
