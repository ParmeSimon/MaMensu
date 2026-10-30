/** Identifiant local, en attendant ceux de la base de données. */
export function nouvelId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
