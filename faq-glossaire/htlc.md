---
layout: base.njk
title: HTLC
description: Définition et fonctionnement des Hashed Timelock Contracts dans le Lightning Network.
order: 3
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [glossaire]
---

# HTLC (Hashed Timelock Contract)

## Définition

Un HTLC est un contrat intelligent utilisé dans le Lightning Network qui garantit la sécurité des paiements lors du routage à travers plusieurs nœuds. Il combine un verrou temporel (timelock) et un verrou cryptographique (hashlock).

## Fonctionnement technique

- **Hashlock** : Verrouille les fonds jusqu'à ce qu'une préimage secrète soit révélée
- **Timelock** : Garantit l'expiration et le remboursement si le paiement n'est pas complété
- **Atomicité** : Assure que le paiement est soit entièrement complété, soit entièrement annulé

## Exemple de flux HTLC

1. Alice veut payer Charlie via Bob
2. Charlie crée un secret R et envoie son hash H à Alice
3. Alice crée un HTLC avec Bob : "Paie Bob si R est révélé avant expiration"
4. Bob crée un HTLC avec Charlie : "Paie Charlie si R est révélé avant expiration"
5. Charlie révèle R à Bob pour réclamer son paiement
6. Bob utilise R pour réclamer son paiement d'Alice
7. Les fonds circulent sans risque de perte

## Importance dans le réseau

- **Sécurité** : Empêche le vol de fonds pendant le transit
- **Confiance** : Permet de transiter par des nœuds non fiables
- **Scalabilité** : Permet d'effectuer des milliers de transactions sans congestionner la blockchain

## Voir aussi
- [Canal Lightning](/faq-glossaire/canal.md)
- [Multipath payments](/concepts-avances/multipath-gossip.md)
- [Onion Routing](/faq-glossaire/onion-routing.md) 