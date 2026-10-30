import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native'
import { AppText } from '@/components/ui'
import { colors, fonts, radius, spacing, TOUCH_MIN } from '@/theme'

export interface TextFieldProps extends TextInputProps {
  label: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.root}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textMuted">
          {hint}
        </AppText>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  input: {
    minHeight: TOUCH_MIN,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.text
  },
  inputError: { borderColor: colors.danger }
})
