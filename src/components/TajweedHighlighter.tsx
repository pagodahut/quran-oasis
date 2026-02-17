'use client';

import { useState, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Info, X } from 'lucide-react';

// ============ Tajweed Color Mapping ============

interface TajweedMatch {
  start: number;
  end: number;
  rule: string;
  color: string;
  label: string;
}

const TAJWEED_LEGEND = [
  { rule: 'Idgham', color: '#22c55e', label: 'Idgham (Merging)' },
  { rule: 'Ikhfa', color: '#fb923c', label: 'Ikhfa (Concealment)' },
  { rule: 'Iqlab', color: '#60a5fa', label: 'Iqlab (Conversion)' },
  { rule: 'Qalqalah', color: '#f87171', label: 'Qalqalah (Echo)' },
  { rule: 'Ghunnah', color: '#c084fc', label: 'Ghunnah (Nasalization)' },
  { rule: 'Madd', color: '#facc15', label: 'Madd (Elongation)' },
  { rule: 'Izhar', color: '#a78bfa', label: 'Izhar (Clear)' },
];

// Regex patterns for detecting tajweed rules in Arabic text
const TAJWEED_PATTERNS: Array<{ pattern: RegExp; rule: string; color: string; label: string }> = [
  // Ghunnah: noon or meem with shaddah
  { pattern: /[نم]ّ/g, rule: 'Ghunnah', color: '#c084fc', label: 'Ghunnah' },
  // Idgham: noon sakinah/tanween followed by ي ن م و ل ر
  { pattern: /نْ[ينمولر]/g, rule: 'Idgham', color: '#22c55e', label: 'Idgham' },
  { pattern: /[ًٌٍ]\s*[ينمولر]/g, rule: 'Idgham', color: '#22c55e', label: 'Idgham' },
  // Ikhfa: noon sakinah/tanween before specific letters
  { pattern: /نْ[تثجدذزسشصضطظفقك]/g, rule: 'Ikhfa', color: '#fb923c', label: 'Ikhfa' },
  { pattern: /[ًٌٍ]\s*[تثجدذزسشصضطظفقك]/g, rule: 'Ikhfa', color: '#fb923c', label: 'Ikhfa' },
  // Iqlab: noon sakinah/tanween before ب
  { pattern: /نْب/g, rule: 'Iqlab', color: '#60a5fa', label: 'Iqlab' },
  { pattern: /[ًٌٍ]\s*ب/g, rule: 'Iqlab', color: '#60a5fa', label: 'Iqlab' },
  // Izhar: noon sakinah/tanween before throat letters
  { pattern: /نْ[ءهعحغخ]/g, rule: 'Izhar', color: '#a78bfa', label: 'Izhar' },
  { pattern: /[ًٌٍ]\s*[ءهعحغخ]/g, rule: 'Izhar', color: '#a78bfa', label: 'Izhar' },
  // Qalqalah: ق ط ب ج د with sukoon
  { pattern: /[قطبجد]ْ/g, rule: 'Qalqalah', color: '#f87171', label: 'Qalqalah' },
  // Madd: elongation indicators
  { pattern: /[اوي]ٓ/g, rule: 'Madd', color: '#facc15', label: 'Madd' },
  { pattern: /ـٰ/g, rule: 'Madd', color: '#facc15', label: 'Madd' },
];

function detectTajweedInText(text: string): TajweedMatch[] {
  const matches: TajweedMatch[] = [];

  for (const { pattern, rule, color, label } of TAJWEED_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      // Check for overlaps - skip if this range is already covered
      const overlaps = matches.some(
        (m) => match!.index < m.end && match!.index + match![0].length > m.start
      );
      if (!overlaps) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          rule,
          color,
          label,
        });
      }
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start);
  return matches;
}

// ============ Highlighted Text Component ============

export function TajweedText({
  text,
  enabled,
  fontSize,
  className = '',
}: {
  text: string;
  enabled: boolean;
  fontSize?: string | number;
  className?: string;
}) {
  const segments = useMemo(() => {
    if (!enabled) return null;
    return detectTajweedInText(text);
  }, [text, enabled]);

  if (!enabled || !segments || segments.length === 0) {
    return (
      <span className={className} style={{ fontSize }} dir="rtl" lang="ar">
        {text}
      </span>
    );
  }

  // Build segments with highlighting
  const parts: Array<{ text: string; color?: string; rule?: string }> = [];
  let lastEnd = 0;

  for (const match of segments) {
    if (match.start > lastEnd) {
      parts.push({ text: text.slice(lastEnd, match.start) });
    }
    parts.push({
      text: text.slice(match.start, match.end),
      color: match.color,
      rule: match.label,
    });
    lastEnd = match.end;
  }
  if (lastEnd < text.length) {
    parts.push({ text: text.slice(lastEnd) });
  }

  return (
    <span className={className} style={{ fontSize }} dir="rtl" lang="ar">
      {parts.map((part, i) =>
        part.color ? (
          <span
            key={i}
            className="relative inline-block"
            style={{
              color: part.color,
              textShadow: `0 0 8px ${part.color}40`,
            }}
            title={part.rule}
          >
            {part.text}
            <span
              className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full opacity-60"
              style={{ backgroundColor: part.color }}
            />
          </span>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        )
      )}
    </span>
  );
}

// ============ Toggle Button ============

export function TajweedToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 min-h-[32px] ${
        enabled
          ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
          : 'bg-white/5 text-night-400 border border-white/5 hover:bg-white/10'
      }`}
      title={enabled ? 'Hide Tajweed Colors' : 'Show Tajweed Colors'}
    >
      {enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      Tajweed
    </button>
  );
}

// ============ Legend Component ============

export function TajweedLegend({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-night-900/90 backdrop-blur-xl rounded-2xl border border-night-800/50 p-4 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-night-300 uppercase tracking-wider">
              Tajweed Color Key
            </h4>
            <button onClick={onClose} className="text-night-500 hover:text-night-300 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TAJWEED_LEGEND.map((item) => (
              <div key={item.rule} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-night-400">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
