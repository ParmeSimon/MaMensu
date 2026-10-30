import { ajouterJours, dansPeriodes, joursDuMois, jourSemaine, lundiDeLaSemaine } from './dates'
import { arrondi, euros, heures } from './format'
import { heuresHebdo, mensualisation, semainesMensualisees } from './mensualisation'
import type { Contrat, Journee, LigneCalcul, ResultatMois } from './types'

/** Au-delà de 45 h dans la semaine, les heures sont majorées. */
export const SEUIL_HEURES_MAJOREES = 45

interface Jour {
  date: string
  prevues: number
  faites: number
  absenceDeduite: number
  repas: number
}

/** Heures prévues au planning ce jour-là (0 hors planning ou en semaine non programmée). */
export function heuresPrevues(contrat: Contrat, date: string): number {
  if (dansPeriodes(date, contrat.periodesNonProgrammees)) return 0
  return contrat.planning[jourSemaine(date)] ?? 0
}

function lireJour(contrat: Contrat, date: string, saisies: Map<string, Journee>): Jour {
  const prevues = heuresPrevues(contrat, date)
  const saisie = saisies.get(date)
  if (!saisie) return { date, prevues, faites: prevues, absenceDeduite: 0, repas: 0 }
  switch (saisie.statut) {
    case 'present':
      return { date, prevues, faites: saisie.heures, absenceDeduite: 0, repas: saisie.repas ?? 0 }
    case 'absence_deduite':
      return { date, prevues, faites: 0, absenceDeduite: prevues, repas: 0 }
    case 'absence_payee':
      return { date, prevues, faites: 0, absenceDeduite: 0, repas: 0 }
  }
}

/**
 * Heures complémentaires et majorées, semaine par semaine.
 * Les heures faites au-delà des heures prévues de la semaine sont
 * complémentaires jusqu'à 45 h, majorées au-delà. Chaque heure en plus est
 * rattachée au jour où le seuil est franchi : une semaine à cheval sur deux
 * mois paie ses heures en plus dans le mois où elles ont été faites.
 */
function heuresEnPlusParJour(semaine: Jour[]): Map<string, { complementaires: number; majorees: number }> {
  const prevuesSemaine = semaine.reduce((t, j) => t + j.prevues, 0)
  const resultat = new Map<string, { complementaires: number; majorees: number }>()
  let cumul = 0
  for (const jour of semaine) {
    const avant = cumul
    cumul += jour.faites
    const auDela = (seuil: number) => Math.max(0, cumul - Math.max(avant, seuil))
    const majorees = auDela(SEUIL_HEURES_MAJOREES)
    const complementaires = auDela(prevuesSemaine) - majorees
    resultat.set(jour.date, { complementaires: Math.max(0, complementaires), majorees })
  }
  return resultat
}

export function calculerMois(contrat: Contrat, mois: string, journees: Journee[] = []): ResultatMois {
  const saisies = new Map(journees.map((j) => [j.date, j]))
  const jours = joursDuMois(mois).map((date) => lireJour(contrat, date, saisies))

  // Semaines complètes (du lundi au dimanche) qui touchent le mois, pour les heures en plus.
  const enPlus = new Map<string, { complementaires: number; majorees: number }>()
  const premierLundi = lundiDeLaSemaine(jours[0]!.date)
  for (let lundi = premierLundi; lundi <= jours[jours.length - 1]!.date; lundi = ajouterJours(lundi, 7)) {
    const semaine = Array.from({ length: 7 }, (_, i) => lireJour(contrat, ajouterJours(lundi, i), saisies))
    for (const [date, h] of heuresEnPlusParJour(semaine)) enPlus.set(date, h)
  }

  const somme = (f: (j: Jour) => number) => jours.reduce((t, j) => t + f(j), 0)
  const prevues = somme((j) => j.prevues)
  const absencesDeduites = somme((j) => j.absenceDeduite)
  const complementaires = somme((j) => enPlus.get(j.date)?.complementaires ?? 0)
  const majorees = somme((j) => enPlus.get(j.date)?.majorees ?? 0)
  const joursActivite = jours.filter((j) => j.faites > 0).length
  const repas = somme((j) => j.repas)

  const mensu = mensualisation(contrat)
  const salaireMensualise = arrondi(mensu.salaire)
  // Absence déduite : salaire mensualisé × heures d'absence ÷ heures prévues dans le mois.
  const deduction = prevues > 0 ? arrondi((salaireMensualise * absencesDeduites) / prevues) : 0
  const tauxMajore = contrat.tauxHoraireBrut * (1 + contrat.tauxMajoration)
  const montantComplementaires = arrondi(complementaires * contrat.tauxHoraireBrut)
  const montantMajorees = arrondi(majorees * tauxMajore)
  const salaireBrut = arrondi(salaireMensualise - deduction + montantComplementaires + montantMajorees)
  const indemnitesEntretien = arrondi(joursActivite * contrat.indemniteEntretienParJour)
  const indemnitesRepas = arrondi(repas * contrat.prixRepas)

  const lignes: LigneCalcul[] = [
    {
      libelle: 'Salaire mensualisé',
      detail: `${heures(heuresHebdo(contrat))} × ${semainesMensualisees(contrat)} semaines ÷ 12 = ${heures(mensu.heures)} × ${euros(contrat.tauxHoraireBrut)}`,
      montant: salaireMensualise
    }
  ]
  if (deduction > 0) {
    lignes.push({
      libelle: 'Absences déduites',
      detail: `${euros(salaireMensualise)} × ${heures(absencesDeduites)} d'absence ÷ ${heures(prevues)} prévues ce mois`,
      montant: -deduction
    })
  }
  if (complementaires > 0) {
    lignes.push({
      libelle: 'Heures complémentaires',
      detail: `${heures(complementaires)} × ${euros(contrat.tauxHoraireBrut)}`,
      montant: montantComplementaires
    })
  }
  if (majorees > 0) {
    lignes.push({
      libelle: `Heures majorées (+${Math.round(contrat.tauxMajoration * 100)} %)`,
      detail: `${heures(majorees)} au-delà de 45 h dans la semaine × ${euros(tauxMajore)}`,
      montant: montantMajorees
    })
  }
  if (indemnitesEntretien > 0) {
    lignes.push({
      libelle: "Indemnités d'entretien",
      detail: `${joursActivite} jours × ${euros(contrat.indemniteEntretienParJour)}`,
      montant: indemnitesEntretien
    })
  }
  if (indemnitesRepas > 0) {
    lignes.push({
      libelle: 'Repas',
      detail: `${repas} repas × ${euros(contrat.prixRepas)}`,
      montant: indemnitesRepas
    })
  }

  return {
    mois,
    heuresMensualisees: arrondi(mensu.heures),
    salaireMensualise,
    heuresPrevues: arrondi(prevues),
    heuresAbsenceDeduites: arrondi(absencesDeduites),
    deductionAbsences: deduction,
    heuresComplementaires: arrondi(complementaires),
    heuresMajorees: arrondi(majorees),
    salaireBrut,
    joursActivite,
    indemnitesEntretien,
    indemnitesRepas,
    totalBrutAvecIndemnites: arrondi(salaireBrut + indemnitesEntretien + indemnitesRepas),
    lignes
  }
}
