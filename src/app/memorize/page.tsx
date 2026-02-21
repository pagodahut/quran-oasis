import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Memorizing | HIFZ',
  description: 'Choose a surah to start memorizing the Quran with AI-powered lessons, spaced repetition, and tajweed guidance.',
};

export default function MemorizePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start Memorizing the Quran
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Choose how you&apos;d like to begin your memorization journey.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/lessons"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          📚 Start a Lesson
        </Link>
        <Link
          href="/surahs"
          className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          📖 Browse Surahs
        </Link>
      </div>
    </div>
  );
}
