import { z } from 'zod'

export const JOURS = [
  { cle: 'lundi', label: 'Lundi', numero: 1 },
  { cle: 'mardi', label: 'Mardi', numero: 2 },
  { cle: 'mercredi', label: 'Mercredi', numero: 3 },
  { cle: 'jeudi', label: 'Jeudi', numero: 4 },
  { cle: 'vendredi', label: 'Vendredi', numero: 5 },
  { cle: 'samedi', label: 'Samedi', numero: 6 },
  { cle: 'dimanche', label: 'Dimanche', numero: 7 }
] as const

const heuresDuJour = z.number().min(0, 'Pas de nombre négatif').max(24, '24 h au plus').optional()
const montant = (message: string) => z.number({ required_error: message, invalid_type_error: message })

export const contratSchema = z
  .object({
    prenomEnfant: z.string().trim().min(1, "Indique le prénom de l'enfant"),
    nomFamille: z.string().trim().min(1, 'Indique le nom de la famille'),
    debut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date au format AAAA-MM-JJ, par exemple 2026-09-01'),
    type: z.enum(['complete', 'incomplete']),
    semainesProgrammees: z
      .number()
      .int('Indique un nombre entier de semaines')
      .min(1, 'Au moins 1 semaine')
      .max(46, '46 semaines au plus en année incomplète')
      .optional(),
    planning: z.object({
      lundi: heuresDuJour,
      mardi: heuresDuJour,
      mercredi: heuresDuJour,
      jeudi: heuresDuJour,
      vendredi: heuresDuJour,
      samedi: heuresDuJour,
      dimanche: heuresDuJour
    }),
    tauxHoraireBrut: montant('Indique le taux horaire brut').positive('Le taux doit être supérieur à 0'),
    indemniteEntretienParJour: montant("Indique l'indemnité d'entretien (0 si aucune)").min(0),
    prixRepas: montant('Indique le prix du repas (0 si les parents le fournissent)').min(0)
  })
  .superRefine((valeurs, ctx) => {
    if (valeurs.type === 'incomplete' && valeurs.semainesProgrammees === undefined) {
      ctx.addIssue({ code: 'custom', path: ['semainesProgrammees'], message: "Indique le nombre de semaines d'accueil par an" })
    }
    const total = Object.values(valeurs.planning).reduce<number>((t, h) => t + (h ?? 0), 0)
    if (total === 0) {
      ctx.addIssue({ code: 'custom', path: ['planning'], message: "Indique les heures d'au moins un jour" })
    } else if (total > 45) {
      ctx.addIssue({ code: 'custom', path: ['planning'], message: `${total} h par semaine : 45 h au plus pour l'instant` })
    }
  })

export type ContratFormValues = z.infer<typeof contratSchema>
