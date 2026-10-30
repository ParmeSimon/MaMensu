import type { Contrat, Journee } from '@mamensu/engine'

export type Role = 'assmat' | 'parent'

export interface Enfant {
  id: string
  prenom: string
  nomFamille: string
}

export interface ContratEnregistre {
  id: string
  enfantId: string
  /** Date de début du contrat, AAAA-MM-JJ. */
  debut: string
  contrat: Contrat
}

export interface DonneesApp {
  role: Role | null
  enfants: Enfant[]
  contrats: ContratEnregistre[]
  /** Journées saisies, par identifiant de contrat. */
  journees: Record<string, Journee[]>
  /** Heure d'arrivée du jour (HH:MM) pour les enfants arrivés et pas encore partis. */
  arrivees: Record<string, string>
  /** Famille abonnée à Ma Mensu+ (ou en mois d'essai). Démo : en attendant RevenueCat. */
  abonne: boolean
  /** Mois validés par la famille : clé `contratId:AAAA-MM`, valeur = date de validation AAAA-MM-JJ. */
  validations: Record<string, string>
}
