# Quran Oasis 🌴

AI-powered Quran memorization app with personalized lessons and spaced repetition.

## Features

- **Interactive Lessons** - Learn Arabic letters, words, and Quranic phrases
- **Journey Visualization** - Track your progress from letters to full Hifz
- **Spaced Repetition** - SM-2 algorithm optimized for Quran memorization
- **Beautiful Recitation** - Multiple reciters via EveryAyah.com
- **Islamic Design** - Bismillah headers, daily wisdom, spiritual journey

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Audio**: EveryAyah.com API, ElevenLabs (optional)
- **State**: Zustand

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── lessons/      # Lesson browser and detail pages
│   ├── mushaf/       # Quran reader
│   └── onboarding/   # Welcome flow
├── components/       # Reusable UI components
└── lib/              # Utilities, audio, lesson content
```

## Audio Setup

For high-quality Arabic pronunciation, see `scripts/setup-letter-audio.md`.

## License

Private - All rights reserved.

