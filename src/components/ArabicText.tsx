'use client';

/**
 * ArabicText Component
 * 
 * Renders Arabic text with the user's preferred font style.
 * Uses the arabicFontStyle preference from the preferences store.
 * Falls back to default Uthmani font if no preference is set.
 */

import { usePreferences, ARABIC_FONT_STYLE_OPTIONS } from '@/lib/preferencesStore';

interface ArabicTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3';
  /** Override the font style preference */
  fontStyle?: 'uthmani' | 'madina' | 'indopak' | 'kitab';
  /** Override font size */
  fontSize?: number;
}

export default function ArabicText({
  children,
  className = '',
  style = {},
  as: Component = 'span',
  fontStyle,
  fontSize,
}: ArabicTextProps) {
  const { preferences, isLoaded } = usePreferences();
  
  // Determine which font style to use
  const styleToUse = fontStyle || (isLoaded ? preferences.display.arabicFontStyle : 'uthmani');
  const fontOption = ARABIC_FONT_STYLE_OPTIONS.find(f => f.value === styleToUse);
  const fontFamily = fontOption?.fontFamily || 'var(--font-arabic)';
  
  // Determine font size
  const finalFontSize = fontSize || (isLoaded ? preferences.display.arabicFontSizePx : undefined);
  
  return (
    <Component
      className={`${className}`}
      style={{
        fontFamily,
        direction: 'rtl',
        fontSize: finalFontSize,
        ...style,
      }}
      lang="ar"
      dir="rtl"
    >
      {children}
    </Component>
  );
}

/**
 * Hook to get the current Arabic font family
 */
export function useArabicFontFamily() {
  const { preferences, isLoaded } = usePreferences();
  
  if (!isLoaded) return 'var(--font-arabic)';
  
  const fontOption = ARABIC_FONT_STYLE_OPTIONS.find(
    f => f.value === preferences.display.arabicFontStyle
  );
  return fontOption?.fontFamily || 'var(--font-arabic)';
}

/**
 * Hook to get the current Arabic font size
 */
export function useArabicFontSize() {
  const { preferences, isLoaded } = usePreferences();
  return isLoaded ? preferences.display.arabicFontSizePx : 28;
}
