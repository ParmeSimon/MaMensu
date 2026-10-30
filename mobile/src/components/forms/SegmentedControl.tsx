import { Pressable, StyleSheet, View } from 'react-native'
import { AppText } from '@/components/ui'
import { colors, radius, spacing, TOUCH_MIN } from '@/theme'

interface Option<T extends string> {
  value: T
  label: string
  description?: string
}

interface Props<T extends string> {
  label: string
  options: Option<T>[]
  value: T | undefined
  onChange: (value: T) => void
}

/** Choix exclusif présenté en grandes cartes, une option par ligne. */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.root} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <AppText variant="label">{label}</AppText>
      {options.map((option) => {
        const actif = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: actif }}
            onPress={() => onChange(option.value)}
            style={[styles.option, actif && styles.optionActive]}
          >
            <AppText variant="label" color={actif ? 'primary' : 'text'}>
              {option.label}
            </AppText>
            {option.description ? (
              <AppText variant="caption" color="textMuted">
                {option.description}
              </AppText>
            ) : null}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  option: {
    minHeight: TOUCH_MIN,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 2
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft }
})
