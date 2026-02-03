'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Eye, EyeOff } from 'lucide-react';
import {
  TAJWEED_COLORS,
  TAJWEED_RULE_DEFINITIONS,
  findTajweedRules,
  type TajweedRuleType,
  type TajweedMatch,
} from '@/lib/tajweed-rules';

interface TajweedHighlightProps {
  arabicText: string;
  showRules?: boolean;
  highlightRule?: TajweedRuleType | null;
  fontSize?: string;
  onRuleClick?: (rule: TajweedRuleType, matchedText: string) => void;
  className?: string;
}

interface HighlightedSegment {
  text: string;
  rule: TajweedRuleType | null;
  startIndex: number;
  endIndex: number;
}

export default function TajweedHighlight({
  arabicText,
  showRules = true,
  highlightRule = null,
  fontSize = 'text-quran-lg',
  onRuleClick,
  className = '',
}: TajweedHighlightProps) {
  const [selectedRule, setSelectedRule] = useState<TajweedRuleType | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [hoveredRule, setHoveredRule] = useState<TajweedRuleType | null>(null);

  // Find all tajweed rules in the text
  const tajweedMatches = useMemo(() => {
    if (!showRules) return [];
    return findTajweedRules(arabicText);
  }, [arabicText, showRules]);

  // Create highlighted segments
  const segments = useMemo((): HighlightedSegment[] => {
    if (!showRules || tajweedMatches.length === 0) {
      return [{ text: arabicText, rule: null, startIndex: 0, endIndex: arabicText.length }];
    }

    const result: HighlightedSegment[] = [];
    let lastIndex = 0;

    // Filter matches based on highlightRule
    const filteredMatches = highlightRule
      ? tajweedMatches.filter(m => m.rule === highlightRule)
      : tajweedMatches;

    // Sort by start index
    const sortedMatches = [...filteredMatches].sort((a, b) => a.startIndex - b.startIndex);

    for (const match of sortedMatches) {
      // Add unhighlighted text before this match
      if (match.startIndex > lastIndex) {
        result.push({
          text: arabicText.slice(lastIndex, match.startIndex),
          rule: null,
          startIndex: lastIndex,
          endIndex: match.startIndex,
        });
      }

      // Skip overlapping matches
      if (match.startIndex >= lastIndex) {
        result.push({
          text: match.matchedText,
          rule: match.rule,
          startIndex: match.startIndex,
          endIndex: match.endIndex,
        });
        lastIndex = match.endIndex;
      }
    }

    // Add remaining text
    if (lastIndex < arabicText.length) {
      result.push({
        text: arabicText.slice(lastIndex),
        rule: null,
        startIndex: lastIndex,
        endIndex: arabicText.length,
      });
    }

    return result;
  }, [arabicText, tajweedMatches, showRules, highlightRule]);

  // Count rules found
  const ruleCounts = useMemo(() => {
    const counts: Partial<Record<TajweedRuleType, number>> = {};
    for (const match of tajweedMatches) {
      counts[match.rule] = (counts[match.rule] || 0) + 1;
    }
    return counts;
  }, [tajweedMatches]);

  const handleSegmentClick = useCallback((rule: TajweedRuleType | null, text: string) => {
    if (rule && onRuleClick) {
      onRuleClick(rule, text);
    }
    setSelectedRule(rule);
  }, [onRuleClick]);

  const activeRules = Object.keys(ruleCounts) as TajweedRuleType[];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Arabic Text with Highlights */}
      <div
        dir="rtl"
        className={`font-quran leading-relaxed ${fontSize} text-cream-100`}
      >
        {segments.map((segment, index) => {
          const isHighlighted = segment.rule !== null;
          const ruleColor = segment.rule ? TAJWEED_COLORS[segment.rule] : null;
          const isFiltered = highlightRule && segment.rule !== highlightRule;
          const isHovered = hoveredRule && segment.rule === hoveredRule;

          if (isHighlighted && ruleColor) {
            return (
              <motion.span
                key={`${segment.startIndex}-${index}`}
                className={`relative cursor-pointer rounded px-0.5 transition-all duration-200 ${
                  isFiltered ? 'opacity-30' : ''
                } ${isHovered ? 'ring-2 ring-offset-2 ring-offset-night-900' : ''}`}
                style={{
                  backgroundColor: `${ruleColor.color}20`,
                  color: ruleColor.color,
                  boxShadow: isHovered ? `0 0 12px ${ruleColor.color}40` : undefined,
                }}
                onClick={() => handleSegmentClick(segment.rule, segment.text)}
                onMouseEnter={() => setHoveredRule(segment.rule)}
                onMouseLeave={() => setHoveredRule(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isFiltered ? 0.3 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {segment.text}
                
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && segment.rule && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
                    >
                      <div
                        className="px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                        style={{
                          backgroundColor: `${ruleColor.color}20`,
                          borderColor: ruleColor.color,
                          borderWidth: 1,
                        }}
                      >
                        <span className="font-sans text-cream-100 text-xs">
                          {TAJWEED_COLORS[segment.rule].name}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span>
            );
          }

          return (
            <span key={`${segment.startIndex}-${index}`} className="text-cream-100">
              {segment.text}
            </span>
          );
        })}
      </div>

      {/* Rule Legend Toggle */}
      {showRules && activeRules.length > 0 && (
        <div className="pt-4 border-t border-night-700">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 text-sm text-cream-300 hover:text-gold-400 transition-colors"
          >
            {showLegend ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showLegend ? 'Hide' : 'Show'} Tajweed Legend</span>
            <span className="text-cream-500">
              ({activeRules.length} rules found)
            </span>
          </button>

          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {activeRules.map((rule) => {
                    const ruleInfo = TAJWEED_COLORS[rule];
                    const count = ruleCounts[rule] || 0;
                    const isSelected = highlightRule === rule || selectedRule === rule;

                    return (
                      <motion.button
                        key={rule}
                        onClick={() => handleSegmentClick(rule, '')}
                        onMouseEnter={() => setHoveredRule(rule)}
                        onMouseLeave={() => setHoveredRule(null)}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                          isSelected
                            ? `${ruleInfo.borderColor} bg-night-800`
                            : 'border-night-700 hover:border-night-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ruleInfo.color }}
                        />
                        <div className="text-left">
                          <span className={`text-sm font-medium ${ruleInfo.textColor}`}>
                            {ruleInfo.name}
                          </span>
                          <span className="text-xs text-cream-500 ml-1">
                            ({count})
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Selected Rule Details */}
      <AnimatePresence>
        {selectedRule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 rounded-xl border border-night-700 bg-night-800/50"
          >
            <RuleDetails rule={selectedRule} onClose={() => setSelectedRule(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Rule Details Component
// ============================================

interface RuleDetailsProps {
  rule: TajweedRuleType;
  onClose?: () => void;
}

export function RuleDetails({ rule, onClose }: RuleDetailsProps) {
  const ruleInfo = TAJWEED_COLORS[rule];
  const ruleDefinition = TAJWEED_RULE_DEFINITIONS[rule];

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: ruleInfo.color }}
          />
          <div>
            <h4 className={`font-semibold ${ruleInfo.textColor}`}>
              {ruleDefinition.name}
            </h4>
            <p className="text-sm text-cream-400 font-arabic">
              {ruleDefinition.arabicName}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-cream-500 hover:text-cream-300 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <p className="text-sm text-cream-300">{ruleDefinition.explanation}</p>

      <div className="space-y-2">
        <h5 className="text-xs font-medium text-cream-500 uppercase tracking-wide">
          Examples
        </h5>
        <div className="flex flex-wrap gap-2">
          {ruleDefinition.examples.map((example, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-lg text-lg font-quran"
              style={{
                backgroundColor: `${ruleInfo.color}20`,
                color: ruleInfo.color,
              }}
              dir="rtl"
            >
              {example}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-medium text-cream-500 uppercase tracking-wide">
          Tips
        </h5>
        <ul className="space-y-1">
          {ruleDefinition.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-cream-400">
              <Info className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: ruleInfo.color }} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================
// Compact Legend for Embedding
// ============================================

interface TajweedLegendProps {
  rules?: TajweedRuleType[];
  compact?: boolean;
  onRuleSelect?: (rule: TajweedRuleType) => void;
  selectedRule?: TajweedRuleType | null;
}

export function TajweedLegend({
  rules,
  compact = false,
  onRuleSelect,
  selectedRule,
}: TajweedLegendProps) {
  const displayRules = rules || (Object.keys(TAJWEED_COLORS) as TajweedRuleType[]);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {displayRules.map((rule) => {
          const ruleInfo = TAJWEED_COLORS[rule];
          const isSelected = selectedRule === rule;

          return (
            <button
              key={rule}
              onClick={() => onRuleSelect?.(rule)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
                isSelected
                  ? ''
                  : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: `${ruleInfo.color}20`,
                color: ruleInfo.color,
                boxShadow: isSelected ? `0 0 0 2px ${ruleInfo.color}` : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ruleInfo.color }}
              />
              {ruleInfo.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {displayRules.map((rule) => {
        const ruleInfo = TAJWEED_COLORS[rule];
        const ruleDefinition = TAJWEED_RULE_DEFINITIONS[rule];
        const isSelected = selectedRule === rule;

        return (
          <motion.button
            key={rule}
            onClick={() => onRuleSelect?.(rule)}
            className={`p-3 rounded-lg border text-left transition-all ${
              isSelected
                ? `border-2 ${ruleInfo.borderColor}`
                : 'border-night-700 hover:border-night-600'
            }`}
            style={{
              backgroundColor: isSelected ? `${ruleInfo.color}10` : undefined,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ruleInfo.color }}
              />
              <span className={`font-medium ${ruleInfo.textColor}`}>
                {ruleInfo.name}
              </span>
            </div>
            <p className="text-xs text-cream-500">{ruleInfo.description}</p>
            <p className="text-sm text-cream-400 font-arabic mt-1" dir="rtl">
              {ruleDefinition.arabicName}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
