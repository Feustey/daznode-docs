---
layout: base.njk
title: Comment fonctionnent les frais sur le Lightning Network ?
description: Comprendre les différents types de frais et leur impact sur les paiements Lightning.
order: 9
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [faq]
---

# Comment fonctionnent les frais sur le Lightning Network ?

## Problème

La structure de frais du Lightning Network est différente de celle de Bitcoin, avec des frais à plusieurs niveaux et des mécanismes de calcul complexes qui peuvent être difficiles à comprendre.

## Solution

Le Lightning Network comprend deux types principaux de frais :

### Frais on-chain (blockchain)
- **Ouverture de canal** : Frais de transaction Bitcoin standard
- **Fermeture de canal** : Frais Bitcoin pour publier la transaction de fermeture
- **Commitment transactions** : Frais prévus pour les scénarios de fermeture forcée

### Frais de routage Lightning
- **Base fee** : Montant fixe par transfert (souvent 1 satoshi)
- **Fee rate** : Pourcentage du montant transféré (typiquement 1-500 ppm)

#### Exemple de calcul
```
Paiement de 100,000 sats via 3 sauts :
Nœud 1: 1 sat + (100 ppm × 100,000 ÷ 1,000,000) = 1 + 10 = 11 sats
Nœud 2: 0 sat + (200 ppm × 100,000 ÷ 1,000,000) = 0 + 20 = 20 sats
Nœud 3: 2 sat + (50 ppm × 100,000 ÷ 1,000,000) = 2 + 5 = 7 sats
Total: 38 sats (0.038% du paiement)
```

### Stratégies d'optimisation
- **Pour les utilisateurs** : Préférez les portefeuilles avec routage intelligent
- **Pour les opérateurs de nœuds** : Ajustez vos frais selon votre objectif (revenu vs volume)
- **Connaissance du réseau** : Surveillez les changements de politique de frais
- **Timing** : Les frais on-chain varient selon la congestion de Bitcoin

## Risques

- **Échec de paiement** : Des frais trop bas peuvent mener à des échecs de routage
- **Perte de compétitivité** : Des frais trop élevés réduisent l'attractivité de vos canaux
- **Volatilité des frais on-chain** : Les coûts d'ouverture/fermeture peuvent varier fortement
- **Complexité pour les débutants** : La structure de frais à plusieurs niveaux est complexe

## Liens utiles
- [Machine learning et prédiction des frais](/concepts-avances/ml-prediction-fees.md)
- [Métriques de routage](/reference-technique/metriques-noeuds.md)
- [Optimisation des canaux](/tutoriels/optimisation-canaux.md) 