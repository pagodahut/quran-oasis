# HIFZ Tajweed Architecture: Making It Superior to Tarteel

## Executive Summary

This document outlines the strategy to make HIFZ's tajweed feedback system **world-class** and superior to Tarteel. After extensive research, we propose a **hybrid architecture** combining:

1. **Real-time streaming transcription** (Deepgram/AssemblyAI)
2. **Quran-specific word alignment** (QUL timestamps + Whisper fine-tuned)
3. **AI-powered tajweed analysis** (Claude with phonetic context)
4. **Visual word-by-word tracking** during recitation

---

## Part 1: Competitor Analysis

### 1.1 Tarteel AI - Deep Dive

**Technology Stack:**
- **ASR Engine**: NVIDIA Riva + NeMo (GPU-accelerated, custom-trained)
- **Dataset**: 75,000+ minutes of curated Quranic recitation
- **Models**: Fine-tuned Whisper (`tarteel-ai/whisper-base-ar-quran` on HuggingFace)
- **Infrastructure**: Multi-cloud (Zeet) with NVIDIA V100/A100 GPUs
- **WER**: ~5.75% on evaluation set (excellent for Quranic Arabic)

**Key Features:**
- Real-time word-by-word tracking
- Mistake detection with color coding
- Voice search (recite any verse to find it)
- Memorization mode with auto-hiding
- Progress tracking and streaks

**Strengths:**
- Massive proprietary dataset
- GPU-optimized inference (~150ms latency)
- Excellent Arabic/Quranic accuracy
- Smooth UX with real-time feedback

**Weaknesses/Opportunities:**
1. **No public API** for developers (they explicitly state this)
2. **Generic tajweed feedback** - doesn't explain specific rules deeply
3. **No phoneme-level analysis** - word-level only
4. **Subscription model** - premium features locked

### 1.2 Other Competitors

| App | Approach | Strengths | Weaknesses |
|-----|----------|-----------|------------|
| **Quran Companion** | Pre-recorded comparisons | Good audio quality | No real-time feedback |
| **Learn Quran Tajwid** | Rule-based tutorials | Educational content | No speech recognition |
| **iQuran** | Manual tracking | Clean UI | No automation |
| **Memorize Quran** | Spaced repetition | Good algorithm | No pronunciation help |

---

## Part 2: Available APIs Comparison

### 2.1 Speech-to-Text APIs

| Provider | Arabic Support | Real-time | Word Timestamps | Pricing | Latency |
|----------|---------------|-----------|-----------------|---------|---------|
| **Deepgram Nova-3** | ✅ ar, ar-AE, ar-SA, etc. | ✅ WebSocket | ✅ | $0.0077/min | ~150ms |
| **AssemblyAI** | ✅ Universal model | ✅ WebSocket | ✅ | ~$0.006/min | ~300ms |
| **Google Cloud STT** | ✅ Chirp 2 model | ✅ gRPC | ✅ | $0.016/min | ~200ms |
| **Azure Speech** | ✅ + Pronunciation Assessment | ✅ | ✅ | ~$0.016/min | ~200ms |
| **OpenAI Whisper** | ✅ | ❌ Batch only | ✅ (with whisper-timestamped) | $0.006/min | ~seconds |

**Winner for Real-time: Deepgram Nova-3**
- Lowest latency (150ms first-word)
- Excellent Arabic support with dialect codes
- $200 free credits to start
- Simple WebSocket API

### 2.2 Quran-Specific Resources

| Resource | Type | Features | Access |
|----------|------|----------|--------|
| **QUL (Tarteel)** | Open-source library | Word timestamps, Mushaf layout, reciter data | Free, GitHub |
| **Quran.com API** | REST API | Word-by-word data, translations, tafsir | Free |
| **EveryAyah.com** | Audio CDN | Reciter audio files | Free |
| **tarteel-ai/whisper-base-ar-quran** | HuggingFace model | Fine-tuned Whisper for Quran | Free |

### 2.3 Specialized Arabic Models

| Model | Type | Performance | Use Case |
|-------|------|-------------|----------|
| **Tarteel Whisper** | Fine-tuned ASR | WER 5.75% | Batch transcription |
| **MFCC + HMM systems** | Academic | 86-92% phoneme accuracy | Tajweed rule detection |
| **whisper-timestamped** | Library | Word-level timestamps via DTW | Post-processing |

---

## Part 3: Recommended Architecture

### 3.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        HIFZ Tajweed System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │   Browser    │────▶│  Deepgram    │────▶│   Claude     │   │
│  │  Microphone  │     │  Real-time   │     │   Analysis   │   │
│  └──────────────┘     │  WebSocket   │     │   (Tajweed)  │   │
│         │             └──────────────┘     └──────────────┘   │
│         │                    │                    │            │
│         ▼                    ▼                    ▼            │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │    Audio     │     │    Word      │     │   Detailed   │   │
│  │  Visualizer  │     │  Highlighting│     │   Feedback   │   │
│  └──────────────┘     └──────────────┘     └──────────────┘   │
│                                                                 │
│  Supporting Data:                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  QUL Timestamps  │  Quran.com API  │  EveryAyah Audio  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Details

#### A. Real-time Transcription Layer
```typescript
// Primary: Deepgram Nova-3 for real-time streaming
interface RealtimeTranscriptionConfig {
  provider: 'deepgram' | 'assemblyai' | 'whisper';
  language: 'ar' | 'ar-AE';
  features: {
    interimResults: true;      // Show words as they're spoken
    wordTimestamps: true;      // Precise word boundaries
    punctuation: false;        // Not needed for Quran
    smartFormatting: false;    // Keep original Arabic
  };
  sampleRate: 16000;           // Optimal for speech
}
```

#### B. Word Alignment Engine
```typescript
// Combine real-time transcription with known Quran text
interface WordAlignmentEngine {
  // Load expected ayah text
  loadExpectedText(surah: number, ayah: number): Promise<string[]>;
  
  // Match transcribed words to expected positions
  alignWords(
    transcribed: TranscribedWord[],
    expected: string[]
  ): AlignmentResult;
  
  // Track user's current position in real-time
  getCurrentWordIndex(): number;
  
  // Detect skipped/repeated words
  detectMistakes(): MistakeReport[];
}
```

#### C. Tajweed Analysis Engine
```typescript
// Claude-powered deep analysis with tajweed knowledge
interface TajweedAnalysisEngine {
  // Analyze specific word pronunciations
  analyzeWord(
    word: string,
    context: {
      previousWord?: string;
      nextWord?: string;
      transcription: string;
      expectedPronunciation: string;
    }
  ): TajweedWordFeedback;
  
  // Detect tajweed rules present in ayah
  detectRules(ayahText: string): TajweedRule[];
  
  // Generate educational feedback
  generateFeedback(
    recitation: RecitationData,
    rulesViolated: TajweedRule[]
  ): DetailedFeedback;
}
```

### 3.3 Data Flow

```
1. User starts recording
   │
2. Audio stream → Deepgram WebSocket
   │
3. Deepgram returns interim transcriptions (150ms latency)
   │
4. Word Alignment Engine matches to expected Quran text
   │
5. UI highlights current word in real-time
   │
6. On completion: Full transcription → Claude for tajweed analysis
   │
7. Display detailed feedback with specific tajweed rule explanations
```

---

## Part 4: Implementation Roadmap

### Phase 1: Real-time Word Tracking (Week 1-2)
**Goal**: Match Tarteel's core feature

1. **Integrate Deepgram streaming API**
   - WebSocket connection from browser
   - Handle interim/final results
   - Arabic language configuration

2. **Build Word Alignment Engine**
   - Fuzzy matching for Arabic text
   - Handle common transcription errors
   - Track position through ayah

3. **Visual Word Highlighting**
   - Real-time word-by-word highlight
   - Smooth animation between words
   - Visual feedback for mistakes

**Deliverable**: User can recite and see words highlight in real-time

### Phase 2: Enhanced Tajweed Analysis (Week 3-4)
**Goal**: Surpass Tarteel with deeper feedback

1. **Implement tajweed rule detection**
   - Parse ayah for known rules (noon sakinah, madd, etc.)
   - Map rules to specific word positions
   - Create rule explanations database

2. **Claude integration for pronunciation analysis**
   - Send transcription with phonetic context
   - Get word-by-word pronunciation feedback
   - Educational explanations for violations

3. **Visual rule annotations**
   - Color-code tajweed rules in text
   - Interactive tooltips with explanations
   - Audio examples for each rule

**Deliverable**: Detailed tajweed feedback with learning content

### Phase 3: Gamification & Progress (Week 5-6)
**Goal**: Make practice addictive

1. **Pronunciation score system**
   - Score per word, per ayah, overall
   - Track improvement over time
   - Leaderboards (optional)

2. **Adaptive learning**
   - Focus practice on weak rules
   - Suggest verses for specific rules
   - Personalized learning path

3. **Offline support**
   - Local Whisper model as fallback
   - Cached rule data
   - Sync when online

**Deliverable**: Complete learning system that surpasses Tarteel

---

## Part 5: API Keys & Accounts Needed

### Required
| Service | Purpose | Sign Up | Free Tier |
|---------|---------|---------|-----------|
| **Deepgram** | Real-time transcription | deepgram.com | $200 credit (~45k min) |
| **Anthropic** | Claude API (already have) | - | - |

### Optional (Enhancements)
| Service | Purpose | Sign Up | Free Tier |
|---------|---------|---------|-----------|
| **AssemblyAI** | Alternative STT | assemblyai.com | $50 credit |
| **Azure Speech** | Pronunciation Assessment | azure.microsoft.com | 5hrs/month free |
| **HuggingFace** | Tarteel Whisper model | huggingface.co | Free inference |

### Open Resources (No Account Needed)
- **QUL (Tarteel)**: github.com/TarteelAI/quranic-universal-library
- **Quran.com API**: api.quran.com
- **EveryAyah**: everyayah.com

---

## Part 6: Technical Specifications

### Browser Requirements
```typescript
const BROWSER_REQUIREMENTS = {
  mediaRecorder: true,        // For audio capture
  webSocket: true,            // For real-time streaming
  webAudio: true,             // For audio visualization
  minSampleRate: 16000,       // For speech recognition
};
```

### Audio Configuration
```typescript
const AUDIO_CONFIG = {
  sampleRate: 16000,          // Optimal for speech
  channelCount: 1,            // Mono
  mimeType: 'audio/webm;codecs=opus',
  bitsPerSecond: 32000,       // Good quality, low bandwidth
};
```

### Deepgram Configuration
```typescript
const DEEPGRAM_CONFIG = {
  model: 'nova-3',
  language: 'ar',             // Or 'ar-AE' for Gulf dialect
  punctuate: false,
  smart_format: false,
  interim_results: true,
  utterance_end_ms: 1000,
  endpointing: 300,
};
```

---

## Part 7: Why This Beats Tarteel

| Feature | Tarteel | HIFZ (Proposed) |
|---------|---------|-----------------|
| Real-time tracking | ✅ | ✅ Same quality |
| Word timestamps | ✅ | ✅ + QUL precision |
| Mistake detection | ✅ | ✅ + Detailed explanation |
| Tajweed rules | Basic | **Deep with Claude** |
| Rule explanations | Generic | **Contextual + Educational** |
| Learning path | Basic | **Adaptive AI-driven** |
| Offline mode | ❌ | ✅ Local Whisper |
| Open API | ❌ | ✅ (Self-hosted) |
| Price | $60/year | **Free / Self-hosted** |

### Key Differentiators

1. **Claude-Powered Deep Analysis**
   - Not just "you made a mistake"
   - Explains WHY and HOW to fix
   - Provides tajweed rule context

2. **Educational Focus**
   - Links mistakes to specific rules
   - Audio examples of correct pronunciation
   - Progressive learning suggestions

3. **Open & Customizable**
   - Self-hostable
   - Extensible rule system
   - Community contributions

---

## Part 8: Cost Estimation

### Monthly Costs (Active User)
Assuming 30 minutes of practice per day:

| Component | Usage | Cost |
|-----------|-------|------|
| Deepgram | 900 min/month | ~$7 |
| Claude API | ~100 analyses | ~$3 |
| **Total** | - | **~$10/user/month** |

### Scaling Considerations
- **Self-hosted Whisper**: $0 for transcription (GPU needed)
- **Cached responses**: Reduce API calls by 50%+
- **Batch mode**: Cheaper than real-time for non-critical

---

## Part 9: Quick Start Guide

### 1. Get Deepgram API Key
```bash
# Sign up at deepgram.com
# Create project → Get API key
export DEEPGRAM_API_KEY="your_key_here"
```

### 2. Add to Environment
```env
# .env.local
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_existing_key  # Already configured
```

### 3. Install Dependencies
```bash
npm install @deepgram/sdk
```

### 4. Test the Integration
```typescript
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const connection = deepgram.listen.live({
  model: "nova-3",
  language: "ar",
  smart_format: false,
  interim_results: true,
});

connection.on(LiveTranscriptionEvents.Transcript, (data) => {
  console.log("Transcription:", data.channel.alternatives[0].transcript);
});
```

---

## Conclusion

HIFZ can surpass Tarteel by combining:
1. **Equivalent real-time tracking** (Deepgram)
2. **Superior tajweed analysis** (Claude)
3. **Better educational content** (contextual explanations)
4. **More accessible** (free/open-source)

The technology exists. The path is clear. Let's build it.

---

*Document created: February 2026*
*Last updated: February 2026*
*Author: HIFZ Development Team*
