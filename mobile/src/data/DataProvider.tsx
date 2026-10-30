import type { Journee } from '@mamensu/engine'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ContratEnregistre, DonneesApp, Enfant, Role } from '@/types'
import { aujourdhui } from '@/utils/dates'
import { nouvelId } from '@/utils/id'
import { donneesDemo } from './demo'

// Données de l'appli en mémoire. Les écrans ne passent que par ce contexte :
// le jour où Firebase arrive, seul ce fichier change.

interface DataContextValue extends DonneesApp {
  choisirRole: (role: Role | null) => void
  ajouterEnfant: (enfant: Omit<Enfant, 'id'>, contrat: Omit<ContratEnregistre, 'id' | 'enfantId'>) => void
  enregistrerJournee: (contratId: string, journee: Journee) => void
  pointerArrivee: (contratId: string, heure: string) => void
  annulerArrivee: (contratId: string) => void
  /** Démo : débloque Ma Mensu+ localement, en attendant RevenueCat. */
  activerEssai: () => void
  validerMois: (contratId: string, mois: string) => void
}

/** Clé d'un mois dans `validations`. */
export const cleMois = (contratId: string, mois: string) => `${contratId}:${mois}`

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [donnees, setDonnees] = useState<DonneesApp>(donneesDemo)

  const choisirRole = useCallback((role: Role | null) => setDonnees((d) => ({ ...d, role })), [])

  const ajouterEnfant = useCallback<DataContextValue['ajouterEnfant']>((enfant, contrat) => {
    const enfantId = nouvelId()
    setDonnees((d) => ({
      ...d,
      enfants: [...d.enfants, { ...enfant, id: enfantId }],
      contrats: [...d.contrats, { ...contrat, id: nouvelId(), enfantId }]
    }))
  }, [])

  // Une seule saisie par jour et par contrat : la nouvelle remplace l'ancienne.
  const enregistrerJournee = useCallback((contratId: string, journee: Journee) => {
    setDonnees((d) => {
      const autres = (d.journees[contratId] ?? []).filter((j) => j.date !== journee.date)
      return { ...d, journees: { ...d.journees, [contratId]: [...autres, journee] } }
    })
  }, [])

  const pointerArrivee = useCallback((contratId: string, heure: string) => {
    setDonnees((d) => ({ ...d, arrivees: { ...d.arrivees, [contratId]: heure } }))
  }, [])

  const annulerArrivee = useCallback((contratId: string) => {
    setDonnees((d) => {
      const { [contratId]: _, ...arrivees } = d.arrivees
      return { ...d, arrivees }
    })
  }, [])

  const activerEssai = useCallback(() => setDonnees((d) => ({ ...d, abonne: true })), [])

  const validerMois = useCallback((contratId: string, mois: string) => {
    setDonnees((d) => ({ ...d, validations: { ...d.validations, [cleMois(contratId, mois)]: aujourdhui() } }))
  }, [])

  const value = useMemo(
    () => ({ ...donnees, choisirRole, ajouterEnfant, enregistrerJournee, pointerArrivee, annulerArrivee, activerEssai, validerMois }),
    [donnees, choisirRole, ajouterEnfant, enregistrerJournee, pointerArrivee, annulerArrivee, activerEssai, validerMois]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const value = useContext(DataContext)
  if (!value) throw new Error('useData doit être utilisé dans un DataProvider')
  return value
}
