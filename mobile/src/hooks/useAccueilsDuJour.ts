import { heuresPrevues } from '@mamensu/engine'
import { useMemo } from 'react'
import { useData } from '@/data/DataProvider'
import type { ContratEnregistre, Enfant } from '@/types'

export interface AccueilDuJour {
  enfant: Enfant
  contrat: ContratEnregistre
  heuresPrevues: number
  arrivee?: string
  /** Heures déjà saisies aujourd'hui (enfant reparti). */
  heuresFaites?: number
}

/** Enfants attendus à cette date, avec leur pointage en cours. */
export function useAccueilsDuJour(date: string): AccueilDuJour[] {
  const { enfants, contrats, journees, arrivees } = useData()
  return useMemo(
    () =>
      contrats.flatMap((contrat) => {
        const enfant = enfants.find((e) => e.id === contrat.enfantId)
        const prevues = heuresPrevues(contrat.contrat, date)
        if (!enfant || prevues === 0) return []
        const saisie = journees[contrat.id]?.find((j) => j.date === date)
        return [
          {
            enfant,
            contrat,
            heuresPrevues: prevues,
            arrivee: arrivees[contrat.id],
            heuresFaites: saisie?.statut === 'present' ? saisie.heures : undefined
          }
        ]
      }),
    [enfants, contrats, journees, arrivees, date]
  )
}
