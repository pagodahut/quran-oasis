# Tarteel Open Source Integration Plan

> **Status**: ACTIVE - Phase 1 ✅ + Phase 2 ✅ (Deployed)  
> **Owner**: Hakim (Opus Executive)  
> **Created**: 2026-02-16  
> **Target**: Complete integration within 2 weeks
> **Last Updated**: 2026-02-18 17:55 EST
>
> ### Phase 1+2 Completion Notes (Feb 18):
> - Modal endpoint redeployed with **model weights baked into image** → cold start 3s, warm 170ms
> - Added ffmpeg for webm/opus audio format conversion
> - Fixed hybridTranscription.ts plumbing (correct API URL, JSON body format)
> - Offline model switched to ONNX-converted `omartariq612/tarteel-ai-whisper-tiny-ar-quran-onnx`
> - Provider indicators (🟢 Tarteel / 🟡 Browser) added to LiveRecitation + RevealRecitation
> - Keep-warm cron pings Modal health endpoint every 4 min
> - `MODAL_WHISPER_URL` env var set in Vercel production
> - All pages verified 200 on prod: studio-coral-alpha.vercel.app

---

## Executive Summary

Tarteel AI has open-sourced their Quran-specific Whisper models and datasets. This represents a **strategic inflection point** for HIFZ - we can now match or exceed Tarteel's core technology at a fraction of the cost.

**Key Assets Released:**
- `whisper-base-ar-quran` (5.75% WER, production-ready)
- `whisper-tiny-ar-quran` (for edge/mobile)
- TLOG dataset (720K samples)
- everyayah dataset (127K professional recordings)

**Strategic Outcome:**
- Replace Deepgram dependency → $2K+/month savings at scale
- Enable offline mode → Major differentiator
- Train custom tajweed models → Competitive moat

---

## Architecture Overview

### Current State
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Deepgram   │────▶│   Claude    │
│ Microphone  │     │  WebSocket  │     │  Analysis   │
└─────────────┘     │  ($0.0077/m)│     └─────────────┘
                    └─────────────┘
                          │
                    ❌ Internet Required
                    ❌ Cost scales linearly
                    ❌ Generic Arabic (not Quran-specific)
```

### Target State
```
┌─────────────┐     ┌─────────────────────────────────────┐
│   Browser   │────▶│         Tarteel Whisper             │
│ Microphone  │     ├─────────────┬───────────────────────┤
└─────────────┘     │  Server     │  Browser (offline)    │
                    │  (Modal)    │  (Transformers.js)    │
                    │  ~$0.001/m  │  FREE                 │
                    └─────────────┴───────────────────────┘
                          │
                    ✅ Offline capable
                    ✅ 90%+ cost reduction
                    ✅ Quran-optimized (5.75% WER)
                    ✅ Diacritics preserved
```

---

## Implementation Phases

### Phase 1: Server-Side Integration (Week 1) ✅ COMPLETE

**Goal**: Replace Deepgram with Tarteel Whisper for server-side transcription.

**Status**: Deployed 2026-02-16
- ✅ Modal endpoint live: `https://pagodahut--hifz-whisper-transcribe-api.modal.run`
- ✅ Next.js API route: `/api/transcribe-tarteel`
- ✅ Hybrid transcription service with fallback
- ✅ Offline model loader component
- ⏳ A/B testing pending (needs user testing)

#### 1.1 Model Deployment (Day 1-2)

**Option A: Modal (Recommended)**
```python
# modal_whisper.py
import modal

app = modal.App("hifz-whisper")

@app.cls(gpu="T4", image=modal.Image.debian_slim().pip_install(
    "transformers", "torch", "librosa", "soundfile"
))
class QuranWhisper:
    @modal.enter()
    def load_model(self):
        from transformers import WhisperProcessor, WhisperForConditionalGeneration
        self.processor = WhisperProcessor.from_pretrained("tarteel-ai/whisper-base-ar-quran")
        self.model = WhisperForConditionalGeneration.from_pretrained("tarteel-ai/whisper-base-ar-quran")
        self.model.to("cuda")
    
    @modal.method()
    def transcribe(self, audio_bytes: bytes) -> dict:
        import librosa
        import io
        
        # Load audio
        audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000)
        
        # Process
        inputs = self.processor(audio, sampling_rate=16000, return_tensors="pt")
        inputs = {k: v.to("cuda") for k, v in inputs.items()}
        
        # Generate
        generated_ids = self.model.generate(**inputs)
        transcription = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
        return {"text": transcription, "language": "ar"}
```

**Option B: Replicate**
- Create custom model deployment
- ~$0.0023/sec GPU time
- Simpler scaling

**Option C: Hugging Face Inference Endpoints**
- Managed deployment
- ~$0.06/hour for dedicated
- Easier but more expensive

**Decision**: Start with Modal (best cost/performance ratio).

#### 1.2 API Endpoint (Day 2-3)

Create new Next.js API route:

```typescript
// src/app/api/transcribe-tarteel/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MODAL_ENDPOINT = process.env.MODAL_WHISPER_URL;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;
  
  if (!audioFile) {
    return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
  }

  const audioBuffer = await audioFile.arrayBuffer();
  
  // Call Modal endpoint
  const response = await fetch(MODAL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: audioBuffer,
  });
  
  const result = await response.json();
  
  return NextResponse.json({
    text: result.text,
    provider: 'tarteel-whisper',
    model: 'whisper-base-ar-quran',
  });
}
```

#### 1.3 Service Layer Update (Day 3-4)

Modify `realtimeTajweedService.ts`:

```typescript
// Add provider selection
type TranscriptionProvider = 'deepgram' | 'tarteel' | 'browser';

interface TranscriptionConfig {
  provider: TranscriptionProvider;
  fallback?: TranscriptionProvider;
  offlineMode?: boolean;
}

// New transcription function
async function transcribeWithTarteel(audioBlob: Blob): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  const response = await fetch('/api/transcribe-tarteel', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}
```

#### 1.4 A/B Testing Framework (Day 4-5)

```typescript
// src/lib/transcriptionAB.ts
interface ABTestResult {
  provider: string;
  transcription: string;
  latency: number;
  accuracy?: number; // Compared to expected text
}

async function runABTest(
  audio: Blob,
  expectedText: string
): Promise<{ deepgram: ABTestResult; tarteel: ABTestResult }> {
  const [deepgramResult, tarteelResult] = await Promise.all([
    transcribeWithDeepgram(audio),
    transcribeWithTarteel(audio),
  ]);
  
  // Calculate accuracy using Levenshtein distance
  const deepgramAccuracy = calculateArabicSimilarity(deepgramResult.text, expectedText);
  const tarteelAccuracy = calculateArabicSimilarity(tarteelResult.text, expectedText);
  
  return {
    deepgram: { ...deepgramResult, accuracy: deepgramAccuracy },
    tarteel: { ...tarteelResult, accuracy: tarteelAccuracy },
  };
}
```

### Phase 2: Offline Mode (Week 1-2)

**Goal**: Enable transcription without internet using Transformers.js.

#### 2.1 Model Conversion (Day 5-6)

Convert Tarteel model to ONNX for browser:
```bash
# Using optimum-cli
pip install optimum[onnxruntime]
optimum-cli export onnx \
  --model tarteel-ai/whisper-tiny-ar-quran \
  --task automatic-speech-recognition \
  ./whisper-tiny-ar-quran-onnx
```

Or use pre-converted: Check if `onnx-community/whisper-tiny-ar-quran` exists.

#### 2.2 Browser Integration (Day 6-8)

```typescript
// src/lib/offlineTranscription.ts
import { pipeline, env } from '@xenova/transformers';

// Configure for browser
env.allowLocalModels = false;
env.useBrowserCache = true;

let whisperPipeline: any = null;

export async function initOfflineWhisper(
  onProgress?: (progress: number) => void
): Promise<void> {
  whisperPipeline = await pipeline(
    'automatic-speech-recognition',
    'tarteel-ai/whisper-tiny-ar-quran',
    {
      progress_callback: (data: any) => {
        if (data.status === 'progress') {
          onProgress?.(data.progress);
        }
      },
    }
  );
}

export async function transcribeOffline(audioBlob: Blob): Promise<string> {
  if (!whisperPipeline) {
    throw new Error('Offline whisper not initialized');
  }
  
  const arrayBuffer = await audioBlob.arrayBuffer();
  const result = await whisperPipeline(arrayBuffer, {
    language: 'ar',
    task: 'transcribe',
  });
  
  return result.text;
}

export function isOfflineReady(): boolean {
  return whisperPipeline !== null;
}
```

#### 2.3 Progressive Model Loading (Day 8-9)

```typescript
// src/components/OfflineModelLoader.tsx
'use client';

import { useState, useEffect } from 'react';
import { initOfflineWhisper, isOfflineReady } from '@/lib/offlineTranscription';

export function OfflineModelLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  
  const handleDownload = async () => {
    setStatus('loading');
    try {
      await initOfflineWhisper(setProgress);
      setStatus('ready');
      // Persist in IndexedDB automatically via Transformers.js
    } catch (error) {
      setStatus('error');
    }
  };
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Offline Mode</h3>
      {status === 'idle' && (
        <button onClick={handleDownload} className="btn-primary">
          Download Model (74MB)
        </button>
      )}
      {status === 'loading' && (
        <div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gold h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-1">{Math.round(progress)}% downloaded</p>
        </div>
      )}
      {status === 'ready' && (
        <p className="text-green-400">✓ Offline mode ready</p>
      )}
    </div>
  );
}
```

#### 2.4 Hybrid Transcription Service (Day 9-10)

```typescript
// src/lib/hybridTranscription.ts
import { isOfflineReady, transcribeOffline } from './offlineTranscription';

interface TranscriptionOptions {
  preferOffline?: boolean;
  fallbackToServer?: boolean;
}

export async function transcribe(
  audio: Blob,
  options: TranscriptionOptions = {}
): Promise<{ text: string; mode: 'offline' | 'server' }> {
  const { preferOffline = true, fallbackToServer = true } = options;
  
  // Check network status
  const isOnline = navigator.onLine;
  
  // Prefer offline if available and requested
  if (preferOffline && isOfflineReady()) {
    try {
      const text = await transcribeOffline(audio);
      return { text, mode: 'offline' };
    } catch (error) {
      if (!fallbackToServer || !isOnline) throw error;
      // Fall through to server
    }
  }
  
  // Use server
  if (!isOnline) {
    throw new Error('No internet connection and offline mode not available');
  }
  
  const response = await fetch('/api/transcribe-tarteel', {
    method: 'POST',
    body: audio,
  });
  
  const result = await response.json();
  return { text: result.text, mode: 'server' };
}
```

### Phase 3: Enhanced Tajweed (Week 2)

**Goal**: Use Tarteel's data to improve tajweed detection.

#### 3.1 TLOG Integration (Day 10-12)

Pending dataset access approval. Plan:

1. **Download subset** for initial training
2. **Analyze label distribution** - what errors are tagged?
3. **Build training pipeline** for tajweed classifier

#### 3.2 Tajweed Error Classifier (Day 12-14)

Train a model to detect:
- **Pronunciation errors**: Wrong makhraj (articulation point)
- **Timing errors**: Incorrect madd length
- **Rule violations**: Missing ghunnah, wrong idgham

```python
# Training architecture (high-level)
from transformers import Wav2Vec2ForSequenceClassification

# Labels for tajweed errors
TAJWEED_LABELS = [
    'correct',
    'madd_short',        # Madd too short
    'madd_long',         # Madd too long
    'ghunnah_missing',   # Missing nasalization
    'qalqalah_weak',     # Weak echo
    'makhraj_error',     # Wrong articulation
    'haraka_error',      # Wrong vowel
]

# Fine-tune on TLOG subset with manual labels
# (Requires labeling effort or synthetic data)
```

#### 3.3 Integration with Claude Analysis (Day 14)

Combine ML classifier with Claude for explainable feedback:

```typescript
async function analyzeTajweed(
  transcription: string,
  audio: Blob,
  expectedText: string
): Promise<TajweedFeedback> {
  // 1. ML classifier for quick error detection
  const mlErrors = await classifyTajweedErrors(audio);
  
  // 2. Claude for detailed explanation
  const claudeFeedback = await claude.chat({
    messages: [{
      role: 'user',
      content: `Analyze this Quran recitation:
Expected: ${expectedText}
Transcribed: ${transcription}
ML Detected Errors: ${JSON.stringify(mlErrors)}

Provide detailed, encouraging feedback on tajweed rules.`
    }]
  });
  
  return {
    errors: mlErrors,
    feedback: claudeFeedback,
    accuracy: calculateAccuracy(transcription, expectedText),
  };
}
```

---

## File Changes Summary

### New Files
```
src/app/api/transcribe-tarteel/route.ts    # Server-side Tarteel endpoint
src/lib/offlineTranscription.ts            # Browser-based transcription
src/lib/hybridTranscription.ts             # Unified transcription service
src/lib/transcriptionAB.ts                 # A/B testing utilities
src/components/OfflineModelLoader.tsx      # Model download UI
experiments/offline-whisper/               # Prototype (sub-agent)
modal_whisper.py                           # Modal deployment
```

### Modified Files
```
src/lib/realtimeTajweedService.ts          # Add provider abstraction
src/lib/tajweedService.ts                  # Integrate ML classifier
src/app/api/deepgram/token/route.ts        # Keep as fallback
src/components/TajweedPractice.tsx         # Add offline mode UI
.env.local                                 # Add MODAL_WHISPER_URL
```

---

## Environment Variables

```bash
# .env.local additions
MODAL_WHISPER_URL=https://your-modal-endpoint.modal.run
TARTEEL_MODEL_ID=tarteel-ai/whisper-base-ar-quran
TARTEEL_TINY_MODEL_ID=tarteel-ai/whisper-tiny-ar-quran
ENABLE_OFFLINE_MODE=true
TRANSCRIPTION_PROVIDER=tarteel  # tarteel | deepgram | hybrid
```

---

## Testing Strategy

### Unit Tests
- [ ] Tarteel API endpoint returns valid Arabic text
- [ ] Offline transcription works without network
- [ ] Hybrid service falls back correctly
- [ ] Diacritics (tashkeel) preserved in output

### Integration Tests
- [ ] Full flow: Record → Transcribe → Highlight → Feedback
- [ ] Offline mode persistence across page reloads
- [ ] A/B test logging works correctly

### Performance Benchmarks
- [ ] Server latency < 500ms for 10s audio
- [ ] Browser model loads < 30s on 4G
- [ ] Browser inference < 3s for 10s audio

---

## Rollout Plan

### Week 1
1. Deploy Modal endpoint (Day 1-2)
2. Create API route (Day 2-3)
3. A/B test vs Deepgram (Day 3-5)
4. Decision: Switch or keep parallel (Day 5)

### Week 2
1. Build offline prototype (Day 6-8)
2. Integrate into app (Day 8-10)
3. TLOG analysis (Day 10-12)
4. Enhanced tajweed (Day 12-14)

### Week 3 (Buffer)
1. Bug fixes and optimization
2. User testing
3. Full rollout

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Transcription accuracy | ~85% (Deepgram) | 94%+ (Tarteel) |
| Cost per 1K minutes | $7.70 | < $1.00 |
| Offline capability | ❌ | ✅ |
| Latency (server) | ~150ms | < 500ms |
| Latency (browser) | N/A | < 3s |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Model accuracy lower than expected | Low | High | Keep Deepgram as fallback |
| Browser model too slow | Medium | Medium | Use server-first, offline as option |
| TLOG access denied | Low | Low | Use everyayah for training instead |
| Modal costs higher than projected | Low | Low | Switch to Replicate or self-host |

---

## Dependencies

### External
- Hugging Face model access (public, ✅)
- TLOG dataset access (requires agreement, ⏳)
- Modal account (free tier available, ✅)

### Internal
- Deepgram fallback maintained
- Claude API for tajweed analysis
- Vercel deployment unchanged

---

## Appendix: ChatGPT/Manus Delegation

### Suitable for ChatGPT (via coding tasks)
- [ ] Write comprehensive unit tests for transcription service
- [ ] Generate TypeScript types for all API responses
- [ ] Create Arabic text similarity algorithm (Levenshtein for Arabic)
- [ ] Build CI/CD workflow for model deployment

### Suitable for Manus (autonomous execution)
- [ ] Set up Modal account and deploy initial endpoint
- [ ] Convert Tarteel model to ONNX format
- [ ] Create benchmark dataset of 50 Quran audio samples
- [ ] Build admin dashboard for A/B test results

---

*Document maintained by Hakim. Last updated: 2026-02-16 00:15 EST*
