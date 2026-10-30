import { calculerMois, type ResultatMois } from '@mamensu/engine'
import { useMemo } from 'react'
import { useData } from '@/data/DataProvider'
import type { ContratEnregistre } from '@/types'

/** Calcul du mois pour un contrat, recalculé à chaque saisie. */
export function useMois(contratId: string, mois: string): ResultatMois | null {
  const { contrats, journees } = useData()
  return useMemo(() => {
    const enregistre = contrats.find((c) => c.id === contratId)
    if (!enregistre) return null
    return calculerMois(enregistre.contrat, mois, journees[contratId] ?? [])
  }, [contrats, journees, contratId, mois])
}

/** Calcul du mois pour tous les contrats, avec le total cumulé. */
export function useMoisDeTous(mois: string): { recaps: { contrat: ContratEnregistre; resultat: ResultatMois }[]; total: number } {
  const { contrats, journees } = useData()
  return useMemo(() => {
    const recaps = contrats.map((contrat) => ({ contrat, resultat: calculerMois(contrat.contrat, mois, journees[contrat.id] ?? []) }))
    return { recaps, total: recaps.reduce((somme, r) => somme + r.resultat.totalBrutAvecIndemnites, 0) }
  }, [contrats, journees, mois])
}
