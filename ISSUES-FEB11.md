# HIFZ App Issues & Features — Feb 11, 2026

## 🔴 Critical Bugs

### 1. Wrong Logo in Onboarding
- **Location:** `/src/app/onboarding/`
- **Issue:** Using old/incorrect logo
- **Fix:** Replace with correct HIFZ logo from `/public/`

### 2. Lesson Scores Default to 77%
- **Location:** Lesson complete screen
- **Issue:** All scores show 77% instead of actual calculated score
- **Fix:** Pass actual score from lesson state to completion component

### 3. Letter Spacing Issues (Ha, Kha)
- **Location:** Letter display components
- **Issue:** Phonetics have weird spacing under letters
- **Fix:** Adjust CSS/layout for Arabic letter + phonetic display

### 4. Blank Practice Recommendation
- **Location:** Practice page
- **Issue:** Shows "** technique:**" with empty content
- **Fix:** Handle null/undefined technique data gracefully

### 5. Quiz Shows Letters with Answers
- **Location:** Quiz component (Ha/Kha/Jeem differentiation quiz)
- **Issue:** Showing Arabic letters next to phonetic names defeats the test purpose
- **Fix:** Option to hide Arabic letters in answer choices for letter recognition quizzes

---

## 🟡 UX Improvements

### 6. Sheikh Onboarding Too Wordy
- **Location:** `/src/app/onboarding/`
- **Issue:** Sheikh HIFZ asks too many questions, too verbose
- **Fix:** Simplify to 3-4 quick questions, shorter responses

### 7. Signup Flow Timing
- **Location:** Onboarding flow
- **Issue:** Signup should come AFTER onboarding with skip option
- **Fix:** Restructure flow: Onboarding → Signup (skippable) → Dashboard

### 8. Ayahs Stat Irrelevant for Alphabet Lessons
- **Location:** Lesson complete screen
- **Issue:** Shows "0 AYAHS" which isn't relevant for alphabet lessons
- **Fix:** Conditionally hide Ayahs stat for non-Quran lessons

### 9. Sheikh Not Aware of Lesson Contents
- **Location:** "Ask Sheikh more" feature post-lesson
- **Issue:** Sheikh doesn't know what was just learned
- **Fix:** Pass lesson context (letters covered, concepts) to Sheikh API

---

## 🟢 New Features

### 10. Floating Feedback Button
- **Description:** Persistent feedback icon that lets users type issues
- **Flow:** User feedback → Hakim (me) → Triage → Linear ticket
- **Implementation:**
  - Floating action button (bottom-left to not conflict with navigation)
  - Modal with text input
  - POST to `/api/feedback` → stores in DB + creates Linear ticket
- **Requires:** Linear account setup, API integration

### 11. Premium Gating for AI Sheikh
- **Description:** Gate AI features to cover costs (not profit center)
- **Gated features:**
  - Sheikh listening/speech recognition
  - Sheikh Q&A / conversations
  - AI-generated lesson plans
- **Non-gated (free):**
  - Core lessons and quizzes
  - Progress tracking
  - Basic onboarding (without Sheikh interaction)
- **Implementation:**
  - `isPremium` flag in user context
  - `<PremiumGate>` wrapper component
  - Bypass flag for development: `BYPASS_PREMIUM=true`
  - UI: Show locked state with "Unlock Premium" CTA

### 12. Classic (Non-Sheikh) Onboarding
- **Description:** Allow users to onboard without AI interaction
- **Flow:** 
  - Option A: "Quick Setup" (no Sheikh, just preferences)
  - Option B: "Meet Sheikh HIFZ" (AI-guided, premium)
- **Implementation:** Two onboarding paths, route based on choice

---

## 📋 Priority Order

1. **P0 - Today:** 
   - Fix 77% score bug
   - Fix blank practice recommendation
   - Fix spacing issues

2. **P1 - This Week:**
   - Simplify Sheikh onboarding
   - Add lesson context to Sheikh
   - Fix quiz (hide letters in answers)
   - Correct logo

3. **P2 - Next:**
   - Floating feedback button + Linear integration
   - Premium gating UI (bypassable)
   - Classic onboarding path
   - Move signup after onboarding

---

## 💡 Premium Gating Ideas

### Pricing Approach (Cost Recovery)
- **Free tier:** Full lesson content, basic features
- **Premium ($X/mo):** AI Sheikh interactions
- Could be:
  - Monthly subscription ($4.99-9.99/mo)
  - Usage-based (X Sheikh interactions/month free, then pay)
  - One-time lifetime ($29.99-49.99)

### Implementation Options
1. **Clerk + Stripe** - Already using Clerk, add Stripe for payments
2. **RevenueCat** - If planning mobile app
3. **Lemon Squeezy** - Simpler alternative to Stripe

### UI Patterns
- Soft paywall: Show Sheikh response preview, blur rest
- Hard gate: "Unlock Sheikh HIFZ" modal before any AI interaction
- Metered: "3 free Sheikh questions today" counter

---

## 🔧 Technical Notes

### Linear Integration
```bash
npm install @linear/sdk
```
- Create Linear account at linear.app
- Generate API key
- Create project for HIFZ feedback
- API endpoint to create issues

### Premium Context
```typescript
// contexts/PremiumContext.tsx
interface PremiumState {
  isPremium: boolean;
  canBypass: boolean; // for dev
  sheikInteractionsRemaining: number;
}

// Usage
<PremiumGate feature="sheikh-chat">
  <SheikhChat />
</PremiumGate>
```
