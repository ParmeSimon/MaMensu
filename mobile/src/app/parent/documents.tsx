import { Ionicons } from '@expo/vector-icons'
import { Fragment } from 'react'
import { Pressable, Share, StyleSheet, View } from 'react-native'
import { Verrou } from '@/components/abonnement/Verrou'
import { AppText, Avatar, Badge, Card, Screen } from '@/components/ui'
import { useData } from '@/data/DataProvider'
import { useHistorique, type MoisHistorique } from '@/hooks/useHistorique'
import { colors, spacing } from '@/theme'
import { libelleMois } from '@/utils/dates'
import { euros } from '@/utils/format'

/** Texte du récap d'un mois, à envoyer par message ou mail. */
function texteRecap({ resultat }: MoisHistorique, prenom: string): string {
  return [
    `Ma Mensu – ${prenom}, ${libelleMois(resultat.mois)}`,
    ...resultat.lignes.map((l) => `${l.libelle} : ${euros(l.montant)} (${l.detail})`),
    `Total : ${euros(resultat.totalBrutAvecIndemnites)}`
  ].join('\n')
}

export default function DocumentsParent() {
  const { enfants, abonne } = useData()
  const { historique, annee } = useHistorique()
  const prenom = (h: MoisHistorique) => enfants.find((e) => e.id === h.contrat.enfantId)?.prenom ?? 'Contrat'

  if (!abonne) {
    return (
      <Screen title="Documents">
        <Verrou
          titre="Historique et récap de l'année"
          description="Tous les mois depuis le début du contrat, validés ou non, à partager en un geste. Et les totaux de l'année, prêts pour la déclaration d'impôts."
        />
      </Screen>
    )
  }

  return (
    <Screen title="Documents" subtitle={`Année ${annee.annee}`}>
      <Card variant="highlight">
        <AppText variant="caption" color="textMuted">
          Total brut {annee.annee}, indemnités comprises
        </AppText>
        <AppText variant="amount" color="primary">
          {euros(annee.total)}
        </AppText>
        <View style={styles.detailAnnee}>
          <Ligne libelle="Salaires bruts" valeur={euros(annee.salaireBrut)} />
          <Ligne libelle="Indemnités d'entretien" valeur={euros(annee.indemnitesEntretien)} />
          {annee.indemnitesRepas > 0 ? <Ligne libelle="Repas" valeur={euros(annee.indemnitesRepas)} /> : null}
          <Ligne libelle="Mois comptés" valeur={String(annee.mois)} />
        </View>
      </Card>

      <AppText variant="caption" color="textMuted" style={styles.surtitre}>
        Historique
      </AppText>
      <Card style={styles.liste}>
        {historique.map((h, index) => (
          <Fragment key={`${h.contrat.id}:${h.resultat.mois}`}>
            {index > 0 ? <View style={styles.separateur} /> : null}
            <View style={styles.ligneMois}>
              <Avatar prenom={prenom(h)} taille={36} />
              <View style={styles.texte}>
                <AppText variant="label">
                  {prenom(h)} · {libelleMois(h.resultat.mois)}
                </AppText>
                <Badge statut={h.valideLe ? 'success' : 'warning'} label={h.valideLe ? 'Validé' : 'À valider'} />
              </View>
              <AppText variant="label" style={styles.chiffre}>
                {euros(h.resultat.totalBrutAvecIndemnites)}
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Partager le récap de ${libelleMois(h.resultat.mois)}`}
                onPress={() => Share.share({ message: texteRecap(h, prenom(h)) })}
                style={styles.partager}
                hitSlop={8}
              >
                <Ionicons name="share-outline" size={20} color={colors.primary} />
              </Pressable>
            </View>
          </Fragment>
        ))}
      </Card>
    </Screen>
  )
}

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View style={styles.ligne}>
      <AppText variant="label" color="textMuted">
        {libelle}
      </AppText>
      <AppText variant="label" style={styles.chiffre}>
        {valeur}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  detailAnnee: { marginTop: spacing.sm },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  chiffre: { fontVariant: ['tabular-nums'] },
  surtitre: { textTransform: 'uppercase', letterSpacing: 1.2, marginTop: spacing.sm },
  liste: { padding: 0, gap: 0 },
  ligneMois: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  texte: { flex: 1, gap: spacing.xs },
  partager: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  separateur: { height: 1, backgroundColor: colors.border, marginLeft: 68 }
})
