---
layout: base.njk
title: "RGB - Les Fondamentaux"
description: "Comprendre l'architecture et les concepts clés du protocole RGB pour les actifs numériques sur Bitcoin."
keywords: ["RGB fondamentaux", "architecture RGB", "contrats RGB", "états", "transitions", "Bitcoin couche 3"]
---

# RGB - Les Fondamentaux 🏗️

*Temps de lecture estimé : 12 minutes*

## Architecture du Protocole 🔧

### Le Modèle RGB
RGB utilise un paradigme révolutionnaire basé sur trois concepts clés :
- **Contrats** : Définissent les règles et la logique métier
- **États** : Représentent l'état actuel des actifs
- **Transitions** : Décrivent les changements d'état validés

### Différences avec Ethereum 🔄
| Aspect | RGB | Ethereum |
|--------|-----|----------|
| Validation | Client-side | On-chain |
| Données | Off-chain | On-chain |
| Coûts | Minimaux | Variables |
| Confidentialité | Maximale | Publique |

## Concepts Clés 💡

### Single-Use Seals 🔐
Mécanisme garantissant qu'un actif ne peut être dépensé qu'une seule fois :
- Basé sur les UTXO Bitcoin
- Empêche la double dépense
- Assure l'intégrité des transferts

### Client-Side Validation ✅
Les utilisateurs valident eux-mêmes les contrats :
- Pas de congestion réseau
- Confidentialité préservée
- Évolutivité maximale

### Anchoring sur Bitcoin ⚓
Les preuves RGB sont ancrées sur Bitcoin :
- Sécurité de la blockchain Bitcoin
- Timestamps immuables
- Résistance à la censure

## Types de Contrats RGB 📋

### RGB20 - Tokens Fongibles 💰
- Équivalent d'ERC-20 sur Bitcoin
- Supply fixe ou variable
- Métadonnées riches

### RGB21 - Actifs Non-Fongibles 🎨
- NFT sur Bitcoin
- Propriétés uniques
- Transferts vérifiables

### RGB25 - Contrats Complexes 🤖
- Smart contracts avancés
- Logique métier personnalisée
- États composés

## Workflow RGB 🔄

1. **Création du Contrat** 📝
   - Définition des règles
   - Génération du Genesis
   - Publication des métadonnées

2. **Émission d'Actifs** 🏭
   - Allocation initiale
   - Distribution aux utilisateurs
   - Enregistrement sur Bitcoin

3. **Transferts** 🔄
   - Création des transitions
   - Validation client-side
   - Ancrage Bitcoin

4. **Vérification** ✅
   - Validation de l'historique
   - Vérification des preuves
   - Confirmation de l'état

## Sécurité et Confidentialité 🛡️

### Modèle de Menaces
RGB protège contre :
- Double dépense
- Création d'actifs non autorisée
- Modification de l'historique
- Surveillance des transactions

### Confidentialité par Design 🕵️
- Seuls les participants connaissent les détails
- Métadonnées privées
- Montants cachés
- Graphe de transactions obfusqué

### Assumptions de Sécurité 🔒
- Sécurité de Bitcoin
- Cryptographie elliptique
- Fonctions de hachage
- Signatures numériques

## Interopérabilité 🌐

### Lightning Network ⚡
- Paiements instantanés RGB
- Canaux multi-actifs
- Routage automatique
- Frais négligeables

### Cross-Chain 🌉
- Ponts vers autres blockchains
- Wrapping d'actifs
- Protocoles d'échange
- Standards unifiés

## Limitations Actuelles ⚠️

### Challenges Techniques
- Complexité d'implémentation
- Outils de développement en cours
- Courbe d'apprentissage
- Standards en évolution

### Adoption
- Écosystème naissant
- Peu de portefeuilles compatibles
- Documentation technique
- Formation nécessaire

## Évolution Future 🚀

### Roadmap Technique
- Simplification des APIs
- Outils graphiques
- Standards stabilisés
- Performance optimisée

### Adoption Mainstream
- Intégration exchange
- Portefeuilles grand public
- Applications DeFi
- Standards industriels

> **Point Clé :** 🎯 RGB révolutionne les actifs numériques en combinant la sécurité de Bitcoin avec l'innovation des contrats intelligents, tout en préservant la confidentialité et l'évolutivité.