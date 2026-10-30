import { Text, type TextProps } from 'react-native'
import { colors, typography, type ColorName, type TypographyVariant } from '@/theme'

interface Props extends TextProps {
  variant?: TypographyVariant
  color?: ColorName
}

export function AppText({ variant = 'body', color = 'text', style, ...props }: Props) {
  return <Text style={[typography[variant], { color: colors[color] }, style]} {...props} />
}
