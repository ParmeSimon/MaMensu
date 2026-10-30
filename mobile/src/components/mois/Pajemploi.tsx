import { Ionicons } from '@expo/vector-icons'
import { arrondi, type ResultatMois } from '@mamensu/engine'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AppText } from '@/components/ui'
import { colors, radius, spacing } from '@/theme'
import { euros, heures } from '@/utils/format'

interface Montant {
  libelle: string
  /** Ce qui s'affiche. */
  affiche: string
  /** Ce qui part dans le presse-papiers : le nombre seul, prêt à coller dans le formulaire. */
  copie: string
}

const nombre = (n: number) => String(arrondi(n)).replace('.', ',')
const montant = (n: number) => arrondi(n).toFixed(2).replace('.', ',')

/**
 * Les chiffres du mois à reporter sur Pajemploi, chacun copiable d'un toucher.
 * Sans carte ni titre : s'insère dans une étape.
 * On ne montre que ce que le moteur calcule déjà : le salaire net arrivera avec
 * le passage du brut au net (cotisations), une fois les règles vérifiées.
 */
export function Pajemploi({ resultat }: { resultat: ResultatMois }) {
  const [copie, setCopie] = useState<string | null>(null)

  const montants: Montant[] = [
    { libelle: 'Heures mensualisées', affiche: heures(resultat.heuresMensualisees), copie: nombre(resultat.heuresMensualisees) },
    ...(resultat.heuresAbsenceDeduites > 0
      ? [{ libelle: "Heures d'absence déduites", affiche: heures(resultat.heuresAbsenceDeduites), copie: nombre(resultat.heuresAbsenceDeduites) }]
      : []),
    ...(resultat.heuresComplementaires > 0
      ? [{ libelle: 'Heures complémentaires', affiche: heures(resultat.heuresComplementaires), copie: nombre(resultat.heuresComplementaires) }]
      : []),
    ...(resultat.heuresMajorees > 0
      ? [{ libelle: 'Heures majorées', affiche: heures(resultat.heuresMajorees), copie: nombre(resultat.heuresMajorees) }]
      : []),
    { libelle: "Jours d'activité", affiche: String(resultat.joursActivite), copie: String(resultat.joursActivite) },
    { libelle: 'Salaire brut', affiche: euros(resultat.salaireBrut), copie: montant(resultat.salaireBrut) },
    { libelle: "Indemnités d'entretien", affiche: euros(resultat.indemnitesEntretien), copie: montant(resultat.indemnitesEntretien) },
    ...(resultat.indemnitesRepas > 0
      ? [{ libelle: 'Repas', affiche: euros(resultat.indemnitesRepas), copie: montant(resultat.indemnitesRepas) }]
      : [])
  ]

  const copier = async ({ libelle, copie: valeur }: Montant) => {
    await Clipboard.setStringAsync(valeur)
    setCopie(libelle)
    setTimeout(() => setCopie((c) => (c === libelle ? null : c)), 1500)
  }

  return (
    <View style={styles.bloc}>
      <AppText variant="caption" color="textMuted">
        Touche une ligne pour copier le nombre, puis colle-le dans le formulaire.
      </AppText>
      <View>
        {montants.map((m) => {
          const vientDEtreCopie = copie === m.libelle
          return (
            <Pressable
              key={m.libelle}
              accessibilityRole="button"
              accessibilityLabel={`Copier ${m.libelle} : ${m.affiche}`}
              onPress={() => copier(m)}
              style={({ pressed }) => [styles.ligne, pressed && styles.appuye]}
            >
              <AppText variant="label" style={styles.libelle}>
                {m.libelle}
              </AppText>
              <AppText variant="label" style={styles.valeur}>
                {m.affiche}
              </AppText>
              <View style={[styles.copier, vientDEtreCopie && styles.copie]}>
                <Ionicons name={vientDEtreCopie ? 'checkmark' : 'copy-outline'} size={16} color={vientDEtreCopie ? colors.white : colors.primary} />
              </View>
            </Pressable>
          )
        })}
        <View style={styles.ligne}>
          <AppText variant="label" color="textMuted" style={styles.libelle}>
            Salaire net
          </AppText>
          <AppText variant="caption" color="textMuted">
            Bientôt
          </AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.sm },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  appuye: { opacity: 0.6 },
  libelle: { flex: 1 },
  valeur: { fontVariant: ['tabular-nums'] },
  copier: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copie: { backgroundColor: colors.success }
})
