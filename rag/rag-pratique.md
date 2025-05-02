---
layout: base.njk
title: RAG en pratique
description: Exemples de requêtes, prompts et résultats pour le RAG.
order: 5
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [rag]
---

# RAG en pratique

## Exemples de requêtes utilisateur

Sur [dazno.de](https://dazno.de), les utilisateurs peuvent poser des questions comme :

> "Quels sont les canaux les plus actifs sur le Lightning Network cette semaine ?"

> "Explique la topologie actuelle du réseau autour de LNBIG"

> "Comment évolue la capacité globale du réseau depuis 3 mois ?"

## Chaîne d'appel complète

1. **Analyse de la requête** : Extraction des entités et intentions
2. **Retrieval** : Recherche sémantique dans la base de connaissances
3. **Augmentation** : Construction du contexte avec documents pertinents
4. **Génération** : Production de la réponse avec citations

## Exemple de prompt complet

```text
Tu es un expert Lightning Network chez dazno.de. Utilise uniquement les informations fournies pour répondre.

CONTEXTE:
{documents}

QUESTION: {query}

INSTRUCTIONS:
1. Réponds de manière précise et factuelle
2. Cite tes sources entre parenthèses
3. Si l'information n'est pas dans le contexte, indique-le clairement
4. Organise ta réponse de façon structurée
5. Ne mentionne pas que tu es une IA
```

## Résultats obtenus

```json
{
  "response": "Les canaux les plus actifs cette semaine sont principalement ceux connectés aux grands nœuds River Financial et Kraken. Le canal entre River Financial et Kraken a traité 432 BTC de volume (Amboss, 06/07/2024), suivi par River-Bitfinex avec 278 BTC. ACINQ et LightningNetwork+ maintiennent également des canaux très actifs dans le top 10 mondial. La concentration d'activité reste forte entre les nœuds institutionnels.",
  "sources": ["amboss:channels/top", "1ml:statistics/weekly", "sparkseer:volume/week23"],
  "processing_time": "0.42s",
  "cache_hit": false
}
```

> [!note]
> Le système [dazno.de](https://dazno.de) apprend continuellement de l'historique des requêtes pour améliorer ses réponses futures. 