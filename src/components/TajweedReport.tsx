'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Clock,
  Info,
  ExternalLink,
} from 'lucide-react';
import type { TajweedRuleInstance, WordAlignment } from '@/lib/realtimeTajweedService';

// ============ Tajweed Rule Colors & Metadata ============

export const TAJWEED_COLORS: Record<string, { bg: string; border: string; text: string; dot: string; label: string }> = {
  'Noon Sakinah - Idgham': {
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.3)',
    text: 'text-green-400',
    dot: 'bg-green-400',
    label: 'Idgham',
  },
  'Noon Sakinah - Ikhfa': {
    bg: 'rgba(251, 146, 60, 0.1)',
    border: 'rgba(251, 146, 60, 0.3)',
    text: 'text-orange-400',
    dot: 'bg-orange-400',
    label: 'Ikhfa',
  },
  'Noon Sakinah - Iqlab': {
    bg: 'rgba(96, 165, 250, 0.1)',
    border: 'rgba(96, 165, 250, 0.3)',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    label: 'Iqlab',
  },
  'Noon Sakinah - Izhar': {
    bg: 'rgba(167, 139, 250, 0.1)',
    border: 'rgba(167, 139, 250, 0.3)',
    text: 'text-violet-400',
    dot: 'bg-violet-400',
    label: 'Izhar',
  },
  'Qalqalah': {
    bg: 'rgba(248, 113, 113, 0.1)',
    border: 'rgba(248, 113, 113, 0.3)',
    text: 'text-red-400',
    dot: 'bg-red-400',
    label: 'Qalqalah',
  },
  'Ghunnah': {
    bg: 'rgba(192, 132, 252, 0.1)',
    border: 'rgba(192, 132, 252, 0.3)',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
    label: 'Ghunnah',
  },
  'Madd (Elongation)': {
    bg: 'rgba(250, 204, 21, 0.1)',
    border: 'rgba(250, 204, 21, 0.3)',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
    label: 'Madd',
  },
};

const DEFAULT_COLOR = {
  bg: 'rgba(148, 163, 184, 0.1)',
  border: 'rgba(148, 163, 184, 0.3)',
  text: 'text-night-300',
  dot: 'bg-night-400',
  label: 'Other',
};

// ============ Rule Explanations ============

const RULE_EXPLANATIONS: Record<string, string> = {
  'Noon Sakinah - Idgham': 'The noon sound merges into the following letter (ي ن م و ل ر), creating a smooth transition.',
  'Noon Sakinah - Ikhfa': 'The noon sound is hidden and nasalized before certain consonants, blending gently.',
  'Noon Sakinah - Iqlab': 'The noon sound changes to a meem sound before the letter ب with nasalization.',
  'Noon Sakinah - Izhar': 'The noon is pronounced clearly without nasalization before throat letters (ء ه ع ح غ خ).',
  'Qalqalah': 'A slight bouncing echo is produced when the letters ق ط ب ج د have sukoon.',
  'Ghunnah': 'A nasal resonance held for 2 counts on noon or meem with shaddah (نّ or مّ).',
  'Madd (Elongation)': 'A vowel sound is stretched for 2–6 counts depending on the type of madd.',
};

// ============ Performance Assessment ============

function getPerformanceForRule(
  rule: TajweedRuleInstance,
  alignments: WordAlignment[]
): 'correct' | 'partial' | 'missed' {
  if (!alignments || alignments.length === 0) return 'partial';

  const ruleWordStatuses = rule.wordIndices.map((idx) => {
    const alignment = alignments[idx];
    if (!alignment) return 'pending';
    return alignment.status;
  });

  const matched = ruleWordStatuses.filter((s) => s === 'matched').length;
  const total = ruleWordStatuses.length;

  if (matched === total) return 'correct';
  if (matched > 0) return 'partial';
  return 'missed';
}

const PERFORMANCE_STYLES = {
  correct: {
    badge: 'bg-sage-500/15 text-sage-400 border-sage-500/30',
    label: 'Correct',
    icon: '✓',
  },
  partial: {
    badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    label: 'Partial',
    icon: '~',
  },
  missed: {
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    label: 'Missed',
    icon: '✗',
  },
};

// ============ Props ============

interface TajweedReportProps {
  rulesDetected: TajweedRuleInstance[];
  alignments: WordAlignment[];
  words: string[];
  accuracy: number;
  duration: number;
}

// ============ Component ============

export default function TajweedReport({
  rulesDetected,
  alignments,
  words,
  accuracy,
  duration,
}: TajweedReportProps) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Calculate tajweed score
  const tajweedScore = useMemo(() => {
    if (rulesDetected.length === 0) return accuracy;

    const performances = rulesDetected.map((r) => {
      const perf = getPerformanceForRule(r, alignments);
      return perf === 'correct' ? 1 : perf === 'partial' ? 0.5 : 0;
    });

    const ruleScore = performances.reduce<number>((a, b) => a + b, 0) / performances.length;
    return Math.round(ruleScore * 100);
  }, [rulesDetected, alignments, accuracy]);

  const scoreGrade = useMemo(() => {
    if (tajweedScore >= 90) return { label: 'Excellent Tajweed', emoji: '🌟', color: 'text-gold-400' };
    if (tajweedScore >= 75) return { label: 'Good Tajweed', emoji: '✨', color: 'text-sage-400' };
    if (tajweedScore >= 50) return { label: 'Needs Improvement', emoji: '💪', color: 'text-yellow-400' };
    return { label: 'Keep Practicing', emoji: '📖', color: 'text-night-300' };
  }, [tajweedScore]);

  // Group rules by category
  const groupedRules = useMemo(() => {
    const groups: Record<string, TajweedRuleInstance[]> = {};
    for (const rule of rulesDetected) {
      const category = rule.rule.startsWith('Noon Sakinah') ? 'Noon Sakinah Rules' :
        rule.rule === 'Ghunnah' ? 'Nasalization' :
        rule.rule === 'Qalqalah' ? 'Echo Effect' :
        rule.rule.includes('Madd') ? 'Elongation' : 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(rule);
    }
    return groups;
  }, [rulesDetected]);

  if (rulesDetected.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-night-900/60 rounded-2xl p-5 border border-night-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-5 h-5 text-night-400" />
          <h3 className="text-sm font-semibold text-night-200">Tajweed Analysis</h3>
        </div>
        <p className="text-xs text-night-500">
          No tajweed rules were detected in this passage. Try a longer recitation for detailed analysis.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {/* Header Card */}
      <div className="bg-night-900/60 rounded-2xl p-5 border border-night-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-night-100">Tajweed Report</h3>
              <p className="text-xs text-night-500">{rulesDetected.length} rules found</p>
            </div>
          </div>
          <Link
            href="/techniques/tajweed"
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition"
          >
            Learn Rules
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={scoreGrade.color}
                initial={{ strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${tajweedScore} 100` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-night-100">{tajweedScore}</span>
            </div>
          </div>
          <div>
            <p className={`text-sm font-semibold ${scoreGrade.color}`}>
              {scoreGrade.emoji} {scoreGrade.label}
            </p>
            <p className="text-xs text-night-500 mt-0.5">
              {rulesDetected.length} tajweed rules analyzed across your recitation
            </p>
          </div>
        </div>

        {/* Legend Toggle */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="flex items-center gap-1.5 text-xs text-night-400 hover:text-night-300 transition"
        >
          <Info className="w-3.5 h-3.5" />
          Color Legend
          {showLegend ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-night-800/30">
                {Object.entries(TAJWEED_COLORS).map(([rule, style]) => (
                  <div key={rule} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <span className="text-xs text-night-400">{style.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rules by Category */}
      {Object.entries(groupedRules).map(([category, rules], catIdx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + catIdx * 0.1 }}
          className="bg-night-900/60 rounded-2xl border border-night-800/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-night-800/30">
            <h4 className="text-xs font-semibold text-night-400 uppercase tracking-wider">
              {category}
            </h4>
          </div>

          <div className="divide-y divide-night-800/20">
            {rules.map((rule, rIdx) => {
              const colors = TAJWEED_COLORS[rule.rule] || DEFAULT_COLOR;
              const performance = getPerformanceForRule(rule, alignments);
              const perfStyle = PERFORMANCE_STYLES[performance];
              const isExpanded = expandedRule === `${category}-${rIdx}`;
              const ruleWords = rule.wordIndices
                .filter((i) => i < words.length)
                .map((i) => words[i]);

              return (
                <div key={rIdx}>
                  <button
                    onClick={() =>
                      setExpandedRule(isExpanded ? null : `${category}-${rIdx}`)
                    }
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition text-left"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${colors.text}`}>
                          {rule.arabicName}
                        </span>
                        <span className="text-xs text-night-500">{rule.rule}</span>
                      </div>
                      {ruleWords.length > 0 && (
                        <p
                          className="text-sm font-arabic text-night-300 mt-1 truncate"
                          dir="rtl"
                          lang="ar"
                        >
                          {ruleWords.join(' ')}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${perfStyle.badge}`}
                    >
                      {perfStyle.icon} {perfStyle.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-night-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-night-500 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 pb-3 ml-5 space-y-2"
                          style={{
                            borderLeft: `2px solid ${colors.border}`,
                          }}
                        >
                          <p className="text-xs text-night-400 leading-relaxed">
                            {RULE_EXPLANATIONS[rule.rule] || rule.description}
                          </p>
                          <p className="text-xs text-night-500 italic">
                            💡 {rule.tip}
                          </p>
                          <Link
                            href={`/techniques/tajweed#${encodeURIComponent(rule.rule.toLowerCase().replace(/\s+/g, '-'))}`}
                            className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition mt-1"
                          >
                            Learn more about this rule
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
