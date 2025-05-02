---
layout: base.njk
title: Guide de démarrage Lightning Network
description: Premiers pas, installation et configuration d'un portefeuille Lightning Network.
order: 4
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [basics]
---

# Rejoindre le Lightning Network

## Objectif immédiat

Démarrez votre expérience Lightning en 10 minutes. Envoyez votre premier paiement instantané avant la fin de ce guide.

## Options de portefeuille

Choisissez votre niveau d'autonomie :

### Non-custodial (contrôle total)

Gardez vos clés privées. Recommandé pour la sécurité maximale.

| Portefeuille | Plateforme | Caractéristiques |
|--------------|------------|------------------|
| Phoenix | Android, iOS | Configuration automatique, simple |
| Breez | Android, iOS | Achat/vente, podcasts, applications |
| Muun | Android, iOS | Hybride on-chain/Lightning |
| Zeus | Android, iOS | Connexion à votre propre nœud |

### Custodial (simplicité maximale)

Déléguez la gestion technique. Parfait pour débuter.

| Portefeuille | Plateforme | Caractéristiques |
|--------------|------------|------------------|
| Wallet of Satoshi | Android, iOS, Web | Ultra simplifié, retraits instantanés |
| BlueWallet | Android, iOS | Mode hybride, options avancées |
| Alby | Extension navigateur | Intégration web, streaming de sats |

> ⚠️ Attention : Les portefeuilles custodial contrôlent vos fonds. N'y stockez que des montants modestes.

## Installation rapide

Installez Phoenix en 2 minutes :
1. Téléchargez depuis [phoenix.acinq.co](https://phoenix.acinq.co)
2. Ouvrez l'application
3. Créez un nouveau portefeuille
4. Notez votre phrase de récupération (12 mots)
5. Sécurisez cette phrase physiquement

## Alimentez votre portefeuille

Transférez des bitcoins vers Lightning. Trois méthodes principales :

### Achat direct
Achetez directement dans ces portefeuilles :
- Wallet of Satoshi
- Breez (via MoonPay)
- BlueWallet (via partenaires)

### Dépôt on-chain
Envoyez des bitcoins depuis un autre portefeuille :
1. Générez une adresse de réception dans votre portefeuille Lightning
2. Envoyez des BTC depuis votre source existante
3. Attendez les confirmations (3-6 blocs)

### Échanges compatibles
Retirez directement en Lightning depuis :
- Kraken
- OKX
- Bitstamp
- River

## Effectuez votre premier paiement

Réalisez une transaction en 3 étapes :

1. **Trouvez une facture** : 
   - Scannez un QR code en magasin
   - Cliquez sur un lien de paiement en ligne
   - Utilisez [Bitrefill](https://bitrefill.com) pour une carte-cadeau

2. **Vérifiez les détails** :
   - Montant exact
   - Description du paiement
   - Frais de routing (généralement < 1%)

3. **Confirmez le paiement** :
   - Approuvez la transaction
   - Confirmation instantanée (< 1 seconde)

Code typique d'intégration marchande :

```js
// Génération d'une facture Lightning
const invoice = await generateInvoice({
  amount: 50000,  // 50,000 sats (environ 20€)
  description: "Commande #12345 - Café Satoshi",
  expirySeconds: 3600  // Expire dans 1 heure
});

// L'invoice est au format BOLT11, exemple:
// lnbc500n1p3z7ungpp5jmvdnrwwyl74st53l33aa2lvjjfsf6mczrel9qjp39p2nehm0qsdqqcqzpgxqyz5vqsp5usyc4lk9chsfp9r5pq40lguflu46q58d2aj3numajkbnlmh3h0s9qyyssqzrupfu95r3zt9x5jac936hq0hdcgwxhh99u39z8qz7h2jwsmw7gs8mf0hpryfr3zy0z6x2gsr7mvfnhn5l5ujx9jjgqq44e4dg2rcpvkytl5
```

## Recevez des paiements

Générez et partagez une facture :

1. Dans votre portefeuille, sélectionnez "Recevoir"
2. Spécifiez le montant et la description
3. Partagez le QR code ou le lien
4. Recevez les fonds instantanément après paiement

## Dépannage immédiat

| Problème | Solution |
|----------|----------|
| Paiement échoué | Vérifiez votre connexion internet, réessayez |
| "No route found" | Le destinataire manque de canaux entrants, essayez un montant plus petit |
| Fonds bloqués | Attendez l'expiration (généralement 24h) |
| Portefeuille vide | Rendez-vous à la section "Alimentez votre portefeuille" |

## Prochain niveau

Maîtrisez ces capacités avancées :
1. [Ouvrez vos propres canaux](/basics/lightning-network-canaux.md)
2. [Explorez les applications LN](https://lightningnetworkstores.com/)
3. [Configurez votre nœud](/lightning-network/getting-started/) 