'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--theme-surface)' }}>
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'var(--theme-surface)',
          borderBottom: '1px solid var(--theme-border-subtle)',
        }}
      >
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2 -ml-2 rounded-lg transition-colors"
            style={{ color: 'var(--theme-text-secondary)' }}
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-lg" style={{ color: 'var(--theme-text)' }}>
            {title}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 pb-24">
        <p className="text-xs mb-8" style={{ color: 'var(--theme-text-muted)' }}>
          Last updated {updated}
        </p>
        <div className="legal-prose space-y-5">{children}</div>
      </main>

      <style jsx global>{`
        .legal-prose h2 {
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.15rem;
          color: var(--theme-text);
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .legal-prose p,
        .legal-prose li {
          color: var(--theme-text-secondary);
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .legal-prose ul {
          list-style: disc;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .legal-prose strong {
          color: var(--theme-text);
          font-weight: 600;
        }
        .legal-prose a {
          color: var(--ambient-gold);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default LegalPage;
