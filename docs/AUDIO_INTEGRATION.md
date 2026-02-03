# Audio Integration Documentation

## Overview

Quran Oasis uses audio from multiple sources for Quranic recitation and Arabic letter/word pronunciation.

## Audio Sources

### 1. EveryAyah.com (Primary Source for Quran Audio)

**URL Pattern:**
```
https://everyayah.com/data/{reciter_folder}/{surah:03d}{ayah:03d}.mp3
```

**Example:**
```
https://everyayah.com/data/Alafasy_128kbps/001001.mp3  # Al-Fatiha:1
https://everyayah.com/data/Alafasy_128kbps/114006.mp3 # An-Nas:6
```

**Available Reciters:**

| Reciter ID | Name | Arabic Name | Folder | Style |
|------------|------|-------------|--------|-------|
| alafasy | Mishary Rashid Alafasy | مشاري راشد العفاسي | Alafasy_128kbps | Murattal |
| husary | Mahmoud Khalil Al-Husary | محمود خليل الحصري | Husary_128kbps | Murattal |
| abdul_basit | Abdul Basit Abdul Samad | عبدالباسط عبدالصمد | Abdul_Basit_Mujawwad_128kbps | Mujawwad |
| sudais | Abdul Rahman Al-Sudais | عبدالرحمن السديس | Abdurrahmaan_As-Sudais_192kbps | Murattal |
| minshawi | Mohamed Siddiq Al-Minshawi | محمد صديق المنشاوي | Minshawi_Mujawwad_128kbps | Mujawwad |
| shuraim | Saud Al-Shuraim | سعود الشريم | Shuraim_128kbps | Murattal |
| ghamadi | Saad Al-Ghamdi | سعد الغامدي | Ghamadi_40kbps | Murattal |

**Quality Variants:**
- High: `{reciter}_128kbps` or `{reciter}_192kbps`
- Medium: `{reciter}_64kbps`
- Low: `{reciter}_32kbps` or `{reciter}_40kbps`
- Teaching: `Husary_Muallim_128kbps` (with pauses for repetition)

### 2. Quran.com API (Alternative/Fallback)

**Base URL:** `https://api.quran.com/api/v4`

**Audio Endpoint:**
```
GET /recitations/{reciter_id}/by_ayah/{surah}:{ayah}
```

**Example:**
```
https://api.quran.com/api/v4/recitations/7/by_ayah/1:1
```

**Response:**
```json
{
  "audio_files": [
    {
      "url": "AbdulBaset/AbdulSamad/Mujawwad/mp3/001001.mp3",
      "verse_key": "1:1"
    }
  ]
}
```

**Audio Base URL:** `https://audio.qurancdn.com/`

**Reciter IDs (Quran.com):**
| ID | Reciter |
|----|---------|
| 1 | Abdul Basit |
| 2 | Al-Sudais |
| 3 | Shuraim |
| 4 | Ghamadi |
| 5 | Husary |
| 6 | Minshawi |
| 7 | Alafasy |

## Audio Service Files

### `src/lib/audio-service.ts`
Main audio service with:
- `getAyahAudioUrl()` - Generate EveryAyah.com URL
- `playAyah()` - Play single ayah
- `playAyahRange()` - Play range with repeat support
- `playListenRepeat()` - Listen-repeat exercise mode
- Reciter configuration
- Playback state management

### `src/lib/audioService.ts`
Arabic letter/word audio using:
- ElevenLabs TTS (if API key configured)
- Pre-recorded letter sounds
- Web Speech API fallback

### `src/lib/quranAudioService.ts`
Enhanced playback with:
- Gapless playback
- Crossfade transitions
- Preloading
- Position persistence

### `src/lib/audioPreload.ts`
Audio caching and preloading:
- Memory cache
- IndexedDB persistence
- Network quality detection

## Lesson Audio Configuration

### AudioConfig Interface
```typescript
interface AudioConfig {
  surah: number;
  ayahStart: number;
  ayahEnd?: number;
  reciterId?: string;      // Default: 'alafasy'
  quality?: AudioQuality;  // 'high' | 'medium' | 'low'
  repeat?: number;         // Times to repeat (1 = play once)
  loopAyah?: boolean;      // Loop each ayah before moving on
  pauseBetweenAyahs?: number; // Milliseconds
  playbackRate?: number;   // 0.5 - 2.0
}
```

### ListenRepeatConfig Interface
```typescript
interface ListenRepeatConfig extends AudioConfig {
  mode: 'listen-first' | 'listen-repeat' | 'repeat-only';
  repeatCount: number;
  showTransliteration?: boolean;
  showTranslation?: boolean;
  recordUserAudio?: boolean;
}
```

### Step Types with Audio

1. **Standard Steps with Audio**
```typescript
{
  id: "step-id",
  type: "explanation",
  title: "Verse Explanation",
  arabicContent: "بِسْمِ اللَّهِ",
  audioConfig: {
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    reciterId: 'alafasy'
  },
  content: "..."
}
```

2. **Listen-Repeat Steps**
```typescript
{
  id: "step-id",
  type: "listen-repeat",
  title: "Practice Recitation",
  arabicContent: "...",
  listenRepeatConfig: {
    surah: 1,
    ayahStart: 1,
    ayahEnd: 3,
    mode: 'listen-repeat',
    repeatCount: 3,
    showTransliteration: true
  },
  content: "..."
}
```

## Usage Examples

### Basic Ayah Playback
```typescript
import { playAyah, getAyahAudioUrl } from '@/lib/audio-service';

// Get URL only
const url = getAyahAudioUrl(1, 1, 'alafasy', 'high');
// https://everyayah.com/data/Alafasy_128kbps/001001.mp3

// Play ayah
await playAyah(1, 1, {
  reciterId: 'alafasy',
  onEnd: () => console.log('Finished')
});
```

### Range Playback with Repeat
```typescript
import { playAyahRange } from '@/lib/audio-service';

await playAyahRange({
  surah: 112,
  ayahStart: 1,
  ayahEnd: 4,
  reciterId: 'alafasy',
  repeat: 3,
  pauseBetweenAyahs: 1000,
  playbackRate: 0.9
}, {
  onAyahChange: (surah, ayah) => console.log(`Now playing ${surah}:${ayah}`),
  onComplete: () => console.log('All done!')
});
```

### Preloading
```typescript
import { preloadAyahRange } from '@/lib/audio-service';

// Preload upcoming ayahs for smoother playback
preloadAyahRange(1, 1, 7, 'alafasy', 'high');
```

## Best Practices

1. **Default to Alafasy** - Clear pronunciation, widely recognized
2. **Use Husary for Tajweed learning** - Classic Egyptian style, excellent for rules
3. **Slower playback for beginners** - Set `playbackRate: 0.8` or lower
4. **Add pauses for memorization** - `pauseBetweenAyahs: 1500` gives time to repeat
5. **Preload when possible** - Better user experience on slower connections
6. **Handle errors gracefully** - Network issues are common

## Offline Support

The app uses a service worker to cache audio files for offline use:
- Cached on first play
- Can download entire surahs
- Falls back to cached version when offline

See `src/lib/audioPreload.ts` for caching implementation.
