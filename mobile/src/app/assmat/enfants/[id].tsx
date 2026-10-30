import { heuresHebdo, mensualisation } from '@mamensu/engine'
import { useLocalSearchParams } from 'expo-router'
import { RecapMois } from '@/components/mois/RecapMois'
import { AppText, Card, EmptyState, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { useMois } from '@/hooks/useMois'
import { moisCourant } from '@/utils/dates'
import { euros, heures } from '@/utils/format'

export default function FicheContrat() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { contrats, enfants } = useData()
  const enregistre = contrats.find((c) => c.id === id)
  const enfant = enfants.find((e) => e.id === enregistre?.enfantId)
  const resultat = useMois(id, moisCourant())

  if (!enregistre || !enfant) {
    return (
      <Screen>
        <EmptyState title="Contrat introuvable" description="Il a peut-être été supprimé. Reviens à la liste des enfants." />
      </Screen>
    )
  }

  const { contrat } = enregistre
  const mensu = mensualisation(contrat)

  return (
    <Screen title={enfant.prenom} subtitle={`Famille ${enfant.nomFamille}, depuis le ${enregistre.debut}`}>
      <Card>
        <AppText variant="heading">Le contrat</AppText>
        <AppText>
          {contrat.type === 'complete' ? 'Année complète' : `Année incomplète, ${contrat.semainesProgrammees} semaines`}
        </AppText>
        <AppText>{heures(heuresHebdo(contrat))} par semaine, {euros(contrat.tauxHoraireBrut)} brut de l'heure</AppText>
        <AppText>
          Mensualisation : {heures(mensu.heures)} soit {euros(mensu.salaire)} par mois
        </AppText>
      </Card>
      {resultat ? <RecapMois titre="Ce mois-ci" resultat={resultat} /> : null}
    </Screen>
  )
}
