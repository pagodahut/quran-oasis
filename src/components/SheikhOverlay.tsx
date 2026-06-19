'use client';

/**
 * SheikhOverlay — Global Sheikh Panel Renderer
 *
 * This component renders the SheikhChat panel and AskSheikhButton globally.
 * Place it once in your root layout and it works on every page.
 *
 * It reads from SheikhContext to know when to show/hide and what
 * context to pass to the chat.
 *
 * Usage in layout.tsx:
 *   <SheikhProvider>
 *     {children}
 *     <SheikhOverlay />
 *   </SheikhProvider>
 */

import { useState, useEffect } from 'react';
import { useSheikh } from '@/contexts/SheikhContext';
import { getPreferences } from '@/lib/preferencesStore';
import AskSheikhButton from '@/components/AskSheikhButton';
import SheikhChat from '@/components/SheikhChat';

/** Pages where the FAB should appear */
const SHOW_FAB_ON: string[] = ['mushaf', 'lesson', 'recite', 'practice', 'dashboard'];

export default function SheikhOverlay() {
  const { pageContext, isSheikhOpen, closeSheikh } = useSheikh();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getPreferences().aiSheikh?.enabled ?? false);

    const handleUpdate = () => {
      setEnabled(getPreferences().aiSheikh?.enabled ?? false);
    };

    window.addEventListener('preferences-updated', handleUpdate);
    return () => window.removeEventListener('preferences-updated', handleUpdate);
  }, []);

  if (!enabled) return null;

  const showFab = SHOW_FAB_ON.includes(pageContext.page);

  return (
    <>
      <AskSheikhButton show={showFab} />

      {isSheikhOpen && (
        <SheikhChat
          isOpen={isSheikhOpen}
          onClose={closeSheikh}
          mode="panel"
        />
      )}
    </>
  );
}
