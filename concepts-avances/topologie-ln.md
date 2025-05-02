---
layout: base.njk
title: Topologie du Lightning Network
description: Analyse de la structure et des propriétés du réseau Lightning.
order: 2
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [concepts-avances]
---

# Analyse de la topologie du Lightning Network

## Problème
Le Lightning Network n'est pas un graphe aléatoire : il présente des hubs majeurs, des clusters et des points de centralité. Cette structure impacte la résilience, la confidentialité et l'efficacité du routage.

## Solution
- Cartographiez le réseau avec des outils comme [Amboss](https://amboss.space) ou [LNRouter](https://lnrouter.app).
- Identifiez les hubs critiques et diversifiez vos connexions pour éviter la dépendance à un seul point de défaillance.
- Utilisez des canaux privés pour limiter la visibilité de vos flux.
- Surveillez la centralité de vos pairs pour optimiser vos routes et réduire les frais.

## Risques
- Centralisation excessive : quelques nœuds contrôlent une grande partie de la liquidité.
- Attaques ciblées sur les hubs (DoS, partition du réseau).
- Perte de confidentialité si vos paiements passent toujours par les mêmes routes.

## Références externes
- [Lightning Network Topology (arXiv)](https://arxiv.org/abs/2006.00744)
- [Amboss Network Explorer](https://amboss.space)

## Liens utiles
- [Ouvrir des canaux Lightning](/tutoriels/guide-demarrage-daznode.md)
- [Optimisation des canaux](/tutoriels/optimisation-canaux.md) 