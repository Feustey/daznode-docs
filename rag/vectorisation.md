---
layout: base.njk
title: Vectorisation & Indexation
description: Méthodes de chunking, embeddings et index pour le RAG.
order: 4
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [rag]
---

# Vectorisation & Indexation

## Chunking optimisé

[Dazno.de](https://dazno.de) utilise un chunking adapté aux spécificités des données Lightning Network :

- **Chunks sémantiques** : Division suivant la structure logique des données
- **Niveau de granularité** : Adapté au type de donnée (nœud, canal, transaction)
- **Chevauchement** : 10-15% entre chunks pour préserver le contexte

## Embeddings

- **Modèle** : OpenAI text-embedding-3-small
- **Dimensions** : 1536
- **Paramètres** : Normalisation L2, weighted mean pooling
- **Spécialisation** : Fine-tuning sur vocabulaire Lightning Network

## Index vectoriel

- **MongoDB Atlas Vector Search**
- **Structure** : 
  - Clés : ID document, timestamp, métadonnées source
  - Valeurs : Vecteurs d'embedding, contenu texte, liens
- **Indexation** : HNSW pour recherche KNN efficace

## Heuristiques de scoring

- **Similarité cosinus** : Mesure de base entre vecteurs
- **Pondération temporelle** : Augmentation des données récentes
- **Diversité** : Mélange de sources complémentaires
- **Fiabilité** : Bonus pour les sources vérifiées

> [!tip]
> La qualité des embeddings est cruciale pour la pertinence des réponses. 