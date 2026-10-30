import { Badge } from '@/components/ui'
import { cleMois, useData } from '@/data/DataProvider'
import { libelleJour } from '@/utils/dates'

/** Côté assmat : où en est la famille dans la validation du mois. */
export function Validation({ contratId, mois }: { contratId: string; mois: string }) {
  const { validations } = useData()
  const valideLe = validations[cleMois(contratId, mois)]

  return valideLe ? (
    <Badge statut="success" label={`Validé par la famille le ${libelleJour(valideLe)}`} />
  ) : (
    <Badge statut="warning" label="En attente de validation par la famille" />
  )
}
