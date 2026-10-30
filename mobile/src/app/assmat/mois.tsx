import { router } from 'expo-router'
import { Fragment } from 'react'
import { RecapMois } from '@/components/mois/RecapMois'
import { Validation } from '@/components/mois/Validation'
import { AppText, Card, EmptyState, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { useMoisDeTous } from '@/hooks/useMois'
import { libelleMois, moisCourant } from '@/utils/dates'
import { euros } from '@/utils/format'

export default function Mois() {
  const { enfants } = useData()
  const { recaps, total } = useMoisDeTous(moisCourant())

  return (
    <Screen title="Mois" subtitle={libelleMois(moisCourant())}>
      {recaps.length === 0 ? (
        <EmptyState
          title="Rien à calculer pour l'instant"
          description="Le calcul du mois apparaît dès qu'un contrat est créé."
          action={{ label: 'Créer un contrat', onPress: () => router.push('/assmat/enfants/nouveau') }}
        />
      ) : (
        <>
          <Card variant="highlight">
            <AppText variant="caption" color="textMuted">
              Total brut du mois, indemnités comprises
            </AppText>
            <AppText variant="amount" color="primary">
              {euros(total)}
            </AppText>
            <AppText variant="caption" color="textMuted">
              {recaps.length > 1 ? `${recaps.length} contrats` : '1 contrat'}
            </AppText>
          </Card>
          {recaps.map(({ contrat, resultat }, index) => (
            <Fragment key={contrat.id}>
              <RecapMois
                titre={enfants.find((e) => e.id === contrat.enfantId)?.prenom ?? 'Contrat'}
                resultat={resultat}
                replie={index > 0}
              />
              <Validation contratId={contrat.id} mois={resultat.mois} />
            </Fragment>
          ))}
        </>
      )}
    </Screen>
  )
}
