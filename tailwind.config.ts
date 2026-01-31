import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom Colors - Islamic Design Palette
      colors: {
        // Night Sky - Primary Background
        night: {
          50: '#f5f6f8',
          100: '#e5e7ec',
          200: '#c8cbd5',
          300: '#a4a9b8',
          400: '#788294',
          500: '#5d6579',
          600: '#4a5164',
          700: '#3e4354',
          800: '#2a2f3d',
          900: '#1a1f2a',
          950: '#0f1419',
        },
        // Gold/Amber - Accent & Highlights
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f8c744',
          500: '#c9a227',
          600: '#a68220',
          700: '#845c1a',
          800: '#6b4a18',
          900: '#5a3d16',
          950: '#332107',
        },
        // Sage Green - Success & Growth
        sage: {
          50: '#f3f7f3',
          100: '#e2ebe2',
          200: '#c5d7c6',
          300: '#9dbb9f',
          400: '#709873',
          500: '#4e7a51',
          600: '#3a6140',
          700: '#2f4f35',
          800: '#283f2d',
          900: '#223527',
          950: '#111d14',
        },
        // Midnight Blue - Secondary Accents
        midnight: {
          50: '#f0f5fc',
          100: '#dce8f8',
          200: '#c1d5f3',
          300: '#96baeb',
          400: '#6496e0',
          500: '#4076d5',
          600: '#305cc8',
          700: '#2a4ab7',
          800: '#283e95',
          900: '#243676',
          950: '#1a2449',
        },
      },
      // Typography
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
        quran: ['KFGQPC Hafs Uthmani', 'Amiri Quran', 'Amiri', 'serif'],
      },
      fontSize: {
        'quran-sm': ['1.5rem', { lineHeight: '2.5' }],
        'quran-md': ['1.75rem', { lineHeight: '2.5' }],
        'quran-lg': ['2rem', { lineHeight: '2.5' }],
        'quran-xl': ['2.25rem', { lineHeight: '2.5' }],
        'quran-2xl': ['2.75rem', { lineHeight: '2.5' }],
      },
      // Spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 162, 39, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201, 162, 39, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      // Box Shadows
      boxShadow: {
        'glow-gold': '0 0 20px rgba(201, 162, 39, 0.15)',
        'glow-sage': '0 0 20px rgba(78, 122, 81, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.25)',
      },
      // Border Radius
      borderRadius: {
        '4xl': '2rem',
      },
      // Backdrop Blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
