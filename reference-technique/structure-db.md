---
title: Structure de la base de données Daznode
description: Documentation du schéma de base de données et du modèle de données de la plateforme Daznode.
order: 5
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [technique]
---

# Structure de la base de données Daznode

## Schéma Général

| Collection/Table | Description | Clé primaire |
|------------------|-------------|--------------|
| `users` | Utilisateurs du service | `userId` |
| `nodes` | Nœuds Lightning | `nodeId` |
| `channels` | Canaux Lightning | `channelId` |
| `transactions` | Transactions | `txId` |
| `invoices` | Factures générées | `invoiceId` |
| `payments` | Paiements effectués | `paymentId` |
| `metrics` | Métriques agrégées | `metricId` |
| `logs` | Journaux système | `logId` |

### Structure obligatoire
- Type document (MongoDB)
- Index sur tous les champs d'identifiant
- Horodatage sur toutes les entrées (`createdAt`, `updatedAt`)
- Relations via références (pas de jointures)

### Exemple de document utilisateur
```json
{
  "userId": "usr_a1b2c3d4e5",
  "email": "utilisateur@exemple.com",
  "hashedPassword": "$2a$12$k8Y1Vn4Cdus...",
  "twoFactorEnabled": true,
  "twoFactorSecret": "JBSWY3DPEHPK3PXP",
  "lastLoginAt": "2024-06-07T08:23:14Z",
  "createdAt": "2023-05-15T14:30:22Z",
  "updatedAt": "2024-06-07T08:23:14Z",
  "subscription": {
    "type": "standard",
    "startDate": "2023-05-15T14:30:22Z",
    "endDate": "2024-05-15T14:30:22Z",
    "autoRenew": true
  },
  "preferences": {
    "currency": "EUR",
    "timezone": "Europe/Paris",
    "notifications": {
      "email": true,
      "browser": false
    }
  }
}
```

### Limites connues
- Requêtes complexes limitées à 5 secondes d'exécution
- Taille maximale de document: 16MB
- TTL (durée de conservation):
  - Métriques détaillées: 90 jours
  - Journaux: 30 jours
  - Transactions: Conservation permanente

### Liens associés
- [Export de vos données](/tutoriels/export-donnees.md)
- [API d'intégration](/reference-technique/api-endpoints.md)

---

## Format node_state

| Champ | Type | Description |
|-------|------|-------------|
| `nodeId` | `String` | Identifiant du nœud (clé publique) |
| `userId` | `String` | Référence au propriétaire |
| `state` | `String` | État du nœud (`initializing`, `online`, `offline`, `error`) |
| `version` | `String` | Version de LND utilisée |
| `alias` | `String` | Alias public du nœud |
| `color` | `String` | Couleur hexadécimale du nœud |
| `addresses` | `Array` | Adresses réseau du nœud |
| `uris` | `Array` | URIs complètes de connexion |
| `channels` | `Object` | Statistiques des canaux |
| `capacity` | `Object` | Informations de capacité |
| `sync` | `Object` | État de synchronisation |
| `uptime` | `Object` | Statistiques de disponibilité |

### Structure obligatoire
Les données de nœud doivent inclure:
- `nodeId`
- `userId`
- `state`
- Statistiques minimales (canaux, capacité)

### Exemple de document node_state
```json
{
  "nodeId": "03b6e9b85f599eee4fa4c17b5c1141e521251c1accff10d6343b47293d439183a6",
  "userId": "usr_a1b2c3d4e5",
  "state": "online",
  "version": "0.16.4-beta",
  "alias": "DaznodeUser123",
  "color": "#3399ff",
  "addresses": [
    { "network": "tcp", "addr": "13.37.13.37:9735" }
  ],
  "uris": [
    "03b6e9b85f599eee4fa4c17b5c1141e521251c1accff10d6343b47293d439183a6@13.37.13.37:9735"
  ],
  "channels": {
    "active": 12,
    "inactive": 1,
    "pending": 2,
    "private": 3,
    "public": 10
  },
  "capacity": {
    "total": 15000000,
    "local": 8500000,
    "remote": 6500000
  },
  "sync": {
    "chain": true,
    "graph": true,
    "lastUpdated": "2024-06-07T10:15:22Z"
  },
  "uptime": {
    "last24h": 99.8,
    "last7d": 99.2,
    "last30d": 98.7
  },
  "createdAt": "2023-05-15T14:45:22Z",
  "updatedAt": "2024-06-07T10:15:22Z"
}
```

### Limites connues
- Rafraîchissement des données toutes les 5 minutes
- Information partielle sur les canaux privés d'autres nœuds
- Certaines métriques avancées disponibles uniquement pour comptes Premium

### Liens associés
- [Supervision de nœuds](/tutoriels/supervision-noeuds.md)
- [API métriques](/reference-technique/metriques-noeuds.md) 