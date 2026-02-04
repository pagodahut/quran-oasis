/**
 * Tajweed Color Map
 * 
 * Maps tajweed CSS classes from Quran.com API responses to colors.
 * The API returns HTML like: <tajweed class="ham_wasl">ٱ</tajweed>
 * 
 * Standard tajweed color coding following traditional mushaf conventions.
 */

export interface TajweedColor {
  /** CSS color value */
  color: string;
  /** Human-readable rule name in English */
  name: string;
  /** Arabic name of the rule */
  arabicName: string;
  /** Brief description */
  description: string;
}

export const TAJWEED_COLOR_MAP: Record<string, TajweedColor> = {
  // Hamzat al-Wasl — silent hamza
  ham_wasl: {
    color: '#9e9e9e',
    name: 'Hamzat al-Wasl',
    arabicName: 'همزة الوصل',
    description: 'Connecting hamza — silent when continuing',
  },

  // Lam Shamsiyah — assimilated lam
  laam_shamsiyah: {
    color: '#9e9e9e',
    name: 'Lam Shamsiyah',
    arabicName: 'لام شمسية',
    description: 'Sun letter — lam is assimilated into the next letter',
  },

  // Madd Normal — natural elongation (2 counts)
  madda_normal: {
    color: '#d32f2f',
    name: 'Madd Normal',
    arabicName: 'مد طبيعي',
    description: 'Natural elongation — hold for 2 counts',
  },

  // Madd Permissible — optional elongation (2, 4, or 6 counts)
  madda_permissible: {
    color: '#e65100',
    name: 'Madd Permissible',
    arabicName: 'مد جائز',
    description: 'Permissible elongation — 2, 4, or 6 counts',
  },

  // Madd Obligatory — must elongate (4-5 counts)
  madda_obligatory: {
    color: '#b71c1c',
    name: 'Madd Obligatory',
    arabicName: 'مد لازم',
    description: 'Obligatory elongation — 4-5 counts',
  },

  // Madd Necessary — compulsory elongation (6 counts)
  madda_necessary: {
    color: '#b71c1c',
    name: 'Madd Necessary',
    arabicName: 'مد لازم',
    description: 'Necessary elongation — hold for 6 counts',
  },

  // Ghunnah — nasalization (2 counts)
  ghunnah: {
    color: '#2e7d32',
    name: 'Ghunnah',
    arabicName: 'غنة',
    description: 'Nasalization — nasal sound for 2 counts',
  },

  // Ikhfa — hiding noon sakinah/tanween
  ikhfa: {
    color: '#388e3c',
    name: 'Ikhfa',
    arabicName: 'إخفاء',
    description: 'Hiding — soft noon sound before specific letters',
  },

  // Idgham with Ghunnah — merging with nasalization
  idghaam_ghunnah: {
    color: '#43a047',
    name: 'Idgham with Ghunnah',
    arabicName: 'إدغام بغنة',
    description: 'Merging with nasalization into ي/ن/م/و',
  },

  // Idgham without Ghunnah — merging without nasalization
  idghaam_no_ghunnah: {
    color: '#9e9e9e',
    name: 'Idgham without Ghunnah',
    arabicName: 'إدغام بلا غنة',
    description: 'Merging without nasalization into ل/ر',
  },

  // Iqlab — converting noon to meem
  iqlab: {
    color: '#66bb6a',
    name: 'Iqlab',
    arabicName: 'إقلاب',
    description: 'Conversion — noon changes to meem before ب',
  },

  // Qalqalah — echoing/bouncing
  qalqalah: {
    color: '#1565c0',
    name: 'Qalqalah',
    arabicName: 'قلقلة',
    description: 'Echo/bounce on letters ق/ط/ب/ج/د with sukoon',
  },

  // Ikhfa Shafawi — lip hiding
  ikhfa_shafawi: {
    color: '#388e3c',
    name: 'Ikhfa Shafawi',
    arabicName: 'إخفاء شفوي',
    description: 'Labial hiding — meem sakinah before ب',
  },

  // Idgham Shafawi — lip merging
  idghaam_shafawi: {
    color: '#43a047',
    name: 'Idgham Shafawi',
    arabicName: 'إدغام شفوي',
    description: 'Labial merging — meem sakinah into meem',
  },

  // Silent letters
  silent: {
    color: '#9e9e9e',
    name: 'Silent',
    arabicName: 'حرف ساكن',
    description: 'Silent letter — not pronounced',
  },
};

/**
 * Get the color for a tajweed class name
 */
export function getTajweedColor(className: string): string {
  return TAJWEED_COLOR_MAP[className]?.color || 'inherit';
}

/**
 * Get tajweed rule info for a class name
 */
export function getTajweedRule(className: string): TajweedColor | null {
  return TAJWEED_COLOR_MAP[className] || null;
}

/**
 * All available tajweed class names
 */
export const TAJWEED_CLASSES = Object.keys(TAJWEED_COLOR_MAP);

/**
 * Group tajweed classes by category for legend display
 */
export const TAJWEED_CATEGORIES = {
  elongation: {
    label: 'Elongation (Madd)',
    arabicLabel: 'المد',
    classes: ['madda_normal', 'madda_permissible', 'madda_obligatory', 'madda_necessary'],
  },
  nasalization: {
    label: 'Nasalization & Hiding',
    arabicLabel: 'الغنة والإخفاء',
    classes: ['ghunnah', 'ikhfa', 'idghaam_ghunnah', 'iqlab', 'ikhfa_shafawi', 'idghaam_shafawi'],
  },
  echoing: {
    label: 'Qalqalah',
    arabicLabel: 'القلقلة',
    classes: ['qalqalah'],
  },
  silent: {
    label: 'Silent & Assimilation',
    arabicLabel: 'الحروف الساكنة',
    classes: ['ham_wasl', 'laam_shamsiyah', 'idghaam_no_ghunnah', 'silent'],
  },
};
