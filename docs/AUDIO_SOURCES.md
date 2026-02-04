# Authentic Arabic Audio Sources for Quran Oasis

> **CRITICAL**: AI-generated voices are UNACCEPTABLE for Quranic content. They produce inaccurate tajweed, wrong makhraj (articulation points), and incorrect letter pronunciation. Users learning Quran need PERFECT, human-spoken, native Arabic audio.

## Table of Contents
1. [Word-by-Word Quranic Audio](#1-word-by-word-quranic-audio-highest-priority)
2. [Ayah-Level Recitations](#2-ayah-level-recitations-already-integrated)
3. [Arabic Letter Pronunciations](#3-arabic-letter-pronunciations)
4. [General Arabic Pronunciations](#4-general-arabic-pronunciations)
5. [Tajweed-Specific Audio](#5-tajweed-specific-audio)
6. [Open Datasets](#6-open-datasets)
7. [Integration Recommendations](#7-integration-recommendations)
8. [Implementation Plan](#8-implementation-plan)

---

## 1. Word-by-Word Quranic Audio (HIGHEST PRIORITY)

### Quran.com Word-by-Word API ⭐⭐⭐⭐⭐
**The BEST source for individual Quranic word pronunciation**

| Attribute | Details |
|-----------|---------|
| **URL** | https://api.quran.com/api/v4 |
| **Audio CDN** | https://verses.quran.com/wbw/ |
| **Coverage** | ALL 77,429+ words in the Quran |
| **Quality** | Professional, native reciter |
| **Licensing** | Free for non-commercial use |
| **Rate Limits** | None stated, but be respectful |

**API Endpoint:**
```
GET /verses/by_key/{surah}:{ayah}?words=true&word_fields=audio_url,text_uthmani
```

**Audio URL Pattern:**
```
https://verses.quran.com/wbw/{surah:03d}_{ayah:03d}_{word:03d}.mp3
```

**Example:**
```bash
# Get word data for Al-Fatiha verse 1
curl "https://api.quran.com/api/v4/verses/by_key/1:1?words=true&word_fields=audio_url"

# Audio for "Bismillah" (first word of 1:1)
https://verses.quran.com/wbw/001_001_001.mp3  # بِسْمِ
https://verses.quran.com/wbw/001_001_002.mp3  # اللَّهِ
https://verses.quran.com/wbw/001_001_003.mp3  # الرَّحْمَٰنِ
https://verses.quran.com/wbw/001_001_004.mp3  # الرَّحِيمِ
```

**Response includes:**
- `audio_url` - relative path to MP3
- `text_uthmani` - Arabic text (Uthmani script)
- `transliteration.text` - Romanization
- `translation.text` - English meaning

**INTEGRATION PRIORITY: IMMEDIATE**
This covers ALL vocabulary in our flashcard system since every word comes from the Quran.

### QuranWBW.com Audio Archive
| Attribute | Details |
|-----------|---------|
| **URL** | https://archive.org/details/quran-wordbyword |
| **Direct Download** | https://archive.org/download/quran-wordbyword/wbw.zip (1.9 GB) |
| **Coverage** | Complete Quran word-by-word |
| **Format** | MP3 |
| **Licensing** | Free to use (credits Quran.com) |

**Use Case:** Download for offline/bundled use rather than API calls.

---

## 2. Ayah-Level Recitations (Already Integrated)

### EveryAyah.com ⭐⭐⭐⭐⭐
**Already in use - see AUDIO_INTEGRATION.md**

| Attribute | Details |
|-----------|---------|
| **URL** | https://everyayah.com |
| **Coverage** | 6,236 ayahs × 80+ reciters |
| **Format** | MP3 (various bitrates) |
| **Licensing** | Free for Islamic projects |

**Key Reciters for Learning:**
- `Husary_Muallim_128kbps` - **Teaching style with pauses** ⭐
- `Husary_128kbps` - Classic Egyptian tajweed
- `Alafasy_128kbps` - Clear modern recitation
- `Minshawy_Murattal_128kbps` - Precise articulation

### QuranicAudio.com
| Attribute | Details |
|-----------|---------|
| **URL** | https://quranicaudio.com |
| **Coverage** | 150+ reciters |
| **Format** | MP3 |
| **API** | REST endpoints available |

### Quran.com Audio API
| Attribute | Details |
|-----------|---------|
| **Endpoint** | https://api.quran.com/api/v4/recitations |
| **Audio CDN** | https://audio.qurancdn.com/ |
| **Reciters** | 12 high-quality options |

---

## 3. Arabic Letter Pronunciations

### Internet Archive - Arabic Alphabet Audio ⭐⭐⭐⭐
| Attribute | Details |
|-----------|---------|
| **URL** | https://archive.org/details/ArabicAlphabetAudio |
| **Source** | Nurul Huda Publications |
| **Coverage** | 28 Arabic letters with proper makhraj |
| **Format** | Audio + Video |
| **Licensing** | Free educational use |

### Internet Archive - Makhraj Animated ⭐⭐⭐⭐⭐
| Attribute | Details |
|-----------|---------|
| **URL** | https://archive.org/details/arabic-letters-makhraj-animated |
| **Source** | Tajweed With Me |
| **Coverage** | All 28 letters with articulation point videos |
| **Format** | H.264 video with audio |
| **Licensing** | Free educational use |

**HIGHLY RECOMMENDED** - Shows WHERE in the mouth each letter is pronounced, not just the sound.

### Letter Audio from Quran.com WBW
We can extract isolated letter sounds from short Quranic words:
- ب (ba) → from بِسْمِ
- ت (ta) → from تَبَارَكَ
- etc.

**Strategy:** Map each letter to a short, clear Quranic word that starts with it.

---

## 4. General Arabic Pronunciations

### Forvo.com API ⭐⭐⭐⭐
| Attribute | Details |
|-----------|---------|
| **URL** | https://api.forvo.com |
| **Coverage** | 6M+ pronunciations, 430+ languages |
| **Arabic** | 100,000+ Arabic words |
| **Licensing** | Paid API ($2/mo non-profit, $29/mo commercial) |
| **Quality** | Native speakers, community-verified |

**API Example:**
```
GET /key/{API_KEY}/format/json/action/word-pronunciations/word/{word}/language/ar
```

**Best For:**
- Names of Allah (99 names)
- Common Islamic phrases (Alhamdulillah, SubhanAllah, etc.)
- Non-Quranic Arabic vocabulary

**Consideration:** Requires API subscription. Good fallback for words not in Quran.

### Corpus Quran Project
| Attribute | Details |
|-----------|---------|
| **URL** | https://corpus.quran.com |
| **Coverage** | Word morphology, roots, grammar |
| **Audio** | Limited, but has phonetic transcription |

---

## 5. Tajweed-Specific Audio

### Husary Muallim Recitation ⭐⭐⭐⭐⭐
**Best for teaching tajweed rules in context**

| Attribute | Details |
|-----------|---------|
| **Source** | EveryAyah.com |
| **Folder** | `Husary_Muallim_128kbps` |
| **Style** | Each ayah read, then repeated with pause for student |
| **Use Case** | Listen-and-repeat exercises |

### Tajweed Rules PDF + Audio
| Attribute | Details |
|-----------|---------|
| **URL** | https://download.understandquran.com/fileadmin/user_upload/extras/tajweed/Tajweed_Rules.pdf |
| **Coverage** | Noon sakinah, meem sakinah, madd rules |
| **Format** | PDF with examples |

**Integration Idea:** Reference specific ayahs that demonstrate each rule:
- **Idgham:** مِن رَّبِّهِم (2:5)
- **Ikhfa:** مِن قَبْلُ (2:25)
- **Iqlab:** مِن بَعْدِ (2:27)
- **Izhar:** مَنْ أَنصَارِي (3:52)

### Learn Quran Tajwid App
| Attribute | Details |
|-----------|---------|
| **URL** | https://tajwid.learn-quran.co |
| **Note** | Commercial app, but model for what we need |
| **Observation** | User reviews mention audio mistakes - opportunity for us |

---

## 6. Open Datasets

### Tarteel AI Datasets ⭐⭐⭐⭐⭐
| Attribute | Details |
|-----------|---------|
| **HuggingFace** | https://huggingface.co/datasets/tarteel-ai/everyayah |
| **QUL Library** | https://qul.tarteel.ai/resources |
| **Coverage** | Complete Quran, multiple reciters |
| **Format** | Audio + timestamps |
| **Licensing** | Open source for Islamic projects |

**Quranic Universal Library (QUL):**
- Translations in many languages
- Tafsir
- Recitation audio with word-level timestamps
- Surah/Ayah metadata

### OpenSLR Quran Dataset
| Attribute | Details |
|-----------|---------|
| **URL** | https://www.openslr.org/132/ |
| **Coverage** | Multiple reciters |
| **Format** | Resampled to 16kHz |
| **Use Case** | ML/speech recognition training |

### fawazahmed0/quran-api ⭐⭐⭐⭐
| Attribute | Details |
|-----------|---------|
| **GitHub** | https://github.com/fawazahmed0/quran-api |
| **CDN** | https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/ |
| **Coverage** | 98 languages, 440+ translations |
| **Licensing** | Free, no rate limits |
| **Note** | Text only, no audio - but great for translation data |

---

## 7. Integration Recommendations

### Priority 1: Word-by-Word Audio (Immediate)
```typescript
// Add to flashcard system
const getWordAudio = (surah: number, ayah: number, wordPosition: number) => {
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  const w = String(wordPosition).padStart(3, '0');
  return `https://verses.quran.com/wbw/${s}_${a}_${w}.mp3`;
};
```

### Priority 2: Letter Audio Mapping
Create a mapping file: `src/lib/letterAudio.ts`
```typescript
export const LETTER_AUDIO: Record<string, { word: string; surah: number; ayah: number; position: number }> = {
  'ا': { word: 'الله', surah: 1, ayah: 1, position: 2 },
  'ب': { word: 'بِسْمِ', surah: 1, ayah: 1, position: 1 },
  'ت': { word: 'تَبَارَكَ', surah: 25, ayah: 1, position: 1 },
  // ... all 28 letters
};
```

### Priority 3: Download and Bundle Letter Audio
1. Download from Internet Archive
2. Process into consistent format (MP3, normalized volume)
3. Bundle with app for offline use

### Priority 4: Tajweed Rule Examples
Create mapping of rules to ayah examples:
```typescript
export const TAJWEED_EXAMPLES = {
  idgham_with_ghunnah: [
    { rule: 'نون + ي', ayah: '2:5', text: 'مِن رَّبِّهِمْ' },
  ],
  ikhfa: [
    { rule: 'نون + ق', ayah: '2:25', text: 'مِن قَبْلُ' },
  ],
  // ...
};
```

---

## 8. Implementation Plan

### Phase 1: Word Audio Integration (Week 1)
- [ ] Create `wordAudioService.ts` using Quran.com WBW API
- [ ] Add audio URLs to flashcard system vocabulary
- [ ] Update FlashcardPlayer to use word audio
- [ ] Test with first 100 words

### Phase 2: Letter Audio (Week 2)  
- [ ] Download Arabic Alphabet Audio from Internet Archive
- [ ] Process and normalize audio files
- [ ] Create letter-to-audio mapping
- [ ] Update Arabic Alphabet lesson with authentic audio
- [ ] Test all 28 letters

### Phase 3: Tajweed Audio Examples (Week 3)
- [ ] Map all tajweed rules to specific ayah examples
- [ ] Create audio clips for each rule demonstration
- [ ] Update tajweed lessons with authentic examples
- [ ] Add Husary Muallim for listen-repeat exercises

### Phase 4: Offline Bundle (Week 4)
- [ ] Download WBW audio for most common 500 words
- [ ] Bundle letter audio with app
- [ ] Implement smart caching for remaining words
- [ ] Test offline functionality

---

## Audio Quality Checklist

When integrating ANY audio source, verify:

- [ ] **Native speaker** - Not TTS or AI-generated
- [ ] **Correct tajweed** - Proper pronunciation rules applied
- [ ] **Clear makhraj** - Articulation points are distinct
- [ ] **Consistent quality** - No background noise, normalized volume
- [ ] **Appropriate speed** - Not too fast for learning

---

## Sources NOT to Use

| Source | Reason |
|--------|--------|
| ElevenLabs TTS | AI-generated, incorrect tajweed |
| Google TTS | AI-generated, wrong letter sounds |
| Amazon Polly | AI-generated |
| Any "Arabic voice" AI | Cannot handle Quranic pronunciation |
| Untrained reciters | May have incorrect tajweed |

---

## Quick Reference: Audio URLs

```
# Word-by-word audio
https://verses.quran.com/wbw/{surah:03d}_{ayah:03d}_{word:03d}.mp3

# Ayah audio (EveryAyah)
https://everyayah.com/data/{reciter}/{surah:03d}{ayah:03d}.mp3

# Teaching style (Husary Muallim)
https://everyayah.com/data/Husary_Muallim_128kbps/{surah:03d}{ayah:03d}.mp3
```

---

## Credits & Acknowledgments

- **Quran.com** - Word-by-word audio API
- **EveryAyah.com** - Comprehensive ayah recitations
- **Tarteel AI** - Open Quranic datasets
- **Internet Archive** - Arabic alphabet audio collections
- **QuranWBW.com** - Word-by-word learning resources
- **fawazahmed0** - Quran API translations

---

*Document created: 2026-02-04*
*Last updated: 2026-02-04*
