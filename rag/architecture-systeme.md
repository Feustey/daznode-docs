---
layout: base.njk
title: Architecture du système RAG
description: Description de l'architecture technique du système RAG appliqué à Lightning Network.
order: 2
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [rag]
---

# Architecture du système RAG

## Vue d'ensemble

Le MCP (Modèle de Connaissance Partagée) de [dazno.de](https://dazno.de) adopte une architecture modulaire conçue pour la performance et l'extensibilité, articulée autour de composants clés interagissant de manière asynchrone.

## Schéma général

Sources → Ingestion → Vecteurs → Modèle → Réponse

![Schéma MCP](../../public/assets/images/mcp-architecture-diagram.png)

## Composants principaux

- **Workflow RAG** : Orchestration du processus complet
- **Bases de données** : MongoDB (persistante) et Redis (cache)
- **API d'intelligence** : OpenAI pour embeddings et génération
- **Interface** : API RESTful pour l'interaction

## Stack technique

- **Python 3.9+** : Langage principal
- **MongoDB** : Stockage des documents et embeddings
- **Redis** : Cache pour réponses fréquentes
- **FastAPI** : Framework web pour l'API
- **OpenAI API** : Génération d'embeddings et de réponses

> [!tip]
> Cette architecture permet d'adapter la puissance du RAG spécifiquement aux données Lightning Network. 