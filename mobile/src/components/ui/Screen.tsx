import { createContext, useContext, type ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/theme'
import { AppText } from './AppText'
import { Voile } from './Voile'

/** Hauteur occupée par la barre d'onglets flottante, à laisser libre en bas de l'écran. */
export const EspaceBasContext = createContext(0)

interface Props {
  title?: string
  subtitle?: string
  children: ReactNode
  /** Zone fixée en bas de l'écran (bouton principal). */
  footer?: ReactNode
}

export function Screen({ title, subtitle, children, footer }: Props) {
  const espaceBas = useContext(EspaceBasContext)

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Voile />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footer ? spacing.lg : spacing.xxl + espaceBas }]}
        keyboardShouldPersistTaps="handled"
      >
        {title || subtitle ? (
          <View style={styles.entete}>
            {subtitle ? (
              <AppText variant="caption" color="textMuted" style={styles.surtitre}>
                {subtitle}
              </AppText>
            ) : null}
            {title ? <AppText variant="title">{title}</AppText> : null}
          </View>
        ) : null}
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: spacing.lg + espaceBas }]}>{footer}</View> : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
  content: { padding: spacing.lg, gap: spacing.md, paddingTop: spacing.xl },
  entete: { gap: spacing.xs, marginBottom: spacing.md },
  surtitre: { textTransform: 'uppercase', letterSpacing: 1.2 },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md }
})
