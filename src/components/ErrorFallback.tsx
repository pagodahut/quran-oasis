'use client';

import { useState, useCallback } from 'react';
import { AlertTriangle, RefreshCw, WifiOff, Clock, ServerCrash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserFriendlyErrorMessage, NetworkError, TimeoutError, APIError } from '@/lib/apiErrors';

interface ErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

/**
 * Inline error fallback component for API failures
 * Shows contextual error with retry option
 */
export function ErrorFallback({ error, onRetry, compact = false, className = '' }: ErrorFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry]);

  // Determine icon and color based on error type
  const getErrorStyle = () => {
    if (error instanceof NetworkError) {
      return { Icon: WifiOff, color: 'amber', label: 'Connection Issue' };
    }
    if (error instanceof TimeoutError) {
      return { Icon: Clock, color: 'orange', label: 'Timeout' };
    }
    if (error instanceof APIError && error.statusCode && error.statusCode >= 500) {
      return { Icon: ServerCrash, color: 'red', label: 'Server Error' };
    }
    return { Icon: AlertTriangle, color: 'amber', label: 'Error' };
  };

  const { Icon, color, label } = getErrorStyle();
  const message = getUserFriendlyErrorMessage(error);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 ${className}`}
      >
        <Icon className={`w-4 h-4 text-${color}-400 flex-shrink-0`} />
        <p className={`text-sm text-${color}-200 flex-1`}>{message}</p>
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`p-1.5 rounded-lg bg-${color}-500/20 hover:bg-${color}-500/30 transition-colors disabled:opacity-50`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-${color}-400 ${isRetrying ? 'animate-spin' : ''}`} />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl text-center ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.02) 100%)`,
        border: '1px solid rgba(251, 191, 36, 0.15)',
      }}
    >
      {/* Icon */}
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-amber-400" />
      </div>

      {/* Label */}
      <p className="text-xs text-amber-400/70 uppercase tracking-wider mb-1">{label}</p>
      
      {/* Message */}
      <p className="text-night-200 mb-4">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
    </motion.div>
  );
}

interface AsyncBoundaryProps<T> {
  data: T | null | undefined;
  error: Error | null;
  isLoading: boolean;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  className?: string;
}

/**
 * Async boundary component for handling loading/error/empty states
 */
export function AsyncBoundary<T>({
  data,
  error,
  isLoading,
  onRetry,
  loadingFallback,
  emptyFallback,
  children,
  className = '',
}: AsyncBoundaryProps<T>) {
  // Loading state
  if (isLoading) {
    if (loadingFallback) return <>{loadingFallback}</>;
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-night-700 border-t-gold-500 rounded-full"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorFallback error={error} onRetry={onRetry} className={className} />;
  }

  // Empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    if (emptyFallback) return <>{emptyFallback}</>;
    return (
      <div className={`text-center p-8 text-night-400 ${className}`}>
        <p>No data available</p>
      </div>
    );
  }

  // Success - render children
  return <>{children(data)}</>;
}

/**
 * Hook for managing async state with retry
 */
export function useAsyncState<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: true,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await asyncFn();
      setState({ data, error: null, isLoading: false });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({ data: null, error, isLoading: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Initial fetch
  useState(() => {
    execute();
  });

  return {
    ...state,
    refetch: execute,
  };
}

export default ErrorFallback;
