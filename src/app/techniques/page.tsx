'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronDown, Brain, BookOpen, Book, Repeat, Layers, Target,
  Headphones, PenLine, Lightbulb, CalendarDays, Scale, RefreshCw, Clock,
  Moon, Sunrise, Infinity as InfinityIcon, Sparkles, GitCompare, Mountain,
  HandHeart, Heart, Crown, Users, BookMarked, type LucideIcon,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { HIFZ_KNOWLEDGE, type KnowledgeSection, type KnowledgeCallout } from '@/lib/hifz-knowledge';

const ICONS: Record<string, LucideIcon> = {
  Brain, BookOpen, Book, Repeat, Layers, Target, Headphones, PenLine, Lightbulb,
  CalendarDays, Scale, RefreshCw, Clock, Moon, Sunrise, Infinity: InfinityIcon,
  Sparkles, GitCompare, Mountain, HandHeart, Heart, Crown, Users,
};

const ACCENT: Record<string, string> = {
  gold: 'var(--ambient-gold)',
  sage: '#6e8c5a',
  indigo: '#7d7aaf',
  rose: '#b07083',
};

const CALLOUT_STYLE: Record<KnowledgeCallout['kind'], { label: string; color: string }> = {
  tip:      { label: 'Tip',      color: 'var(--ambient-gold)' },
  warning:  { label: 'Take care', color: '#c08a4a' },
  wisdom:   { label: 'Wisdom',   color: '#7d7aaf' },
  evidence: { label: 'Evidence', color: '#6e8c5a' },
};

function Callout({ callout }: { callout: KnowledgeCallout }) {
  const s = CALLOUT_STYLE[callout.kind];
  return (
    <div
      className="rounded-xl p-4 mt-3"
      style={{ background: 'var(--theme-surface-alt)', borderLeft: `2px solid ${s.color}` }}
    >
      <p className="text-[11px] uppercase tracking-widest mb-1.5 font-medium" style={{ color: s.color }}>
        {s.label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
        {callout.text}
      </p>
      {callout.source && (
        <p className="text-xs mt-1.5 italic" style={{ color: 'var(--theme-text-muted)' }}>
          — {callout.source}
        </p>
      )}
    </div>
  );
}

function SectionCard({ section, index }: { section: KnowledgeSection; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = ICONS[section.icon] || Lightbulb;
  const accent = ACCENT[section.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--theme-surface-alt)', color: accent }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base" style={{ color: 'var(--theme-text)' }}>
              {section.title}
            </h3>
            {section.arabic && (
              <span className="text-sm font-arabic opacity-50" dir="rtl" style={{ color: accent }}>
                {section.arabic}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--theme-text-muted)' }}>
            {section.summary}
          </p>
        </div>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: 'var(--theme-text-muted)', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-5 pt-1 space-y-3">
              {section.body.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                  {para}
                </p>
              ))}

              {section.steps && (
                <div className="space-y-3 pt-1">
                  {section.steps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 tabular-nums"
                        style={{ background: 'var(--ambient-gold-subtle)', color: accent }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{step.title}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.checklist && (
                <ul className="space-y-2 pt-1">
                  {section.checklist.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                      <span style={{ color: accent }} className="mt-0.5">◆</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.callouts?.map((c, i) => <Callout key={i} callout={c} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TechniquesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--theme-surface)' }}>
      <header
        className="sticky top-0 z-40"
        style={{ background: 'var(--theme-surface)', borderBottom: '1px solid var(--theme-border-subtle)' }}
      >
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-lg" style={{ color: 'var(--theme-text-secondary)' }} aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-lg" style={{ color: 'var(--theme-text)' }}>The Hifz Companion</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 pb-28">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--ambient-gold-subtle)', border: '1px solid var(--panel-border-gold)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'var(--theme-card)', color: 'var(--ambient-gold)' }}>
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg mb-1" style={{ color: 'var(--theme-text)' }}>
                The accumulated wisdom of hifz
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                A complete companion to memorizing the Quran — drawn from the traditional Tahfiz tradition,
                the practice of established huffaz, and the adab of the salaf. Read it slowly; return to it
                often.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chapters */}
        <div className="space-y-10">
          {HIFZ_KNOWLEDGE.map((chapter) => (
            <section key={chapter.id}>
              <div className="mb-4 px-1">
                <h2 className="font-serif text-xl" style={{ color: 'var(--theme-text)' }}>{chapter.title}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{chapter.description}</p>
              </div>
              <div className="space-y-3">
                {chapter.sections.map((section, i) => (
                  <SectionCard key={section.id} section={section} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Tajweed link */}
        <Link href="/techniques/tajweed" className="block mt-10">
          <div
            className="rounded-2xl p-5 flex items-center gap-3"
            style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'var(--ambient-gold-subtle)', color: 'var(--ambient-gold)' }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm" style={{ color: 'var(--theme-text)' }}>Tajweed Guide</p>
              <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>The rules of beautiful, correct recitation</p>
            </div>
            <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: 'var(--theme-text-muted)' }} />
          </div>
        </Link>

        <p className="text-center text-xs mt-10 italic px-6" style={{ color: 'var(--theme-text-muted)' }}>
          &ldquo;And We have certainly made the Quran easy to remember, so is there any who will be reminded?&rdquo;
          <br />— Quran 54:17
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
