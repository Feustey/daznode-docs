---
title: API Endpoints Daznode
description: >-
  Documentation technique complète des endpoints API exposés par la plateforme
  Daznode.
order: 1
lastUpdated: 2024-06-07T00:00:00.000Z
author: Équipe Daznode
category:
  - technique
layout: base.njk
---

# API Endpoints Daznode

## Authentification

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/auth/token` | Génère un token JWT |

### Champs obligatoires
- `email` - Email du compte utilisateur
- `password` - Mot de passe du compte

### Exemple de requête
```http
POST /api/v1/auth/token HTTP/1.1
Host: api.dazno.de
Content-Type: application/json

{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse"
}
```

### Exemple de réponse
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### Limites connues
- 5 tentatives d'authentification par minute
- Token valide 24 heures
- Nécessite la 2FA si activée sur le compte

### Liens associés
- [Créer un compte Daznode](/tutoriels/guide-demarrage-daznode.md)
- [Sécurisation de votre compte](/tutoriels/securiser-compte.md)

---

## Nœuds Lightning

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/nodes` | Liste tous les nœuds de l'utilisateur |
| `GET /api/v1/nodes/:id` | Récupère les détails d'un nœud |
| `POST /api/v1/nodes` | Crée un nouveau nœud |
| `DELETE /api/v1/nodes/:id` | Supprime un nœud existant |

### Champs obligatoires
#### Pour la création (`POST`)
- `name` - Nom du nœud
- `type` - Type de nœud (`standard`, `enterprise`, `custodial`)

### Exemple de requête
```http
POST /api/v1/nodes HTTP/1.1
Host: api.dazno.de
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "MonNoeudLightning",
  "type": "standard"
}
```

### Exemple de réponse
```json
{
  "status": "success",
  "data": {
    "nodeId": "03b6e9b85f599eee4fa4c17b5c1141e521251c1accff10d6343b47293d439183a6",
    "name": "MonNoeudLightning",
    "type": "standard",
    "status": "initializing",
    "createdAt": "2024-06-07T12:34:56Z"
  }
}
```

### Limites connues
- 10 requêtes par minute par endpoint
- 5 nœuds maximum par compte standard
- Le nœud peut prendre jusqu'à 2 minutes pour initialiser
- Limite de 20 canaux par nœud sur les comptes gratuits

### Liens associés
- [Créer votre nœud Lightning](/tutoriels/guide-demarrage-daznode.md)
- [Gestion avancée des nœuds](/tutoriels/gestion-noeuds.md) 
