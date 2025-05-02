---
layout: base.njk
title: Nœud Lightning
description: Définition et fonctionnement d'un nœud Lightning Network.
order: 1
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [glossaire]
---

# Nœud Lightning

## Définition

Un nœud Lightning est un serveur qui participe au réseau Lightning Network en maintenant des canaux de paiement et en routant des transactions. Il exécute un logiciel comme LND, c-lightning ou Eclair.

## Caractéristiques essentielles

- **Gère des canaux** : Établit et maintient des connexions financières avec d'autres nœuds
- **Route les paiements** : Transmet les transactions entre l'expéditeur et le destinataire
- **Applique le protocole** : Respecte les spécifications BOLT (Basis of Lightning Technology)
- **Conserve des fonds** : Verrouille des bitcoins pour les utiliser dans des transactions rapides

## Types de nœuds

| Type | Description | Avantages | Inconvénients |
|------|-------------|-----------|--------------|
| Nœud complet | Exécute également un nœud Bitcoin | Sécurité maximale | Ressources importantes |
| Nœud léger | Se connecte à un nœud Bitcoin externe | Plus simple à gérer | Dépendance à un tiers |
| Nœud custodial | Géré par un service tiers | Aucune configuration | Pas de contrôle des clés |

## Logiciels principaux

- **[LND](https://github.com/lightningnetwork/lnd)** - Développé par Lightning Labs
- **[c-lightning](https://github.com/ElementsProject/lightning)** - Développé par Blockstream
- **[Eclair](https://github.com/ACINQ/eclair)** - Développé par ACINQ
- **[LDK](https://github.com/lightningdevkit/ldk)** - Lightning Development Kit

## Voir aussi
- [Ouvrir des canaux Lightning](/tutoriels/guide-demarrage-daznode.md)
- [Métriques des nœuds](/reference-technique/metriques-noeuds.md)
- [Canal Lightning](/faq-glossaire/canal.md) 