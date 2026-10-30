import { StyleSheet, View } from 'react-native'
import { colors } from '@/theme'
import { AppText } from './AppText'

/** Pastille bleu pâle avec l'initiale du prénom. */
export function Avatar({ prenom, taille = 40 }: { prenom: string; taille?: number }) {
  return (
    <View style={[styles.base, { width: taille, height: taille, borderRadius: taille / 2 }]}>
      <AppText variant="label" color="primary">
        {prenom.charAt(0).toUpperCase()}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }
})
