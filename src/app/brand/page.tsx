'use client';

import { 
  LogoConceptOpenQuran, 
  LogoConceptBoldHa, 
  LogoConceptCrescentBook,
  LogoConceptRadiantQuran,
  LogoConceptHifzShield,
  LogoConceptMinimalQuran,
  LogoConceptMinimalQuranOutline
} from '@/components/brand/concepts';
import { HifzIcon } from '@/components/brand/HifzLogo';

export default function BrandPage() {
  const concepts = [
    { name: 'Current Logo', description: 'Octagram + ح (too complex)', Component: HifzIcon },
    { name: '1. Open Quran', description: 'Book + crescent moon', Component: LogoConceptOpenQuran },
    { name: '2. Bold Ha (ح)', description: 'Geometric Arabic letter', Component: LogoConceptBoldHa },
    { name: '3. Crescent Book', description: 'Dual-meaning symbol', Component: LogoConceptCrescentBook },
    { name: '4. Radiant Quran', description: 'Book with light rays', Component: LogoConceptRadiantQuran },
    { name: '5. Hifz Shield', description: 'Protection/preservation', Component: LogoConceptHifzShield },
    { name: '6. Minimal Quran', description: 'Ultra-simple book (WINNER)', Component: LogoConceptMinimalQuran },
    { name: '6b. Minimal Outline', description: 'Outline variant', Component: LogoConceptMinimalQuranOutline },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-950 to-night-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gold-400 mb-2">HIFZ Logo Concepts</h1>
        <p className="text-night-400 mb-8">Comparing logo options for clarity and recognition</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {concepts.map(({ name, description, Component }) => (
            <div key={name} className="flex flex-col items-center p-4 bg-night-800/50 rounded-xl">
              <Component size={80} />
              <h3 className="text-gold-300 font-medium mt-4 text-center">{name}</h3>
              <p className="text-night-400 text-sm text-center">{description}</p>
              
              {/* Size comparison */}
              <div className="flex items-center gap-2 mt-4">
                <Component size={48} />
                <Component size={32} />
                <Component size={24} />
                <Component size={16} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-night-800/50 rounded-xl">
          <h2 className="text-xl font-bold text-gold-400 mb-4">Recommendation: Concept 6 (Minimal Quran)</h2>
          <ul className="text-night-300 space-y-2">
            <li>✓ Works at ALL sizes (even 16px favicon)</li>
            <li>✓ Instantly recognizable as a book/Quran</li>
            <li>✓ Simple enough to be memorable</li>
            <li>✓ Gold color palette matches the app</li>
            <li>✓ No complex geometry that breaks at small sizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
