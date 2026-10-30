// Mise en forme française des nombres dans le détail du calcul.

const ESPACE_INSECABLE = ' '

export function arrondi(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** 1079.9 → « 1 079,90 € », avec une espace insécable entre les milliers. */
export function euros(n: number): string {
  const [entier = '0', decimales] = arrondi(n).toFixed(2).split('.')
  const milliers = entier.replace(/\B(?=(\d{3})+(?!\d))/g, ESPACE_INSECABLE)
  return `${milliers},${decimales} €`
}

/** 173.333 → « 173,33 h », 9 → « 9 h ». */
export function heures(n: number): string {
  const texte = Number.isInteger(arrondi(n)) ? String(arrondi(n)) : arrondi(n).toFixed(2)
  return `${texte.replace('.', ',')} h`
}
