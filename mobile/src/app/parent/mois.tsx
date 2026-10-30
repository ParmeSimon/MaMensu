import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Verrou } from '@/components/abonnement/Verrou'
import { Etape } from '@/components/mois/Etape'
import { Pajemploi } from '@/components/mois/Pajemploi'
import { Lignes } from '@/components/mois/RecapMois'
import { AppText, Avatar, Badge, Button, Card, Screen } from '@/components/ui'
import { cleMois, useData } from '@/data/DataProvider'
import { useMoisDeTous } from '@/hooks/useMois'
import { colors, radius, spacing } from '@/theme'
import { libelleJour, libelleMois, moisCourant } from '@/utils/dates'
import { euros } from '@/utils/format'

// Le mois côté famille. En gratuit : le total de chaque enfant. Avec Ma Mensu+ :
// un enfant à la fois, en trois étapes (vérifier, déclarer sur Pajemploi,
// valider), pour ne jamais mélanger les chiffres de deux contrats.
export default function MoisParent() {
  const { enfants, abonne, validations, validerMois } = useData()
  const mois = moisCourant()
  const nomMois = libelleMois(mois).split(' ')[0] ?? ''
  const { recaps, total } = useMoisDeTous(mois)
  const [choisi, setChoisi] = useState<string | null>(null)

  const prenom = (enfantId: string) => enfants.find((e) => e.id === enfantId)?.prenom ?? 'Contrat'
  const valideLe = (contratId: string) => validations[cleMois(contratId, mois)]
  const nbValides = recaps.filter((r) => valideLe(r.contrat.id)).length
  const courant = recaps.find((r) => r.contrat.id === choisi) ?? recaps[0]
  const suivant = recaps.find((r) => r.contrat.id !== courant?.contrat.id && !valideLe(r.contrat.id))
  const plusieurs = recaps.length > 1

  return (
    <Screen title="Mois" subtitle={libelleMois(mois)}>
      <Card variant="highlight">
        <AppText variant="caption" color="textMuted">
          À payer pour {nomMois}
          {plusieurs ? `, ${recaps.length} enfants` : ''}
        </AppText>
        <AppText variant="amount" color="primary">
          {euros(total)}
        </AppText>
        <AppText variant="caption" color="textMuted">
          Brut et indemnités
          {abonne ? ` · ${nbValides === recaps.length ? 'tout est validé' : `${nbValides} sur ${recaps.length} validé${nbValides > 1 ? 's' : ''}`}` : ''}
        </AppText>
        {plusieurs ? (
          <View style={styles.resume}>
            {recaps.map(({ contrat, resultat }) => (
              <Pressable
                key={contrat.id}
                accessibilityRole="button"
                accessibilityLabel={`Ouvrir le mois de ${prenom(contrat.enfantId)}`}
                disabled={!abonne}
                onPress={() => setChoisi(contrat.id)}
                style={({ pressed }) => [styles.ligneResume, pressed && styles.appuye]}
              >
                <Avatar prenom={prenom(contrat.enfantId)} taille={36} />
                <AppText variant="label" style={styles.flex}>
                  {prenom(contrat.enfantId)}
                </AppText>
                {abonne ? (
                  <Badge statut={valideLe(contrat.id) ? 'success' : 'warning'} label={valideLe(contrat.id) ? 'Validé' : 'À valider'} style={styles.centre} />
                ) : null}
                <AppText variant="label" style={styles.chiffre}>
                  {euros(resultat.totalBrutAvecIndemnites)}
                </AppText>
                {abonne ? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} /> : null}
              </Pressable>
            ))}
          </View>
        ) : null}
      </Card>

      {!abonne ? (
        <Verrou
          titre="Déclarer sans calcul"
          description="Le détail de chaque montant, les chiffres à copier dans Pajemploi et la validation du mois avec ton assmat, un enfant à la fois."
        />
      ) : courant ? (
        <>
          {plusieurs ? (
            <View style={styles.choix}>
              <AppText variant="caption" color="textMuted" style={styles.surtitre}>
                Un enfant à la fois
              </AppText>
              <View style={styles.segments} accessibilityRole="tablist">
                {recaps.map(({ contrat }) => {
                  const actif = contrat.id === courant.contrat.id
                  return (
                    <Pressable
                      key={contrat.id}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: actif }}
                      onPress={() => setChoisi(contrat.id)}
                      style={[styles.segment, actif && styles.segmentActif]}
                    >
                      <View style={[styles.point, { backgroundColor: valideLe(contrat.id) ? colors.success : colors.warning }]} />
                      <AppText variant="label" color={actif ? 'text' : 'textMuted'}>
                        {prenom(contrat.enfantId)}
                      </AppText>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          ) : null}

          <Etape numero={1} titre={`Vérifier le montant de ${prenom(courant.contrat.enfantId)}`}>
            <View style={styles.montant}>
              <AppText variant="caption" color="textMuted">
                Salaire brut et indemnités
              </AppText>
              <AppText variant="title" color="primary" style={styles.chiffre}>
                {euros(courant.resultat.totalBrutAvecIndemnites)}
              </AppText>
            </View>
            <Lignes resultat={courant.resultat} />
          </Etape>

          <Etape numero={2} titre={`Déclarer ${prenom(courant.contrat.enfantId)} sur Pajemploi`}>
            <Pajemploi key={courant.contrat.id} resultat={courant.resultat} />
          </Etape>

          <Etape numero={3} titre="Valider avec l'assmat">
            {valideLe(courant.contrat.id) ? (
              <>
                <View style={styles.valide}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
                  <AppText variant="label" style={styles.texteValide}>
                    {nomMois.charAt(0).toUpperCase() + nomMois.slice(1)} validé pour {prenom(courant.contrat.enfantId)} le{' '}
                    {libelleJour(valideLe(courant.contrat.id)!)}
                  </AppText>
                </View>
                {suivant ? (
                  <Button
                    variant="secondary"
                    label={`Continuer avec ${prenom(suivant.contrat.enfantId)}`}
                    onPress={() => setChoisi(suivant.contrat.id)}
                  />
                ) : null}
              </>
            ) : (
              <>
                <AppText color="textMuted">
                  Tu confirmes que le récap de {prenom(courant.contrat.enfantId)} est juste. Ton assmat le verra, et la trace restera
                  dans l'historique.
                </AppText>
                <Button
                  label={`Valider ${nomMois} pour ${prenom(courant.contrat.enfantId)}`}
                  onPress={() => validerMois(courant.contrat.id, mois)}
                />
              </>
            )}
          </Etape>
        </>
      ) : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centre: { alignSelf: 'center' },
  chiffre: { fontVariant: ['tabular-nums'] },
  appuye: { opacity: 0.6 },
  resume: { marginTop: spacing.sm },
  ligneResume: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  choix: { gap: spacing.sm, marginTop: spacing.sm },
  surtitre: { textTransform: 'uppercase', letterSpacing: 1.2 },
  segments: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: colors.glassBorder
  },
  segment: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.full
  },
  segmentActif: {
    backgroundColor: colors.background,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  point: { width: 8, height: 8, borderRadius: 4 },
  montant: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  valide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: 'rgba(22,163,74,0.1)'
  },
  texteValide: { flex: 1, color: '#166534' }
})
