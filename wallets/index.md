---
layout: base.njk
title: Wallets
eleventyNavigation:
  key: Wallets
  parent: Guide
  order: 3
---

# Wallets (portefeuilles)

Un [wallet](/glossary/#wallet-portefeuille), ou portefeuille, sert à stocker et utiliser tes [bitcoins](/glossary/#bitcoin) ou tes [satoshis](/glossary/#satoshi-sat) (la plus petite unité de bitcoin).

## Types de wallets

Il existe deux types principaux :
- **[Non-custodial](/glossary/#non-custodial)** : tu es le seul à avoir la clé. Plus sécurisé, mais tu dois bien sauvegarder ta [phrase secrète](/glossary/#seed-phrase-secrete) (seed).
- **[Custodial](/glossary/#custodial)** : une entreprise garde la clé pour toi. Plus simple, mais moins sécurisé.

## Wallets recommandés

### Wallets mobiles
- **Phoenix** : Excellent wallet non-custodial pour débutants
- **Breez** : Interface intuitive et fonctionnalités avancées
- **Zeus** : Pour les utilisateurs qui veulent contrôler leur propre nœud

### Wallets web et extensions
- **Alby** : [Extension navigateur](/glossary/#extension-navigateur) parfaite pour les paiements web
- **Wallet of Satoshi** : Solution custodial simple pour débuter

## Guide d'installation

### Installation d'un wallet mobile
1. Va sur le [store](/glossary/#store-magasin-dapplications) de ton téléphone (Google Play ou App Store)
2. Cherche le nom du wallet choisi (ex: "Phoenix", "Breez" ou "Zeus")
3. Installe l'application
4. Ouvre l'application et suis les instructions pour créer un nouveau wallet
5. Note bien ta [phrase secrète](/glossary/#seed-phrase-secrete) sur papier. Ne la partage jamais !

### Installation d'Alby
1. Va sur [getalby.com](https://getalby.com)
2. Choisis entre l'extension navigateur ou Alby Go (version mobile)
3. Suis les instructions d'installation
4. Sauvegarde soigneusement ta phrase de récupération

## Utilisation quotidienne

### Recevoir des paiements
1. Ouvre ton wallet
2. Clique sur "Recevoir"
3. Une [facture Lightning](/glossary/#facture-lightning-lightning-invoice) sera générée
4. Partage l'adresse ou le [QR code](/glossary/#qr-code) avec l'expéditeur

### Envoyer des paiements
1. Clique sur "Envoyer"
2. Scanne le QR code ou colle la facture [BOLT11](/glossary/#bolt11) du destinataire
3. Vérifie le montant et confirme

## Sécurité

- Active la [2FA](/glossary/#2fa-authentification-a-deux-facteurs) si disponible
- Ne stocke pas de grosses sommes sur un wallet mobile
- Fais régulièrement des sauvegardes
- Ne partage jamais ta phrase secrète

## Ressources supplémentaires

- [Guide de démarrage Lightning](/lightning/premiers-pas/)
- [Comprendre les canaux Lightning](/lightning/canaux/)
- [Sécurisation de vos fonds](/securisation/)

**Exemple concret** :
- Tu installes Phoenix sur ton téléphone
- Tu notes soigneusement ta phrase secrète sur papier
- Tu reçois 5 euros en bitcoin de ton ami via un QR code
- Tu peux ensuite payer un café en scannant le QR code du commerçant 