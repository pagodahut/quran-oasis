# AI Sheikh Integration Guide

## What Was Built

The AI Sheikh (Your Personal Quran Teacher) consists of 5 files:

### Core Files

| File | Purpose |
|------|---------|
| `src/lib/sheikh-prompt.ts` | The AI's personality, knowledge, and teaching style. This is the soul. |
| `src/app/api/sheikh/route.ts` | API endpoint that calls Claude with streaming. |
| `src/hooks/useSheikhChat.ts` | React hook for managing chat state, streaming, errors. |
| `src/components/SheikhChat.tsx` | The chat UI — messages, input, suggested questions. |
| `src/components/AskSheikhButton.tsx` | Floating "Ask Sheikh" button for any page. |

### Demo/Test

| File | Purpose |
|------|---------|
| `src/app/sheikh/page.tsx` | Full demo page at `/sheikh` with sample ayahs. |

---

## Step 1: Copy Files to Your Project

Copy all 5 core files into your existing HIFZ project, maintaining the same paths.

Your existing project already has `src/lib/`, `src/app/api/`, `src/hooks/`, and `src/components/` — these files drop right in.

---

## Step 2: Verify Dependencies

Your project already has everything needed:
- `framer-motion` ✅ (for animations)
- `next` ✅ (for API routes)
- `@anthropic-ai/sdk` or direct API calls ✅ (you already call Claude for tajweed)

No new packages required.

---

## Step 3: Ensure Environment Variable

Your `.env.local` should already have this from your tajweed feature:

```
ANTHROPIC_API_KEY=sk-ant-...
```

The sheikh uses the same key. No additional setup needed.

---

## Step 4: Add Arabic Font Support

If you don't already have an Arabic font class in your Tailwind config, add this:

In `tailwind.config.ts`:
```ts
theme: {
  extend: {
    fontFamily: {
      arabic: ['var(--font-arabic)', 'Amiri', 'serif'],
    },
  },
}
```

And add a `dir-rtl` utility class in your global CSS:
```css
.dir-rtl {
  direction: rtl;
}
```

---

## Step 5: Integrate into Mushaf Page

In your existing mushaf/ayah display component, add the floating button:

```tsx
import AskSheikhButton from '@/components/AskSheikhButton';

// Inside your component, wherever you display an ayah:
<AskSheikhButton
  ayahContext={{
    surahNumber: currentSurah.number,
    surahName: currentSurah.englishName,
    surahNameArabic: currentSurah.arabicName,
    ayahNumber: currentAyah.number,
    arabicText: currentAyah.arabic,
    translation: currentAyah.translation,
    transliteration: currentAyah.transliteration,
    juz: currentAyah.juz,
  }}
  userLevel={userProfile.level || 'beginner'}
/>
```

The button will float in the bottom-right and open a slide-up chat panel.

---

## Step 6: Integrate into Lesson Pages

For lesson pages where you want the sheikh inline (not as a popup):

```tsx
import SheikhChat from '@/components/SheikhChat';

// At the bottom of a lesson page:
<SheikhChat
  ayahContext={currentLessonAyah}
  userLevel={studentLevel}
  isOpen={true}
  mode="inline"
/>
```

---

## Step 7: Test

1. Start your dev server: `npm run dev`
2. Navigate to `/sheikh` — this is the demo page
3. Select an ayah and try asking questions
4. Test different student levels to see how the AI adapts
5. Test the streaming (responses should appear word-by-word)
6. Test error handling (try with invalid API key)

---

## Architecture Notes

### Why Streaming?
The sheikh streams responses word-by-word. This is critical for UX — a 500-word tafsir explanation would feel like a 10-second wait without streaming. With streaming, the user sees the first word in ~300ms.

### Why Claude Sonnet (not Opus)?
Cost and speed. Sonnet is fast enough for real-time chat and knowledgeable enough for Quran teaching. If you want deeper scholarly analysis, you can upgrade the model in `route.ts` to `claude-opus-4-5-20250929` — but expect 3-5x higher costs and slower responses.

### Token Management
- Conversations are capped at 20 messages to prevent token overflow
- Each response is capped at 1024 tokens (~750 words) to keep answers focused
- The system prompt + ayah context uses ~1500 tokens
- Budget: ~$0.003-0.01 per message with Sonnet

### Prompt Engineering
The system prompt in `sheikh-prompt.ts` is the most important file. It defines:
- The sheikh's personality and teaching style
- Knowledge domains (tafsir, tajweed, Arabic, memorization, spirituality)
- How to adapt to beginner/intermediate/advanced students
- Boundaries (no fatwa, no sectarian debate, scholarly accuracy)
- Response formatting (Arabic text, transliteration, follow-up questions)

To customize the sheikh's personality, edit this file. The prompt is heavily commented.

---

## What's Next (V2 Features)

1. **Conversation Memory** — Save chat history per ayah so students can continue where they left off
2. **Voice Input** — Students speak questions instead of typing (you already have Deepgram)
3. **Voice Output** — Sheikh reads Arabic text aloud with proper tajweed
4. **Quiz Mode** — Sheikh asks the student questions to test understanding
5. **Tafsir Sources** — Integrate an API for verified tafsir data (Ibn Kathir, Jalalayn) so the sheikh references specific works
6. **Multi-language** — Sheikh teaches in Arabic, Urdu, Malay, Turkish, French (top Quran-learning languages)
