import { Redirect } from 'expo-router'
import { useData } from '@/data/DataProvider'

/** Point d'entrée : envoie chacun vers son espace selon son profil. */
export default function Index() {
  const { role } = useData()
  if (role === 'assmat') return <Redirect href="/assmat" />
  if (role === 'parent') return <Redirect href="/parent" />
  return <Redirect href="/bienvenue" />
}
