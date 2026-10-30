import { Ionicons } from '@expo/vector-icons'
import { heuresHebdo } from '@mamensu/engine'
import { router } from 'expo-router'
import { Fragment } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AppText, Avatar, Button, Card, EmptyState, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { colors, spacing } from '@/theme'
import { heures } from '@/utils/format'

export default function Enfants() {
  const { enfants, contrats } = useData()
  const nouveau = () => router.push('/assmat/enfants/nouveau')

  return (
    <Screen
      title="Enfants"
      subtitle={contrats.length > 1 ? `${contrats.length} contrats actifs` : undefined}
      footer={enfants.length > 0 ? <Button label="Nouveau contrat" onPress={nouveau} /> : undefined}
    >
      {enfants.length === 0 ? (
        <EmptyState
          title="Aucun enfant pour l'instant"
          description="Crée un contrat : l'appli calcule la mensualisation et prépare chaque mois."
          action={{ label: 'Nouveau contrat', onPress: nouveau }}
        />
      ) : (
        <Card style={styles.liste}>
          {contrats.map((contrat, index) => {
            const enfant = enfants.find((e) => e.id === contrat.enfantId)
            if (!enfant) return null
            const annee = contrat.contrat.type === 'complete' ? 'année complète' : `${contrat.contrat.semainesProgrammees} semaines`
            return (
              <Fragment key={contrat.id}>
                {index > 0 ? <View style={styles.separateur} /> : null}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push(`/assmat/enfants/${contrat.id}`)}
                  style={({ pressed }) => [styles.ligne, pressed && styles.appuye]}
                >
                  <Avatar prenom={enfant.prenom} taille={44} />
                  <View style={styles.texte}>
                    <AppText variant="heading">{enfant.prenom}</AppText>
                    <AppText variant="caption" color="textMuted">
                      Famille {enfant.nomFamille} · {heures(heuresHebdo(contrat.contrat))}/sem. · {annee}
                    </AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
              </Fragment>
            )
          })}
        </Card>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  liste: { padding: 0, gap: 0, overflow: 'hidden' },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: spacing.lg, paddingHorizontal: 20 },
  appuye: { backgroundColor: 'rgba(234,240,255,0.6)' },
  texte: { flex: 1, gap: 2 },
  separateur: { height: 1, backgroundColor: colors.border, marginLeft: 78 }
})
