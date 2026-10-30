import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { AppText, Card } from '@/components/ui'
import { colors, fonts, radius, spacing } from '@/theme'

interface Props {
  numero: number
  titre: string
  children: ReactNode
}

/** Une étape numérotée du mois côté parent : vérifier, déclarer, valider. */
export function Etape({ numero, titre, children }: Props) {
  return (
    <Card style={styles.carte}>
      <View style={styles.entete}>
        <View style={styles.pastille}>
          <AppText variant="caption" color="white" style={styles.numero}>
            {numero}
          </AppText>
        </View>
        <AppText variant="heading" style={styles.titre}>
          {titre}
        </AppText>
      </View>
      {children}
    </Card>
  )
}

const styles = StyleSheet.create({
  carte: { padding: 20, gap: spacing.md },
  entete: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pastille: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  numero: { fontFamily: fonts.semibold },
  titre: { flex: 1, fontSize: 17, lineHeight: 22 }
})
