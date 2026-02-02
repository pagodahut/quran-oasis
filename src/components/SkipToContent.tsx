'use client';

/**
 * Skip to Content Link
 * 
 * Provides keyboard users a way to skip navigation and jump directly to main content.
 * Becomes visible only when focused (via Tab key).
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[100]
        focus:px-6 focus:py-3 focus:rounded-xl
        focus:bg-gold-500 focus:text-night-950
        focus:font-semibold focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-night-950
        transition-all
      "
    >
      Skip to main content
    </a>
  );
}
