import type { Contrat } from './types'

export const SEMAINES_ANNEE_COMPLETE = 52
export const SEMAINES_MAX_ANNEE_INCOMPLETE = 46

export function heuresHebdo(contrat: Contrat): number {
  return Object.values(contrat.planning).reduce((total, h) => total + (h ?? 0), 0)
}

export function semainesMensualisees(contrat: Contrat): number {
  if (contrat.type === 'complete') return SEMAINES_ANNEE_COMPLETE
  const semaines = contrat.semainesProgrammees
  if (!semaines || semaines <= 0) {
    throw new Error("Année incomplète : indique le nombre de semaines d'accueil programmées.")
  }
  if (semaines > SEMAINES_MAX_ANNEE_INCOMPLETE) {
    throw new Error(
      `Année incomplète : ${semaines} semaines dépasse le maximum de ${SEMAINES_MAX_ANNEE_INCOMPLETE}. Au-delà, c'est une année complète.`
    )
  }
  return semaines
}

/**
 * Mensualisation : le salaire est lissé sur 12 mois.
 * Heures mensualisées = heures par semaine × semaines ÷ 12.
 */
export function mensualisation(contrat: Contrat): { heures: number; salaire: number } {
  const hebdo = heuresHebdo(contrat)
  // Au-delà de 45 h prévues par semaine, une partie de la mensualisation serait
  // majorée : ce cas n'est pas encore calculé, on refuse plutôt que de se tromper.
  if (hebdo > 45) {
    throw new Error(`Contrat de ${hebdo} h par semaine : les contrats de plus de 45 h ne sont pas encore gérés.`)
  }
  const heures = (hebdo * semainesMensualisees(contrat)) / 12
  return { heures, salaire: heures * contrat.tauxHoraireBrut }
}
