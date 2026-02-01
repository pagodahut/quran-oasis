// HIFZ Brand Components
// Export all brand-related components from this index

export { 
  HifzLogo, 
  HifzIcon, 
  HifzIconSimple, 
  HifzWordmark,
  HifzLogoAnimated,
} from './HifzLogo';

// Brand colors for use in JavaScript/TypeScript
export const HIFZ_COLORS = {
  // Primary - Deep Night
  night: {
    950: '#0f1419',
    900: '#1a1f25',
    800: '#252b33',
    700: '#3a424d',
    600: '#4f5966',
    500: '#6b7785',
    400: '#8a95a5',
    300: '#a8b3c4',
    200: '#c6d0de',
    100: '#e5eaf2',
  },
  
  // Accent - Gold Leaf
  gold: {
    light: '#f4d47c',
    DEFAULT: '#c9a227',
    dark: '#8b6914',
    shadow: '#5a4410',
  },
  
  // Secondary - Spiritual Teal
  teal: {
    light: '#2d9191',
    DEFAULT: '#1a6b6b',
    dark: '#0f4545',
  },
  
  // Tertiary - Warm Cream
  cream: {
    light: '#faf8f2',
    DEFAULT: '#f5f0e1',
    dark: '#e8dfc9',
  },
  
  // Accent - Sage Green
  sage: {
    light: '#a8c9a0',
    DEFAULT: '#86a971',
    dark: '#5a7a4d',
  },
};

// Gradients for reuse
export const HIFZ_GRADIENTS = {
  goldLeaf: 'linear-gradient(135deg, #f4d47c 0%, #c9a227 50%, #8b6914 100%)',
  nightSky: 'linear-gradient(180deg, #0f1419 0%, #1a1f25 100%)',
  divineGlow: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
};
