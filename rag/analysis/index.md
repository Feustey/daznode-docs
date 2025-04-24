---
layout: base.njk
title: "Analyse détaillée du MCP de Daznode"
---

# Le MCP de Daznode : Architecture et fonctionnement

*Temps de lecture estimé : 10 minutes*

## Introduction

**MCP** est un système avancé de question-réponse conçu pour fournir des réponses précises et contextuelles. Il s'appuie sur la technique **RAG (Retrieval-Augmented Generation)**, qui combine la recherche d'informations pertinentes dans un corpus de documents avec la capacité de génération de texte de modèles de langage avancés.

L'objectif principal du MCP est de permettre aux utilisateurs d'interroger une base de connaissances documentaire et d'obtenir des réponses synthétisées, fiables et sourcées, tout en offrant une architecture robuste, performante et extensible.

## Fonctionnalités Clés

*   **Ingestion de Documents :** Capacité à traiter et stocker divers documents pour construire la base de connaissances.
*   **Recherche Sémantique :** Recherche de passages pertinents dans les documents basée sur le sens de la question, et non uniquement sur les mots-clés.
*   **Génération de Réponses Augmentée :** Utilisation des informations récupérées pour générer des réponses cohérentes, précises et contextuelles via un modèle de langage.
*   **API RESTful :** Interface standardisée pour interagir avec le système (ingestion, interrogation, gestion).
*   **Mise en Cache Intelligente :** Utilisation de Redis pour accélérer les réponses aux questions fréquentes.
*   **Stockage Persistant :** Utilisation de MongoDB pour stocker les documents, les embeddings, l'historique des requêtes et les métriques.
*   **Opérations Asynchrones :** Conception basée sur l'asynchronisme pour une meilleure performance et réactivité.
*   **Monitoring :** Collecte et exposition de métriques sur l'utilisation et la performance du système.
*   **Personnalisation :** Possibilité de personnaliser les prompts utilisés par le modèle de langage.

## Architecture

### Vue d'ensemble

MCP adopte une architecture modulaire conçue pour la performance et l'extensibilité, articulée autour de plusieurs composants clés interagissant de manière asynchrone.

<div class="diagram">
  <img src="/assets/images/mcp-architecture-diagram.png" alt="Architecture du MCP" width="800">
</div>

### Composants Principaux

*   **Workflow RAG (`src/rag.py`) :** Le cœur du système. Il orchestre l'ensemble du processus :
    *   Ingestion des documents et génération des embeddings.
    *   Réception des requêtes utilisateurs.
    *   Génération de l'embedding de la requête.
    *   Recherche sémantique dans MongoDB pour trouver les documents pertinents.
    *   Vérification du cache Redis.
    *   Construction du prompt pour le modèle de langage (en incluant les documents récupérés).
    *   Appel à l'API OpenAI pour la génération de la réponse.
    *   Mise en cache de la réponse dans Redis.
    *   Retour de la réponse à l'utilisateur.
*   **Gestion des Données (`src/models.py`) :** Définit les schémas de données utilisés dans l'application :
    *   `Document` : Représente un document ingéré avec son contenu, sa source, ses métadonnées et son embedding.
    *   `QueryHistory` : Enregistre les détails de chaque requête traitée (question, réponse, temps, source, cache hit/miss).
    *   `SystemStats` : Stocke les métriques de performance et d'utilisation du système.
*   **Opérations MongoDB (`src/mongo_operations.py`) :** Gère toutes les interactions avec la base de données MongoDB.
*   **Opérations Redis (`src/redis_operations.py`) :** Gère les interactions avec le cache Redis.
*   **Configuration (`src/database.py`) :** Centralise la configuration et la gestion des connexions aux bases de données.

### Flux de Données

1.  **Ingestion :**
    `Document (texte) → [API/Script] → Embedding (OpenAI) → Stockage (MongoDB)`
2.  **Interrogation :**
    `Requête (texte) → [API] → Embedding (OpenAI) → Recherche Sémantique (MongoDB) → Vérification Cache (Redis)`
    *   **Cache Hit :** `Récupération (Redis) → Réponse`
    *   **Cache Miss :** `Récupération Documents (MongoDB) → Construction Prompt → Génération (OpenAI) → Réponse → Mise en Cache (Redis)`

### Technologies Utilisées

*   **Langage :** Python (3.9+)
*   **Base de Données Persistante :** MongoDB
*   **Cache :** Redis
*   **IA (Embeddings & Génération) :** API OpenAI
*   **Web Framework :** FastAPI
*   **Librairies Principales :** `motor` (MongoDB async), `redis-py` (Redis async), `openai`, `pytest` (tests).

## Sources de Données

*   **Corpus de Documents :** La source primaire de connaissances. Ce sont les fichiers fournis au système lors de la phase d'ingestion.
*   **MongoDB :** Stocke les documents traités, l'historique des requêtes et les statistiques système.
*   **Redis :** Stocke les paires question/réponse pour une récupération rapide.

## APIs

### API RESTful interne

Le système expose une API RESTful pour permettre les interactions programmatiques.

*   **Endpoints Principaux :**
    *   `POST /v1/documents` : Ingestion d'un nouveau document.
    *   `GET /v1/documents/{document_id}` : Récupération d'un document spécifique.
    *   `POST /v1/query` : Soumission d'une question au système RAG.
    *   `GET /v1/history` : Consultation de l'historique des requêtes (avec pagination).
    *   `GET /v1/stats` : Récupération des statistiques d'utilisation et de performance.

### API Externe Utilisée

*   **API OpenAI :** Utilisée pour deux fonctions critiques :
    1.  **Génération d'Embeddings :** Transformer le contenu textuel en représentations vectorielles.
    2.  **Génération de Texte :** Synthétiser la réponse finale en se basant sur la question et les documents pertinents.

## Intelligence IA & RAG

### RAG (Retrieval-Augmented Generation)

C'est le cœur de l'intelligence du système. Le processus combine :

1.  **Retrieval (Récupération) :** Recherche dans la base de documents pour identifier les extraits les plus pertinents.
2.  **Augmentation :** Ajout des documents pertinents au contexte de la question initiale.
3.  **Generation (Génération) :** Production d'une réponse complète et cohérente par un grand modèle de langage.

### Composants IA

*   **Embeddings (OpenAI) :** Création des représentations vectorielles pour la recherche sémantique.
*   **Recherche Sémantique (MongoDB) :** Recherche de similarité entre le vecteur de la requête et les vecteurs des documents.
*   **Génération de Texte (OpenAI) :** Synthèse de la réponse finale.
*   **Personnalisation des Prompts :** Le comportement du modèle de langage peut être ajusté via des templates.

## Installation et Configuration

### Prérequis

*   Python 3.9+
*   MongoDB Community Edition
*   Redis
*   Clé API OpenAI

### Installation

1.  **Dépendances Système :** Installation de MongoDB et Redis
2.  **Clonage du Projet :** `git clone ...`
3.  **Environnement Python :** Création et activation d'un environnement virtuel
4.  **Dépendances Python :** Installation via `pip install -r requirements.txt`

### Configuration

1.  **Fichier d'environnement :** Copier `.env.example` vers `.env`
2.  **Édition de `.env` :** Renseigner les variables essentielles comme les connexions MongoDB, Redis et la clé OpenAI

## Utilisation

### Via le Code (Script/Intégration)

```python
from src.rag import RAGWorkflow
import asyncio

async def main():
    # Initialisation
    rag = RAGWorkflow()

    # Interrogation
    question = "Quelle est l'architecture du système MCP ?"
    response_data = await rag.query(question)

    print(f"Question: {question}")
    print(f"Réponse: {response_data['response']}")
    print(f"Sources: {response_data['sources']}")
    print(f"Cache Hit: {response_data['cache_hit']}")

# Exécution
if __name__ == "__main__":
    asyncio.run(main())
```

### Via l'API RESTful

**Exemple d'interrogation avec `curl` :**

```bash
curl -X POST http://localhost:8000/v1/query \
     -H "Content-Type: application/json" \
     -d '{
           "query": "Comment fonctionne la mise en cache ?"
         }'
```

## Monitoring et Performance

*   **Métriques :** Collecte de statistiques sur les documents ingérés, les requêtes traitées, les temps de traitement et le taux de cache hit.
*   **Mise en Cache :** Utilisation de Redis pour réduire les temps de réponse et les coûts API.
*   **Asynchronisme :** Optimisation des opérations d'I/O pour améliorer la réactivité globale.
*   **Indexation :** Utilisation d'index vectoriels dans MongoDB pour accélérer la recherche sémantique.

## Potentiel et Extensibilité

L'architecture modulaire du MCP facilite son extension avec de nouvelles fonctionnalités :

*   Support de nouveaux types de documents ou sources de données
*   Intégration de modèles d'embedding ou de génération alternatifs
*   Amélioration des stratégies de recherche (hybride: sémantique + mots-clés)
*   Interface utilisateur graphique
*   Système d'évaluation et de feedback sur la qualité des réponses

## Contribution et Licence

*   **Contribution :** Le projet encourage les contributions via le processus standard de GitHub.
*   **Licence :** Le projet est distribué sous la licence MIT.

---

Pour plus d'informations sur l'utilisation du MCP ou pour signaler un problème, consultez notre [documentation technique complète](https://github.com/daznode/mcp) ou contactez notre équipe de support. 