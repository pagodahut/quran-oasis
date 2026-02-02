# Real-Time Tajweed Integration

## Overview

This document describes the Deepgram real-time tajweed integration for the Quran Oasis app.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TajweedPractice.tsx                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Mode Selection (Intro)                  │   │
│  │  ┌─────────────┐    ┌─────────────┐                 │   │
│  │  │  Real-time  │    │  Standard   │                 │   │
│  │  │   (Zap)     │    │   (Mic)     │                 │   │
│  │  └─────────────┘    └─────────────┘                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│         ┌─────────────────┴─────────────────┐              │
│         ▼                                   ▼              │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │ Real-time Mode  │              │ Standard Mode   │      │
│  │ ─────────────── │              │ ─────────────── │      │
│  │ • WordTracker   │              │ • Record audio  │      │
│  │ • Live feedback │              │ • Playback      │      │
│  │ • Audio level   │              │ • Then analyze  │      │
│  └─────────────────┘              └─────────────────┘      │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

## Files

### New Files

1. **`/src/components/WordTracker.tsx`**
   - Visual word tracker component
   - Shows Arabic verse with word-by-word highlighting
   - Color coding: green (correct), yellow (close), red (missed), blue (current)
   - Audio level indicator component
   - Error display component with retry/fallback options

2. **`/docs/REALTIME_TAJWEED_INTEGRATION.md`** (this file)

### Modified Files

1. **`/src/components/TajweedPractice.tsx`**
   - Added mode selection (real-time vs standard)
   - Integrated `useRealtimeTajweed` hook
   - Added real-time recording step with WordTracker
   - Error handling with fallback to standard mode
   - Connection status indicators

### Pre-existing Files

1. **`/src/lib/realtimeTajweedService.ts`**
   - Deepgram WebSocket service
   - Arabic text processing and word alignment
   - Tajweed rule detection

2. **`/src/hooks/useRealtimeTajweed.ts`**
   - React hook wrapping the service
   - State management for real-time tracking

## Features

### Real-Time Mode
- Word-by-word tracking as user recites
- Visual highlighting shows current word
- Audio level indicator shows microphone is working
- Live transcription feedback
- Graceful fallback to standard mode on errors

### Standard Mode (unchanged)
- Record complete recitation
- Playback before analysis
- Claude AI analysis

### Error Handling
- Microphone permission denied → Show error with settings hint
- Browser doesn't support WebSocket/AudioContext → Disable real-time mode
- Network errors → Retry or fallback options
- Deepgram API errors → Fall back to standard mode

## Configuration

### Environment Variables
- `NEXT_PUBLIC_DEEPGRAM_API_KEY` - Deepgram API key (already in Vercel)

### Browser Requirements
- MediaDevices API (getUserMedia)
- MediaRecorder API
- WebSocket API
- Web Audio API (AudioContext)

## Usage

1. User opens Tajweed Practice for a verse
2. Mode selection appears (Real-time or Standard)
3. If real-time selected and available:
   - WebSocket connects to Deepgram
   - User sees word tracker with verse
   - As user recites, words highlight in real-time
   - When done, Claude analyzes for detailed feedback
4. If standard selected or real-time unavailable:
   - User records their recitation
   - Can playback and re-record
   - Click analyze for Claude feedback

## Known Limitations

1. **Type System**: The real-time service detects tajweed rules with different string identifiers than the existing `TajweedRule` type. Currently, detected rules from real-time are added to tips instead of rulesAnalysis.

2. **Audio Capture**: In real-time mode, we don't capture the actual audio for Claude analysis - we just analyze the text transcript. This could be enhanced to also save the audio.

3. **Arabic Transcription**: Deepgram's Arabic model may not perfectly transcribe Quranic recitation with tajweed. Accuracy depends on:
   - User's pronunciation clarity
   - Background noise
   - Microphone quality

## Testing

Run the build to verify:
```bash
cd /Users/admin/clawd/projects/quran-oasis
npm run build
```

To test locally:
```bash
npm run dev
```
Navigate to any Surah, tap a verse, and select "Practice Tajweed".

## Future Enhancements

1. **Local Whisper**: Add offline transcription using Tarteel's Whisper model
2. **Audio Recording**: Capture audio in real-time mode for Claude analysis
3. **Haptic Feedback**: Add vibration on word matches (mobile)
4. **Sound Effects**: Optional audio cues for correct/incorrect
5. **Progress History**: Track real-time accuracy over time
