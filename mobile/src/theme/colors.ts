// Blanc et bleu : bleu pour les actions et les montants, bleu nuit pour le texte.
// Le dégradé bleu → violet → rose sert au voile de fond et au liseré de ce qui
// compte le plus à l'écran. Vert, orange et rouge servent uniquement à signaler
// un statut (payé, à faire, en retard), jamais à décorer.
export const colors = {
  primary: '#2563EB',
  primarySoft: '#EAF0FF',
  primaryBorder: '#C7D6FB',
  text: '#0F172A',
  textMuted: '#5B6478',
  background: '#FFFFFF',
  surface: '#F6F8FC',
  border: '#E3E8F2',
  /** Cartes en verre posées sur le voile. */
  glass: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.9)',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  white: '#FFFFFF'
} as const

export type ColorName = keyof typeof colors

/** Dégradés : tuples [début, …, fin] pour expo-linear-gradient. */
export const gradients = {
  /** Liseré des cartes mises en avant et de la barre d'onglets. */
  accent: ['#2563EB', '#A855F7', '#EC4899'],
  /** Pilule de l'onglet actif. */
  primary: ['#2563EB', '#4F46E5']
} as const satisfies Record<string, readonly [string, string, ...string[]]>
