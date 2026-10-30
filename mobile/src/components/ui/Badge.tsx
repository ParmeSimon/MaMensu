import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { colors, radius, spacing } from '@/theme'
import { AppText } from './AppText'

export type Statut = 'success' | 'warning' | 'danger' | 'neutral'

const COULEUR = {
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  neutral: colors.textMuted
} as const

/** `style` : par exemple `{ alignSelf: 'center' }` quand le badge est dans une ligne. */
export function Badge({ label, statut = 'neutral', style }: { label: string; statut?: Statut; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.base, { backgroundColor: `${COULEUR[statut]}14` }, style]}>
      <View style={[styles.point, { backgroundColor: COULEUR[statut] }]} />
      <AppText variant="caption">{label}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full
  },
  point: { width: 8, height: 8, borderRadius: 4 }
})
