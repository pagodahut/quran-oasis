'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  RotateCcw,
  Zap,
  CalendarClock,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type ActionStatus = 'success' | 'pending' | 'error';
type ActionType = 'recitation' | 'srs' | 'review' | 'analysis' | 'sync';

interface AgentAction {
  id: string;
  type: ActionType;
  description: string;
  timestamp: string;
  status: ActionStatus;
}

interface UpcomingReview {
  id: string;
  surahName: string;
  ayahRange: string;
  dueIn: string;
  priority: 'high' | 'medium' | 'low';
}

// ============================================
// Constants
// ============================================

const ACTION_ICONS: Record<ActionType, typeof Activity> = {
  recitation: Brain,
  srs: RotateCcw,
  review: CheckCircle2,
  analysis: Zap,
  sync: Activity,
};

const STATUS_STYLES: Record<ActionStatus, { dot: string; text: string }> = {
  success: { dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
  pending: { dot: 'bg-amber-500 animate-pulse', text: 'text-amber-600 dark:text-amber-400' },
  error: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
};

const PRIORITY_STYLES: Record<string, string> = {
  high: 'border-l-red-500 bg-red-500/5 dark:bg-red-500/10',
  medium: 'border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
  low: 'border-l-green-500 bg-green-500/5 dark:bg-green-500/10',
};

// Demo data
const DEMO_ACTIONS: AgentAction[] = [
  { id: '1', type: 'recitation', description: 'Scored recitation of Al-Mulk (1-10) — 94% accuracy', timestamp: '2 min ago', status: 'success' },
  { id: '2', type: 'srs', description: 'Rescheduled Al-Baqarah (21-40) review using SRS algorithm', timestamp: '15 min ago', status: 'success' },
  { id: '3', type: 'analysis', description: 'Analyzing tajweed patterns in recent recitations', timestamp: 'Just now', status: 'pending' },
  { id: '4', type: 'review', description: 'Marked Ya-Sin (1-20) as needing review — confidence dropped', timestamp: '1 hour ago', status: 'success' },
  { id: '5', type: 'sync', description: 'Failed to sync progress — retrying', timestamp: '30 min ago', status: 'error' },
];

const DEMO_UPCOMING: UpcomingReview[] = [
  { id: '1', surahName: 'Al-Baqarah', ayahRange: '1-20', dueIn: 'In 30 min', priority: 'high' },
  { id: '2', surahName: 'Al-Mulk', ayahRange: '11-20', dueIn: 'In 2 hours', priority: 'medium' },
  { id: '3', surahName: 'Ya-Sin', ayahRange: '21-40', dueIn: 'Tomorrow', priority: 'low' },
  { id: '4', surahName: 'Ar-Rahman', ayahRange: '31-50', dueIn: 'In 3 days', priority: 'low' },
];

// ============================================
// Components
// ============================================

function ActionItem({ action }: { action: AgentAction }) {
  const Icon = ACTION_ICONS[action.type];
  const statusStyle = STATUS_STYLES[action.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <Icon size={16} className="text-night-400 dark:text-night-500" />
        <span className={cn('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-night-900', statusStyle.dot)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-night-700 dark:text-night-200 leading-relaxed">{action.description}</p>
        <span className={cn('text-[10px]', statusStyle.text)}>{action.timestamp}</span>
      </div>
    </motion.div>
  );
}

function UpcomingItem({ review }: { review: UpcomingReview }) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-2 py-2 px-3 mb-1.5 transition-colors',
        PRIORITY_STYLES[review.priority],
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-night-700 dark:text-night-200">{review.surahName}</span>
        <span className="text-[10px] text-night-400 dark:text-night-500">{review.dueIn}</span>
      </div>
      <span className="text-[10px] text-night-500 dark:text-night-400">Ayahs {review.ayahRange}</span>
    </div>
  );
}

function HeartbeatDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
    </span>
  );
}

// ============================================
// Main Panel
// ============================================

interface AgentPanelProps {
  actions?: AgentAction[];
  upcoming?: UpcomingReview[];
  className?: string;
}

export default function AgentPanel({
  actions = DEMO_ACTIONS,
  upcoming = DEMO_UPCOMING,
  className,
}: AgentPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'rounded-2xl overflow-hidden',
        'backdrop-blur-[16px]',
        'bg-[linear-gradient(135deg,rgba(255,255,255,0.70),rgba(255,255,255,0.30))]',
        'dark:bg-[linear-gradient(135deg,rgba(22,27,34,0.72),rgba(255,255,255,0.02))]',
        'border border-black/[0.06] dark:border-white/[0.07]',
        'shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-gold-500" />
          <h3 className="text-sm font-semibold text-night-800 dark:text-night-100">Agent Actions</h3>
        </div>
        <div className="flex items-center gap-2">
          <HeartbeatDot />
          <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Active</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/[0.04] dark:divide-white/[0.06]">
        {/* Recent Actions */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <Clock size={12} className="text-night-400 dark:text-night-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-night-400 dark:text-night-500">
              Recent Activity
            </span>
          </div>
          <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
            {actions.map((action) => (
              <ActionItem key={action.id} action={action} />
            ))}
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <CalendarClock size={12} className="text-night-400 dark:text-night-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-night-400 dark:text-night-500">
              Upcoming Reviews
            </span>
          </div>
          <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
            {upcoming.map((review) => (
              <UpcomingItem key={review.id} review={review} />
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] grid grid-cols-3 gap-2">
            {[
              { label: 'Due Today', value: '3', icon: AlertCircle, color: 'text-amber-500' },
              { label: 'Streak', value: '12d', icon: Zap, color: 'text-gold-500' },
              { label: 'Accuracy', value: '91%', icon: CheckCircle2, color: 'text-green-500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={14} className={cn('mx-auto mb-0.5', stat.color)} />
                <div className="text-sm font-bold text-night-800 dark:text-night-100">{stat.value}</div>
                <div className="text-[9px] text-night-400 dark:text-night-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
