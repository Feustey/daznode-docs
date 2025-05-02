---
title: Heuristiques d'optimisation Lightning
description: Documentation des algorithmes et heuristiques utilisés pour l'optimisation des nœuds Lightning sur Daznode.
order: 4
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [technique]
---

# Heuristiques d'optimisation Lightning

## API Heuristiques

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/nodes/:nodeId/heuristics/suggestions` | Suggestions d'optimisation |
| `GET /api/v1/nodes/:nodeId/heuristics/channel-scores` | Score de chaque canal |
| `GET /api/v1/nodes/:nodeId/heuristics/peer-recommendations` | Recommandations de pairs |
| `GET /api/v1/nodes/:nodeId/heuristics/fee-strategy` | Stratégie de frais optimale |

### Champs obligatoires
- `nodeId` - Identifiant du nœud
- `optimizationTarget` (optionnel) - Cible d'optimisation (`fees`, `liquidity`, `reliability`, `balanced`)

### Exemple de requête
```http
GET /api/v1/nodes/03b6e9.../heuristics/suggestions?optimizationTarget=fees HTTP/1.1
Host: api.dazno.de
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemple de réponse
```json
{
  "status": "success",
  "data": {
    "optimizationTarget": "fees",
    "suggestionScore": 78,
    "suggestions": [
      {
        "type": "ADJUST_FEES",
        "channelId": "123456x789x1",
        "currentValue": 100,
        "suggestedValue": 250,
        "impact": "high",
        "reason": "High traffic channel with below-market fees"
      },
      {
        "type": "REBALANCE",
        "channelId": "123456x789x2",
        "currentLocal": 950000,
        "currentRemote": 50000,
        "suggestedLocal": 700000,
        "suggestedRemote": 300000,
        "impact": "medium",
        "reason": "Outbound capacity nearly depleted"
      },
      {
        "type": "CLOSE_CHANNEL",
        "channelId": "123456x789x3",
        "impact": "low",
        "reason": "Inactive for 60+ days with poor connectivity"
      }
    ]
  }
}
```

### Limites connues
- 10 requêtes par heure
- Les suggestions sont basées sur des données historiques (jusqu'à 7 jours)
- L'optimisation avancée requiert un compte Premium
- Performances prédictives variables selon la volatilité du réseau

### Liens associés
- [Optimisation automatique des nœuds](/tutoriels/optimisation-automatique.md)
- [Stratégies de frais avancées](/tutoriels/strategie-frais.md) 