'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Bug,
  Lightbulb,
  MessageCircle,
  Clock,
  Loader2,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  Filter,
  ExternalLink,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  userId: string | null;
  category: string;
  message: string;
  pageUrl: string | null;
  userAgent: string | null;
  status: string;
  createdAt: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Bug }> = {
  bug: { label: 'Bug', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', icon: Bug },
  feature: { label: 'Feature', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30', icon: Lightbulb },
  general: { label: 'General', color: 'text-night-400', bg: 'bg-night-700/50 border-night-600/30', icon: MessageCircle },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Circle }> = {
  new: { label: 'New', color: 'text-amber-400', bg: 'bg-amber-500/15', icon: Circle },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/15', icon: Loader2 },
  done: { label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: CheckCircle2 },
};

export default function FeedbackTrackerPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '50' });
      if (categoryFilter) params.set('category', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/feedback?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          setError('Unauthorized — you need admin access.');
          return;
        }
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setFeedback(data.feedback);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, statusFilter]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
      }
    } catch {
      // silent
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    if (diffHrs < 48) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 liquid-glass rounded-b-2xl mx-2 mt-2">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/settings" className="liquid-icon-btn">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-night-100">Bug Tracker</h1>
              <p className="text-xs text-night-500">{total} total entries</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
          <Filter className="w-4 h-4 text-night-500 flex-shrink-0" />
          
          {/* Category filters */}
          {['bug', 'feature', 'general'].map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(isActive ? null : cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  isActive ? cfg.bg + ' ' + cfg.color + ' border' : 'bg-white/5 text-night-400 border-white/5 hover:bg-white/10'
                }`}
              >
                <cfg.icon className="w-3 h-3" />
                {cfg.label}
              </button>
            );
          })}

          <div className="w-px h-5 bg-night-800 flex-shrink-0" />

          {/* Status filters */}
          {['new', 'in_progress', 'done'].map((st) => {
            const cfg = STATUS_CONFIG[st];
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(isActive ? null : st)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive ? cfg.bg + ' ' + cfg.color : 'bg-white/5 text-night-400 hover:bg-white/10'
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <main className="px-3 py-4 max-w-3xl mx-auto pb-24">
        {error ? (
          <div className="text-center py-16">
            <p className="text-red-400 mb-2">{error}</p>
            <button onClick={fetchFeedback} className="text-sm text-gold-400 hover:underline">
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gold-400" />
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-12 h-12 text-night-700 mx-auto mb-3" />
            <p className="text-night-500">No feedback entries found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {feedback.map((item, i) => {
              const catCfg = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.general;
              const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
              const isExpanded = expandedId === item.id;
              const CatIcon = catCfg.icon;
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
                >
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Category badge */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${catCfg.bg}`}>
                      <CatIcon className={`w-4 h-4 ${catCfg.color}`} />
                    </div>

                    {/* Message preview */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-night-200 truncate">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-night-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="text-[10px] text-night-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.userId ? item.userId.slice(0, 8) + '…' : 'Guest'}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                      <StatusIcon className={`w-3 h-3 ${item.status === 'in_progress' ? 'animate-spin' : ''}`} />
                      {statusCfg.label}
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-night-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-night-600" />
                    )}
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-3">
                          {/* Full message */}
                          <p className="text-sm text-night-300 leading-relaxed whitespace-pre-wrap">
                            {item.message}
                          </p>

                          {/* Meta */}
                          {item.pageUrl && (
                            <div className="flex items-center gap-2 text-xs text-night-500">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate">{item.pageUrl}</span>
                            </div>
                          )}

                          <p className="text-[10px] text-night-600">
                            ID: {item.id} • {new Date(item.createdAt).toLocaleString()}
                          </p>

                          {/* Status actions */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-night-500 mr-1">Status:</span>
                            {(['new', 'in_progress', 'done'] as const).map((st) => {
                              const stCfg = STATUS_CONFIG[st];
                              const isCurrent = item.status === st;
                              return (
                                <button
                                  key={st}
                                  onClick={() => !isCurrent && updateStatus(item.id, st)}
                                  disabled={updatingId === item.id}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isCurrent
                                      ? stCfg.bg + ' ' + stCfg.color + ' ring-1 ring-current/20'
                                      : 'bg-white/5 text-night-500 hover:bg-white/10'
                                  } ${updatingId === item.id ? 'opacity-50' : ''}`}
                                >
                                  {stCfg.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-white/5 text-night-400 text-sm disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm text-night-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-white/5 text-night-400 text-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
