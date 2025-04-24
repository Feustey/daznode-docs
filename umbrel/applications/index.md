---
layout: base.njk
title: Applications Umbrel
---

# Applications Umbrel

*Temps de lecture estimé : 7 minutes*

Umbrel propose un grand nombre d'applications que vous pouvez installer pour étendre les fonctionnalités de votre nœud. Cette page présente les applications les plus populaires et leur utilité.

## Applications Bitcoin et Lightning

### Bitcoin Core

L'implémentation de référence d'un nœud Bitcoin complet. Bitcoin Core télécharge, vérifie et stocke l'intégralité de la blockchain Bitcoin.

**Fonctionnalités principales :**
- Validation complète de la blockchain
- Portefeuille Bitcoin intégré
- Interface de ligne de commande complète

### LND (Lightning Network Daemon)

L'implémentation par défaut du Lightning Network sur Umbrel.

**Fonctionnalités principales :**
- Création et gestion de canaux Lightning
- Envoi et réception de paiements
- Routage de paiements à travers le réseau

### Thunderhub

Interface utilisateur avancée pour gérer votre nœud Lightning.

**Fonctionnalités principales :**
- Gestion détaillée des canaux
- Visualisation du routage des paiements
- Outils d'équilibrage des canaux
- Gestion des frais de routage

### Ride The Lightning (RTL)

Interface web alternative pour gérer votre nœud Lightning.

**Fonctionnalités principales :**
- Interface conviviale et intuitive
- Gestion complète des canaux et des paiements
- Prise en charge de plusieurs nœuds

### Lightning Terminal (LiT)

Suite d'outils pour la gestion avancée de la liquidité Lightning.

**Fonctionnalités principales :**
- Loop In/Out pour déplacer des fonds entre la chaîne et Lightning
- Pool pour acheter et vendre de la liquidité
- Visualisation avancée des canaux

### LNBits

Système de portefeuille Lightning extensible.

**Fonctionnalités principales :**
- Création de sous-portefeuilles
- Extensions pour les points de vente, les dons, etc.
- API complète pour les développeurs

## Autres applications

### Mempool

Explorateur de blockchain et moniteur de mempool.

**Fonctionnalités principales :**
- Visualisation des transactions en attente
- Estimation des frais en temps réel
- Statistiques détaillées sur les blocs

### BTCPay Server

Solution de paiement Bitcoin autonome.

**Fonctionnalités principales :**
- Traitement des paiements Bitcoin et Lightning
- Génération de factures
- Intégration avec des plateformes de commerce électronique

### Sphinx Chat

Application de messagerie basée sur le Lightning Network.

**Fonctionnalités principales :**
- Messages chiffrés
- Paiements intégrés via Lightning
- Groupes et communautés

### Samourai Server (Dojo)

Serveur backend pour le portefeuille Bitcoin Samourai.

**Fonctionnalités principales :**
- Confidentialité améliorée pour les transactions
- Coordination avec le portefeuille Samourai
- Suivi des transactions sans compromettre la vie privée

### Electrum Server

Serveur pour connecter des portefeuilles Electrum à votre propre nœud.

**Fonctionnalités principales :**
- Connexion directe de votre portefeuille Electrum à votre nœud
- Amélioration de la confidentialité
- Vérification des transactions avec votre propre nœud

### Specter Desktop

Interface utilisateur pour la gestion de portefeuilles multi-signatures.

**Fonctionnalités principales :**
- Configuration de portefeuilles multi-signatures
- Support pour les portefeuilles matériels
- Interface conviviale

## Installation des applications

L'installation d'applications sur Umbrel est simple :

1. Accédez au tableau de bord Umbrel
2. Cliquez sur l'onglet "App Store"
3. Parcourez les applications disponibles
4. Cliquez sur "Install" pour l'application souhaitée
5. Attendez que l'installation soit terminée

## Considérations importantes

- Chaque application peut avoir des exigences différentes en termes de ressources
- Certaines applications peuvent nécessiter un redémarrage de votre nœud
- Soyez prudent lorsque vous installez de nombreuses applications sur un matériel limité comme un Raspberry Pi
- Chaque application dispose de sa propre adresse onion pour l'accès à distance via Tor

## Ressources supplémentaires

- [Site officiel d'Umbrel](https://umbrel.com/)
- [GitHub d'Umbrel](https://github.com/getumbrel/umbrel)
- [Communauté Umbrel](https://community.umbrel.com/) 