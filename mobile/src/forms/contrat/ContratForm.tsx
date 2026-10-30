import { zodResolver } from '@hookform/resolvers/zod'
import { mensualisation } from '@mamensu/engine'
import { useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import { View, StyleSheet } from 'react-native'
import { ControlledNumberField, ControlledSegmentedControl, ControlledTextField } from '@/components/forms'
import { AppText, Button, Card } from '@/components/ui'
import { colors, radius, spacing } from '@/theme'
import { aujourdhui } from '@/utils/dates'
import { euros, heures } from '@/utils/format'
import { contratSchema, JOURS, type ContratFormValues } from './schema'
import { toContrat } from './toContrat'

// Création d'un contrat en quatre étapes, une question à la fois. Chaque
// étape ne valide que ses propres champs avant de passer à la suivante.

const ETAPES: { titre: string; champs: Path<ContratFormValues>[] }[] = [
  { titre: "L'enfant", champs: ['prenomEnfant', 'nomFamille', 'debut'] },
  { titre: "L'année d'accueil", champs: ['type', 'semainesProgrammees'] },
  { titre: 'Le planning de la semaine', champs: ['planning'] },
  { titre: 'Le tarif', champs: ['tauxHoraireBrut', 'indemniteEntretienParJour', 'prixRepas'] }
]

interface Props {
  onSubmit: (valeurs: ContratFormValues) => void
}

export function ContratForm({ onSubmit }: Props) {
  const [etape, setEtape] = useState(0)
  const { control, handleSubmit, trigger, watch, formState } = useForm<ContratFormValues>({
    resolver: zodResolver(contratSchema),
    defaultValues: { prenomEnfant: '', nomFamille: '', debut: aujourdhui(), type: 'complete', planning: {} }
  })

  const derniere = etape === ETAPES.length - 1
  const suivant = async () => {
    if (await trigger(ETAPES[etape]!.champs)) setEtape((e) => e + 1)
  }

  const valeurs = watch()
  const apercu = contratSchema.safeParse(valeurs)
  const mensu = apercu.success ? mensualisation(toContrat(apercu.data)) : null

  return (
    <View style={styles.root}>
      <View style={styles.entete}>
        <View style={styles.progression}>
          {ETAPES.map((e, i) => (
            <View key={e.titre} style={[styles.segment, i <= etape && styles.segmentFait]} />
          ))}
        </View>
        <AppText variant="caption" color="textMuted" style={styles.surtitre}>
          Étape {etape + 1} sur {ETAPES.length}
        </AppText>
        <AppText variant="title">{ETAPES[etape]!.titre}</AppText>
      </View>

      {etape === 0 ? (
        <>
          <ControlledTextField control={control} name="prenomEnfant" label="Prénom de l'enfant" autoCapitalize="words" />
          <ControlledTextField control={control} name="nomFamille" label="Nom de la famille" autoCapitalize="words" />
          <ControlledTextField control={control} name="debut" label="Début du contrat" hint="Format AAAA-MM-JJ" />
        </>
      ) : null}

      {etape === 1 ? (
        <>
          <ControlledSegmentedControl
            control={control}
            name="type"
            label="L'enfant est accueilli…"
            options={[
              { value: 'complete', label: 'Toute l’année', description: 'Année complète : tes congés sont ceux des parents' },
              { value: 'incomplete', label: 'Une partie de l’année', description: 'Année incomplète : 46 semaines d’accueil au plus' }
            ]}
          />
          {valeurs.type === 'incomplete' ? (
            <ControlledNumberField
              control={control}
              name="semainesProgrammees"
              label="Semaines d'accueil par an"
              hint="Sans compter tes semaines de congés"
            />
          ) : null}
        </>
      ) : null}

      {etape === 2 ? (
        <>
          <AppText color="textMuted">Heures d'accueil prévues chaque jour. Laisse vide les jours sans accueil.</AppText>
          {JOURS.map((jour) => (
            <ControlledNumberField key={jour.cle} control={control} name={`planning.${jour.cle}`} label={jour.label} />
          ))}
          {formState.errors.planning?.message ? (
            <AppText variant="caption" color="danger">
              {formState.errors.planning.message}
            </AppText>
          ) : null}
        </>
      ) : null}

      {etape === 3 ? (
        <>
          <ControlledNumberField control={control} name="tauxHoraireBrut" label="Taux horaire brut (€)" />
          <ControlledNumberField control={control} name="indemniteEntretienParJour" label="Indemnité d'entretien par jour (€)" />
          <ControlledNumberField control={control} name="prixRepas" label="Prix d'un repas (€)" hint="0 si les parents fournissent les repas" />
          {mensu ? (
            <Card variant="highlight">
              <AppText variant="caption" color="textMuted">
                Salaire mensualisé
              </AppText>
              <AppText variant="amount" color="primary">
                {euros(mensu.salaire)}
              </AppText>
              <AppText variant="caption" color="textMuted">
                {heures(mensu.heures)} par mois
              </AppText>
            </Card>
          ) : null}
        </>
      ) : null}

      <View style={styles.actions}>
        {derniere ? (
          <Button label="Créer le contrat" onPress={handleSubmit(onSubmit)} />
        ) : (
          <Button label="Continuer" onPress={suivant} />
        )}
        {etape > 0 ? <Button variant="ghost" label="Retour" onPress={() => setEtape((e) => e - 1)} /> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  entete: { gap: spacing.md },
  progression: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 3, borderRadius: radius.full, backgroundColor: colors.border },
  segmentFait: { backgroundColor: colors.primary },
  surtitre: { textTransform: 'uppercase', letterSpacing: 1.2 },
  actions: { gap: spacing.sm }
})
