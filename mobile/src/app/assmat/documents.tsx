import { EmptyState, Screen } from '@/components/ui'

export default function Documents() {
  return (
    <Screen title="Documents">
      <EmptyState
        title="Aucun document pour l'instant"
        description="Les contrats, avenants et récapitulatifs mensuels seront rangés ici automatiquement."
      />
    </Screen>
  )
}
