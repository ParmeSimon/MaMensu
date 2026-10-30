import { Geist_400Regular, Geist_500Medium, Geist_600SemiBold, useFonts } from '@expo-google-fonts/geist'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DataProvider } from '@/data/DataProvider'

export default function RootLayout() {
  const [policesChargees] = useFonts({ Geist_400Regular, Geist_500Medium, Geist_600SemiBold })
  if (!policesChargees) return null

  return (
    <SafeAreaProvider>
      <DataProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="abonnement" options={{ presentation: 'modal' }} />
        </Stack>
      </DataProvider>
    </SafeAreaProvider>
  )
}
