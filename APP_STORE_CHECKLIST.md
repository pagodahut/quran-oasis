# App Store Readiness Checklist — HIFZ

Status of the path to shipping HIFZ on the Apple App Store. The web app is a
PWA; the store build wraps it in a native shell (Capacitor recommended for
WKWebView + StoreKit + native push + native speech).

## ✅ Done in this codebase

- **In-app account deletion** (Guideline 5.1.1(v) — the #1 rejection reason).
  `DELETE /api/account` removes the Clerk account + all DB data (cascades);
  UI in Profile → Data & Privacy.
- **Privacy Policy** (`/privacy`), **Terms of Service** (`/terms`),
  **Help & Support** (`/support`) — real pages, linked from profile,
  sign-in/up, and the footer. Use these URLs in App Store Connect.
- **Privacy disclosures** for all third-party processors (Clerk, Anthropic,
  speech-recognition, EveryAyah, push) written into the policy.
- **Broken manifest screenshot** reference removed.
- **Microphone resource leak** on `/identify` fixed (mic released on unmount).
- **Audio failure handling** so playback can't hang the UI.
- **Server-side AI rate limiting** to prevent cost abuse.
- **Push IDOR** removed; **sync data-loss** guarded; **SW cross-user HTML
  leak** closed.

## ⚠️ Required in the native shell (cannot be done in this web repo)

1. **Microphone usage string** — add to `Info.plist`:
   `NSMicrophoneUsageDescription` = "HIFZ uses your microphone to listen to
   your Quran recitation and give you tajweed feedback."
2. **App Store icon** — generate a 1024×1024 PNG (no alpha, no rounded
   corners) for the asset catalog. A clean SVG mark ships at `src/app/icon.svg`.
3. **iOS voice recognition** — `webkitSpeechRecognition` does NOT work in
   WKWebView. Use a native speech plugin (e.g.
   `@capacitor-community/speech-recognition`) or route recording to the
   server transcription path with an iOS-compatible audio format (`audio/mp4`).
   The app already degrades to a manual "I've recited it" fallback.
4. **Push notifications** — web push doesn't work in WKWebView. Use native
   APNs (Capacitor Push Notifications) + the `aps-environment` entitlement.
5. **In-App Purchase** — if/when Premium is monetized, digital goods MUST use
   StoreKit IAP (Guideline 3.1.1). Do NOT link to Stripe/external checkout.
   The premium page is currently "coming soon" (no purchase), so this is
   deferred until launch.
6. **Sign in with Apple** (Guideline 4.8) — if Google or other social logins
   are enabled in Clerk, Apple sign-in must also be offered. Confirm Clerk's
   enabled providers; enable Apple if any third-party social login is on.
7. **Privacy nutrition label** — declare in App Store Connect: Contact Info
   (email/name, linked), User Content (audio + AI messages, linked),
   Identifiers (push token). See `/privacy` for the processor list.
8. **`PrivacyInfo.xcprivacy`** privacy manifest in the native binary
   (declare required-reason APIs such as UserDefaults).

## 🔭 Recommended before launch (not hard blockers)

- Set the daily Ramadan logic to compute the Hijri month dynamically
  (`Intl.DateTimeFormat('en-u-ca-islamic-umalqura', …)`) — currently hardcoded
  to 2026 dates and will not trigger in 2027+.
- Hide or finish the "coming soon" toggles (practice reminders, cloud sync).
- Add segment `error.tsx` boundaries to dashboard/bookmarks/settings/surahs.
- Real location-based prayer times if the prayer labels are ever surfaced as a
  schedule (today they drive ambient theming only).
