'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// This is the root error boundary - it must be minimal because it catches errors
// in the root layout itself. No fancy components or fonts available here.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical errors
    console.error('[Critical Error]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        minHeight: '100vh',
        backgroundColor: '#0f1419',
        color: '#e5e5e5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ 
          maxWidth: '400px', 
          padding: '24px', 
          textAlign: 'center' 
        }}>
          {/* Simple warning icon using CSS */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251, 191, 36, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(251, 191, 36, 0.3)',
          }}>
            <span style={{ fontSize: '36px' }}>⚠️</span>
          </div>

          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: '#f5f5f5',
          }}>
            Critical Error
          </h1>
          
          <p style={{ 
            color: '#9ca3af', 
            marginBottom: '24px',
            lineHeight: 1.6,
          }}>
            The app encountered a critical error. Your data is safe. 
            Please try reloading the page.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div style={{
              padding: '12px',
              marginBottom: '24px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              textAlign: 'left',
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: '#f87171',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                margin: 0,
              }}>
                {error.message}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                backgroundColor: '#c9a227',
                color: '#0f1419',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1f2937',
                color: '#e5e5e5',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>

          {/* Simple Bismillah */}
          <p style={{ 
            marginTop: '48px', 
            color: 'rgba(201, 162, 39, 0.4)',
            fontSize: '20px',
          }}>
            بِسْمِ ٱللَّهِ
          </p>
        </div>
      </body>
    </html>
  );
}
