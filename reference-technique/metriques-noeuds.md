---
title: Métriques des nœuds Lightning
description: >-
  Documentation des métriques disponibles et leur interprétation pour les nœuds
  Lightning Daznode.
order: 3
lastUpdated: 2024-06-07T00:00:00.000Z
author: Équipe Daznode
category:
  - technique
layout: base.njk
---

# Métriques des nœuds Lightning

## API de métriques

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/nodes/:nodeId/metrics` | Métriques générales du nœud |
| `GET /api/v1/nodes/:nodeId/metrics/channels` | Métriques des canaux |
| `GET /api/v1/nodes/:nodeId/metrics/routing` | Métriques de routage |
| `GET /api/v1/nodes/:nodeId/metrics/liquidity` | Métriques de liquidité |

### Champs obligatoires
- `nodeId` - Identifiant du nœud
- `startTime` (optionnel) - Timestamp de début (ISO-8601)
- `endTime` (optionnel) - Timestamp de fin (ISO-8601)
- `interval` (optionnel) - Intervalle d'agrégation (`hour`, `day`, `week`, `month`)

### Exemple de requête
```http
GET /api/v1/nodes/03b6e9.../metrics?startTime=2024-06-01T00:00:00Z&endTime=2024-06-07T23:59:59Z&interval=day HTTP/1.1
Host: api.dazno.de
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemple de réponse
```json
{
  "status": "success",
  "data": {
    "timeframe": {
      "start": "2024-06-01T00:00:00Z",
      "end": "2024-06-07T23:59:59Z",
      "interval": "day"
    },
    "uptime": 99.7,
    "channels": {
      "active": 12,
      "inactive": 1,
      "pending": 2,
      "total": 15
    },
    "capacity": {
      "total": 15000000,
      "outbound": 8500000,
      "inbound": 6500000
    },
    "transactions": {
      "count": 127,
      "volume": 4250000,
      "fees": 1230
    },
    "daily": [
      {
        "date": "2024-06-01",
        "channels": {"active": 10, "inactive": 0, "pending": 0},
        "transactions": {"count": 15, "volume": 500000, "fees": 150}
      },
      {
        "date": "2024-06-07",
        "channels": {"active": 12, "inactive": 1, "pending": 2},
        "transactions": {"count": 22, "volume": 750000, "fees": 210}
      }
    ]
  }
}
```

### Limites connues
- 100 requêtes par heure
- Données conservées 90 jours (standard), 1 an (premium)
- Granularité minimale: 1 heure
- Délai de rafraîchissement: 5 minutes

### Liens associés
- [Analyse des performances de nœud](/tutoriels/analyse-performances.md)
- [Optimisation des canaux](/tutoriels/optimisation-canaux.md) 
