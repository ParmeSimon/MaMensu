import type { TextStyle } from 'react-native'

/** Graisses de Geist, chargées dans le layout racine. */
export const fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold'
} as const

// Texte de base à 17 : lisible par tous, téléphone tenu à bout de bras.
// Titres et montants serrés : rendu éditorial, sans lourdeur.
export const typography = {
  title: { fontFamily: fonts.semibold, fontSize: 34, lineHeight: 40, letterSpacing: -1.2 },
  heading: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 24, letterSpacing: -0.3 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24 },
  label: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  amount: { fontFamily: fonts.semibold, fontSize: 44, lineHeight: 50, letterSpacing: -1.8, fontVariant: ['tabular-nums'] }
} satisfies Record<string, TextStyle>

export type TypographyVariant = keyof typeof typography
