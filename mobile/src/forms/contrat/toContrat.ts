import type { Contrat, JourSemaine } from '@mamensu/engine'
import { JOURS, type ContratFormValues } from './schema'

/** Majoration au-delà de 45 h par défaut, à confirmer avec la convention collective. */
export const MAJORATION_PAR_DEFAUT = 0.25

/** Valeurs du formulaire → contrat compris par le moteur de calcul. */
export function toContrat(valeurs: ContratFormValues): Contrat {
  const planning: Partial<Record<JourSemaine, number>> = {}
  for (const jour of JOURS) {
    const h = valeurs.planning[jour.cle]
    if (h) planning[jour.numero] = h
  }
  return {
    type: valeurs.type,
    semainesProgrammees: valeurs.type === 'incomplete' ? valeurs.semainesProgrammees : undefined,
    planning,
    tauxHoraireBrut: valeurs.tauxHoraireBrut,
    tauxMajoration: MAJORATION_PAR_DEFAUT,
    indemniteEntretienParJour: valeurs.indemniteEntretienParJour,
    prixRepas: valeurs.prixRepas
  }
}
