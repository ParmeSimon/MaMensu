import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppText, Voile } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { colors, gradients, radius, spacing } from '@/theme'
import type { Role } from '@/types'

const PROFILS: { role: Role; titre: string; description: string }[] = [
  { role: 'assmat', titre: 'Assistante maternelle', description: 'Contrats, pointage, calcul du mois. Gratuit, sans limite.' },
  { role: 'parent', titre: 'Parent', description: 'Heures de mon enfant, montant du mois, Pajemploi.' }
]

export default function Bienvenue() {
  const { choisirRole } = useData()

  const choisir = (role: Role) => {
    choisirRole(role)
    router.replace(role === 'assmat' ? '/assmat' : '/parent')
  }

  return (
    <SafeAreaView style={styles.root}>
      <Voile />
      <View style={styles.marque}>
        <LinearGradient colors={gradients.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.point} />
        <AppText variant="label">Ma Mensu</AppText>
      </View>

      <AppText variant="title" style={styles.accroche}>
        La paie <Text style={styles.motCle}>juste</Text>, pour l'assmat et pour les parents.
      </AppText>
      <AppText color="textMuted" style={styles.sousTitre}>
        Heures du jour, calcul du mois, déclaration Pajemploi. Au centime près.
      </AppText>

      <View style={styles.espace} />

      <AppText variant="caption" color="textMuted" style={styles.surtitre}>
        Je suis
      </AppText>
      <View style={styles.choix}>
        {PROFILS.map((profil) => (
          <Pressable
            key={profil.role}
            accessibilityRole="button"
            onPress={() => choisir(profil.role)}
            style={({ pressed }) => [styles.carte, pressed && styles.appuye]}
          >
            <View style={styles.texte}>
              <AppText variant="heading">{profil.titre}</AppText>
              <AppText variant="label" color="textMuted">
                {profil.description}
              </AppText>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </Pressable>
        ))}
      </View>
      <AppText variant="caption" color="textMuted" style={styles.pied}>
        Tu pourras changer de profil à tout moment.
      </AppText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, overflow: 'hidden' },
  marque: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: spacing.xxl },
  point: { width: 10, height: 10, borderRadius: 5 },
  accroche: { marginTop: 56, fontSize: 38, lineHeight: 42, letterSpacing: -1.4 },
  sousTitre: { marginTop: spacing.lg },
  espace: { flex: 1 },
  surtitre: { textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md },
  choix: { gap: spacing.md },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder
  },
  appuye: { opacity: 0.8 },
  texte: { flex: 1, gap: spacing.xs },
  motCle: { color: colors.primary },
  pied: { textAlign: 'center', marginTop: 20 }
})
