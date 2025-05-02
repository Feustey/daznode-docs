---
layout: base.njk
title: Évaluation des performances
description: Métriques, cas limites et benchmarks pour le RAG.
order: 6
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [rag]
---

# Évaluation des performances

## Métriques clés

[Dazno.de](https://dazno.de) évalue son système RAG selon plusieurs dimensions :

- **Précision factuelle** : Concordance avec les données source (90-95%)
- **Pertinence** : Adéquation de la réponse à la question (85-90%)
- **Exhaustivité** : Couverture des aspects importants (80-85%)
- **Latence** : Temps de réponse total (<2 secondes)
- **Taux de cache** : Proportion de requêtes servies depuis le cache (30-40%)

## Cas limites identifiés

- **Requêtes multifacettes** : Questions combinant plusieurs concepts distants
- **Données conflictuelles** : Sources fournissant des informations contradictoires
- **Données trop récentes** : Informations pas encore intégrées au système
- **Requêtes hypothétiques** : Questions sur des scénarios futurs ou conditionnels

## Stratégies d'amélioration continue

- **Évaluation humaine** : Notation manuelle des réponses sur échantillon aléatoire
- **Feedback utilisateur** : Intégration des retours utilisateurs directs
- **Test A/B** : Comparaison de différentes stratégies de retrieval et prompting
- **Analyse d'erreurs** : Identification systématique des patterns d'échec

## Benchmarks comparatifs

| Métrique | [Dazno.de](https://dazno.de) | GPT sans RAG | Assistant spécialisé |
|----------|-------|------------|---------------------|
| Précision LN | 92% | 63% | 78% |
| Fraîcheur | <24h | >6 mois | Variable |
| Latence | 1.8s | 3.2s | 2.5s |
| Citations | 100% | 0% | 20% |

> [!tip]
> La puissance du système repose sur la combinaison de données fraîches et variées avec un modèle optimisé spécifiquement pour Lightning Network. 