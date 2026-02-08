# Phase A Integration Guide
## Drop-in Instructions for Quran Oasis

---

## Files Overview

| File | Status | Purpose |
|------|--------|---------|
| `src/contexts/SheikhContext.tsx` | **NEW** | Global brain — ayah context, page context, panel state |
| `src/components/SheikhOverlay.tsx` | **NEW** | Renders FAB + panel globally from layout |
| `src/components/AskSheikhButton.tsx` | **REPLACED** | Context-aware FAB (reads from SheikhContext) |
| `src/components/SheikhChat.tsx` | **REPLACED** | Context-aware panel (auto-sends pending questions) |
| `src/hooks/useSheikhChat.ts` | **REPLACED** | Sends pageContext to API |
| `src/lib/sheikh-prompt.ts` | **REPLACED** | Page-aware system prompt builder |
| `src/app/api/sheikh/route.ts` | **REPLACED** | Accepts pageContext, uses buildFullSystemPrompt |

---

## Step 1: Add SheikhProvider to Layout

Your layout.tsx likely has providers already (Clerk, etc). Add SheikhProvider inside them.

**If layout.tsx is already `'use client'`:**

```tsx
import { SheikhProvider } from '@/contexts/SheikhContext';
import SheikhOverlay from '@/components/SheikhOverlay';

// Wrap children:
<SheikhProvider>
  {children}
  <SheikhOverlay />
</SheikhProvider>
```

**If layout.tsx is a server component**, create a client wrapper:

```tsx
// src/components/Providers.tsx
'use client';
import { SheikhProvider } from '@/contexts/SheikhContext';
import SheikhOverlay from '@/components/SheikhOverlay';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SheikhProvider>
      {children}
      <SheikhOverlay />
    </SheikhProvider>
  );
}
```

Then in layout.tsx: `<Providers>{children}</Providers>`

---

## Step 2: Wire Each Page

Each page needs 2 things:
1. Tell SheikhContext which page the user is on (so FAB appears + sheikh adapts)
2. Update ayah context when user selects an ayah (so sheikh knows what they're studying)

### Mushaf Page

```tsx
'use client';
import { useEffect } from 'react';
import { useSheikh } from '@/contexts/SheikhContext';

export default function MushafPage() {
  const { setPageContext, setAyahContext, openSheikh } = useSheikh();

  // Tell sheikh we're on mushaf
  useEffect(() => {
    setPageContext({ page: 'mushaf' });
    return () => setAyahContext(undefined); // Clear on leave
  }, [setPageContext, setAyahContext]);

  // When user taps an ayah:
  const handleAyahTap = (ayah: any) => {
    setAyahContext({
      surahNumber: ayah.surahNumber,
      surahName: ayah.surahName,
      surahNameArabic: ayah.surahNameArabic,
      ayahNumber: ayah.ayahNumber,
      arabicText: ayah.arabicText,
      translation: ayah.translation,
    });
    // FAB automatically changes to "Ask about this ayah"
  };

  // Optional: "Ask Sheikh about this ayah" button in ayah menu
  const handleAskSheikh = (ayah: any) => {
    setAyahContext({ /* same as above */ });
    openSheikh(); // Opens panel with ayah pre-loaded
  };

  // ... rest of your mushaf component
}
```

### Lesson Page

```tsx
'use client';
import { useEffect } from 'react';
import { useSheikh } from '@/contexts/SheikhContext';

export default function LessonPage({ params }: { params: { id: string } }) {
  const { setPageContext, setAyahContext, incrementReplayCount, incrementFailedAttempts } = useSheikh();

  useEffect(() => {
    setPageContext({
      page: 'lesson',
      lessonId: params.id,
      lessonTitle: 'Al-Fatiha: The Opening', // from your lesson data
    });
    return () => setAyahContext(undefined);
  }, [params.id, setPageContext, setAyahContext]);

  // When user replays audio:
  const handleReplay = () => {
    incrementReplayCount(); // After 5, "Need help?" appears
    // ... your existing replay logic
  };

  // When recitation fails:
  const handleRecitationFail = () => {
    incrementFailedAttempts(); // After 3, "Need help?" appears
    // ... your existing failure logic
  };

  // Update ayah as user progresses through lesson:
  const handleAyahChange = (ayah: any) => {
    setAyahContext({ /* ayah data */ });
  };
}
```

### Recite Page

```tsx
useEffect(() => {
  setPageContext({ page: 'recite' });
}, [setPageContext]);
```

### Practice Page

```tsx
useEffect(() => {
  setPageContext({ page: 'practice' });
}, [setPageContext]);
```

### Dashboard Page

```tsx
useEffect(() => {
  setPageContext({ page: 'dashboard' });
}, [setPageContext]);
```

---

## Step 3: Remove Old Sheikh Navigation

Your dashboard currently has a card linking to `/sheikh`:

```tsx
// REMOVE or REPLACE this card:
<Link href="/sheikh">
  <div>📖 Ask Sheikh · AI</div>
</Link>

// REPLACE with:
<button onClick={() => openSheikh()}>
  <div>📖 Ask Sheikh · AI</div>
</button>
```

The `/sheikh` standalone page can remain as a fallback/deep-link, but the primary access is now the overlay panel from any page.

---

## Step 4: Remove Old AskSheikhButton Imports

If your mushaf or any page already imports AskSheikhButton and renders it manually, **remove those imports**. The SheikhOverlay component (in layout) now handles rendering the FAB globally — you don't need per-page button instances anymore.

```tsx
// REMOVE from mushaf/lessons/etc:
import AskSheikhButton from '@/components/AskSheikhButton';
// REMOVE: <AskSheikhButton ayahContext={...} />

// The FAB now appears automatically via SheikhOverlay
// when you call setPageContext({ page: 'mushaf' })
```

---

## How It Works (The Flow)

1. User opens `/mushaf` → page calls `setPageContext({ page: 'mushaf' })`
2. SheikhOverlay sees `page === 'mushaf'` → shows the floating "Ask Sheikh" button
3. User taps an ayah → page calls `setAyahContext({ surahNumber: 2, ayahNumber: 255, ... })`
4. FAB label changes to "Ask about this ayah"
5. User taps FAB → `openSheikh()` is called
6. SheikhChat panel slides up from bottom (user stays on mushaf)
7. SheikhChat reads `ayahContext` from context → passes to `useSheikhChat`
8. `useSheikhChat` sends ayahContext + pageContext to `/api/sheikh`
9. API route builds full system prompt with `buildFullSystemPrompt()` including:
   - Core sheikh personality
   - Current page context ("student is browsing the mushaf")
   - Current ayah context (Arabic text, translation, surah info)
   - User level adaptation
10. Sheikh responds contextually: "You're reading Ayatul Kursi (2:255)..."

---

## Stuck Detection Flow

1. User is on lesson page, replays audio 5+ times
2. Page calls `incrementReplayCount()` each replay
3. SheikhContext sets `isUserStuck = true`
4. AskSheikhButton shows a nudge: "Having trouble? Sheikh can help..."
5. Button label changes to "Need help?" with orange gradient
6. User taps → opens sheikh with pre-loaded question about the specific ayah
7. Sheikh receives context: "⚠️ Student has replayed audio 7 times — may be struggling"
8. Sheikh responds with extra patience and specific memorization tips

---

## What You Get After Phase A

- ✅ Global sheikh panel accessible from mushaf, lessons, recite, practice, dashboard
- ✅ Contextual awareness — sheikh knows what page you're on and what ayah you're reading
- ✅ Slide-up overlay — stays on current page, no navigation away
- ✅ Stuck detection — gentle "need help?" after struggling
- ✅ Pre-loaded questions — "Ask about this ayah" sends context immediately
- ✅ Page-adapted suggested questions — different chips for mushaf vs recite vs practice
- ✅ Single source of truth — SheikhContext manages all state

---

## Next: Phase B (Deep Integrations)

After Phase A is wired up and working:
- Pre-lesson sheikh briefing cards
- Post-lesson reflection moments
- Tajweed feedback routed through sheikh personality
- Dashboard daily greeting
- Understanding quizzes in practice mode
