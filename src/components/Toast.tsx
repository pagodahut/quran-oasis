'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Bookmark, Volume2 } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon?: ReactNode;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, options?: { icon?: ReactNode; duration?: number }) => void;
  removeToast: (id: string) => void;
  // Convenience methods
  success: (message: string, icon?: ReactNode) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  bookmarkAdded: () => void;
  bookmarkRemoved: () => void;
  reciterChanged: (newReciter: string, reason?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return no-op functions if outside provider (for safety)
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      bookmarkAdded: () => {},
      bookmarkRemoved: () => {},
      reciterChanged: () => {},
    };
  }
  return context;
}

// Toast icons by type
const TOAST_ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-sage-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
};

// Toast styles by type
const TOAST_STYLES: Record<ToastType, string> = {
  success: 'border-sage-500/30 bg-sage-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((
    message: string, 
    type: ToastType = 'info',
    options?: { icon?: ReactNode; duration?: number }
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = options?.duration ?? 3000;
    
    setToasts(prev => [...prev, { id, message, type, icon: options?.icon, duration }]);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  // Convenience methods
  const success = useCallback((message: string, icon?: ReactNode) => {
    addToast(message, 'success', { icon });
  }, [addToast]);

  const error = useCallback((message: string) => {
    addToast(message, 'error', { duration: 5000 });
  }, [addToast]);

  const info = useCallback((message: string) => {
    addToast(message, 'info');
  }, [addToast]);

  const bookmarkAdded = useCallback(() => {
    addToast('Bookmark added', 'success', { 
      icon: <Bookmark className="w-5 h-5 text-gold-400 fill-gold-400" /> 
    });
  }, [addToast]);

  const bookmarkRemoved = useCallback(() => {
    addToast('Bookmark removed', 'info', { 
      icon: <Bookmark className="w-5 h-5 text-night-400" /> 
    });
  }, [addToast]);

  const reciterChanged = useCallback((newReciter: string, reason?: string) => {
    const message = reason 
      ? `Switched to ${newReciter} (${reason})`
      : `Now playing: ${newReciter}`;
    addToast(message, 'info', { 
      icon: <Volume2 className="w-5 h-5 text-gold-400" />,
      duration: 4000,
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast, 
      success, 
      error, 
      info,
      bookmarkAdded,
      bookmarkRemoved,
      reciterChanged,
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              pointer-events-auto
              flex items-center gap-3 px-4 py-3 rounded-xl
              bg-night-900/95 backdrop-blur-lg border
              shadow-lg shadow-black/20
              ${TOAST_STYLES[toast.type]}
            `}
          >
            {toast.icon || TOAST_ICONS[toast.type]}
            <span className="text-sm text-night-100 font-medium">{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-night-500 hover:text-night-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastProvider;
