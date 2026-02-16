# Modal Whisper Deployment Guide

Server-side Quran transcription using Tarteel AI's Whisper model on Modal.

## Status: ⚠️ Authentication Required

Modal CLI is installed but needs authentication. Run this once to set up:

```bash
source /Users/admin/clawd/.venv/bin/activate
modal token new
```

This opens a browser to authenticate with Modal. After authenticating, deploy with:

```bash
cd /Users/admin/quran-oasis-git
modal deploy modal_whisper.py
```

## Endpoint URLs (After Deployment)

Once deployed, you'll have two ways to call the API:

### 1. HTTP Web Endpoint
```
POST https://<your-workspace>--hifz-whisper-transcribe-api.modal.run
```

**Request:**
```json
{
  "audio_base64": "<base64-encoded-audio>"
}
```

**Response:**
```json
{
  "success": true,
  "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
}
```

### 2. Python SDK (Direct Call)
```python
import modal

QuranWhisper = modal.Cls.from_name("hifz-whisper", "QuranWhisper")
whisper = QuranWhisper()

with open("recording.wav", "rb") as f:
    result = whisper.transcribe.remote(f.read())
    print(result["text"])
```

## Integration with Quran Oasis

Add to your Next.js API route:

```typescript
// src/app/api/transcribe/route.ts
export async function POST(request: Request) {
  const { audio } = await request.json();
  
  const response = await fetch(
    'https://YOUR_WORKSPACE--hifz-whisper-transcribe-api.modal.run',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_base64: audio }),
    }
  );
  
  return Response.json(await response.json());
}
```

## Model Details

- **Model:** `tarteel-ai/whisper-base-ar-quran`
- **GPU:** NVIDIA T4
- **Warm time:** Container stays warm for 5 minutes after last request
- **Cold start:** ~30-60 seconds (model download + load)
- **Inference:** ~1-3 seconds per audio clip

## Testing

```bash
# Health check
modal run modal_whisper.py

# With audio file
modal run modal_whisper.py path/to/quran_recitation.wav
```

## Costs

Modal pricing (as of 2024):
- T4 GPU: ~$0.59/hour
- Container idle: Free after 5 minutes
- First $30/month: Free tier

For low-volume use (hifz practice), expect < $5/month.

## Troubleshooting

### Cold Start Too Slow
Increase `scaledown_window` in `modal_whisper.py` to keep containers warm longer.

### Out of Memory
The base Whisper model uses ~1GB VRAM. T4 has 16GB, so this shouldn't happen.

### Audio Format Issues
Supported: WAV, MP3, FLAC, OGG
Required sample rate: Auto-resampled to 16kHz
Required channels: Auto-converted to mono

## Files

- `/Users/admin/quran-oasis-git/modal_whisper.py` - Deployment code
- `/Users/admin/quran-oasis-git/docs/MODAL_DEPLOYMENT.md` - This file
