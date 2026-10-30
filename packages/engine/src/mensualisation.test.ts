import { describe, expect, it } from 'vitest'
import { mensualisation } from './mensualisation'
import type { Contrat } from './types'

const base: Contrat = {
  type: 'complete',
  planning: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 },
  tauxHoraireBrut: 4.2,
  tauxMajoration: 0.25,
  indemniteEntretienParJour: 0,
  prixRepas: 0
}

describe('mensualisation', () => {
  it('année complète : 40 h × 52 ÷ 12 = 173,33 h', () => {
    const m = mensualisation(base)
    expect(m.heures).toBeCloseTo(173.333, 3)
    expect(m.salaire).toBeCloseTo(728, 2)
  })

  it('année incomplète : 40 h × 46 ÷ 12 = 153,33 h', () => {
    const m = mensualisation({ ...base, type: 'incomplete', semainesProgrammees: 46 })
    expect(m.heures).toBeCloseTo(153.333, 3)
    expect(m.salaire).toBeCloseTo(644, 2)
  })

  it('refuse une année incomplète de plus de 46 semaines', () => {
    expect(() => mensualisation({ ...base, type: 'incomplete', semainesProgrammees: 47 })).toThrow(/46/)
  })

  it('refuse une année incomplète sans nombre de semaines', () => {
    expect(() => mensualisation({ ...base, type: 'incomplete' })).toThrow(/semaines/)
  })

  it('refuse un contrat de plus de 45 h par semaine', () => {
    expect(() => mensualisation({ ...base, planning: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 } })).toThrow(/45/)
  })
})
