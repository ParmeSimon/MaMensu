import type { JourSemaine, Periode } from './types'

// Les dates circulent en texte AAAA-MM-JJ et sont manipulées en UTC : un
// calcul de paie ne doit jamais dépendre du fuseau horaire du téléphone.

const JOUR_MS = 86_400_000

export function versDate(texte: string): Date {
  const [a, m, j] = texte.split('-').map(Number)
  if (!a || !m || !j) throw new Error(`Date invalide : ${texte}`)
  return new Date(Date.UTC(a, m - 1, j))
}

export function versTexte(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function ajouterJours(texte: string, n: number): string {
  return versTexte(new Date(versDate(texte).getTime() + n * JOUR_MS))
}

export function jourSemaine(texte: string): JourSemaine {
  const j = versDate(texte).getUTCDay()
  return (j === 0 ? 7 : j) as JourSemaine
}

/** Lundi de la semaine qui contient cette date. */
export function lundiDeLaSemaine(texte: string): string {
  return ajouterJours(texte, 1 - jourSemaine(texte))
}

/** Tous les jours d'un mois AAAA-MM. */
export function joursDuMois(mois: string): string[] {
  const [a, m] = mois.split('-').map(Number)
  if (!a || !m) throw new Error(`Mois invalide : ${mois}`)
  const nb = new Date(Date.UTC(a, m, 0)).getUTCDate()
  return Array.from({ length: nb }, (_, i) => `${mois}-${String(i + 1).padStart(2, '0')}`)
}

export function dansPeriodes(texte: string, periodes: Periode[] = []): boolean {
  return periodes.some((p) => texte >= p.du && texte <= p.au)
}
