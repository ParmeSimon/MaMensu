import { Tabs } from 'expo-router'
import { onglet, optionsBarreOnglets, renduBarreOnglets, useEspaceBarre } from '@/components/navigation/onglet'
import { EspaceBasContext } from '@/components/ui'

export default function ParentLayout() {
  return (
    <EspaceBasContext.Provider value={useEspaceBarre()}>
      <Tabs screenOptions={optionsBarreOnglets} tabBar={renduBarreOnglets}>
        <Tabs.Screen name="index" options={onglet("Aujourd'hui", 'today-outline')} />
        <Tabs.Screen name="mois" options={onglet('Mois', 'stats-chart-outline')} />
        <Tabs.Screen name="documents" options={onglet('Documents', 'document-text-outline')} />
      </Tabs>
    </EspaceBasContext.Provider>
  )
}
