---
layout: base.njk
title: Guide de démarrage rapide pour Daznode
description: Configurez et utilisez un nœud Lightning avec Daznode en 10 étapes concrètes.
order: 1
lastUpdated: 2024-06-07
author: Équipe Daznode
category: [tutoriel]
---

# Guide de démarrage rapide pour Daznode

## Objectif
Configurer et utiliser un nœud Lightning avec Daznode. Effectuez vos premiers paiements en moins de 10 minutes.

## Prérequis
- Adresse email valide
- Portefeuille Bitcoin (pour dépôt on-chain)
- Smartphone (pour 2FA)

## Étapes

1. **Créez un compte Daznode**
   - Rendez-vous sur [https://dazno.de](https://dazno.de)
   - Cliquez sur "S'inscrire"
   - Entrez votre email et un mot de passe fort
   - Confirmez votre compte via l'email reçu

2. **Activez la double authentification (2FA)**
   - Accédez aux paramètres du compte
   - Activez la 2FA
   - Scannez le QR code avec Google Authenticator ou Authy
   - Saisissez le code à 6 chiffres
   > ⚠️ Obligatoire si solde > 100 000 sats

3. **Créez votre nœud Lightning**
   - Cliquez sur "Créer un nœud" dans le tableau de bord
   - Nommez votre nœud
   - Laissez les options par défaut (débutant)
   - Confirmez (paiement de 250 sats requis)

4. **Alimentez votre nœud**
   - Cliquez sur "Dépôt" puis "Dépôt on-chain"
   - Copiez l'adresse Bitcoin générée
   - Envoyez des BTC depuis votre portefeuille
   - Attendez 3 confirmations

5. **Recevez un paiement Lightning**
   - Cliquez sur "Recevoir"
   - Entrez le montant
   - Générez et partagez la facture Lightning
   - Attendez le crédit instantané

6. **Ouvrez un canal Lightning**
   - Cliquez sur "Canaux" > "Ouvrir un canal"
   - Sélectionnez un nœud Daznode ou entrez une URI
   - Indiquez le montant
   - Confirmez (transaction on-chain)
   - Attendez l'activation (3 confirmations)

7. **Obtenez de la capacité entrante**
   - Dans "Canaux", cliquez sur "Obtenir de la capacité entrante"
   - Choisissez le montant
   - Payez les frais
   - Daznode ouvre un canal entrant pour vous

8. **Envoyez un paiement Lightning**
   - Cliquez sur "Envoyer"
   - Collez la facture à payer
   - Vérifiez et confirmez
   - Paiement instantané si liquidité suffisante

9. **Recevez un paiement Lightning**
   - Cliquez sur "Recevoir"
   - Entrez le montant et une description
   - Générez la facture
   - Partagez-la
   - Fonds disponibles dès paiement

10. **Sécurisez et optimisez**
    - Activez la 2FA
    - Fermez les canaux inactifs
    - Sauvegardez vos accès
    - Ne stockez pas de grosses sommes sur Daznode

## Résultat attendu
- Nœud Lightning opérationnel
- Canaux ouverts et liquidité disponible
- Paiements Lightning envoyés et reçus

## Bugs connus / erreurs fréquentes
- **Erreur 2FA** : Vérifiez l'heure de votre smartphone
- **Canal non actif** : Attendez 3 confirmations on-chain
- **Paiement échoué** : Vérifiez la liquidité sortante
- **Dépôt non crédité** : Vérifiez l'adresse et le nombre de confirmations

## Aller plus loin
- [Documentation complète](/docs)
- [Communauté Nostr](#) / [Telegram](#)
- support@dazno.de 