import { StyleSheet, View } from 'react-native'
import { AppText, Avatar, Badge, Card, EmptyState, Screen } from '@/components/ui'
import { useAccueilsDuJour } from '@/hooks/useAccueilsDuJour'
import { spacing } from '@/theme'
import { aujourdhui, libelleJour } from '@/utils/dates'
import { heures } from '@/utils/format'

// Suivi en direct de la journée : arrivée et départ, tels que l'assmat les pointe.
// Démo : le parent voit tous les enfants. Avec les comptes, il ne verra que les siens.
export default function AujourdhuiParent() {
  const date = aujourdhui()
  const accueils = useAccueilsDuJour(date)

  return (
    <Screen title="Aujourd'hui" subtitle={libelleJour(date)}>
      {accueils.length === 0 ? (
        <EmptyState title="Pas d'accueil prévu aujourd'hui" description="Les heures d'arrivée et de départ s'affichent ici en direct." />
      ) : (
        accueils.map(({ enfant, contrat, arrivee, heuresFaites, heuresPrevues }) => (
          <Card key={contrat.id}>
            <View style={styles.ligne}>
              <Avatar prenom={enfant.prenom} />
              <View style={styles.nom}>
                <AppText variant="heading">{enfant.prenom}</AppText>
                <AppText variant="label" color="textMuted">
                  {heures(heuresPrevues)} prévues
                </AppText>
              </View>
              {heuresFaites !== undefined ? (
                <Badge statut="success" label={`Reparti, ${heures(heuresFaites)}`} style={styles.centre} />
              ) : arrivee ? (
                <Badge statut="warning" label={`Arrivé à ${arrivee}`} style={styles.centre} />
              ) : (
                <Badge label="Pas encore arrivé" style={styles.centre} />
              )}
            </View>
          </Card>
        ))
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nom: { flex: 1 },
  centre: { alignSelf: 'center' }
})
