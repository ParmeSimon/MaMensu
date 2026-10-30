import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { colors, gradients, radius, spacing } from '@/theme'

interface Props {
  children: ReactNode
  /**
   * « default » : verre translucide posé sur le voile.
   * « highlight » : blanc opaque cerclé d'un liseré en dégradé, pour ce qui compte le plus (le total du mois).
   * « tint » : bleu pâle, pour les petits chiffres clés.
   */
  variant?: 'default' | 'highlight' | 'tint'
  style?: StyleProp<ViewStyle>
}

export function Card({ children, variant = 'default', style }: Props) {
  if (variant === 'highlight') {
    // Le dégradé dépasse d'un pixel autour de la carte blanche : il ne reste qu'un liseré.
    return (
      <LinearGradient colors={gradients.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.lisere, style]}>
        <View style={[styles.base, styles.interieur]}>{children}</View>
      </LinearGradient>
    )
  }
  return <View style={[styles.base, variant === 'tint' ? styles.tint : styles.verre, style]}>{children}</View>
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, padding: spacing.xl, gap: spacing.sm },
  verre: { backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder },
  tint: { backgroundColor: 'rgba(234,240,255,0.7)', borderWidth: 1, borderColor: colors.glassBorder, padding: spacing.lg, gap: 2 },
  lisere: { borderRadius: radius.lg, padding: 1 },
  interieur: { backgroundColor: colors.background, borderRadius: radius.lg - 1 }
})
