---
layout: base.njk
title: Glossaire du Lightning Network - Daznode
---

# Glossaire du Lightning Network

Ce glossaire regroupe les termes techniques les plus importants utilisés dans la documentation de Daznode et dans l'écosystème du Lightning Network. Il est conçu pour aider à la compréhension des concepts, métriques et comportements spécifiques au réseau Lightning.

## Centralité

La centralité fait référence à l'importance ou à la position d'un nœud ou d'un canal dans le réseau Lightning. Elle peut être mesurée de différentes manières :

### Centralité d'intermédiarité (Betweenness Centrality)

Mesure à quel point un nœud sert d'intermédiaire dans les chemins de paiement entre autres nœuds du réseau. Un nœud avec une forte centralité d'intermédiarité se trouve souvent sur les chemins les plus courts entre de nombreux autres nœuds, jouant ainsi un rôle crucial dans le routage des paiements.

### Centralité de proximité (Closeness Centrality)

Mesure la proximité d'un nœud par rapport à tous les autres nœuds du réseau. Un nœud avec une forte centralité de proximité peut atteindre plus rapidement les autres nœuds, ce qui peut être avantageux pour la transmission rapide des paiements.

### Centralité par vecteur propre (Eigenvector Centrality)

Mesure l'influence d'un nœud dans le réseau. Un nœud avec une forte centralité par vecteur propre est connecté à d'autres nœuds qui sont eux-mêmes très connectés ou influents.

## Balance des canaux (Channel Balance)

Fait référence à la proportion de liquidité dans un canal Lightning, divisée entre les deux parties. Cette balance détermine la capacité de routage dans chaque direction et peut être asymétrique selon les besoins de paiement.

## Balance de liquidité effective (Effective Liquidity Balance)

Représente la liquidité perçue comme disponible pour les HTLC dans un canal. Elle peut différer de la balance réelle en raison des limites et des réserves du canal.

## Temps de réponse HTLC (HTLC Response Time)

Mesure le temps nécessaire à un nœud pour traiter et transmettre les HTLC (Hashed Timelock Contracts). Un temps de réponse court est généralement préférable pour l'efficacité du routage.

## Demande de liquidité (Liquidity Demand)

Représente la demande de liquidité dans une direction particulière sur une période donnée. Une forte demande de liquidité peut indiquer des opportunités pour les fournisseurs de liquidité.

## Flexibilité de liquidité (Liquidity Flexibility)

Mesure la capacité d'un nœud à maintenir un équilibre de liquidité malgré les fluctuations du trafic de paiement. Une flexibilité élevée indique une bonne gestion des canaux.

## Taux de flux de liquidité (Liquidity Flow Rate)

Décrit comment la liquidité se déplace entre les canaux en fonction des frais et de la demande. Un taux de flux élevé peut indiquer des canaux très actifs.

## Valeur de la liquidité sortante (Outgoing Liquidity Value)

Estimation de la valeur de la liquidité sortante basée sur le coût des paiements alternatifs. Elle aide à déterminer les frais optimaux pour le routage.

## Comportements et caractéristiques des nœuds

Les nœuds du réseau Lightning peuvent être comparés à des organismes vivants, chacun ayant des comportements et des caractéristiques uniques :

### Routeurs du dernier kilomètre (Last-mile Routers)

Nœuds qui se spécialisent dans la connexion aux nœuds d'utilisateurs finaux, facilitant les paiements vers et depuis ces utilisateurs.

### Puits de liquidité (Liquidity Sinks)

Nœuds qui accumulent constamment de la liquidité entrante, souvent en raison de déséquilibres dans leurs modèles de paiement.

### Sources de liquidité (Liquidity Sources)

Nœuds qui génèrent constamment de la liquidité sortante, souvent des services qui effectuent de nombreux paiements.

### Nœuds d'équilibrage (Balancing Nodes)

Nœuds qui maintiennent activement l'équilibre de leurs canaux pour optimiser la capacité de routage bidirectionnelle.

### Routeurs centraux (Core Routers)

Nœuds hautement connectés qui facilitent une grande partie du routage dans le réseau, souvent avec une forte centralité.

## Stratégies de rééquilibrage (Rebalancing Strategies)

Techniques utilisées pour maintenir des balances de canal optimales :

### Rééquilibrage actif (Active Rebalancing)

Initiation délibérée de paiements circulaires pour déplacer la liquidité entre les canaux d'un nœud.

### Rééquilibrage passif (Passive Rebalancing)

Ajustement des frais pour encourager les paiements dans une direction particulière, rééquilibrant ainsi naturellement les canaux.

## Capacité totale (Total Capacity)

La somme de toutes les capacités des canaux d'un nœud, représentant la quantité totale de bitcoins verrouillés dans ses canaux Lightning.

---

Pour plus d'informations sur ces concepts, consultez nos guides détaillés ou contactez notre équipe technique. 