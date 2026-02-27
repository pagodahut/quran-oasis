# Flashcard Audio Audit — Feb 27, 2026

## Summary

| Deck | Total Cards | With Audio | Missing Audio | Coverage |
|------|-------------|------------|---------------|----------|
| Arabic Alphabet | 28 | 28 | 0 | ✅ 100% |
| 99 Names of Allah | 84 | 14 | 70 | ❌ 17% |
| Essential Words | varies | varies | varies | ⚠️ Depends on Quran.com lookup |
| Particles | varies | varies | varies | ⚠️ Depends on Quran.com lookup |
| Verbs | varies | varies | varies | ⚠️ Depends on Quran.com lookup |
| Prayer & Worship | varies | varies | varies | ⚠️ Depends on Quran.com lookup |
| Nature & Creation | varies | varies | varies | ⚠️ Depends on Quran.com lookup |

## Arabic Alphabet (✅ Full Coverage)

All 28 letters have pre-recorded audio from IslamCan.com (`src/lib/audioService.ts`).
33 sound file entries (including variants like ة/ى/ء). Letters fall back to Web Speech API if IslamCan fails.

**Status: GOOD** — Users reported first few letters working, which confirms the IslamCan source works.

## 99 Names of Allah (❌ Major Gap)

**Root cause:** `NAMES_OF_ALLAH_AUDIO_MAP` in `src/lib/vocabularyAudioService.ts` only has **14 verified entries** out of 84 defined cards.

### Names WITH verified audio (14):
1. الله (Allah)
2. الرَّحْمَٰن (Ar-Rahman)
3. الرَّحِيم (Ar-Raheem)
4. الْمَلِك (Al-Malik)
5. الْقُدُّوس (Al-Quddus)
6. السَّلَام (As-Salam)
7. الْمُؤْمِن (Al-Mu'min)
8. الْمُهَيْمِن (Al-Muhaymin)
9. الْعَزِيز (Al-Aziz)
10. الْجَبَّار (Al-Jabbar)
11. الْمُتَكَبِّر (Al-Mutakabbir)
12. الْخَالِق (Al-Khaliq)
13. الْبَارِئ (Al-Bari')
14. الْمُصَوِّر (Al-Musawwir)

### Names WITHOUT audio (70+):
Everything after Al-Musawwir lacks a verified Quran.com word mapping. The `playArabic()` function will try generic Quran.com word lookup but text matching is unreliable for diacritized Arabic — most will fail silently.

## How Audio Works (Architecture)

```
playArabic(text)
  → if ≤2 chars: playLetter() → IslamCan.com pre-recorded
  → if ≤15 chars, single word: playWord() → vocabularyAudioService
      → Check NAMES_OF_ALLAH_AUDIO_MAP (14 entries)
      → If not found AND text is in NAMES_OF_ALLAH_TEXTS set → BLOCKED (returns false)
      → Else: try generic Quran.com word search → unreliable
  → if phrase: playPhrase() → ALWAYS returns false (no TTS for Quran)
```

The strict policy of "no AI/TTS for Quranic content" is correct and important, but it means missing audio = silence, not a fallback.

## Fix Plan

### Priority 1: Complete Names of Allah audio map
All 99 Names appear in the Quran. Map each to its Quran.com word-by-word audio:
- Source: `https://api.quran.com/api/v4/verses/by_key/{surah}:{ayah}/words`
- Each word has an `audio_url` field pointing to Quran CDN
- Many Names cluster in Surah Al-Hashr (59:22-24), Al-Baqarah (2:255), Al-A'raf (7:180), Ta-Ha (20:8)

### Priority 2: Validate other vocabulary decks
Essential Words, Particles, Verbs, Prayer, Nature decks use generic Quran.com word lookup. Need to test each card's audio individually and add verified mappings for any that fail.

### Priority 3: Visual indicator for missing audio
Currently the audio button just silently disables. Should show a subtle indicator (dimmed icon, "No audio" tooltip) instead of leaving users confused.
