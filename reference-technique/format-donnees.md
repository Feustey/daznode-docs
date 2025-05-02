---
title: Format des données Daznode
description: Spécifications techniques des formats de données utilisés dans l'écosystème Daznode.
order: 2
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [technique]
---

# Format des données Daznode

## Format BOLT11 (Factures Lightning)

| Champ | Description | Format |
|-------|-------------|--------|
| Préfixe | Identifie le réseau | `lnbc` (mainnet), `lntb` (testnet) |
| Montant | Valeur du paiement | Entier + suffixe (n=milli, u=micro, m=milli, p=pico) |
| Timestamp | Date de création | Unix timestamp |
| Expiration | Durée de validité | Secondes depuis création |
| Description | Objet du paiement | Chaîne UTF-8 ou hash |
| Routing | Informations de routage | R-records |
| Signature | Signature de la facture | 32 bytes |

### Structure obligatoire
Toute facture doit contenir:
- Préfixe réseau
- Montant
- Hash de paiement
- Expiration (défaut: 3600s)
- Signature valide

### Exemple de facture décodée
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

### Limites connues
- Longueur maximale: 1024 caractères
- Compatibilité variable selon les implémentations
- Expiration minimale: 60 secondes
- Montant minimum: 1 millionième de BTC

### Liens associés
- [Générer des factures Lightning](/tutoriels/reception-paiements.md)
- [Spécification BOLT11](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md)

---

## Format des transactions

| Champ | Description | Format |
|-------|-------------|--------|
| `txid` | Identifiant de transaction | Chaîne hexadécimale (32 bytes) |
| `amount` | Montant en satoshis | Entier positif |
| `direction` | Direction du flux | `incoming` ou `outgoing` |
| `status` | État de la transaction | `pending`, `completed`, `failed` |
| `timestamp` | Date d'exécution | ISO-8601 (ex: "2024-06-07T13:45:22Z") |
| `channelId` | Identifiant du canal utilisé | Chaîne (format: `txid:vout`) |
| `fee` | Frais payés | Entier (en satoshis) |
| `description` | Description/mémo | Chaîne UTF-8 |

### Structure obligatoire
Chaque transaction doit inclure:
- `txid`
- `amount`
- `direction`
- `status`
- `timestamp`

### Exemple de transaction
```json
{
  "txid": "3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0",
  "amount": 250000,
  "direction": "outgoing",
  "status": "completed",
  "timestamp": "2024-06-07T13:45:22Z",
  "channelId": "123456x789x1",
  "fee": 5,
  "description": "Paiement service web"
}
```

### Limites connues
- Rétention des données: 90 jours pour comptes standard
- 10,000 transactions maximum par requête d'historique
- Description limitée à 280 caractères

### Liens associés
- [Gestion des transactions](/tutoriels/gestion-transactions.md)
- [Export des données](/tutoriels/export-donnees.md) 