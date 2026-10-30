import { StyleSheet, View } from 'react-native'
import { AppText, Avatar, Badge, Button, Card } from '@/components/ui'
import type { AccueilDuJour } from '@/hooks/useAccueilsDuJour'
import { spacing } from '@/theme'
import { heures } from '@/utils/format'

interface Props {
  accueil: AccueilDuJour
  onArrivee: () => void
  onDepart: () => void
}

/** Un enfant attendu aujourd'hui : un bouton pour l'arrivée, puis un pour le départ. */
export function PointageCard({ accueil, onArrivee, onDepart }: Props) {
  const { enfant, heuresPrevues, arrivee, heuresFaites } = accueil

  return (
    <Card style={styles.carte}>
      <View style={styles.entete}>
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
          <Badge label="Pas encore là" style={styles.centre} />
        )}
      </View>

      {heuresFaites !== undefined ? null : arrivee ? (
        <Button label="Parti" onPress={onDepart} />
      ) : (
        <Button variant="secondary" label="Arrivé" onPress={onArrivee} />
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  carte: { gap: spacing.lg },
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nom: { flex: 1 },
  centre: { alignSelf: 'center' }
})
