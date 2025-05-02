---
layout: base.njk
title: Facture BOLT11
description: Format standard des factures de paiement sur le Lightning Network.
order: 4
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [glossaire]
---

# Facture BOLT11

## Définition

Une facture BOLT11 (aussi appelée Lightning Invoice) est un format standardisé pour demander un paiement sur le Lightning Network. Elle contient toutes les informations nécessaires pour effectuer un paiement.

## Structure de base

- **Préfixe réseau** : `lnbc` (mainnet), `lntb` (testnet)
- **Montant** : Valeur à payer, avec unité (n=nano, u=micro, m=milli)
- **Timestamp** : Date de création
- **Expiration** : Durée de validité
- **Description** : Objet du paiement
- **Hash de paiement** : Identifiant unique
- **Routing Hints** : Indices pour trouver une route
- **Signature** : Preuve d'authenticité

## Exemple décodé

```json
{
  "network": "mainnet",
  "amount": 150000,
  "timestamp": 1654267200,
  "expiry": 3600,
  "description": "Paiement pour service Daznode",
  "paymentHash": "0001020304050607080900010203040506070809000102030405060708090102",
  "destination": "03b6e9b85f599eee4fa4c17b5c1141e521251c1accff10d6343b47293d439183a6"
}
```

## Visualisation

Une facture BOLT11 apparaît comme une longue chaîne de caractères:

```
lnbc1500n1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspk28uwq
```

## Voir aussi
- [Format des données](/reference-technique/format-donnees.md)
- [Paiements Lightning](/faq-glossaire/paiement-ln.md)
- [HTLC](/faq-glossaire/htlc.md) 