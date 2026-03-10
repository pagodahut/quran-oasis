'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'chip' | 'fab';
type ButtonSize = 'sm' | 'md' | 'lg';

interface SheikhButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  pulse?: boolean;
  breathe?: boolean;
  children?: ReactNode;
}

export default function SheikhButton({
  variant = 'primary',
  size = 'md',
  icon,
  pulse = false,
  breathe = false,
  children,
  className = '',
  ...props
}: SheikhButtonProps) {
  const classes = [
    'sheikh-btn',
    `sheikh-btn--${variant}`,
    `sheikh-btn--${size}`,
    pulse ? 'sheikh-btn--pulse' : '',
    breathe ? 'sheikh-btn--breathe' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <>
      <button className={classes} {...props}>
        {icon && <span className="sheikh-btn__icon">{icon}</span>}
        {children}
      </button>

      <style jsx>{`
        /* ═══════════════════════════════════════
           Living Light — Sheikh Button System
           ═══════════════════════════════════════ */

        .sheikh-btn {
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-family: inherit;
          letter-spacing: 0.2px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .sheikh-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          pointer-events: none;
        }
        .sheikh-btn__icon {
          display: inline-flex;
          align-items: center;
          font-size: 1.1em;
        }

        /* ─── Sizes ─── */
        .sheikh-btn--sm { padding: 8px 16px; font-size: 12.5px; border-radius: 10px; }
        .sheikh-btn--md { padding: 12px 22px; font-size: 14px; border-radius: 12px; }
        .sheikh-btn--lg { padding: 14px 28px; font-size: 15px; border-radius: 14px; }

        /* ─── Primary ─── */
        .sheikh-btn--primary {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow:
            0 0 20px rgba(212, 175, 55, 0.15),
            0 8px 32px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .sheikh-btn--primary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow:
            0 0 30px rgba(212, 175, 55, 0.25),
            0 8px 32px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        .sheikh-btn--primary:active {
          transform: translateY(0);
          background: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 0 16px rgba(212, 175, 55, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.25);
        }

        /* ─── Secondary ─── */
        .sheikh-btn--secondary {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        .sheikh-btn--secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(245, 214, 128, 0.9);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.18);
        }
        .sheikh-btn--secondary:active {
          background: rgba(255, 255, 255, 0.1);
        }

        /* ─── Ghost ─── */
        .sheikh-btn--ghost {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          padding-left: 8px;
          padding-right: 8px;
        }
        .sheikh-btn--ghost:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }

        /* ─── Chip ─── */
        .sheikh-btn--chip {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 7px 14px;
          font-size: 12.5px;
          font-weight: 500;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        .sheikh-btn--chip:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(245, 214, 128, 0.9);
          border-color: rgba(212, 175, 55, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }
        .sheikh-btn--chip:active {
          transform: translateY(0);
        }

        /* ─── FAB ─── */
        .sheikh-btn--fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          padding: 0;
          font-size: 22px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          color: rgba(212, 175, 55, 0.95);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow:
            0 0 24px rgba(212, 175, 55, 0.2),
            0 8px 32px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .sheikh-btn--fab:hover {
          transform: scale(1.12);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow:
            0 0 40px rgba(212, 175, 55, 0.3),
            0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .sheikh-btn--fab:active {
          transform: scale(1.04);
        }
        /* FAB ignores size classes */
        .sheikh-btn--fab.sheikh-btn--sm,
        .sheikh-btn--fab.sheikh-btn--md,
        .sheikh-btn--fab.sheikh-btn--lg {
          width: 56px;
          height: 56px;
          padding: 0;
          font-size: 22px;
          border-radius: 50%;
        }

        /* ─── Animations ─── */
        .sheikh-btn--pulse {
          animation: sheikhPulse 3s ease-in-out infinite;
        }
        .sheikh-btn--breathe {
          animation: sheikhBreathe 4s ease-in-out infinite;
        }

        @keyframes sheikhPulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(212, 175, 55, 0.15),
              0 8px 32px rgba(0, 0, 0, 0.25);
          }
          50% {
            box-shadow:
              0 0 30px rgba(212, 175, 55, 0.25),
              0 8px 32px rgba(0, 0, 0, 0.3);
          }
        }

        @keyframes sheikhBreathe {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(212, 175, 55, 0.25); }
        }
      `}</style>
    </>
  );
}
