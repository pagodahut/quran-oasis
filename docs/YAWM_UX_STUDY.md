# Yawm App — UX & Design Study

> **Date:** February 18, 2026
> **Subject:** [Yawm](https://getyawm.com) — "The Duolingo for Quran" by dawm LLC
> **Purpose:** Extract actionable design patterns for our Hifz app

---

## 1. Brand Positioning & First Impression

Yawm positions itself as **"Your Duolingo for Quran"** — a daily 5-minute micro-learning loop: **Read → Reflect → Learn**. The tagline "Fall in love with the Quran one يوم (day) at a time" immediately sets an emotional, approachable tone.

**Key takeaway:** They frame Quran engagement as a *replacement for doomscrolling*, not as homework. This reframing is critical — it makes the app feel like self-care, not obligation.

---

## 2. Visual Design Language

### 2.1 Color Palette

| Role | Color | Hex (approx) | Usage |
|------|-------|---------------|-------|
| **Primary** | Warm teal/turquoise | `#1DB4A0` → `#0E8C7F` | Backgrounds, CTAs, dominant brand color |
| **Secondary** | Golden amber/sunset | `#F5A623` → `#E8913A` | Accent badges, highlights, Arabic calligraphy overlays |
| **Tertiary** | Soft cream/warm white | `#FFF8F0` → `#FFFDF9` | Card backgrounds, content areas |
| **Text** | Deep charcoal | `#1A1A2E` | Body text on light backgrounds |
| **Text on teal** | Pure white | `#FFFFFF` | Headlines on teal sections |

**Gradient strategy:** The hero uses a **teal-to-warm-gold diagonal gradient** that evokes sunrise/spirituality without being cliché Islamic green. This is their single most differentiating visual choice.

```css
/* Yawm-inspired gradient */
background: linear-gradient(135deg, #1DB4A0 0%, #17A08E 40%, #E8913A 100%);
```

### 2.2 Typography

- **Headlines:** Mix of a clean sans-serif (likely Inter or similar) with a **handwritten/brush script** for emphasis words ("love", "your way", "while it's fresh", "journey", "in motion")
- **Body:** Clean sans-serif, ~16px, generous line-height (~1.6)
- **Arabic text:** Rendered large and centered, treated as a visual hero element — not squeezed into body copy
- **Pattern:** They italicize/script the *emotional* word in each headline: "Fall in **_love_**", "your **_way_**", "**_while it's fresh_**", "**_understand_**"

**CSS pattern for mixed-font headlines:**
```css
.headline {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.2;
}
.headline .emphasis {
  font-family: 'Caveat', cursive; /* or similar brush script */
  font-style: italic;
  color: inherit;
}
```

### 2.3 Spacing & Layout

- **Extremely generous whitespace** — sections breathe with 80-120px vertical padding
- **Max content width** ~1100px, centered
- **Card design:** Rounded corners (16-20px border-radius), subtle shadows, cream/white backgrounds
- **Pill badges** for feature tags: `border-radius: 9999px; padding: 6px 16px; background: rgba(0,0,0,0.08)`
- **Alternating section backgrounds:** Teal → White → Teal → White — creates visual rhythm without complexity
- **Phone mockups** are used as social proof and to show the actual reading experience

```css
/* Section rhythm */
.section-teal { background: var(--teal-gradient); color: white; padding: 80px 0; }
.section-light { background: #FFFDF9; color: #1A1A2E; padding: 80px 0; }

/* Card style */
.feature-card {
  background: #FFFDF9;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

/* Pill tags */
.tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.07);
  margin: 4px;
}
```

---

## 3. The Yawm Flow — Core UX Loop

Their entire UX is built around a **3-step micro-session**:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  STEP 01    │───▶│  STEP 02     │───▶│  STEP 03    │
│  Read       │    │  Reflect     │    │  Learn      │
│  (1 min     │    │  (Tafsir +   │    │  (Vocab     │
│   required) │    │   journal)   │    │   games)    │
│             │    │  BONUS       │    │  BONUS      │
└─────────────┘    └──────────────┘    └─────────────┘
```

**Critical insight:** Only Step 1 is mandatory. Steps 2-3 are labeled "BONUS" — this lowers the barrier massively. Users feel accomplished with just 1 minute, but the bonus system creates a pull to go deeper.

### Streak System
- **Base Goal:** Minimum to keep your streak (just reading)
- **Daily Goal:** Full loop for a "Bonus Streak boost"
- **Hasanat milestones:** Spiritual reward framing instead of purely gamified XP

---

## 4. Reading Experience

### 4.1 Multiple View Modes
- **Vertical Scroll:** "TikTok-style" verse-by-verse — their signature feature
- **Page View:** Traditional mushaf layout
- **List View:** Standard list with translations

### 4.2 Audio Integration
- Word-by-word highlighting synced with recitation
- Top-tier reciters
- Audio follows along regardless of view mode

### 4.3 Translation Layer
- Word-level translations and transliterations
- Multiple tafseer sources
- Toggle-able — not always visible (reduces clutter)

---

## 5. Reflection & Journaling

The reflection step shows:
- **Bite-sized tafsir gems** — curated, not full academic tafsir
- **Guided prompts** — e.g., "Where did you notice relief today?" with a text input
- Prompts are warm and personal, not academic
- Option to save to personal journal or share

**Design pattern:** Cards with soft backgrounds, large readable type, minimal UI chrome.

---

## 6. Vocabulary / Learning Engine

- **Top 500 words** covering ~70% of Quran
- **Spaced Repetition (SRS)** — scientifically-backed retention
- **Gamified quizzes** — "Daily Challenges" framing
- **Context-aware:** Vocab pulled from verses just read (not random)
- Visual: Clean flashcard-style UI with Arabic large, translation below, and interactive tap/swipe

---

## 7. What Makes It Feel Premium

### 7.1 Zero Monetization Friction
"No Ads. No Paywalls. No Distractions." — This is repeated throughout. The entire app is free. This alone makes it feel premium because there are no upsell banners, no locked features, no "watch ad to continue."

### 7.2 Restraint in UI
- Very few buttons on screen at any time
- No bottom tab bar clutter (likely minimal navigation)
- Feature tags use pills instead of long descriptions
- Phone mockups on the landing page show clean, spacious screens

### 7.3 Emotional Design
- Warm color palette (teal + gold) feels spiritual but modern
- Handwritten typography for emotional words creates intimacy
- Copy uses "you" and "your" constantly — personal, not institutional
- Islamic concepts (Hasanat, Deen) used naturally, not forced

### 7.4 Social-Feed Mental Model
The vertical scroll reading mode maps to TikTok/Instagram — familiar muscle memory makes it feel effortless.

---

## 8. Actionable Recommendations for Our Hifz App

### 8.1 Adopt the Warm Teal + Gold Palette
Avoid the cliché "Islamic green + gold" that every other Quran app uses. Yawm's teal-to-amber gradient feels modern and spiritual. Consider:

```css
:root {
  --primary: #1DB4A0;
  --primary-dark: #0E8C7F;
  --accent: #F5A623;
  --surface: #FFFDF9;
  --text: #1A1A2E;
  --text-muted: #6B7280;
}
```

### 8.2 Implement the "Tiny Commitment" Pattern
For Hifz specifically:
- **Base goal:** Review 1 page (keep streak)
- **Daily goal:** Review + new memorization (bonus streak)
- Frame new memorization as "bonus" — not the default expectation. This reduces anxiety.

### 8.3 Use Mixed Typography for Headlines
Pair a clean sans-serif with a brush/script font for emphasis words. This creates visual warmth that pure sans-serif apps lack.

```
"Master your _memorization_"  ← "memorization" in script font
"Track your _journey_"        ← "journey" in script font
```

### 8.4 Vertical Scroll as Primary Reading Mode
For Hifz review, offer a vertical scroll mode where each ayah is a "card" you scroll through — tap to reveal translation, long-press to hear recitation. This maps to social-feed muscle memory.

### 8.5 Generous Spacing — Trust the Whitespace
- Minimum 80px padding between sections
- 20px border-radius on cards
- Content max-width 600px on mobile for readability
- Arabic text should be **at least 24px**, ideally 28-32px

### 8.6 Feature Pills Instead of Descriptions
Replace long feature descriptions with scannable pill badges:

```
◉ Spaced Repetition  ◉ Audio Sync  ◉ Progress Tracking
```

### 8.7 Alternating Section Backgrounds
Create visual rhythm with alternating teal/light sections. This breaks up long pages and makes scanning easy without adding visual complexity.

### 8.8 Onboarding Flow
Yawm's recent update added dedicated onboarding. Based on the pattern:
- **Screen 1:** Emotional hook — "Finally connect with what you memorize"
- **Screen 2:** Set your daily goal (slider: 5 min / 10 min / 15 min)
- **Screen 3:** Choose your starting surah/juz
- **Screen 4:** First micro-session starts immediately (no account required)

### 8.9 Spiritual Framing Over Gamification
Use "Hasanat" instead of "XP." Use "Journey" instead of "Level." The gamification mechanics (streaks, SRS, progress) should be identical to Duolingo, but the *language* should be Islamic.

### 8.10 Audio-First with Word Highlighting
For Hifz this is essential — word-by-word highlighting during recitation helps muscle memory. Yawm treats this as a core feature, not an add-on.

---

## 9. Key Differentiators to Match or Exceed

| Yawm Feature | Our Hifz Equivalent | Priority |
|---|---|---|
| 5-min Read→Reflect→Learn loop | 5-min Review→Test→NewAyah loop | 🔴 Critical |
| Vertical scroll reading | Vertical scroll review mode | 🔴 Critical |
| Word-level audio sync | Word-level audio for memorization | 🔴 Critical |
| SRS vocab games | SRS-powered review scheduling | 🔴 Critical |
| Streak with base/bonus goals | Streak with review/memorize goals | 🟡 High |
| Tafsir reflection prompts | Meaning-connection prompts | 🟡 High |
| No ads/paywalls | Freemium with generous free tier | 🟢 Medium |
| Hasanat milestones | Hifz milestones (juz completion, etc.) | 🟢 Medium |

---

## 10. CSS Design System Starter

```css
/* Typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Caveat:wght@500;700&display=swap');

:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-accent: 'Caveat', cursive;
  --font-arabic: 'Amiri', 'Traditional Arabic', serif;

  /* Colors */
  --teal-500: #1DB4A0;
  --teal-600: #17A08E;
  --teal-700: #0E8C7F;
  --amber-400: #F5A623;
  --amber-500: #E8913A;
  --cream: #FFFDF9;
  --cream-dark: #FFF3E0;
  --charcoal: #1A1A2E;
  --muted: #6B7280;

  /* Spacing */
  --section-padding: 80px;
  --card-radius: 20px;
  --pill-radius: 9999px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.06);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Hero gradient */
.gradient-spiritual {
  background: linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 50%, var(--amber-500) 100%);
}

/* Arabic text - always large and prominent */
.arabic-verse {
  font-family: var(--font-arabic);
  font-size: 2rem;
  line-height: 2;
  direction: rtl;
  text-align: center;
}

/* Feature card */
.card {
  background: var(--cream);
  border-radius: var(--card-radius);
  padding: 2rem;
  box-shadow: var(--shadow-card);
}

/* Pill badge */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: var(--pill-radius);
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.07);
}

/* Section alternation */
.section:nth-child(odd) {
  background: var(--cream);
  padding: var(--section-padding) 0;
}
.section:nth-child(even) {
  background: linear-gradient(135deg, var(--teal-500), var(--teal-700));
  color: white;
  padding: var(--section-padding) 0;
}
```

---

## Summary

Yawm succeeds by being **opinionated and restrained**. It does three things (Read, Reflect, Learn) and does them beautifully. The premium feel comes from:

1. **Warm, non-generic color palette** (teal + amber, not green + gold)
2. **Mixed typography** (clean + handwritten = warmth)
3. **Extreme whitespace discipline**
4. **"Tiny commitment" UX** (1 min base, bonuses optional)
5. **Social-feed muscle memory** (vertical scroll)
6. **Zero monetization noise**
7. **Spiritual language over gamification language**

For our Hifz app, the single highest-impact adoption would be the **teal-amber palette + generous spacing + vertical scroll review mode**. These three changes alone would differentiate us from every other Hifz app on the market.
