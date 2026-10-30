import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState, type ComponentProps } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AppText, Button, Card, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { colors, radius, spacing } from '@/theme'

type Icone = ComponentProps<typeof Ionicons>['name']

const INCLUS: { icone: Icone; titre: string; description: string }[] = [
  {
    icone: 'copy-outline',
    titre: 'Pajemploi sans calcul',
    description: 'Les heures, jours et indemnités du mois, prêts à copier dans le formulaire. Fini les calculs à la main.'
  },
  {
    icone: 'list-outline',
    titre: 'Le calcul expliqué, ligne par ligne',
    description: 'Mensualisation, absences, heures en plus : tu vois pourquoi ce montant, et tu peux le vérifier.'
  },
  {
    icone: 'checkmark-done-outline',
    titre: 'Mois validés avec ton assmat',
    description: "Tu valides le récap, elle le voit. Une trace claire pour tous les deux, en cas de doute plus tard."
  },
  {
    icone: 'time-outline',
    titre: "Historique et récap de l'année",
    description: 'Tous les mois depuis le début du contrat, et les totaux de l’année, prêts pour la déclaration d’impôts.'
  }
]

const BIENTOT = ['Fin de contrat guidée (solde, indemnité de rupture)', 'Congés payés et régularisation de fin d’année', 'Salaire net et rappels avant la date Pajemploi']

const FORMULES = [
  { id: 'annuel', libelle: 'Annuel', prix: '19,99 € par an', detail: 'Soit 1,67 € par mois, près de 2 mois offerts' },
  { id: 'mensuel', libelle: 'Mensuel', prix: '1,99 € par mois', detail: 'Sans engagement' }
] as const

// Démo : l'essai se débloque localement. Avec RevenueCat, le bouton lancera l'achat sur le store.
export default function Abonnement() {
  const { abonne, activerEssai } = useData()
  const [formule, setFormule] = useState<(typeof FORMULES)[number]['id']>('annuel')

  const essayer = () => {
    activerEssai()
    router.back()
  }

  return (
    <Screen
      title="Ma Mensu+"
      subtitle="Pour les familles"
      footer={
        abonne ? (
          <Button variant="secondary" label="Tu es déjà abonné, merci !" onPress={() => router.back()} />
        ) : (
          <View style={styles.pied}>
            <Button label="Essayer un mois gratuit" onPress={essayer} />
            <Button variant="ghost" label="Plus tard" onPress={() => router.back()} />
            <AppText variant="caption" color="textMuted" style={styles.centre}>
              Puis {FORMULES.find((f) => f.id === formule)!.prix}. Résiliable à tout moment.
            </AppText>
          </View>
        )
      }
    >
      <AppText color="textMuted">
        Le total du mois reste gratuit. Ma Mensu+ t'aide à déclarer juste, à garder une trace et à préparer l'année.
      </AppText>

      <Card variant="highlight">
        {INCLUS.map((item) => (
          <View key={item.titre} style={styles.inclus}>
            <View style={styles.icone}>
              <Ionicons name={item.icone} size={20} color={colors.primary} />
            </View>
            <View style={styles.texte}>
              <AppText variant="label">{item.titre}</AppText>
              <AppText variant="caption" color="textMuted">
                {item.description}
              </AppText>
            </View>
          </View>
        ))}
      </Card>

      {abonne ? null : (
        <View style={styles.formules} accessibilityRole="radiogroup">
          {FORMULES.map((f) => {
            const choisie = f.id === formule
            return (
              <Pressable
                key={f.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: choisie }}
                onPress={() => setFormule(f.id)}
                style={[styles.formule, choisie && styles.formuleChoisie]}
              >
                <View style={[styles.radio, choisie && styles.radioChoisi]}>{choisie ? <View style={styles.radioPoint} /> : null}</View>
                <View style={styles.texte}>
                  <AppText variant="label">{f.libelle}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {f.detail}
                  </AppText>
                </View>
                <AppText variant="label">{f.prix}</AppText>
              </Pressable>
            )
          })}
        </View>
      )}

      <Card>
        <AppText variant="label">Bientôt dans Ma Mensu+</AppText>
        {BIENTOT.map((b) => (
          <View key={b} style={styles.bientot}>
            <Ionicons name="sparkles-outline" size={16} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.texte}>
              {b}
            </AppText>
          </View>
        ))}
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  pied: { gap: spacing.sm },
  centre: { textAlign: 'center' },
  inclus: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  icone: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  texte: { flex: 1, gap: 2 },
  formules: { gap: spacing.sm },
  formule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },
  formuleChoisie: { borderColor: colors.primary, backgroundColor: colors.background },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioChoisi: { borderColor: colors.primary },
  radioPoint: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  bientot: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }
})
