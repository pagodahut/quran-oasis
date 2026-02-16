'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class SheikhErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Sheikh error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: 20,
          background: 'rgba(255,0,0,0.1)',
          borderRadius: 12,
          border: '1px solid rgba(255,0,0,0.2)',
        }}>
          <p style={{ color: '#ff6b6b', margin: 0 }}>
            Something went wrong. Please try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Skeletons ─────────────────────────────────────────────────────

export function SheikhCardSkeleton() {
  return (
    <div className="sheikh-skeleton">
      <div className="sheikh-skeleton__avatar" />
      <div className="sheikh-skeleton__content">
        <div className="sheikh-skeleton__line sheikh-skeleton__line--short" />
        <div className="sheikh-skeleton__line" />
        <div className="sheikh-skeleton__line sheikh-skeleton__line--medium" />
      </div>

      <style jsx>{`
        .sheikh-skeleton {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #0c1f1a, #132e25);
          border: 1px solid rgba(45, 212, 150, 0.08);
          border-radius: 16px;
          margin-bottom: 12px;
        }
        .sheikh-skeleton__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(90deg, #1a3d32 25%, #2a5d4a 50%, #1a3d32 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          flex-shrink: 0;
        }
        .sheikh-skeleton__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sheikh-skeleton__line {
          height: 12px;
          background: linear-gradient(90deg, #1a3d32 25%, #2a5d4a 50%, #1a3d32 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }
        .sheikh-skeleton__line--short { width: 40%; }
        .sheikh-skeleton__line--medium { width: 70%; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function SheikhMessageSkeleton() {
  return (
    <div className="sheikh-msg-skeleton">
      <div className="sheikh-msg-skeleton__bubble">
        <div className="sheikh-msg-skeleton__line" />
        <div className="sheikh-msg-skeleton__line sheikh-msg-skeleton__line--medium" />
        <div className="sheikh-msg-skeleton__line sheikh-msg-skeleton__line--short" />
      </div>

      <style jsx>{`
        .sheikh-msg-skeleton {
          padding: 12px 16px;
          background: linear-gradient(135deg, #0c1f1a, #132e25);
          border: 1px solid rgba(45, 212, 150, 0.12);
          border-radius: 16px;
        }
        .sheikh-msg-skeleton__bubble {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sheikh-msg-skeleton__line {
          height: 14px;
          background: linear-gradient(90deg, #1a3d32 25%, #2a5d4a 50%, #1a3d32 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 7px;
        }
        .sheikh-msg-skeleton__line--short { width: 50%; }
        .sheikh-msg-skeleton__line--medium { width: 80%; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
