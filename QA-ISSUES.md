# QA Issues — Feb 17, 2026

## 🔴 P0 — Auth & Navigation (Blocking)

1. **Auth loop on protected routes** — `/lessons`, `/practice`, `/memorize`, `/progress`, `/recite` all force sign-in redirect even when signed in. Middleware is too aggressive.
   - FIX: Make ALL routes public. Handle auth gracefully client-side with GuestBanner prompts. Remove `isProtectedRoute` forcing redirectToSignIn.
   
2. **Dashboard shows "guest mode" when signed in** — GuestBanner appears even for authenticated users
   - CHECK: Is Clerk session being read correctly on client?

3. **Homepage "Sign in" button doesn't update to profile pic after auth**
   - Likely same Clerk session issue

4. **Practice page redirects to onboarding** — `isCalibrationComplete()` check sends users to `/onboarding/welcome` if not calibrated
   - FIX: Don't redirect. Show inline prompt to complete setup if needed.

5. **Practice page feels like different app** — Was built separately (Claude Code), inconsistent with main app design
   - REDESIGN needed

## 🔴 P0 — Broken Features

6. **Practice features don't work** — The actual practice/review system is non-functional
7. **Word-by-word highlighting not working** — Feature was built but not visible
8. **Tarteel integration not user-facing** — Server endpoint exists but no UI exposes it
9. **No reveal-as-you-recite feature** — Central to Tarteel memorization technique
10. **Lessons have dead "Listen" buttons** — Audio removed but buttons remain
11. **Tajweed menu hides behind player controls** — Z-index/layout issue in mushaf
12. **Feedback button not on every page** — Should be global floating

## 🟡 P1 — Navigation & Architecture

13. **Garden of Surahs should be IN the Quran tab** — Not a separate nav item
    - Move browse/surahs into mushaf as a tab/view mode
    - Remove from BottomNav
14. **No Madani mushaf view option** — Need proper Madani script option

## 🟡 P1 — Visual/Design

15. **Garden of Surahs animation is mediocre** — Needs stunning, best-in-class navigation
16. **Onboarding first page (green) doesn't match branding** — Inconsistent theme
17. **Onboarding flow functional but not beautiful** — Needs design polish
18. **"Garden of Surahs" text not on brand** — Header styling
19. **Olive Earth theme legibility issues** — Needs cream background, dark fonts
20. **Mushaf settings label wrong** — "Audio and Reciter" should be "Mushaf Settings"
21. **Remove Hazza Al Balushi reciter** — Doesn't work well
22. **Find better indo-pak script** — Current one hard to read
23. **Settings toggle should be liquid glass animated slider**

## 🟢 P2 — Missing Features

24. **No Linear-like bug tracker** — Feedback should feed into trackable system
25. **Word-by-word transliteration only in memorization** — Should be available elsewhere
26. **Tracking not properly elevated** — Progress tracking UX needs work
