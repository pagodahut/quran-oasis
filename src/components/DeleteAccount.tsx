'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * In-app account deletion — required by Apple App Store Guideline 5.1.1(v).
 * Confirms intent, calls DELETE /api/account, clears local data, signs out.
 */
export default function DeleteAccount() {
  const { isSignedIn, isClerkConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  // Only relevant when there is an actual account to delete.
  if (!isClerkConfigured || !isSignedIn) return null;

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Deletion failed. Please try again.');
      }
      // Wipe everything local before redirecting.
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
      // Hard redirect home; the Clerk session is already invalidated server-side.
      window.location.href = '/';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deletion failed.');
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-colors"
        style={{ color: '#d66', background: 'rgba(200,70,70,0.06)', border: '1px solid rgba(200,70,70,0.18)' }}
      >
        <Trash2 className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-xs opacity-70">Permanently remove your account and all data</p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !busy && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(200,70,70,0.12)', color: '#d66' }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif mb-2" style={{ color: 'var(--theme-text)' }}>
                Delete your account?
              </h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                This permanently deletes your account, memorization progress, bookmarks, and all
                data on our servers. This cannot be undone.
              </p>

              <label className="block text-xs mb-2" style={{ color: 'var(--theme-text-muted)' }}>
                Type <strong style={{ color: 'var(--theme-text)' }}>DELETE</strong> to confirm
              </label>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg mb-4 text-sm"
                style={{
                  background: 'var(--theme-surface-alt)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text)',
                }}
                placeholder="DELETE"
                autoCapitalize="characters"
                disabled={busy}
              />

              {error && (
                <p className="text-xs mb-3" style={{ color: '#d66' }}>
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--theme-surface-alt)', color: 'var(--theme-text)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={busy || confirmText.trim().toUpperCase() !== 'DELETE'}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: '#c0392b', color: '#fff' }}
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {busy ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
