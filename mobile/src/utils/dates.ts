// Dates « humaines » de l'appli, à l'heure du téléphone. Le moteur, lui,
// travaille sur du texte AAAA-MM-JJ et ne dépend d'aucun fuseau.

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

const deuxChiffres = (n: number) => String(n).padStart(2, '0')

export function aujourdhui(): string {
  const d = new Date()
  return `${d.getFullYear()}-${deuxChiffres(d.getMonth() + 1)}-${deuxChiffres(d.getDate())}`
}

export function moisCourant(): string {
  return aujourdhui().slice(0, 7)
}

export function heureActuelle(): string {
  const d = new Date()
  return `${deuxChiffres(d.getHours())}:${deuxChiffres(d.getMinutes())}`
}

/** Durée entre deux heures HH:MM, en heures, arrondie au quart d'heure. */
export function dureeEnHeures(debut: string, fin: string): number {
  const minutes = (h: string) => {
    const [hh = 0, mm = 0] = h.split(':').map(Number)
    return hh * 60 + mm
  }
  const duree = Math.max(0, minutes(fin) - minutes(debut)) / 60
  return Math.round(duree * 4) / 4
}

/** « 2026-11 » → « novembre 2026 ». */
export function libelleMois(mois: string): string {
  const [annee, m] = mois.split('-').map(Number)
  return `${MOIS[(m ?? 1) - 1]} ${annee}`
}

/** « 2026-11-02 » → « lundi 2 novembre ». */
export function libelleJour(date: string): string {
  const [a = 0, m = 1, j = 1] = date.split('-').map(Number)
  const jourSemaine = new Date(a, m - 1, j).getDay()
  return `${JOURS[jourSemaine]} ${j} ${MOIS[m - 1]}`
}

/** Mois de `debut` à `fin` inclus, du plus récent au plus ancien. Ex. (« 2026-09 », « 2026-11 ») → [« 2026-11 », « 2026-10 », « 2026-09 »]. */
export function moisEntre(debut: string, fin: string): string[] {
  const liste: string[] = []
  let [a = 0, m = 1] = debut.split('-').map(Number)
  for (let mois = debut.slice(0, 7); mois <= fin; mois = `${a}-${deuxChiffres(m)}`) {
    liste.push(mois)
    m += 1
    if (m > 12) {
      m = 1
      a += 1
    }
  }
  return liste.reverse()
}
