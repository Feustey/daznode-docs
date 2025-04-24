---
layout: base.njk
title: Fonctionnement du Lightning Network
---

# Fonctionnement du Lightning Network

Le Lightning Network (réseau Lightning) est une technologie qui rend les paiements en bitcoin rapides et très peu chers.

## Comment ça marche ?

Au lieu d'inscrire chaque paiement sur la blockchain (le grand cahier partagé), on ouvre un canal Lightning entre deux personnes. Un canal, c'est comme un compte commun où chacun met un peu d'argent.

<img src="/assets/img/schema-canal-lightning.svg" alt="Schéma d'un canal Lightning : Alice et Bob ouvrent un canal pour s'envoyer des bitcoins rapidement" style="display:block;max-width:400px;margin:1em auto;">

Ensuite, on peut s'envoyer des bitcoins autant de fois qu'on veut, sans frais importants. Seul le solde final est inscrit sur la blockchain quand on ferme le canal.

## Exemple concret

Alice et Bob ouvrent un canal Lightning. Ils peuvent s'envoyer des petites sommes toute la journée (payer un café, rembourser un sandwich...). À la fin, ils ferment le canal : la blockchain garde juste le résultat final.

Le Lightning Network permet donc de payer vite, partout dans le monde, sans attendre ! 