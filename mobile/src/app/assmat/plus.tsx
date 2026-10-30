import { router } from 'expo-router'
import { AppText, Button, Card, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'

export default function Plus() {
  const { choisirRole } = useData()

  return (
    <Screen title="Plus">
      <Card>
        <AppText variant="heading">Impôts</AppText>
        <AppText color="textMuted">Le récapitulatif fiscal de l'année arrivera avant la période des déclarations.</AppText>
      </Card>
      <Button
        variant="secondary"
        label="Changer de profil"
        onPress={() => {
          choisirRole(null)
          router.replace('/bienvenue')
        }}
      />
    </Screen>
  )
}
