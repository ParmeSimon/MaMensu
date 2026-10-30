import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { AppText, Button, Card } from '@/components/ui'
import { colors, spacing } from '@/theme'

interface Props {
  titre: string
  description: string
}

/** Fonction de Ma Mensu+ pas encore débloquée : dit ce qu'elle apporte et mène à l'offre. */
export function Verrou({ titre, description }: Props) {
  return (
    <Card>
      <View style={styles.titre}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
        <AppText variant="heading" style={styles.texte}>
          {titre}
        </AppText>
      </View>
      <AppText color="textMuted">{description}</AppText>
      <Button label="Découvrir Ma Mensu+" onPress={() => router.push('/abonnement')} />
    </Card>
  )
}

const styles = StyleSheet.create({
  titre: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  texte: { flex: 1 }
})
