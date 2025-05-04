---
title: Canal Lightning
description: Définition et fonctionnement d'un canal de paiement sur le Lightning Network.
order: 2
lastUpdated: 2024-06-07T00:00:00.000Z
author: Équipe Daznode
category:
  - glossaire
layout: base.njk
---

# Canal Lightning

## Définition

Un canal Lightning est une connexion financière entre deux nœuds du réseau Lightning qui permet d'effectuer des transactions instantanées sans publication sur la blockchain Bitcoin. C'est la fondation du Lightning Network.

## Fonctionnement technique

- **Ouverture** : Transaction multi-signature sur la blockchain Bitcoin
- **Opérations** : Mises à jour d'état hors chaîne (off-chain) signées par les deux parties
- **Fermeture** : Publication du dernier état sur la blockchain

## Types de canaux

| Type | Description | Utilisation |
|------|-------------|-------------|
| Public | Annoncé dans le réseau | Routage des paiements |
| Privé | Non annoncé | Transactions confidentielles |
| Sortant | Vous avez ouvert le canal | Envoyer des paiements |
| Entrant | Un pair a ouvert le canal vers vous | Recevoir des paiements |

## Caractéristiques essentielles

- **Capacité** : Montant total de bitcoins alloué au canal
- **Solde local** : Fonds que vous pouvez envoyer
- **Solde distant** : Fonds que votre pair peut envoyer
- **HTLC** : Contrats conditionnels permettant le routage sécurisé

## Voir aussi
- [Nœud Lightning](/faq-glossaire/node.md)
- [Ouvrir des canaux Lightning](/tutoriels/guide-demarrage-daznode.md)
- [HTLC](/faq-glossaire/htlc.md) 
