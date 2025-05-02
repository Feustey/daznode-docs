---
title: Quelle est la différence entre Bitcoin et Lightning Network ?
description: Comprendre les différences fondamentales entre la blockchain Bitcoin et le Lightning Network.
order: 6
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [faq]
---

# Quelle est la différence entre Bitcoin et Lightning Network ?

## Problème

Les transactions Bitcoin souffrent de limitations inhérentes : coûts élevés, temps de confirmation longs, scalabilité limitée. Ces contraintes empêchent l'usage de Bitcoin comme moyen de paiement quotidien.

## Solution

Le Lightning Network résout ces problèmes en créant une couche supplémentaire au-dessus de Bitcoin :

| Caractéristique | Bitcoin | Lightning Network |
|-----------------|---------|-------------------|
| Vitesse | 10 minutes par bloc | Instantané (<1 seconde) |
| Frais | 1-5 USD | <0.01 USD |
| Capacité | ~7 TPS | Millions TPS |
| Finalité | Probabiliste (6 confirmations) | Immédiate |
| Utilisation idéale | Grosses sommes, finalité | Micro-paiements, transactions quotidiennes |
| Stockage des données | Sur chaque nœud, permanent | Uniquement entre participants, temporaire |

Lightning fonctionne en créant des canaux de paiement qui permettent de transférer des fonds instantanément sans enregistrer chaque transaction sur la blockchain. Seules les transactions d'ouverture et de fermeture de canal sont inscrites sur la blockchain Bitcoin.

## Risques

- **Liquidité** : Nécessite des fonds bloqués dans des canaux
- **Connectivité** : Requiert que les nœuds soient en ligne
- **Complexité technique** : Plus difficile à comprendre et utiliser
- **Maturité** : Technologie plus récente, encore en développement

## Liens utiles
- [Nœud Lightning](/faq-glossaire/node.md)
- [Canal Lightning](/faq-glossaire/canal.md)
- [Les piliers de la Blockchain](/basics/les-blockchains.md) 