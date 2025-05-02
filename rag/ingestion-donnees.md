---
layout: base.njk
title: Ingestion de données
description: Processus d'intégration et de préparation des données Lightning pour le RAG.
order: 3
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [rag]
---

# Ingestion de données

## Sources Lightning Network

[Dazno.de](https://dazno.de) collecte des données depuis plusieurs sources Lightning Network :

- **Amboss** : Métriques des nœuds et canaux (capacité, uptime, frais)
- **LNbits** : Données transactionnelles et utilisation de wallets
- **Sparkseer** : Analytics avancés du réseau
- **1ML, Mempool.space** : Données complémentaires
- **API Lightning** : Données techniques des nœuds

## Pipeline de nettoyage et enrichissement

1. **Extraction** : Collecte des données brutes via APIs
2. **Nettoyage** : Normalisation des formats, correction des anomalies
3. **Enrichissement** : Ajout de métadonnées, annotations sémantiques
4. **Stockage** : Indexation dans MongoDB

## Fréquence d'update

- **Données critiques** : Mise à jour toutes les 5-15 minutes
- **Métriques générales** : Actualisation toutes les 3-6 heures
- **Données historiques** : Mises à jour quotidiennes

## Exemple de prétraitement

```python
# Pseudo-code du processus d'ingestion
async def process_ln_data(source_name):
    raw_data = await fetch_from_source(source_name)
    
    # Nettoyage et validation
    clean_data = []
    for record in raw_data:
        if validate_ln_record(record):
            normalized = normalize_format(record)
            enriched = add_metadata(normalized)
            clean_data.append(enriched)
    
    # Stockage dans MongoDB
    await store_documents(clean_data)
    
    # Mise à jour du cache Redis si nécessaire
    await invalidate_related_cache()
```

> [!note]
> Le système maintient une traçabilité complète des sources pour chaque élément d'information. 