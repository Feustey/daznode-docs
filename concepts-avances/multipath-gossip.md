---
layout: base.njk
title: Multipath & Gossip
description: Routage multipath et protocoles de diffusion sur le Lightning Network.
order: 4
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [concepts-avances]
---

# Multipath payments, gossip layer et techniques avancées

## Problème
Les paiements de gros montants échouent souvent faute de liquidité suffisante sur un seul canal. Le routage dépend d'une information de réseau (gossip) parfois incomplète ou obsolète, ce qui limite la fiabilité et la rapidité des paiements.

## Solution
- Utilisez les paiements multi-chemins (MPP) pour diviser un paiement en plusieurs sous-parties routées indépendamment.
- Surveillez la couche gossip pour détecter les changements de topologie et adapter vos routes en temps réel.
- Implémentez des stratégies de probing pour tester la liquidité avant d'envoyer un paiement important.
- Adoptez des outils comme `bos probe` ou `lncli sendpayment --max_parts` pour exploiter le MPP.

## Risques
- Augmentation de la complexité du routage et du risque d'échec partiel.
- Confidentialité réduite : chaque sous-paiement peut emprunter un chemin différent.
- Consommation de bande passante accrue pour maintenir une vue à jour du réseau via le gossip.

## Références externes
- [BOLT 4: Onion Routing Protocol](https://github.com/lightning/bolts/blob/master/04-onion-routing.md)
- [BOLT 7: Gossip Protocol](https://github.com/lightning/bolts/blob/master/07-routing-gossip.md)
- [Multipath Payments (BOLT 11)](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md)

## Liens utiles
- [Ouvrir des canaux Lightning](/tutoriels/guide-demarrage-daznode.md)
- [Optimisation des canaux](/tutoriels/optimisation-canaux.md)
- [Métriques de routage](/reference-technique/metriques-noeuds.md) 