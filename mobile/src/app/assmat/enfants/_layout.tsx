import { Stack } from 'expo-router'
import { colors, fonts } from '@/theme'

export default function EnfantsLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: colors.primary, headerShadowVisible: false, headerStyle: { backgroundColor: colors.surface }, headerBackTitle: 'Retour', headerTitleStyle: { fontFamily: fonts.medium } }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="nouveau" options={{ title: 'Nouveau contrat' }} />
      <Stack.Screen name="[id]" options={{ title: 'Contrat' }} />
    </Stack>
  )
}
