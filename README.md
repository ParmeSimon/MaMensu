# Ma Mensu – Paie assmat & parents

Appli mobile (React Native + Expo) qui calcule juste la paie des assistantes maternelles et donne aux parents les montants à déclarer sur Pajemploi. Notes produit et étude de marché : `C:\Perso\AAM\`.

## Structure
```
packages/engine/     moteur de calcul en TypeScript, sans interface, testé avec Vitest
mobile/              appli Expo (Expo Router), importe le moteur via @mamensu/engine
  src/app/           pages (une route par fichier)
    bienvenue.tsx      choix assmat / parent
    assmat/            onglets : Aujourd'hui, Enfants (liste, nouveau, fiche), Mois, Documents, Plus
    parent/            onglets : Aujourd'hui, Mois, Documents
  src/components/
    ui/                briques de base : AppText, Button, Card, Badge, Screen, EmptyState
    forms/             champs : TextField, NumberField, SegmentedControl + versions reliées à react-hook-form
    mois/              RecapMois (total + détail ligne par ligne)
    pointage/          PointageCard (Arrivé / Parti)
    navigation/        options de la barre d'onglets
  src/forms/contrat/   formulaire de contrat : schéma zod, conversion vers le moteur, formulaire en 4 étapes
  src/hooks/           useMois, useAccueilsDuJour
  src/data/            DataProvider (données en mémoire + démo), seul fichier à changer pour brancher Firebase
  src/types/           types de l'appli (Enfant, ContratEnregistre, Role…)
  src/theme/           couleurs, espacements, typographie
  src/utils/           dates, formats, identifiants
```

## Installer l'appli (depuis un réseau sans filtrage npm)
```
rmdir node_modules          (supprime le raccourci temporaire vers PitNexus, surtout pas rm -rf)
npm install
cd mobile
npx expo install --fix      (aligne les versions sur la version d'Expo installée)
npx expo start
```
Les versions de `mobile/package.json` ont été écrites à la main sans accès au registre npm : `expo install --fix` les corrige.

## Moteur de calcul : ce qui est fait
- Mensualisation, année complète (52 semaines) et incomplète (46 semaines au plus)
- Calcul d'un mois à partir du contrat et des journées saisies (un jour non saisi = jour normal)
- Absence non rémunérée déduite : salaire mensualisé × heures d'absence ÷ heures prévues dans le mois
- Heures complémentaires (au-delà du planning de la semaine) et majorées (au-delà de 45 h), rattachées au jour où elles sont faites, même quand la semaine est à cheval sur deux mois
- Semaines non programmées (année incomplète)
- Indemnités d'entretien par jour d'accueil, repas
- Détail du calcul ligne par ligne, dont la somme retombe exactement sur le total

## Règles à vérifier avec les textes officiels avant de s'y fier
Convention collective IDCC 3239 (particulier employeur et emploi à domicile, 2022) et documentation Pajemploi :
- Taux de majoration des heures au-delà de 45 h (paramètre du contrat pour l'instant)
- Absences payées ou déduites : la liste exacte des cas (maladie de l'enfant avec ou sans justificatif, congés des parents en plus de ceux prévus, jours fériés…)
- Heures complémentaires quand l'enfant a été absent une partie de la semaine
- Montant minimum de l'indemnité d'entretien selon la durée d'accueil
- Exonération de cotisations sur les heures complémentaires et majorées (erreur relevée dans l'appli officielle)

## Pas encore géré
- Congés payés (acquisition, paiement en année incomplète)
- Montants Pajemploi (heures, jours, salaire net) et passage du brut au net
- Contrats de plus de 45 h par semaine (refusés pour l'instant)
- Fin de contrat, avenant, récap fiscal

## Lancer les tests
```
cd packages/engine
npm install
npm test
```
