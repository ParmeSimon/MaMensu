import { Ionicons } from '@expo/vector-icons'
import type { ResultatMois } from '@mamensu/engine'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AppText, Avatar, Card } from '@/components/ui'
import { colors, spacing } from '@/theme'
import { euros } from '@/utils/format'

interface Props {
  titre: string
  resultat: ResultatMois
  /** Afficher le détail ligne par ligne (payant côté parents). */
  detail?: boolean
  /** Grand montant bleu dans une carte à liseré, pour l'écran où ce total est l'essentiel. */
  enAvant?: boolean
  /** Version compacte : détail replié au départ, dépliable d'un toucher. */
  replie?: boolean
}

export function RecapMois({ titre, resultat, detail = true, enAvant = false, replie = false }: Props) {
  const [ouvert, setOuvert] = useState(!replie)
  const total = euros(resultat.totalBrutAvecIndemnites)

  if (enAvant) {
    return (
      <Card variant="highlight">
        <View style={styles.identite}>
          <Avatar prenom={titre} taille={32} />
          <AppText variant="label">{titre}</AppText>
        </View>
        <View>
          <AppText variant="caption" color="textMuted">
            Salaire brut et indemnités
          </AppText>
          <AppText variant="amount" color="primary">
            {total}
          </AppText>
        </View>
        {detail ? <Lignes resultat={resultat} /> : null}
      </Card>
    )
  }

  return (
    <Card style={styles.compacte}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: ouvert }}
        disabled={!detail}
        onPress={() => setOuvert((o) => !o)}
        style={styles.entete}
      >
        <AppText variant="heading" style={styles.titre}>
          {titre}
        </AppText>
        <AppText variant="heading" style={styles.chiffre}>
          {total}
        </AppText>
        {detail ? <Ionicons name={ouvert ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} /> : null}
      </Pressable>
      {detail && ouvert ? <Lignes resultat={resultat} /> : null}
    </Card>
  )
}

/** Détail du calcul ligne par ligne. */
export function Lignes({ resultat }: { resultat: ResultatMois }) {
  return (
    <View>
      {resultat.lignes.map((ligne) => (
        <View key={ligne.libelle} style={styles.ligne}>
          <View style={styles.texte}>
            <AppText variant="label">{ligne.libelle}</AppText>
            <AppText variant="caption" color="textMuted">
              {ligne.detail}
            </AppText>
          </View>
          <AppText variant="label" color={ligne.montant < 0 ? 'danger' : 'text'} style={styles.chiffre}>
            {euros(ligne.montant)}
          </AppText>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  identite: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  compacte: { paddingVertical: spacing.xs, gap: 0 },
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  titre: { flex: 1 },
  chiffre: { fontVariant: ['tabular-nums'] },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  texte: { flex: 1, gap: 2 }
})
