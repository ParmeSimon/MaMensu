import { calculerMois, type ResultatMois } from '@mamensu/engine'
import { useMemo } from 'react'
import { cleMois, useData } from '@/data/DataProvider'
import type { ContratEnregistre } from '@/types'
import { moisCourant, moisEntre } from '@/utils/dates'

export interface MoisHistorique {
  contrat: ContratEnregistre
  resultat: ResultatMois
  /** Date de validation par la famille, si le mois est validé. */
  valideLe?: string
}

export interface RecapAnnee {
  annee: string
  mois: number
  salaireBrut: number
  indemnitesEntretien: number
  indemnitesRepas: number
  total: number
}

/** Tous les mois de tous les contrats depuis leur début, du plus récent au plus ancien, et le cumul de l'année en cours. */
export function useHistorique(): { historique: MoisHistorique[]; annee: RecapAnnee } {
  const { contrats, journees, validations } = useData()
  return useMemo(() => {
    const courant = moisCourant()
    const historique = contrats
      .flatMap((contrat) =>
        moisEntre(contrat.debut, courant).map((mois) => ({
          contrat,
          resultat: calculerMois(contrat.contrat, mois, journees[contrat.id] ?? []),
          valideLe: validations[cleMois(contrat.id, mois)]
        }))
      )
      .sort((a, b) => b.resultat.mois.localeCompare(a.resultat.mois))

    const annee = courant.slice(0, 4)
    const deLAnnee = historique.filter((h) => h.resultat.mois.startsWith(annee)).map((h) => h.resultat)
    const somme = (f: (r: ResultatMois) => number) => deLAnnee.reduce((t, r) => t + f(r), 0)
    return {
      historique,
      annee: {
        annee,
        mois: new Set(deLAnnee.map((r) => r.mois)).size,
        salaireBrut: somme((r) => r.salaireBrut),
        indemnitesEntretien: somme((r) => r.indemnitesEntretien),
        indemnitesRepas: somme((r) => r.indemnitesRepas),
        total: somme((r) => r.totalBrutAvecIndemnites)
      }
    }
  }, [contrats, journees, validations])
}
