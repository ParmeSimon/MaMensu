import { describe, expect, it } from 'vitest'
import { calculerMois } from './mois'
import type { Contrat } from './types'

// Lundi, mardi et jeudi, 9 h par jour : l'exemple du forum (27 h par semaine).
// Novembre 2026 : 5 lundis, 4 mardis, 4 jeudis = 13 jours, 117 h prévues.
const contrat: Contrat = {
  type: 'complete',
  planning: { 1: 9, 2: 9, 4: 9 },
  tauxHoraireBrut: 4.2,
  tauxMajoration: 0.25,
  indemniteEntretienParJour: 3.5,
  prixRepas: 4
}

describe('calculerMois', () => {
  it('mois sans imprévu : le salaire mensualisé, rien de plus', () => {
    const r = calculerMois(contrat, '2026-11')
    expect(r.heuresMensualisees).toBe(117) // 27 × 52 ÷ 12
    expect(r.salaireMensualise).toBe(491.4)
    expect(r.heuresPrevues).toBe(117)
    expect(r.joursActivite).toBe(13)
    expect(r.deductionAbsences).toBe(0)
    expect(r.heuresComplementaires).toBe(0)
    expect(r.salaireBrut).toBe(491.4)
    expect(r.indemnitesEntretien).toBe(45.5) // 13 × 3,50
    expect(r.totalBrutAvecIndemnites).toBe(536.9)
  })

  it("absence non rémunérée : déduite au prorata des heures prévues du mois", () => {
    const r = calculerMois(contrat, '2026-11', [{ date: '2026-11-10', statut: 'absence_deduite' }])
    expect(r.heuresAbsenceDeduites).toBe(9)
    expect(r.deductionAbsences).toBe(37.8) // 491,40 × 9 ÷ 117
    expect(r.salaireBrut).toBe(453.6)
    expect(r.joursActivite).toBe(12)
  })

  it('absence rémunérée : aucun effet sur le salaire, pas d\'indemnité ce jour-là', () => {
    const r = calculerMois(contrat, '2026-11', [{ date: '2026-11-10', statut: 'absence_payee' }])
    expect(r.salaireBrut).toBe(491.4)
    expect(r.joursActivite).toBe(12)
  })

  it('heures en plus sous 45 h : heures complémentaires au taux normal', () => {
    const r = calculerMois(contrat, '2026-11', [{ date: '2026-11-12', statut: 'present', heures: 11 }])
    expect(r.heuresComplementaires).toBe(2)
    expect(r.heuresMajorees).toBe(0)
    expect(r.salaireBrut).toBe(499.8) // 491,40 + 2 × 4,20
  })

  it('au-delà de 45 h dans la semaine : heures majorées', () => {
    // Semaine du 16 novembre : 12 + 12 + 11 (mercredi, hors planning) + 12 = 47 h pour 27 h prévues.
    const r = calculerMois(contrat, '2026-11', [
      { date: '2026-11-16', statut: 'present', heures: 12 },
      { date: '2026-11-17', statut: 'present', heures: 12 },
      { date: '2026-11-18', statut: 'present', heures: 11 },
      { date: '2026-11-19', statut: 'present', heures: 12 }
    ])
    expect(r.heuresComplementaires).toBe(18)
    expect(r.heuresMajorees).toBe(2)
    expect(r.salaireBrut).toBe(577.5) // 491,40 + 18 × 4,20 + 2 × 5,25
    expect(r.joursActivite).toBe(14)
  })

  it('semaine à cheval sur deux mois : les heures en plus vont au mois où elles sont faites', () => {
    // Semaine du lundi 30 novembre au dimanche 6 décembre.
    const journees = [{ date: '2026-12-03', statut: 'present' as const, heures: 12 }]
    expect(calculerMois(contrat, '2026-11', journees).heuresComplementaires).toBe(0)
    expect(calculerMois(contrat, '2026-12', journees).heuresComplementaires).toBe(3)
  })

  it('année incomplète : une semaine non programmée ne compte ni comme prévue ni comme absence', () => {
    const incomplete: Contrat = {
      ...contrat,
      type: 'incomplete',
      semainesProgrammees: 40,
      periodesNonProgrammees: [{ du: '2026-11-16', au: '2026-11-22' }]
    }
    const r = calculerMois(incomplete, '2026-11')
    expect(r.salaireMensualise).toBe(378) // 27 × 40 ÷ 12 × 4,20
    expect(r.heuresPrevues).toBe(90)
    expect(r.joursActivite).toBe(10)
    expect(r.deductionAbsences).toBe(0)
  })

  it('accueil pendant une semaine non programmée : heures complémentaires', () => {
    const incomplete: Contrat = {
      ...contrat,
      type: 'incomplete',
      semainesProgrammees: 40,
      periodesNonProgrammees: [{ du: '2026-11-16', au: '2026-11-22' }]
    }
    const r = calculerMois(incomplete, '2026-11', [{ date: '2026-11-17', statut: 'present', heures: 9 }])
    expect(r.heuresComplementaires).toBe(9)
  })

  it('repas comptés à partir des journées saisies', () => {
    const r = calculerMois(contrat, '2026-11', [
      { date: '2026-11-02', statut: 'present', heures: 9, repas: 1 },
      { date: '2026-11-03', statut: 'present', heures: 9, repas: 1 }
    ])
    expect(r.indemnitesRepas).toBe(8)
  })

  it('le détail ligne par ligne retombe exactement sur le total', () => {
    const r = calculerMois(contrat, '2026-11', [
      { date: '2026-11-03', statut: 'absence_deduite' },
      { date: '2026-11-12', statut: 'present', heures: 11, repas: 1 }
    ])
    const somme = r.lignes.reduce((t, l) => t + l.montant, 0)
    expect(Math.round(somme * 100) / 100).toBe(r.totalBrutAvecIndemnites)
    expect(r.lignes.map((l) => l.libelle)).toEqual([
      'Salaire mensualisé',
      'Absences déduites',
      'Heures complémentaires',
      "Indemnités d'entretien",
      'Repas'
    ])
    expect(r.lignes[0]!.detail).toBe('27 h × 52 semaines ÷ 12 = 117 h × 4,20 €')
  })
})
