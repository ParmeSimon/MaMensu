import type { DonneesApp } from '@/types'

// Données d'exemple pour voir les écrans remplis tant qu'il n'y a pas de base.
export const donneesDemo: DonneesApp = {
  role: null,
  enfants: [
    { id: 'leo', prenom: 'Léo', nomFamille: 'Martin' },
    { id: 'jade', prenom: 'Jade', nomFamille: 'Bernard' }
  ],
  contrats: [
    {
      id: 'contrat-leo',
      enfantId: 'leo',
      debut: '2026-09-01',
      contrat: {
        type: 'complete',
        planning: { 1: 9, 2: 9, 4: 9 },
        tauxHoraireBrut: 4.2,
        tauxMajoration: 0.25,
        indemniteEntretienParJour: 3.5,
        prixRepas: 4
      }
    },
    {
      id: 'contrat-jade',
      enfantId: 'jade',
      debut: '2026-09-01',
      contrat: {
        type: 'incomplete',
        semainesProgrammees: 40,
        planning: { 1: 8, 2: 8, 4: 8, 5: 8 },
        tauxHoraireBrut: 4.5,
        tauxMajoration: 0.25,
        indemniteEntretienParJour: 3.5,
        prixRepas: 0
      }
    }
  ],
  journees: {},
  arrivees: {},
  abonne: false,
  // Septembre déjà validé, pour voir un historique rempli.
  validations: { 'contrat-leo:2026-09': '2026-10-02', 'contrat-jade:2026-09': '2026-10-03' }
}
