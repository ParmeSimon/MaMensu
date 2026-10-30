import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { PointageCard } from '@/components/pointage/PointageCard'
import { AppText, Card, EmptyState, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { useAccueilsDuJour } from '@/hooks/useAccueilsDuJour'
import { spacing } from '@/theme'
import { aujourdhui, dureeEnHeures, heureActuelle, libelleJour } from '@/utils/dates'
import { heures } from '@/utils/format'

export default function Aujourdhui() {
  const date = aujourdhui()
  const accueils = useAccueilsDuJour(date)
  const { pointerArrivee, annulerArrivee, enregistrerJournee } = useData()

  const depart = (contratId: string, arrivee: string) => {
    enregistrerJournee(contratId, { date, statut: 'present', heures: dureeEnHeures(arrivee, heureActuelle()) })
    annulerArrivee(contratId)
  }

  return (
    <Screen title="Aujourd'hui" subtitle={libelleJour(date)}>
      {accueils.length === 0 ? (
        <EmptyState
          title="Aucun enfant prévu aujourd'hui"
          description="Les enfants apparaissent ici les jours prévus dans leur contrat."
          action={{ label: 'Voir les enfants', onPress: () => router.push('/assmat/enfants') }}
        />
      ) : (
        <>
          <View style={styles.tuiles}>
            <Card variant="tint" style={styles.tuile}>
              <AppText variant="caption" color="textMuted">
                Enfants prévus
              </AppText>
              <AppText variant="title">{accueils.length}</AppText>
            </Card>
            <Card variant="tint" style={styles.tuile}>
              <AppText variant="caption" color="textMuted">
                Heures prévues
              </AppText>
              <AppText variant="title">{heures(accueils.reduce((somme, a) => somme + a.heuresPrevues, 0))}</AppText>
            </Card>
          </View>
          {accueils.map((accueil) => (
            <PointageCard
              key={accueil.contrat.id}
              accueil={accueil}
              onArrivee={() => pointerArrivee(accueil.contrat.id, heureActuelle())}
              onDepart={() => accueil.arrivee && depart(accueil.contrat.id, accueil.arrivee)}
            />
          ))}
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  tuiles: { flexDirection: 'row', gap: spacing.md },
  tuile: { flex: 1 }
})
