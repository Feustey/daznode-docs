---
layout: base.njk
title: Glossaire du Lightning Network - Daznode
---

# Glossaire du Lightning Network

Ce glossaire explique les mots et acronymes que tu vas rencontrer dans la documentation. Tout est expliqué simplement, avec des exemples.

## Bitcoin
Monnaie numérique, sans banque ni gouvernement. Exemple : tu peux envoyer de l'argent à un ami sans passer par une banque.

## Blockchain
Grand cahier partagé sur Internet où toutes les transactions sont inscrites. Personne ne peut tricher.

## Lightning Network
Réseau qui rend les paiements en bitcoin rapides et très peu chers. Fonctionne grâce à des canaux.

## Canal Lightning
Tirelire partagée entre deux personnes pour s'envoyer des bitcoins rapidement.

## Wallet (portefeuille)
Application pour stocker, envoyer et recevoir des bitcoins.

## Satoshi (sat)
La plus petite unité de bitcoin. 1 bitcoin = 100 000 000 satoshis.

## 2FA (authentification à deux facteurs)
Sécurité supplémentaire : tu dois entrer un code unique à chaque connexion.

## Seed (phrase secrète)
Suite de mots qui permet de récupérer ton wallet si tu perds ton téléphone.

## Non-custodial
Tu es le seul à avoir la clé de ton wallet. Plus sécurisé.

## Custodial
Une entreprise garde la clé pour toi. Plus simple, mais moins sécurisé.

## Nœud
Ordinateur qui vérifie et enregistre les transactions sur le réseau Bitcoin ou Lightning.

## QR code
Image carrée que tu scannes avec ton téléphone pour envoyer ou recevoir des bitcoins facilement.

## Halving
Division par deux de la récompense des mineurs Bitcoin, programmée tous les 210 000 blocs (environ 4 ans). Exemple : En 2020, la récompense est passée de 12,5 à 6,25 bitcoins par bloc.

## Mineur
Participant du réseau Bitcoin qui utilise la puissance de calcul de son ordinateur pour valider les transactions. Exemple : Les mineurs reçoivent des bitcoins en récompense pour sécuriser le réseau.

## Pool de minage
Groupe de mineurs qui combinent leur puissance de calcul pour augmenter leurs chances de valider un bloc et partager les récompenses. Exemple : Un petit mineur seul aurait peu de chances de valider un bloc, mais en rejoignant un pool, il reçoit régulièrement de petites récompenses.

## ASIC
Application-Specific Integrated Circuit. Matériel informatique spécialement conçu pour le minage de Bitcoin, bien plus efficace que les ordinateurs classiques. Exemple : Un ASIC moderne peut être des centaines de fois plus puissant qu'un ordinateur gaming pour le minage.

## Adresse Bitcoin
Chaîne de caractères servant d'identifiant pour recevoir des bitcoins, comparable à un IBAN bancaire. Exemple : bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh

## Clé privée
Code secret qui permet de contrôler les bitcoins associés à une adresse. Ne doit jamais être partagée. Exemple : Perdre sa clé privée signifie perdre l'accès à ses bitcoins de façon permanente.

## BTC
Symbole utilisé pour désigner l'unité Bitcoin. Exemple : Le prix actuel est de 50 000 € par BTC.

## Bloc Genesis
Premier bloc de la blockchain Bitcoin, miné par Satoshi Nakamoto le 3 janvier 2009. Exemple : Le bloc genesis contient un message sur la crise financière de 2008.

## Exemple concret
Si tu ne comprends pas un mot, cherche-le ici !

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