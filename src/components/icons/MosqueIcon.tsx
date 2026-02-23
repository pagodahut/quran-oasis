'use client';

/**
 * MosqueIcon — Custom mosque silhouette for AI Sheikh floating button
 *
 * Elegant geometric mosque: central dome with finial, two minarets, arched doorway.
 * Designed as a clean filled/stroked silhouette that reads instantly as a mosque.
 */

interface MosqueIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export function MosqueIcon({ size = 24, className = '', color = 'currentColor' }: MosqueIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Dome finial — small point atop the central dome */}
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <circle cx="12" cy="2" r="0.4" fill={color} stroke="none" />

      {/* Central dome — semicircle sitting atop the main body */}
      <path d="M7 11 C7 7.5 9.2 5 12 5 C14.8 5 17 7.5 17 11" />

      {/* Main body */}
      <rect x="7" y="11" width="10" height="8.5" rx="0.4" />

      {/* Arched doorway */}
      <path d="M10 19.5 V16.5 C10 15.1 10.9 14.2 12 14.2 C13.1 14.2 14 15.1 14 16.5 V19.5" />

      {/* Left minaret */}
      <rect x="2.5" y="8" width="3" height="11.5" rx="0.5" />
      {/* Left minaret cap */}
      <path d="M2.5 8 L4 5.5 L5.5 8" />
      <line x1="4" y1="4.5" x2="4" y2="5.5" />
      {/* Left minaret balcony line */}
      <line x1="2" y1="12.5" x2="6" y2="12.5" />

      {/* Right minaret */}
      <rect x="18.5" y="8" width="3" height="11.5" rx="0.5" />
      {/* Right minaret cap */}
      <path d="M18.5 8 L20 5.5 L21.5 8" />
      <line x1="20" y1="4.5" x2="20" y2="5.5" />
      {/* Right minaret balcony line */}
      <line x1="18" y1="12.5" x2="22" y2="12.5" />

      {/* Ground / base line */}
      <line x1="1" y1="19.5" x2="23" y2="19.5" />
    </svg>
  );
}

export default MosqueIcon;
