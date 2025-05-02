---
layout: base.njk
title: Onion Routing
description: Le mécanisme de confidentialité utilisé dans le Lightning Network pour protéger les informations de paiement.
order: 5
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [glossaire]
---

# Onion Routing

## Définition

L'Onion Routing est une technique de routage qui protège la confidentialité des paiements Lightning en empêchant les nœuds intermédiaires de connaître l'origine et la destination finale d'une transaction.

## Fonctionnement technique

1. Le paiement est encapsulé dans plusieurs couches de chiffrement (comme un oignon)
2. Chaque nœud intermédiaire ne peut déchiffrer que sa propre couche
3. Un nœud connaît uniquement son prédécesseur et son successeur immédiat
4. Aucun nœud ne voit le chemin complet du paiement

## Importance dans le Lightning Network

- **Confidentialité** : Protection contre la surveillance du réseau
- **Sécurité** : Réduction des risques de ciblage de nœuds spécifiques 
- **Intégrité** : Garantie que les paiements suivent le chemin prévu

## Exemple simplifié

1. Alice veut payer Dave en passant par Bob et Charlie
2. Alice crée un paquet "oignon" avec 3 couches chiffrées
3. Bob déchiffre la couche 1, trouve l'instruction de relayer à Charlie
4. Charlie déchiffre la couche 2, trouve l'instruction de relayer à Dave
5. Dave déchiffre la couche 3, trouve le paiement final

## Spécifications techniques

L'Onion Routing du Lightning Network est défini dans le [BOLT 4: Onion Routing Protocol](https://github.com/lightning/bolts/blob/master/04-onion-routing.md) et utilise le schéma de chiffrement SPHINX.

## Voir aussi
- [Multipath payments, gossip layer](/concepts-avances/multipath-gossip.md)
- [Canal Lightning](/faq-glossaire/canal.md)
- [HTLC](/faq-glossaire/htlc.md) 