/** Jour de la semaine, lundi = 1 … dimanche = 7 (norme ISO). */
export type JourSemaine = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** Période incluse, dates au format AAAA-MM-JJ. */
export interface Periode {
  du: string
  au: string
}

export interface Contrat {
  /**
   * Année complète : l'enfant est accueilli toute l'année, les congés de
   * l'assmat sont inclus dans la mensualisation (52 semaines).
   * Année incomplète : seules les semaines d'accueil programmées sont
   * mensualisées (46 au plus), les congés payés s'ajoutent à part.
   */
  type: 'complete' | 'incomplete'
  /** Semaines d'accueil programmées sur 12 mois. Ignoré en année complète. */
  semainesProgrammees?: number
  /** Heures prévues pour chaque jour de la semaine. Ex. { 1: 9, 2: 9, 4: 9 }. */
  planning: Partial<Record<JourSemaine, number>>
  /** Taux horaire brut, en euros. */
  tauxHoraireBrut: number
  /** Majoration des heures au-delà de 45 h dans la semaine (0.25 = 25 %). */
  tauxMajoration: number
  /** Indemnité d'entretien par jour d'accueil, en euros. */
  indemniteEntretienParJour: number
  /** Prix d'un repas fourni par l'assmat, en euros (0 si les parents le fournissent). */
  prixRepas: number
  /** Semaines sans accueil prévues au contrat (année incomplète). */
  periodesNonProgrammees?: Periode[]
}

/**
 * Ce qui s'est passé un jour donné. Un jour absent de la liste est un jour
 * normal : l'enfant est venu les heures prévues au planning.
 */
export type Journee =
  | { date: string; statut: 'present'; heures: number; repas?: number }
  /** Absence non rémunérée : retirée du salaire du mois. */
  | { date: string; statut: 'absence_deduite' }
  /** Absence rémunérée : aucun effet sur le salaire. */
  | { date: string; statut: 'absence_payee' }

/** Une ligne du détail du calcul, telle qu'affichée à l'assmat et aux parents. */
export interface LigneCalcul {
  libelle: string
  detail: string
  montant: number
}

export interface ResultatMois {
  /** Mois calculé, au format AAAA-MM. */
  mois: string
  heuresMensualisees: number
  salaireMensualise: number
  /** Heures prévues au planning sur les jours de ce mois. */
  heuresPrevues: number
  heuresAbsenceDeduites: number
  deductionAbsences: number
  heuresComplementaires: number
  heuresMajorees: number
  salaireBrut: number
  joursActivite: number
  indemnitesEntretien: number
  indemnitesRepas: number
  /** Salaire brut + indemnités d'entretien + repas. */
  totalBrutAvecIndemnites: number
  lignes: LigneCalcul[]
}
