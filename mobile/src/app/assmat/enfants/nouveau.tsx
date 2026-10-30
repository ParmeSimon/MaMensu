import { router } from 'expo-router'
import { Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { ContratForm } from '@/forms/contrat/ContratForm'
import type { ContratFormValues } from '@/forms/contrat/schema'
import { toContrat } from '@/forms/contrat/toContrat'

export default function NouveauContrat() {
  const { ajouterEnfant } = useData()

  const creer = (valeurs: ContratFormValues) => {
    ajouterEnfant(
      { prenom: valeurs.prenomEnfant, nomFamille: valeurs.nomFamille },
      { debut: valeurs.debut, contrat: toContrat(valeurs) }
    )
    router.back()
  }

  return (
    <Screen>
      <ContratForm onSubmit={creer} />
    </Screen>
  )
}
