---
layout: base.njk
title: "À quel point le Lightning Network est-il sécurisé ?"
description: Analyse des garanties de sécurité et des risques potentiels du Lightning Network.
order: 7
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [faq]
---

# À quel point le Lightning Network est-il sécurisé ?

## Problème

La décentralisation du Lightning Network soulève des questions légitimes sur la sécurité des fonds, la fiabilité des transactions et les risques potentiels d'attaque ou de perte.

## Solution

Le Lightning Network implémente plusieurs mécanismes de sécurité :

- **HTLC (Hashed Timelock Contracts)** : Garantissent que les fonds ne peuvent pas être perdus en transit
- **Canaux bidirectionnels** : Transactions signées par les deux parties avant validation
- **Transactions de pénalité** : Dissuadent les tentatives de fraude par attribution de tous les fonds à la partie honnête
- **Timelock** : Permettent la récupération des fonds même si un partenaire devient non-coopératif
- **Watchtowers** : Services tiers qui surveillent les tentatives de fraude pour les nœuds hors ligne

Pour sécuriser vos fonds :
1. Utilisez un nœud toujours en ligne ou un service de watchtower
2. Répartissez vos fonds sur plusieurs canaux
3. Maintenez votre logiciel à jour
4. Ne conservez que des montants raisonnables sur les canaux Lightning

## Risques

- **Attaque de vol de canal** : Risque si votre nœud est hors ligne pendant longtemps
- **Bug logiciel** : Vulnérabilités potentielles dans les implémentations
- **Perte de backup** : Perte d'accès aux canaux si les données du nœud sont corrompues
- **Attaques de routage** : Congestion artificielle ou refus de transmettre des paiements
- **Fermeture forcée** : Frais élevés en cas de fermeture non coopérative en période de congestion

## Liens utiles
- [Nœud Lightning](/faq-glossaire/node.md)
- [HTLC](/faq-glossaire/htlc.md)
- [Configuration sécurisée](/tutoriels/securiser-compte.md) 