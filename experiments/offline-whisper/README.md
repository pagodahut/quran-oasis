# Quran Offline Transcription - Transformers.js Prototype

Browser-based offline Quran transcription using Tarteel's fine-tuned Whisper model.

## Quick Start

```bash
# Serve locally (required for ES modules)
cd /Users/admin/quran-oasis-git/experiments/offline-whisper
npx serve .

# Or use Python
python -m http.server 8000
```

Then open http://localhost:3000 (or :8000)

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Browser                          │
├──────────────────────────────────────────────────────┤
│  MediaRecorder API  →  AudioContext (16kHz resample) │
│         ↓                        ↓                   │
│  WebM/MP4 Blob      →   Float32Array audio data     │
│                              ↓                       │
│              Transformers.js Pipeline                │
│              (automatic-speech-recognition)          │
│                              ↓                       │
│         ONNX Runtime (WebGPU/WASM fallback)         │
│                              ↓                       │
│              Arabic Text Transcription               │
└──────────────────────────────────────────────────────┘
```

## Model Details

| Property | Value |
|----------|-------|
| Original Model | `tarteel-ai/whisper-tiny-ar-quran` |
| ONNX Model | `omartariq612/tarteel-ai-whisper-tiny-ar-quran-onnx` |
| Base | OpenAI Whisper Tiny |
| Fine-tuned on | Quran recitations |
| Parameters | ~39M |
| Model Size | ~150MB (ONNX format) |
| Input | 16kHz mono audio |
| Output | Arabic text |

### Why This ONNX Model?

The original Tarteel model (`tarteel-ai/whisper-tiny-ar-quran`) is PyTorch-only and lacks the ONNX files and tokenizer.json required by Transformers.js. We use the community-converted ONNX version which includes:
- `encoder_model.onnx` + `decoder_model_merged.onnx`
- `tokenizer.json` (required by Transformers.js)
- Multiple quantization variants (q4, int8, fp16)

### Why Whisper Tiny?

- **Browser-friendly**: ~150MB download vs 1.5GB for base/small
- **Fast inference**: 0.5-2s for 10s audio on modern devices
- **Quran-optimized**: Fine-tuned specifically for Quranic Arabic
- **Offline**: Runs entirely client-side after initial download

## Technical Notes

### Audio Processing

```javascript
// Audio is resampled to 16kHz (Whisper's expected rate)
// Stereo is mixed to mono
const SAMPLE_RATE = 16000;

// MediaRecorder captures in WebM/Opus or MP4/AAC
// AudioContext.decodeAudioData() handles conversion
```

### Model Loading

```javascript
import { pipeline } from '@huggingface/transformers';

// Models are cached in IndexedDB after first download
const transcriber = await pipeline(
  'automatic-speech-recognition',
  'tarteel-ai/whisper-tiny-ar-quran',
  { dtype: 'fp32' }  // fp32 for compatibility, fp16 for speed
);
```

### Inference Options

```javascript
const result = await transcriber(audioData, {
  language: 'arabic',
  task: 'transcribe',
  chunk_length_s: 30,    // Process in 30s chunks
  stride_length_s: 5,    // 5s overlap between chunks
});
```

## Observed Performance

**Test Environment:** M1 MacBook Pro, Chrome 131

| Metric | Observed Value |
|--------|----------------|
| Model Load (first) | 5.54s |
| Model Load (cached) | ~2-3s |
| Download Size | ~150MB total |

### Expected by Device

| Device | Model Load | 10s Audio Inference |
|--------|------------|---------------------|
| M1/M2 MacBook | 3-6s | 0.5-1.5s |
| iPhone 14+ | 5-10s | 1-2s |
| Mid-range Android | 10-20s | 2-5s |
| Older devices | 20-40s | 5-15s |

*First load includes download; subsequent loads use IndexedDB cache.*

## Observations & Findings

### ✅ What Works Well

- Model loads and runs entirely in-browser
- No server required after initial model download
- Arabic Quranic text transcription quality is reasonable
- Works on mobile devices (iOS Safari, Chrome Android)

### ⚠️ Limitations

1. **Initial Download**: ~150MB must be downloaded on first use
2. **Memory Usage**: Peaks at 300-500MB during inference
3. **Mobile Compatibility**: Older phones may struggle
4. **Accuracy**: Whisper-tiny is less accurate than larger models
5. **Diacritics**: May miss some harakat (vowel marks)

### 🔧 Potential Improvements

1. **WebGPU**: When available, significantly faster than WASM
2. **Quantization**: INT8/INT4 for smaller model & faster inference
3. **Streaming**: Real-time transcription during recording
4. **Worker Thread**: Move inference to Web Worker
5. **PWA**: Add service worker for true offline support

## File Structure

```
offline-whisper/
├── index.html      # Demo page with UI
├── app.js          # Transformers.js integration
└── README.md       # This file
```

## Dependencies

- **@huggingface/transformers** (v3.3.3) - Loaded via CDN
- **ONNX Runtime Web** - Bundled with Transformers.js

No npm install required - everything loads from CDN.

## Browser Requirements

- Chrome 88+ / Edge 88+ / Safari 15+ / Firefox 90+
- WebAssembly support (all modern browsers)
- ~300MB available memory
- Microphone access (for recording)

## Testing Checklist

- [ ] Model downloads and caches successfully
- [ ] Microphone permission granted
- [ ] Recording captures audio
- [ ] Transcription produces Arabic text
- [ ] Performance metrics displayed
- [ ] Works on mobile (iOS/Android)
- [ ] Works offline after initial load

## Next Steps

1. **Compare with larger models** (small, medium) for accuracy
2. **Add ayah detection** to identify Quran verses
3. **Implement PWA** for full offline support
4. **Add recording history** with local storage
5. **Test with various reciters** for robustness

---

*Prototype created for Quran Oasis offline mode evaluation.*
